/* ============================
   script.js — FreshFeast Homepage
============================ */

// ── Homepage food cards (must match IDs in menuItems) ──
const HOME_ITEMS = [
  { id:1, name:"Classic Smash Burger",    price:14.99, img:"https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80" },
  { id:2, name:"Grilled Atlantic Salmon", price:22.99, img:"https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=500&q=80" },
  { id:3, name:"Garden Fresh Bowl",       price:12.99, img:"https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&q=80" },
  { id:4, name:"Truffle Carbonara",       price:18.99, img:"https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=500&q=80" },
];

// ── Add to Cart Buttons ─────────────────────────────
document.querySelectorAll('.btn-add-cart').forEach(btn => {
  btn.addEventListener('click', () => {
    const name  = btn.dataset.name;
    const price = parseFloat(btn.dataset.price);
    // Find matching item for img
    const meta = HOME_ITEMS.find(i => i.name === name) || {};
    const id   = meta.id   || Math.floor(Math.random() * 1000) + 100;
    const img  = meta.img  || '';

    // Write to shared localStorage cart
    CartStore.addItem({ id, name, price, img });
    CartStore.syncBadge();

    showToast(name);

    btn.textContent = '✓ Added';
    btn.style.background = 'var(--clr-primary)';
    btn.style.color = '#fff';
    setTimeout(() => {
      btn.textContent = 'Add to Cart';
      btn.style.background = '';
      btn.style.color = '';
    }, 1400);
  });
});

// ── Sticky Navbar Shadow ────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
});

// ── Hamburger Menu ──────────────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

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

// ── Active Nav Link on Scroll ───────────────────────
const sections    = document.querySelectorAll('section[id], header[id]');
const allNavLinks = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      allNavLinks.forEach(l => l.classList.remove('active'));
      const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));

// ── Scroll-triggered Animations ────────────────────
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
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

animEls.forEach(el => animObserver.observe(el));

// ── Hero image parallax ─────────────────────────────
const heroImg = document.querySelector('.hero-img');
if (heroImg && window.innerWidth > 820) {
  window.addEventListener('scroll', () => {
    heroImg.style.transform = `translateY(${window.scrollY * 0.08}px)`;
  }, { passive: true });
}

// ── Toast ────────────────────────────────────────────
const toast    = document.getElementById('toast');
const toastMsg = document.getElementById('toastMsg');
let toastTimer;

function showToast(name) {
  clearTimeout(toastTimer);
  toastMsg.textContent = `"${name}" added to cart!`;
  toast.classList.add('show');
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
}

// ── Init: sync badge from stored cart ───────────────
CartStore.syncBadge();