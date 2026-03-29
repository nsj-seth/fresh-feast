/* ============================================================
   FreshFeast — profile-script.js
============================================================ */

// ── Navbar ─────────────────────────────────────────────────
const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

hamburger?.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

navLinks?.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger?.classList.remove('open');
    navLinks?.classList.remove('open');
  });
});

// ── Toast ─────────────────────────────────────────────────
const toastEl  = document.getElementById('toast');
const toastMsg = document.getElementById('toastMsg');
let toastTimer;

function showToast(msg, type = 'success') {
  clearTimeout(toastTimer);
  toastMsg.textContent = msg;
  toastEl.querySelector('i').className =
    type === 'success' ? 'fa-solid fa-circle-check' : 'fa-solid fa-circle-exclamation';
  toastEl.classList.add('show');
  toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2800);
}

// ── Tab Navigation ────────────────────────────────────────
const snavItems  = document.querySelectorAll('.snav-item[data-tab]');
const tabPanels  = document.querySelectorAll('.tab-panel');

function switchTab(tabId) {
  snavItems.forEach(i => i.classList.remove('active'));
  tabPanels.forEach(p => p.classList.remove('active'));

  const targetNav   = document.querySelector(`.snav-item[data-tab="${tabId}"]`);
  const targetPanel = document.getElementById(`tab-${tabId}`);

  if (targetNav)   targetNav.classList.add('active');
  if (targetPanel) targetPanel.classList.add('active');

  // scroll to top of main panel on mobile
  if (window.innerWidth < 900) {
    document.getElementById('profileMain')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

snavItems.forEach(item => {
  item.addEventListener('click', () => switchTab(item.dataset.tab));
});

// "View All" / "goto" buttons inside panels
document.querySelectorAll('[data-goto]').forEach(btn => {
  btn.addEventListener('click', () => switchTab(btn.dataset.goto));
});

// ── Order History Data ────────────────────────────────────
const ORDERS = [
  { id: '#FF-00831', date: 'March 24, 2025', loc: 'Downtown District', status: 'delivered', total: '$29.98',
    items: [
      { name: 'Classic Smash Burger × 2', img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=80&h=80&fit=crop' }
    ]
  },
  { id: '#FF-00820', date: 'March 20, 2025', loc: 'East End Garden', status: 'delivered', total: '$31.98',
    items: [
      { name: 'Truffle Carbonara', img: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=80&h=80&fit=crop' },
      { name: 'Garden Fresh Bowl', img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=80&h=80&fit=crop' }
    ]
  },
  { id: '#FF-00804', date: 'March 15, 2025', loc: 'Midtown Market', status: 'delivered', total: '$22.99',
    items: [
      { name: 'Grilled Atlantic Salmon', img: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=80&h=80&fit=crop' }
    ]
  },
  { id: '#FF-00791', date: 'March 10, 2025', loc: 'Northgate Square', status: 'delivered', total: '$18.99',
    items: [
      { name: 'Truffle Carbonara', img: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=80&h=80&fit=crop' }
    ]
  },
  { id: '#FF-00779', date: 'March 5, 2025',  loc: 'Downtown District', status: 'cancelled', total: '$14.99',
    items: [
      { name: 'Classic Smash Burger', img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=80&h=80&fit=crop' }
    ]
  },
  { id: '#FF-00762', date: 'Feb 27, 2025',   loc: 'East End Garden',   status: 'delivered', total: '$44.97',
    items: [
      { name: 'Grilled Salmon × 2', img: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=80&h=80&fit=crop' },
      { name: 'Garden Fresh Bowl',   img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=80&h=80&fit=crop' }
    ]
  },
  { id: '#FF-00748', date: 'Feb 20, 2025',   loc: 'Midtown Market',    status: 'active',    total: '$36.97',
    items: [
      { name: 'Truffle Carbonara', img: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=80&h=80&fit=crop' },
      { name: 'Classic Smash Burger', img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=80&h=80&fit=crop' }
    ]
  },
];

const statusLabel = {
  delivered:  { cls: 'status-badge--delivered',  txt: 'Delivered'  },
  active:     { cls: 'status-badge--active',      txt: 'On the Way' },
  cancelled:  { cls: 'status-badge--cancelled',   txt: 'Cancelled'  },
  processing: { cls: 'status-badge--processing',  txt: 'Processing' },
};

function buildOrderCard(order) {
  const s = statusLabel[order.status] || statusLabel.delivered;
  const itemChips = order.items.map(i => `
    <div class="order-item-chip">
      <img src="${i.img}" alt="${i.name}" loading="lazy" />
      <span>${i.name}</span>
    </div>
  `).join('');

  return `
    <div class="full-order-card" data-status="${order.status}">
      <div class="full-order-card__top">
        <div class="full-order-card__meta">
          <span class="full-order-card__id">Order ${order.id}</span>
          <span class="full-order-card__date">${order.date}</span>
          <span class="full-order-card__loc"><i class="fa-solid fa-location-dot"></i>${order.loc}</span>
        </div>
        <div class="full-order-card__right">
          <span class="status-badge ${s.cls}">${s.txt}</span>
          <span class="full-order-card__total">${order.total}</span>
          <button class="btn-reorder">Reorder</button>
        </div>
      </div>
      <div class="full-order-card__items">${itemChips}</div>
    </div>
  `;
}

function renderOrders(filter = 'all') {
  const list = document.getElementById('ordersFullList');
  if (!list) return;

  const filtered = filter === 'all'
    ? ORDERS
    : ORDERS.filter(o => o.status === filter);

  if (filtered.length === 0) {
    list.innerHTML = `<p style="color:var(--clr-muted);text-align:center;padding:2rem 0;font-size:.9rem;">No orders found.</p>`;
    return;
  }

  list.innerHTML = filtered.map(buildOrderCard).join('');

  // Reorder button micro-interaction
  list.querySelectorAll('.btn-reorder').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.textContent = '✓ Added to Cart';
      btn.style.background = 'var(--clr-primary)';
      btn.style.color = '#fff';
      btn.style.borderColor = 'var(--clr-primary)';
      showToast('Items added to your cart!');
      setTimeout(() => {
        btn.textContent = 'Reorder';
        btn.style.cssText = '';
      }, 1500);
    });
  });
}

renderOrders();

// Filter orders
document.getElementById('orderFilter')?.addEventListener('change', e => {
  renderOrders(e.target.value);
});

// ── Avatar Upload Preview ─────────────────────────────────
document.getElementById('avatarUpload')?.addEventListener('change', e => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    document.getElementById('avatarImg').src = ev.target.result;
    showToast('Profile photo updated!');
  };
  reader.readAsDataURL(file);
});

// ── Add Address ───────────────────────────────────────────
const addAddressWrap = document.getElementById('addressFormWrap');
const addAddressBtn  = document.getElementById('addAddressBtn');
const addAddressCard = document.getElementById('addAddressCard');
const cancelAddrBtn  = document.getElementById('cancelAddressBtn');
const saveAddrBtn    = document.getElementById('saveAddressBtn');

function showAddressForm() {
  addAddressWrap?.classList.remove('hidden');
  addAddressWrap?.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

addAddressBtn?.addEventListener('click',  showAddressForm);
addAddressCard?.addEventListener('click', showAddressForm);
cancelAddrBtn?.addEventListener('click',  () => addAddressWrap?.classList.add('hidden'));
saveAddrBtn?.addEventListener('click', () => {
  addAddressWrap?.classList.add('hidden');
  showToast('Address saved successfully!');
});

// ── Add Card ──────────────────────────────────────────────
const cardFormWrap = document.getElementById('cardFormWrap');
const addCardBtn   = document.getElementById('addCardBtn');
const cancelCardBtn = document.getElementById('cancelCardBtn');
const saveCardBtn  = document.getElementById('saveCardBtn');
const cardNumInput = document.getElementById('cardNumInput');

addCardBtn?.addEventListener('click', () => {
  cardFormWrap?.classList.remove('hidden');
  cardFormWrap?.scrollIntoView({ behavior: 'smooth', block: 'center' });
});
cancelCardBtn?.addEventListener('click', () => cardFormWrap?.classList.add('hidden'));
saveCardBtn?.addEventListener('click', () => {
  cardFormWrap?.classList.add('hidden');
  showToast('Card saved successfully!');
});

// Card number formatting
cardNumInput?.addEventListener('input', e => {
  let v = e.target.value.replace(/\D/g,'').substring(0,16);
  e.target.value = v.replace(/(.{4})/g,'$1 ').trim();
});

// ── Personal Info Edit ────────────────────────────────────
const editPersonalBtn     = document.getElementById('editPersonalBtn');
const personalFormActions = document.getElementById('personalFormActions');
const cancelPersonalBtn   = document.getElementById('cancelPersonalBtn');
const savePersonalBtn     = document.getElementById('savePersonalBtn');
const personalInputs      = document.querySelectorAll('#personalForm .form-input');

let originalValues = {};

editPersonalBtn?.addEventListener('click', () => {
  // Store originals
  personalInputs.forEach((inp, i) => { originalValues[i] = inp.value; });

  personalInputs.forEach(inp => { inp.disabled = false; });
  personalFormActions?.classList.remove('hidden');
  editPersonalBtn.innerHTML = '<i class="fa-solid fa-xmark"></i> Cancel Edit';
  editPersonalBtn.onclick = cancelEdit;
});

function cancelEdit() {
  personalInputs.forEach((inp, i) => { inp.value = originalValues[i]; inp.disabled = true; });
  personalFormActions?.classList.add('hidden');
  editPersonalBtn.innerHTML = '<i class="fa-regular fa-pen-to-square"></i> Edit';
  editPersonalBtn.onclick = null;
}

cancelPersonalBtn?.addEventListener('click', cancelEdit);

savePersonalBtn?.addEventListener('click', () => {
  personalInputs.forEach(inp => { inp.disabled = true; });
  personalFormActions?.classList.add('hidden');
  editPersonalBtn.innerHTML = '<i class="fa-regular fa-pen-to-square"></i> Edit';
  editPersonalBtn.onclick = null;
  showToast('Personal info saved!');
});

// ── Reorder buttons in overview ───────────────────────────
document.querySelectorAll('.recent-orders .btn-reorder').forEach(btn => {
  btn.addEventListener('click', () => {
    btn.textContent = '✓ Added';
    btn.style.background = 'var(--clr-primary)';
    btn.style.color = '#fff';
    btn.style.borderColor = 'var(--clr-primary)';
    showToast('Items added to your cart!');
    setTimeout(() => { btn.textContent = 'Reorder'; btn.style.cssText = ''; }, 1500);
  });
});

// ── Favourite heart toggle ────────────────────────────────
document.querySelectorAll('.fav-heart').forEach(btn => {
  btn.addEventListener('click', () => {
    btn.classList.toggle('active');
    const isActive = btn.classList.contains('active');
    showToast(isActive ? '❤️ Added to favourites' : 'Removed from favourites');
  });
});

// ── Logout ────────────────────────────────────────────────
document.getElementById('logoutBtn')?.addEventListener('click', () => {
  openModal(
    'Sign Out',
    'Are you sure you want to sign out of your account?',
    () => showToast('Signed out. Redirecting…')
  );
});

// ── Delete Account ────────────────────────────────────────
document.getElementById('deleteAccountBtn')?.addEventListener('click', () => {
  openModal(
    'Delete Account',
    'This will permanently remove your account and all associated data. This cannot be undone.',
    () => showToast('Account deletion requested.', 'error')
  );
});

// ── Modal ─────────────────────────────────────────────────
const modalOverlay = document.getElementById('modalOverlay');
const modalTitle   = document.getElementById('modalTitle');
const modalBody    = document.getElementById('modalBody');
const modalConfirm = document.getElementById('modalConfirm');
const modalCancel  = document.getElementById('modalCancel');

let onConfirmCallback = null;

function openModal(title, body, onConfirm) {
  modalTitle.textContent   = title;
  modalBody.textContent    = body;
  onConfirmCallback        = onConfirm;
  modalOverlay?.classList.remove('hidden');
}

modalConfirm?.addEventListener('click', () => {
  modalOverlay?.classList.add('hidden');
  onConfirmCallback?.();
});

modalCancel?.addEventListener('click', () => {
  modalOverlay?.classList.add('hidden');
});

modalOverlay?.addEventListener('click', e => {
  if (e.target === modalOverlay) modalOverlay.classList.add('hidden');
});

// ── Loyalty progress bar animation on load ────────────────
window.addEventListener('load', () => {
  const fill = document.querySelector('.loyalty-progress__fill');
  if (fill) {
    const target = fill.style.width;
    fill.style.width = '0%';
    setTimeout(() => { fill.style.width = target; }, 400);
  }
});

// ── Connect Wallet button ─────────────────────────────────
document.querySelector('.wallet-badge--connect')?.addEventListener('click', function() {
  this.textContent = '✓ Linked';
  this.classList.remove('wallet-badge--connect');
  this.classList.add('wallet-badge--linked');
  this.style.cursor = 'default';
  showToast('Google Pay connected!');
});

// ── Sticky navbar shadow ─────────────────────────────────
window.addEventListener('scroll', () => {
  navbar?.classList.toggle('scrolled', window.scrollY > 10);
}, { passive: true });