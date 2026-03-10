// ── Cart ──────────────────────────────────────────────────────────────────────
const Cart = {
  items: JSON.parse(localStorage.getItem('brewhaus_cart') || '[]'),
  save() { localStorage.setItem('brewhaus_cart', JSON.stringify(this.items)); this.updateBadge(); },
  add(item) {
    const existing = this.items.find(i =>
      i.menuId === item.menuId && i.size === item.size &&
      i.milk === item.milk && JSON.stringify(i.extras) === JSON.stringify(item.extras)
    );
    if (existing) { existing.qty += item.qty; }
    else { this.items.push({ ...item, cartId: Date.now() + Math.random() }); }
    this.save();
    Toast.show(`${item.name} added to cart ☕`, 'success');
  },
  remove(cartId) { this.items = this.items.filter(i => i.cartId !== cartId); this.save(); },
  updateQty(cartId, qty) {
    const item = this.items.find(i => i.cartId === cartId);
    if (!item) return;
    if (qty <= 0) { this.remove(cartId); return; }
    item.qty = qty; this.save();
  },
  clear() { this.items = []; this.save(); },
  get count() { return this.items.reduce((s, i) => s + i.qty, 0); },
  get subtotal() { return this.items.reduce((s, i) => s + i.totalPrice * i.qty, 0); },
  updateBadge() {
    document.querySelectorAll('.cart-badge').forEach(b => {
      b.textContent = this.count;
      b.classList.toggle('show', this.count > 0);
    });
  }
};

// ── Auth ──────────────────────────────────────────────────────────────────────
const Auth = {
  user: JSON.parse(localStorage.getItem('brewhaus_user') || 'null'),
  async fetchMe() {
    try {
      const r = await fetch('/api/auth/me'); const d = await r.json();
      if (d.user) { this.user = d.user; localStorage.setItem('brewhaus_user', JSON.stringify(d.user)); }
      else { this.user = null; localStorage.removeItem('brewhaus_user'); }
    } catch {}
    return this.user;
  },
  async login(email, password) {
    const r = await fetch('/api/auth/login', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({email,password}) });
    const d = await r.json();
    if (d.user) { this.user = d.user; localStorage.setItem('brewhaus_user', JSON.stringify(d.user)); }
    return d;
  },
  async register(name, email, password) {
    const r = await fetch('/api/auth/register', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({name,email,password}) });
    const d = await r.json();
    if (d.user) { this.user = d.user; localStorage.setItem('brewhaus_user', JSON.stringify(d.user)); }
    return d;
  },
  async logout() { await fetch('/api/auth/logout', {method:'POST'}); this.user = null; localStorage.removeItem('brewhaus_user'); }
};

// ── Toast ──────────────────────────────────────────────────────────────────────
const Toast = {
  container: null,
  init() { this.container = document.createElement('div'); this.container.className = 'toast-container'; document.body.appendChild(this.container); },
  show(msg, type = 'success') {
    if (!this.container) this.init();
    const t = document.createElement('div');
    t.className = `toast ${type}`;
    t.innerHTML = `<span>${type === 'success' ? '✓' : '✕'}</span> ${msg}`;
    this.container.appendChild(t);
    setTimeout(() => { t.style.opacity = '0'; t.style.transition = 'opacity 0.4s'; setTimeout(() => t.remove(), 400); }, 3000);
  }
};

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatPrice(n) { return `₱${Number(n).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`; }
function formatDate(str) { return new Date(str).toLocaleDateString('en-PH', { month:'short', day:'numeric', year:'numeric', hour:'2-digit', minute:'2-digit' }); }
const EMOJIS = { hot:'☕', cold:'🧊', blended:'🥤', food:'🥐', merch:'🛍️' };

const ITEM_PHOTOS = {
  'espresso': 'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=600&q=80',
  'flat white': 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=600&q=80',
  'pour over': 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80',
  'latte': 'https://images.unsplash.com/photo-1561047029-3000c68339ca?w=600&q=80',
  'cold brew': 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600&q=80',
  'americano': 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&q=80',
  'matcha': 'https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=600&q=80',
  'mocha': 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=600&q=80',
  'caramel': 'https://images.unsplash.com/photo-1579888944880-d98341245702?w=600&q=80',
  'croissant': 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&q=80',
  'avocado': 'https://images.unsplash.com/photo-1541519227354-08fa5d50c820?w=600&q=80',
  'banana': 'https://images.unsplash.com/photo-1528975604071-b4dc52a2d18c?w=600&q=80',
  'tumbler': 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=600&q=80',
  'tote': 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&q=80',
};

function getItemPhoto(name) {
  const lower = name.toLowerCase();
  for (const [key, url] of Object.entries(ITEM_PHOTOS)) {
    if (lower.includes(key)) return url;
  }
  return null;
}

// ── Scroll Reveal ─────────────────────────────────────────────────────────────
function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); } });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

// ── Nav ───────────────────────────────────────────────────────────────────────
function initNav() {
  Cart.updateBadge();
  const ham = document.querySelector('.hamburger');
  const links = document.querySelector('.nav-links');
  if (ham) ham.addEventListener('click', () => links.classList.toggle('open'));

  const authLink = document.getElementById('authNavLink');
  if (authLink) {
    if (Auth.user) { authLink.textContent = Auth.user.name.split(' ')[0]; authLink.href = '/account'; }
    else { authLink.textContent = 'Sign In'; authLink.href = '#'; authLink.addEventListener('click', e => { e.preventDefault(); showAuthModal(); }); }
  }
  document.querySelectorAll('.nav-links a').forEach(a => {
    if (a.pathname === window.location.pathname) a.classList.add('active');
  });
}

// ── Auth Modal ────────────────────────────────────────────────────────────────
function showAuthModal() {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.innerHTML = `
    <div class="modal auth-modal" style="border-radius:24px 24px 0 0;">
      <div style="background:var(--ink);padding:32px;text-align:center;border-bottom:1px solid var(--border);">
        <div style="font-family:'Cormorant Garamond',serif;font-size:1.6rem;color:var(--caramel);font-weight:700;margin-bottom:4px;">Brewhaus</div>
        <div style="font-size:0.78rem;color:rgba(253,246,236,0.3);letter-spacing:2px;text-transform:uppercase;">Your coffee, your way</div>
      </div>
      <div style="padding:32px;">
        <div class="auth-tabs">
          <button class="auth-tab active" data-tab="login">Sign In</button>
          <button class="auth-tab" data-tab="register">Create Account</button>
        </div>
        <div id="loginForm">
          <div class="form-group"><label>Email</label><input type="email" id="authEmail" placeholder="you@email.com"></div>
          <div class="form-group"><label>Password</label><input type="password" id="authPass" placeholder="••••••••"></div>
          <button class="btn btn-primary btn-block" id="loginBtn" style="font-size:1rem;padding:14px;">Sign In</button>
        </div>
        <div id="registerForm" style="display:none">
          <div class="form-group"><label>Full Name</label><input type="text" id="regName" placeholder="Your name"></div>
          <div class="form-group"><label>Email</label><input type="email" id="regEmail" placeholder="you@email.com"></div>
          <div class="form-group"><label>Password</label><input type="password" id="regPass" placeholder="Min 6 characters"></div>
          <button class="btn btn-primary btn-block" id="registerBtn" style="font-size:1rem;padding:14px;">Create Account</button>
        </div>
      </div>
    </div>`;
  document.body.appendChild(overlay);
  setTimeout(() => overlay.classList.add('open'), 10);
  overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
  overlay.querySelectorAll('.auth-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      overlay.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById('loginForm').style.display = tab.dataset.tab === 'login' ? 'block' : 'none';
      document.getElementById('registerForm').style.display = tab.dataset.tab === 'register' ? 'block' : 'none';
    });
  });
  document.getElementById('loginBtn').addEventListener('click', async () => {
    const email = document.getElementById('authEmail').value;
    const pass = document.getElementById('authPass').value;
    const d = await Auth.login(email, pass);
    if (d.error) { Toast.show(d.error, 'error'); return; }
    overlay.remove(); Toast.show(`Welcome back, ${d.user.name.split(' ')[0]}! ☕`);
    setTimeout(() => location.reload(), 800);
  });
  document.getElementById('registerBtn').addEventListener('click', async () => {
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const pass = document.getElementById('regPass').value;
    const d = await Auth.register(name, email, pass);
    if (d.error) { Toast.show(d.error, 'error'); return; }
    overlay.remove(); Toast.show(`Welcome, ${d.user.name.split(' ')[0]}! ☕`);
    setTimeout(() => location.reload(), 800);
  });
}

document.addEventListener('DOMContentLoaded', () => { initNav(); initReveal(); });