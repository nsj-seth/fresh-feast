/* ============================
   preferences.js — FreshFeast
============================ */

// ── State ─────────────────────────────────────────────
const state = {
  dietary:  [],
  allergen: [],
  spice:    'medium'
};

// Load from localStorage if available
function loadState() {
  try {
    const saved = localStorage.getItem('freshfeast_prefs');
    if (saved) {
      const parsed = JSON.parse(saved);
      state.dietary  = parsed.dietary  || [];
      state.allergen = parsed.allergen || [];
      state.spice    = parsed.spice    || 'medium';
    }
  } catch (_) {}
}

function saveState() {
  try {
    localStorage.setItem('freshfeast_prefs', JSON.stringify(state));
  } catch (_) {}
}

// ── Apply saved state to UI ───────────────────────────
function applyState() {
  // Dietary cards
  document.querySelectorAll('[data-group="dietary"]').forEach(card => {
    const active = state.dietary.includes(card.dataset.value);
    card.classList.toggle('selected', active);
    card.setAttribute('aria-pressed', active);
  });

  // Allergen cards
  document.querySelectorAll('[data-group="allergen"]').forEach(card => {
    const active = state.allergen.includes(card.dataset.value);
    card.classList.toggle('selected', active);
    card.setAttribute('aria-pressed', active);
  });

  // Spice pills
  document.querySelectorAll('.spice-pill').forEach(pill => {
    const active = pill.dataset.value === state.spice;
    pill.classList.toggle('active', active);
    pill.setAttribute('aria-pressed', active);
  });
}

// ── Dietary / Allergen card toggle ────────────────────
document.querySelectorAll('.pref-card').forEach(card => {
  card.addEventListener('click', () => {
    const group = card.dataset.group;  // "dietary" | "allergen"
    const val   = card.dataset.value;
    const arr   = state[group];
    const idx   = arr.indexOf(val);

    if (idx === -1) {
      arr.push(val);
    } else {
      arr.splice(idx, 1);
    }

    applyState();

    // Ripple micro-interaction
    const icon = card.querySelector('.pref-card-icon');
    icon.style.transform = 'scale(1.25)';
    setTimeout(() => { icon.style.transform = ''; }, 200);
  });
});

// ── Spice pills (single-select) ───────────────────────
document.querySelectorAll('.spice-pill').forEach(pill => {
  pill.addEventListener('click', () => {
    state.spice = pill.dataset.value;
    applyState();
  });
});

// ── Save Button ───────────────────────────────────────
const saveBtn = document.getElementById('saveBtn');

saveBtn.addEventListener('click', () => {
  saveBtn.classList.add('saving');
  saveBtn.textContent = 'Saving…';

  // Simulate async save
  setTimeout(() => {
    saveState();
    saveBtn.textContent = '✓ Saved!';

    // Show toast
    showToast('Your preferences have been saved!');

    setTimeout(() => {
      saveBtn.textContent = 'Save Preferences';
      saveBtn.classList.remove('saving');
    }, 1800);
  }, 700);
});

// ── Toast ─────────────────────────────────────────────
const toast    = document.getElementById('toast');
const toastMsg = document.getElementById('toastMsg');
let toastTimer;

function showToast(msg) {
  clearTimeout(toastTimer);
  toastMsg.textContent = msg;
  toast.classList.add('show');
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3000);
}

// ── Scroll Animations ─────────────────────────────────
const animEls = document.querySelectorAll('[data-animate]');
const animObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const delay = e.target.dataset.delay ? parseInt(e.target.dataset.delay) : 0;
      setTimeout(() => e.target.classList.add('visible'), delay);
      animObs.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });
animEls.forEach(el => animObs.observe(el));

// ── Sticky Navbar ─────────────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

// ── Hamburger ─────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('.nav-link').forEach(l => {
  l.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

// ── Init ──────────────────────────────────────────────
loadState();
applyState();