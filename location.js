/* ============================================================
   FreshFeast — loc-script.js   (Locations Page)
============================================================ */

// ── Navbar: sticky shadow + hamburger ─────────────────────
const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

// ── Cart badge (persist from other pages) ─────────────────
const cartBadge = document.getElementById('cartBadge');
const savedCart = parseInt(localStorage.getItem('ffCartCount') || '0', 10);
if (savedCart) cartBadge.textContent = savedCart;

// ── Scroll animations ─────────────────────────────────────
const animEls = document.querySelectorAll('[data-animate]');

const animObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el    = entry.target;
      const delay = el.dataset.delay ? parseInt(el.dataset.delay) : 0;
      setTimeout(() => el.classList.add('visible'), delay);
      animObserver.unobserve(el);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

animEls.forEach(el => animObserver.observe(el));

// ── Location data (mirrors the HTML cards) ────────────────
const LOCATIONS = [
  { id: '1', city: 'downtown',  tags: ['open','delivery','dine-in'],            name: 'Downtown District'  },
  { id: '2', city: 'midtown',   tags: ['open','delivery','dine-in','drive-thru'], name: 'Midtown Market'   },
  { id: '3', city: 'westside',  tags: ['delivery'],                              name: 'Westside Kitchen'  },
  { id: '4', city: 'northgate', tags: ['open','dine-in','drive-thru'],           name: 'Northgate Square'  },
  { id: '5', city: 'eastend',   tags: ['open','delivery','dine-in'],             name: 'East End Garden'   },
  { id: '6', city: 'southpark', tags: ['delivery','drive-thru'],                 name: 'South Park Bites'  },
];

// ── Filter state ───────────────────────────────────────────
let activeFilter = 'all';
let searchQuery  = '';

const cardEls      = document.querySelectorAll('.loc-card');
const resultsLabel = document.getElementById('resultsLabel');
const noResults    = document.getElementById('noResults');

function applyFilters() {
  let visible = 0;

  cardEls.forEach(card => {
    const tags  = card.dataset.tags || '';
    const city  = card.dataset.city || '';
    const name  = card.querySelector('.loc-card__name')?.textContent.toLowerCase() || '';
    const addr  = card.querySelector('.loc-card__address')?.textContent.toLowerCase() || '';

    const matchFilter = activeFilter === 'all' || tags.includes(activeFilter);
    const matchSearch = !searchQuery ||
      city.includes(searchQuery) ||
      name.includes(searchQuery) ||
      addr.includes(searchQuery);

    const show = matchFilter && matchSearch;
    card.classList.toggle('hidden', !show);
    if (show) visible++;
  });

  resultsLabel.innerHTML = `<strong>${visible}</strong> location${visible !== 1 ? 's' : ''} found`;
  noResults.classList.toggle('hidden', visible > 0);
}

// ── Filter Pills ───────────────────────────────────────────
const pills = document.querySelectorAll('.pill');
pills.forEach(pill => {
  pill.addEventListener('click', () => {
    pills.forEach(p => p.classList.remove('pill--active'));
    pill.classList.add('pill--active');
    activeFilter = pill.dataset.filter;
    applyFilters();
  });
});

// ── Search bar ─────────────────────────────────────────────
const searchInput = document.getElementById('searchInput');
const searchBtn   = document.getElementById('searchBtn');

function doSearch() {
  searchQuery = searchInput.value.trim().toLowerCase();
  applyFilters();
}

searchBtn.addEventListener('click', doSearch);
searchInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') doSearch();
});
// Live search as you type (debounced)
let searchTimer;
searchInput.addEventListener('input', () => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(doSearch, 300);
});

// ── Clear filters button ───────────────────────────────────
document.getElementById('clearFilters')?.addEventListener('click', () => {
  searchInput.value = '';
  searchQuery = '';
  activeFilter = 'all';
  pills.forEach(p => p.classList.remove('pill--active'));
  document.querySelector('.pill[data-filter="all"]').classList.add('pill--active');
  applyFilters();
});

// ── Map Pins — highlight matching card ────────────────────
const mapPins = document.querySelectorAll('.map-pin');

function highlightCard(locId, scroll = false) {
  cardEls.forEach(card => card.classList.remove('highlighted'));
  mapPins.forEach(pin => pin.classList.remove('pin-active'));

  const card = document.querySelector(`.loc-card[data-id="${locId}"]`);
  const pin  = document.querySelector(`.map-pin[data-loc="${locId}"]`);

  if (card) {
    card.classList.add('highlighted');
    if (scroll) {
      card.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }
  if (pin) pin.classList.add('pin-active');
}

mapPins.forEach(pin => {
  pin.addEventListener('click', () => {
    const locId = pin.dataset.loc;
    highlightCard(locId, true);

    // Show toast with location name
    const loc = LOCATIONS.find(l => l.id === locId);
    if (loc) showToast(`📍 ${loc.name}`);
  });
});

// Hover on card highlights pin
cardEls.forEach(card => {
  const locId = extractLocId(card);

  card.addEventListener('mouseenter', () => {
    mapPins.forEach(p => p.classList.remove('pin-active'));
    const pin = document.querySelector(`.map-pin[data-loc="${locId}"]`);
    if (pin) pin.classList.add('pin-active');
  });

  card.addEventListener('mouseleave', () => {
    mapPins.forEach(p => p.classList.remove('pin-active'));
  });
});

// Extract loc id from card (stored in data-id, fallback to position)
function extractLocId(card) {
  // We don't have data-id on <li> so use index
  const allCards = Array.from(document.querySelectorAll('.loc-card'));
  return String(allCards.indexOf(card) + 1);
}

// ── Toast ──────────────────────────────────────────────────
const toast   = document.getElementById('toast');
const toastMsg = document.getElementById('toastMsg');
let toastTimer;

function showToast(msg) {
  clearTimeout(toastTimer);
  toastMsg.textContent = msg;
  toast.classList.add('show');
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
}

// ── "Get Directions" links: open in new tab + toast ────────
document.querySelectorAll('.btn-directions').forEach((btn, i) => {
  btn.addEventListener('click', e => {
    const loc = LOCATIONS[i];
    if (loc) showToast(`🗺 Opening directions to ${loc.name}…`);
  });
});

// ── Delivery CTA address input: enter key ─────────────────
document.querySelector('.delivery-cta__input')?.addEventListener('keydown', e => {
  if (e.key === 'Enter' && e.target.value.trim()) {
    showToast('🛵 Checking delivery availability…');
  }
});