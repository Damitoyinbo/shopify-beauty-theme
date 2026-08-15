/**
 * <restock-indicator>
 *
 * A custom element that keeps the restock-urgency copy on a product page in
 * sync with the selected variant, without a full page reload. It subscribes
 * to Dawn's existing pub/sub channel (PUB_SUB_EVENTS.variantChange), which
 * Dawn's variant-picker / variant-radios components already publish to on
 * every selection change, and re-renders from a small inline inventory
 * snapshot instead of re-fetching the product.
 */

if (!customElements.get('restock-indicator')) {
  class RestockIndicator extends HTMLElement {
    constructor() {
      super();
      this.textEl = null;
      this.notifyButton = null;
      this.inventory = {};
      this.unsubscribe = null;
    }

    connectedCallback() {
      this.textEl = this.querySelector('[data-restock-text]');
      this.notifyButton = this.querySelector('[data-notify-button]');
      this.lowStockThreshold = Number(this.dataset.lowStockThreshold || 5);

      const inventoryScript = this.querySelector('[data-restock-inventory]');
      try {
        this.inventory = inventoryScript ? JSON.parse(inventoryScript.textContent) : {};
      } catch (error) {
        this.inventory = {};
      }

      // Dawn publishes on window.subscribe / PUB_SUB_EVENTS from global.js.
      // Falls back to a no-op if the theme's pub/sub helpers aren't present
      // (e.g. when this component is previewed outside of Dawn).
      if (typeof subscribe === 'function' && typeof PUB_SUB_EVENTS !== 'undefined') {
        this.unsubscribe = subscribe(PUB_SUB_EVENTS.variantChange, (event) => {
          if (event.data.sectionId !== this.dataset.sectionId) return;
          this.render(event.data.variant);
        });
      }

      if (this.notifyButton) {
        this.notifyButton.addEventListener('click', () => this.handleNotifyClick());
      }
    }

    disconnectedCallback() {
      if (typeof this.unsubscribe === 'function') this.unsubscribe();
    }

    render(variant) {
      if (!variant || !this.textEl) return;
      const snapshot = this.inventory[variant.id];

      let label = 'In stock';
      let showNotify = false;

      if (variant.available === false) {
        label = 'Out of stock';
        showNotify = true;
      } else if (
        snapshot &&
        snapshot.inventory_management &&
        typeof snapshot.inventory_quantity === 'number' &&
        snapshot.inventory_quantity > 0 &&
        snapshot.inventory_quantity <= this.lowStockThreshold
      ) {
        label = `Only ${snapshot.inventory_quantity} left`;
      }

      this.textEl.textContent = label;
      this.classList.toggle('restock-indicator--low', label.startsWith('Only'));
      this.classList.toggle('restock-indicator--out', showNotify);
      this.toggleNotifyButton(showNotify);
    }

    toggleNotifyButton(show) {
      if (show && !this.notifyButton) {
        this.notifyButton = document.createElement('button');
        this.notifyButton.type = 'button';
        this.notifyButton.className = 'restock-indicator__notify';
        this.notifyButton.dataset.notifyButton = '';
        this.notifyButton.textContent = 'Notify me when back';
        this.notifyButton.addEventListener('click', () => this.handleNotifyClick());
        this.appendChild(this.notifyButton);
      } else if (!show && this.notifyButton) {
        this.notifyButton.remove();
        this.notifyButton = null;
      }
    }

    handleNotifyClick() {
      this.dispatchEvent(
        new CustomEvent('restock-indicator:notify-request', {
          bubbles: true,
          detail: { productId: this.dataset.productId },
        })
      );
      this.notifyButton.textContent = "We'll email you";
      this.notifyButton.disabled = true;
    }
  }

  customElements.define('restock-indicator', RestockIndicator);
}
