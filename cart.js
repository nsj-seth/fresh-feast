/* ============================
   cart.js — FreshFeast Cart Page
============================ */

const DELIVERY_FEE  = 3.99;
const FREE_DELIVERY = 35;

const PROMOS = {
  'FRESH10':  { type: 'percent', value: 10, label: '10% off applied!' },
  'SAVE5':    { type: 'fixed',   value: 5,  label: '$5 discount applied!' },
  'FREESHIP': { type: 'ship',    value: 0,  label: 'Free delivery applied!' },
};

// ── State — load from shared CartStore ───────────────
let cart         = CartStore.load();
let promoApplied = null;

// ── DOM Refs ──────────────────────────────────────────
const cartItemsEl   = document.getElementById('cartItems');
const cartEmptyEl   = document.getElementById('cartEmpty');
const continueLinkEl= document.getElementById('continueLink');
const cartBadge     = document.getElementById('cartBadge');
const subtotalVal   = document.getElementById('subtotalVal');
const deliveryVal   = document.getElementById('deliveryVal');
const discountRow   = document.getElementById('discountRow');
const discountVal   = document.getElementById('discountVal');
const totalVal      = document.getElementById('totalVal');
const promoInput    = document.getElementById('promoInput');
const promoApplyBtn = document.getElementById('promoApplyBtn');
const promoMsg      = document.getElementById('promoMsg');
const checkoutBtn   = document.getElementById('checkoutBtn');
const toast         = document.getElementById('toast');
const toastMsg      = document.getElementById('toastMsg');
const modalOverlay  = document.getElementById('modalOverlay');
const modalOk       = document.getElementById('modalOk');
const navbar        = document.getElementById('navbar');
const hamburger     = document.getElementById('hamburger');
const navLinks      = document.getElementById('navLinks');

// ── Render ────────────────────────────────────────────
function renderCart() {
  cartItemsEl.innerHTML = '';

  if (cart.length === 0) {
    cartEmptyEl.style.display    = 'block';
    cartItemsEl.style.display    = 'none';
    continueLinkEl.style.display = 'none';
    checkoutBtn.disabled         = true;
  } else {
    cartEmptyEl.style.display    = 'none';
    cartItemsEl.style.display    = '';
    continueLinkEl.style.display = '';
    checkoutBtn.disabled         = false;

    cart.forEach((item, idx) => {
      const row = document.createElement('div');
      row.className = 'cart-item';
      row.dataset.id = item.id;
      row.style.animationDelay = `${idx * 60}ms`;
      row.innerHTML = `
        <div class="cart-item-top">
          <img src="${item.img}" alt="${item.name}" class="cart-item-img"
               onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&q=80'" />
          <div class="cart-item-info">
            <div class="cart-item-name">${item.name}</div>
            <div class="cart-item-price">$${item.price.toFixed(2)}</div>
          </div>
          <button class="cart-item-delete" data-action="delete" data-id="${item.id}" aria-label="Remove">
            <i class="fa-regular fa-trash-can"></i>
          </button>
        </div>
        <div class="cart-item-bottom">
          <button class="qty-btn" data-action="dec" data-id="${item.id}"><i class="fa-solid fa-minus"></i></button>
          <span class="qty-value" id="qty-${item.id}">${item.qty}</span>
          <button class="qty-btn" data-action="inc" data-id="${item.id}"><i class="fa-solid fa-plus"></i></button>
        </div>`;
      cartItemsEl.appendChild(row);
    });
  }

  updateSummary();
  syncBadge();
  CartStore.save(cart);
}

// ── Summary ───────────────────────────────────────────
function calcSubtotal() { return cart.reduce((s, i) => s + i.price * i.qty, 0); }

function calcDiscount(sub) {
  if (!promoApplied) return 0;
  const p = PROMOS[promoApplied];
  if (p.type === 'percent') return sub * (p.value / 100);
  if (p.type === 'fixed')   return Math.min(p.value, sub);
  return 0;
}

function calcDelivery(sub) {
  if (cart.length === 0) return 0;
  if (sub >= FREE_DELIVERY) return 0;
  if (promoApplied && PROMOS[promoApplied].type === 'ship') return 0;
  return DELIVERY_FEE;
}

function updateSummary() {
  const sub      = calcSubtotal();
  const discount = calcDiscount(sub);
  const delivery = calcDelivery(sub);
  const total    = Math.max(0, sub - discount + delivery);

  subtotalVal.textContent = `$${sub.toFixed(2)}`;
  deliveryVal.textContent = delivery === 0 ? 'Free' : `$${delivery.toFixed(2)}`;
  discountRow.style.display = discount > 0 ? '' : 'none';
  if (discount > 0) discountVal.textContent = `-$${discount.toFixed(2)}`;
  totalVal.textContent = `$${total.toFixed(2)}`;
}

function syncBadge() {
  const count = cart.reduce((s, i) => s + i.qty, 0);
  cartBadge.textContent = count;
}

// ── Cart Actions ──────────────────────────────────────
function changeQty(id, delta) {
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) { removeItem(id); return; }

  const el = document.getElementById(`qty-${id}`);
  if (el) {
    el.classList.add('bump');
    setTimeout(() => el.classList.remove('bump'), 200);
    el.textContent = item.qty;
  }
  updateSummary();
  syncBadge();
  CartStore.save(cart);
}

function removeItem(id) {
  const row = cartItemsEl.querySelector(`[data-id="${id}"]`);
  if (row) {
    row.classList.add('removing');
    setTimeout(() => { cart = cart.filter(i => i.id !== id); renderCart(); }, 300);
  } else {
    cart = cart.filter(i => i.id !== id);
    renderCart();
  }
  showToast('Item removed.', 'info');
}

// ── Event delegation ──────────────────────────────────
cartItemsEl.addEventListener('click', e => {
  const btn = e.target.closest('[data-action]');
  if (!btn) return;
  const id     = parseInt(btn.dataset.id);
  const action = btn.dataset.action;
  if (action === 'inc')    changeQty(id, +1);
  if (action === 'dec')    changeQty(id, -1);
  if (action === 'delete') removeItem(id);
});

// ── Promo ─────────────────────────────────────────────
promoApplyBtn.addEventListener('click', applyPromo);
promoInput.addEventListener('keydown', e => { if (e.key === 'Enter') applyPromo(); });

function applyPromo() {
  const code = promoInput.value.trim().toUpperCase();
  if (!code) { setPromoMsg('Please enter a promo code.', 'error'); return; }
  if (PROMOS[code]) {
    promoApplied = code;
    setPromoMsg(PROMOS[code].label, 'success');
    promoInput.value = '';
    promoApplyBtn.textContent = '✓ Applied';
    promoApplyBtn.style.color = '#2e7d32';
    promoApplyBtn.style.borderColor = '#2e7d32';
    setTimeout(() => { promoApplyBtn.textContent = 'Apply'; promoApplyBtn.style.color = ''; promoApplyBtn.style.borderColor = ''; }, 2000);
  } else {
    promoApplied = null;
    setPromoMsg('Invalid code. Try: FRESH10, SAVE5 or FREESHIP', 'error');
  }
  updateSummary();
}

function setPromoMsg(text, type) {
  promoMsg.textContent = text;
  promoMsg.className = `promo-msg ${type}`;
}

// ── Checkout ──────────────────────────────────────────
checkoutBtn.addEventListener('click', () => {
  if (!cart.length) return;
  checkoutBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing...';
  checkoutBtn.disabled = true;
  setTimeout(() => {
    modalOverlay.classList.add('show');
    checkoutBtn.innerHTML = 'Checkout <i class="fa-solid fa-arrow-right"></i>';
    checkoutBtn.disabled = false;
  }, 1000);
});

modalOk.addEventListener('click', () => {
  cart = [];
  CartStore.save(cart);
  modalOverlay.classList.remove('show');
  window.location.href = 'index.html';
});

modalOverlay.addEventListener('click', e => {
  if (e.target === modalOverlay) modalOverlay.classList.remove('show');
});

// ── Toast ─────────────────────────────────────────────
let toastTimer;
function showToast(msg, type = 'check') {
  clearTimeout(toastTimer);
  toastMsg.textContent = msg;
  const ico = toast.querySelector('i');
  ico.className = type === 'check' ? 'fa-solid fa-circle-check'
                : type === 'info'  ? 'fa-solid fa-circle-info'
                : 'fa-solid fa-triangle-exclamation';
  toast.classList.add('show');
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
}

// ── Navbar ────────────────────────────────────────────
window.addEventListener('scroll', () => navbar.classList.toggle('scrolled', window.scrollY > 20), { passive: true });
hamburger.addEventListener('click', () => { hamburger.classList.toggle('open'); navLinks.classList.toggle('open'); });
navLinks.querySelectorAll('.nav-link').forEach(l => l.addEventListener('click', () => { hamburger.classList.remove('open'); navLinks.classList.remove('open'); }));

// ── Init ──────────────────────────────────────────────
renderCart();