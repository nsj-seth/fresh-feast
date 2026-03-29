/* ============================
   cart-store.js — FreshFeast
   Shared cart state across all pages.
   Include this BEFORE any page script.
============================ */

const CartStore = (() => {
  const KEY = 'ff_cart';

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (_) { return []; }
  }

  function save(cart) {
    try { localStorage.setItem(KEY, JSON.stringify(cart)); } catch (_) {}
  }

  function getAll() { return load(); }

  function totalQty() {
    return load().reduce((s, i) => s + i.qty, 0);
  }

  /**
   * Add an item to the cart.
   * If the item already exists (matched by id), increment qty.
   * @param {{ id, name, price, img }} item
   */
  function addItem(item) {
    const cart = load();
    const existing = cart.find(i => i.id === item.id);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({ ...item, qty: 1 });
    }
    save(cart);
    return totalQty();
  }

  /**
   * Sync the nav badge on the current page to reflect cart count.
   * Looks for an element with id="cartBadge".
   */
  function syncBadge() {
    const badge = document.getElementById('cartBadge');
    if (badge) badge.textContent = totalQty();
  }

  return { getAll, addItem, totalQty, syncBadge, load, save };
})();