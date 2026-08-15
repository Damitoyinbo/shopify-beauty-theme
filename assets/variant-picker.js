/**
 * <variant-picker>
 *
 * Minimal stand-in for Dawn's variant-picker component: renders variant
 * options as a <select>, and on change publishes PUB_SUB_EVENTS.variantChange
 * with the newly selected variant + the owning section id, which is exactly
 * what <restock-indicator> listens for in restock-indicator.js.
 */

if (!customElements.get('variant-picker')) {
  class VariantPicker extends HTMLElement {
    connectedCallback() {
      this.select = this.querySelector('select');
      this.variants = JSON.parse(this.querySelector('[data-variants-json]').textContent);
      this.sectionId = this.dataset.sectionId;

      this.select.addEventListener('change', (event) => {
        const variant = this.variants.find((v) => String(v.id) === event.target.value);
        if (!variant) return;
        publish(PUB_SUB_EVENTS.variantChange, {
          sectionId: this.sectionId,
          variant,
        });
      });
    }
  }

  customElements.define('variant-picker', VariantPicker);
}
