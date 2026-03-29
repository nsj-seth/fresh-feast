/* ============================
   menu.js — FreshFeast Menu Page
============================ */

// ── Menu Data ───────────────────────────────────────
const menuItems = [
  { id:1,  name:"Classic Smash Burger",    category:"burgers",  price:14.99, rating:4.9, desc:"Double patty with melted cheddar, fresh lettuce, and our secret sauce",          img:"https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80",  tag:null },
  { id:2,  name:"Grilled Atlantic Salmon", category:"seafood",  price:22.99, rating:4.8, desc:"Fresh salmon with herb butter, served with seasonal vegetables",                 img:"https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=500&q=80",  tag:null },
  { id:3,  name:"Garden Fresh Bowl",       category:"salads",   price:12.99, rating:4.7, desc:"Mixed greens, cherry tomatoes, avocado, and citrus vinaigrette",                 img:"https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&q=80",  tag:"Vegetarian" },
  { id:4,  name:"Truffle Carbonara",       category:"pasta",    price:18.99, rating:4.9, desc:"Creamy pasta with pancetta, parmesan, and black truffle",                        img:"https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=500&q=80",  tag:null },
  { id:5,  name:"BBQ Bacon Burger",        category:"burgers",  price:16.99, rating:4.8, desc:"Smoky BBQ sauce, crispy bacon strips, caramelized onion rings",                  img:"https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=500&q=80",  tag:null },
  { id:6,  name:"Lemon Herb Cod",          category:"seafood",  price:19.99, rating:4.6, desc:"Pan-seared cod with lemon butter sauce and classic dressing",                    img:"https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=500&q=80",  tag:null },
  { id:7,  name:"Caesar Supreme",          category:"salads",   price:11.99, rating:4.5, desc:"Romaine hearts, croutons, parmesan, classic dressing",                           img:"https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=500&q=80",  tag:"Vegetarian" },
  { id:8,  name:"Pesto Primavera",         category:"pasta",    price:16.99, rating:4.7, desc:"Fresh basil pesto with seasonal vegetables and penne",                           img:"https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=500&q=80",  tag:"Vegetarian" },
  { id:9,  name:"Chocolate Lava Cake",     category:"desserts", price:8.99,  rating:4.9, desc:"Warm molten chocolate cake with vanilla bean ice cream",                         img:"https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500&q=80",  tag:null },
  { id:10, name:"Mango Sorbet",            category:"desserts", price:6.99,  rating:4.6, desc:"House-made mango sorbet with fresh mint and coconut flakes",                     img:"https://images.unsplash.com/photo-1570145820259-b5b80c5c8bd6?w=500&q=80",  tag:"Vegetarian" },
  { id:11, name:"Fresh Lemonade",          category:"drinks",   price:4.99,  rating:4.8, desc:"Cold-pressed lemons, cane sugar, fresh mint, sparkling water",                  img:"https://images.unsplash.com/photo-1523677011781-c91d1bbe2f9e?w=500&q=80",  tag:"Vegetarian" },
  { id:12, name:"Mango Lassi",             category:"drinks",   price:5.99,  rating:4.7, desc:"Creamy blended mango with yogurt, cardamom and honey",                          img:"https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=500&q=80",  tag:"Vegetarian" }
];

// ── State ────────────────────────────────────────────
let activeCategory = 'all';
let searchQuery    = '';
const PAGE_SIZE    = 8;
let visibleCount   = PAGE_SIZE;

// ── DOM Refs ─────────────────────────────────────────
const grid         = document.getElementById('menuGrid');
const emptyState   = document.getElementById('emptyState');
const resultsCount = document.getElementById('resultsCount');
const searchInput  = document.getElementById('searchInput');
const searchClear  = document.getElementById('searchClear');
const toast        = document.getElementById('toast');
const toastMsg     = document.getElementById('toastMsg');
const loadMoreWrap = document.getElementById('loadMoreWrap');
const loadMoreBtn  = document.getElementById('loadMoreBtn');
const resetBtn     = document.getElementById('resetBtn');
const navbar       = document.getElementById('navbar');
const hamburger    = document.getElementById('hamburger');
const navLinks     = document.getElementById('navLinks');

// ── Filter Logic ─────────────────────────────────────
function getFiltered() {
  return menuItems.filter(item => {
    const matchCat    = activeCategory === 'all' || item.category === activeCategory;
    const matchSearch = item.name.toLowerCase().includes(searchQuery) ||
                        item.desc.toLowerCase().includes(searchQuery);
    return matchCat && matchSearch;
  });
}

// ── Build Card HTML ───────────────────────────────────
function buildCard(item, index) {
  const tagHtml = item.tag ? `<span class="card-tag">${item.tag}</span>` : '';
  return `
    <div class="food-card" style="animation-delay:${(index % PAGE_SIZE) * 60}ms" data-id="${item.id}">
      <div class="card-img-wrap">
        <img src="${item.img}" alt="${item.name}" class="card-img" loading="lazy"
             onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80'" />
        ${tagHtml}
      </div>
      <div class="card-body">
        <div class="card-top">
          <h3 class="card-name">${item.name}</h3>
          <div class="card-rating"><i class="fa-solid fa-star"></i> ${item.rating.toFixed(1)}</div>
        </div>
        <p class="card-desc">${item.desc}</p>
        <div class="card-footer">
          <span class="card-price">$${item.price.toFixed(2)}</span>
          <button class="btn-add-cart"
            data-id="${item.id}"
            data-name="${item.name}"
            data-price="${item.price}"
            data-img="${item.img}">Add to Cart</button>
        </div>
      </div>
    </div>`;
}

// ── Render ────────────────────────────────────────────
function render() {
  const filtered = getFiltered();
  const toShow   = filtered.slice(0, visibleCount);

  resultsCount.textContent   = filtered.length;
  emptyState.style.display   = filtered.length === 0 ? 'block' : 'none';
  loadMoreWrap.style.display = filtered.length > visibleCount ? 'block' : 'none';

  if (filtered.length === 0) { grid.innerHTML = ''; return; }

  grid.innerHTML = toShow.map((item, i) => buildCard(item, i)).join('');

  grid.querySelectorAll('.btn-add-cart').forEach(btn => {
    btn.addEventListener('click', () => {
      const id    = parseInt(btn.dataset.id);
      const name  = btn.dataset.name;
      const price = parseFloat(btn.dataset.price);
      const img   = btn.dataset.img;

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
}

// ── Toast ─────────────────────────────────────────────
let toastTimer;
function showToast(name) {
  clearTimeout(toastTimer);
  toastMsg.textContent = `"${name}" added to cart!`;
  toast.classList.add('show');
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
}

// ── Category Tabs ─────────────────────────────────────
document.getElementById('categoryTabs').addEventListener('click', e => {
  const pill = e.target.closest('.tab-pill');
  if (!pill) return;
  document.querySelectorAll('.tab-pill').forEach(p => p.classList.remove('active'));
  pill.classList.add('active');
  activeCategory = pill.dataset.cat;
  visibleCount = PAGE_SIZE;
  render();
});

// ── Search ────────────────────────────────────────────
searchInput.addEventListener('input', () => {
  searchQuery = searchInput.value.trim().toLowerCase();
  searchClear.classList.toggle('visible', searchQuery.length > 0);
  visibleCount = PAGE_SIZE;
  render();
});

searchClear.addEventListener('click', () => {
  searchInput.value = '';
  searchQuery = '';
  searchClear.classList.remove('visible');
  searchInput.focus();
  render();
});

// ── Load More ─────────────────────────────────────────
loadMoreBtn.addEventListener('click', () => {
  visibleCount += PAGE_SIZE;
  render();
  const cards = grid.querySelectorAll('.food-card');
  if (cards.length > 0)
    cards[cards.length - Math.min(PAGE_SIZE, cards.length)].scrollIntoView({ behavior:'smooth', block:'nearest' });
});

// ── Reset ─────────────────────────────────────────────
resetBtn && resetBtn.addEventListener('click', () => {
  searchInput.value = '';
  searchQuery = '';
  searchClear.classList.remove('visible');
  activeCategory = 'all';
  visibleCount = PAGE_SIZE;
  document.querySelectorAll('.tab-pill').forEach(p => p.classList.remove('active'));
  document.querySelector('[data-cat="all"]').classList.add('active');
  render();
});

document.getElementById('filterBtn').addEventListener('click', function () { this.classList.toggle('active'); });

// ── Scroll Animations ─────────────────────────────────
const animEls = document.querySelectorAll('[data-animate]');
const animObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); animObs.unobserve(e.target); } });
}, { threshold: 0.1 });
animEls.forEach(el => animObs.observe(el));

// ── Navbar / Hamburger ────────────────────────────────
window.addEventListener('scroll', () => navbar.classList.toggle('scrolled', window.scrollY > 20), { passive:true });
hamburger.addEventListener('click', () => { hamburger.classList.toggle('open'); navLinks.classList.toggle('open'); });
navLinks.querySelectorAll('.nav-link').forEach(l => l.addEventListener('click', () => { hamburger.classList.remove('open'); navLinks.classList.remove('open'); }));

// ── Init ──────────────────────────────────────────────
CartStore.syncBadge();
render();