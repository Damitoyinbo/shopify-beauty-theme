/**
 * Minimal pub/sub helpers, modeled on Dawn's global.js, so this repo's
 * custom sections/components can be previewed standalone. If this file
 * already exists in the base Dawn theme this is built on top of, this
 * version is a no-op superset (same event names, same signatures).
 */

const PUB_SUB_EVENTS = {
  cartUpdate: 'cart-update',
  quantityUpdate: 'quantity-update',
  variantChange: 'variant-change',
  cartError: 'cart-error',
};

function subscribe(eventName, callback) {
  document.addEventListener(eventName, (event) => callback(event.detail), false);
  return function unsubscribe() {
    document.removeEventListener(eventName, (event) => callback(event.detail), false);
  };
}

function publish(eventName, data) {
  document.dispatchEvent(new CustomEvent(eventName, { detail: data }));
}
