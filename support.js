/* ============================
   support.js — FreshFeast
============================ */

// ── FAQ Accordion ─────────────────────────────────────
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
  const btn = item.querySelector('.faq-question');
  const chevron = item.querySelector('.faq-chevron');

  btn.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');

    // Close all
    faqItems.forEach(i => {
      i.classList.remove('open');
      const ch = i.querySelector('.faq-chevron');
      ch.classList.remove('fa-chevron-up');
      ch.classList.add('fa-chevron-down');
      i.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
    });

    // Open clicked (if it was closed)
    if (!isOpen) {
      item.classList.add('open');
      chevron.classList.remove('fa-chevron-down');
      chevron.classList.add('fa-chevron-up');
      btn.setAttribute('aria-expanded', 'true');
    }
  });
});

// ── FAQ Search ────────────────────────────────────────
const faqSearch      = document.getElementById('faqSearch');
const faqSearchClear = document.getElementById('faqSearchClear');
const faqList        = document.getElementById('faqList');
const faqEmpty       = document.getElementById('faqEmpty');
const faqEmptyTerm   = document.getElementById('faqEmptyTerm');

// Store original text content for each item
faqItems.forEach(item => {
  const q = item.querySelector('.faq-question span');
  const a = item.querySelector('.faq-answer p');
  item.dataset.qText = q.textContent;
  item.dataset.aText = a.textContent;
});

function highlightText(text, query) {
  if (!query) return text;
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  return text.replace(regex, '<mark class="faq-highlight">$1</mark>');
}

function runFaqSearch(query) {
  const q = query.trim().toLowerCase();
  let visible = 0;

  faqItems.forEach(item => {
    const qEl = item.querySelector('.faq-question span');
    const aEl = item.querySelector('.faq-answer p');

    const matchQ = item.dataset.qText.toLowerCase().includes(q);
    const matchA = item.dataset.aText.toLowerCase().includes(q);

    if (!q || matchQ || matchA) {
      item.style.display = '';
      visible++;
      // Restore / highlight
      qEl.innerHTML = q ? highlightText(item.dataset.qText, q) : item.dataset.qText;
      aEl.innerHTML = q ? highlightText(item.dataset.aText, q) : item.dataset.aText;

      // Auto-open matching items when searching
      if (q && (matchQ || matchA)) {
        item.classList.add('open');
        const ch = item.querySelector('.faq-chevron');
        ch.classList.remove('fa-chevron-down');
        ch.classList.add('fa-chevron-up');
      }
    } else {
      item.style.display = 'none';
      // Restore text for hidden items
      qEl.innerHTML = item.dataset.qText;
      aEl.innerHTML = item.dataset.aText;
    }
  });

  faqEmpty.style.display = visible === 0 ? 'block' : 'none';
  faqList.style.display  = visible === 0 ? 'none'  : '';
  if (visible === 0) faqEmptyTerm.textContent = query;
}

faqSearch.addEventListener('input', () => {
  const val = faqSearch.value;
  faqSearchClear.classList.toggle('visible', val.length > 0);
  runFaqSearch(val);
});

faqSearchClear.addEventListener('click', () => {
  faqSearch.value = '';
  faqSearchClear.classList.remove('visible');
  faqSearch.focus();
  runFaqSearch('');
});

// ── Quick Message Form ────────────────────────────────
const sendBtn   = document.getElementById('sendMsgBtn');
const qmName    = document.getElementById('qmName');
const qmMessage = document.getElementById('qmMessage');
const toast     = document.getElementById('toast');
const toastMsg  = document.getElementById('toastMsg');
let toastTimer;

function showToast(msg, icon = 'check') {
  clearTimeout(toastTimer);
  toastMsg.textContent = msg;
  const ico = toast.querySelector('i');
  ico.className = icon === 'check'
    ? 'fa-solid fa-circle-check'
    : 'fa-solid fa-triangle-exclamation';
  toast.classList.add('show');
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3200);
}

sendBtn.addEventListener('click', () => {
  const name = qmName.value.trim();
  const msg  = qmMessage.value.trim();

  // Basic validation
  if (!name) {
    qmName.focus();
    qmName.style.borderColor = '#e53935';
    setTimeout(() => { qmName.style.borderColor = ''; }, 1800);
    showToast('Please enter your name.', 'warn');
    return;
  }

  if (!msg) {
    qmMessage.focus();
    qmMessage.style.borderColor = '#e53935';
    setTimeout(() => { qmMessage.style.borderColor = ''; }, 1800);
    showToast('Please type a message.', 'warn');
    return;
  }

  sendBtn.classList.add('sending');
  sendBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending…';

  // Simulate async send
  setTimeout(() => {
    qmName.value    = '';
    qmMessage.value = '';
    sendBtn.innerHTML = 'Send Message <i class="fa-solid fa-paper-plane"></i>';
    sendBtn.classList.remove('sending');
    showToast('Message sent! We\'ll get back to you shortly.');
  }, 900);
});

// Clear red borders on focus
[qmName, qmMessage].forEach(el => {
  el.addEventListener('focus', () => { el.style.borderColor = ''; });
});

// ── Scroll Animations ─────────────────────────────────
const animEls = document.querySelectorAll('[data-animate]');
const animObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const delay = parseInt(e.target.dataset.delay || 0);
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