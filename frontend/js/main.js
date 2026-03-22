// frontend/js/main.js

var API = '/api';

/* ─── API Helper ─────────────────────────────── */
async function apiCall(endpoint, options) {
  options = options || {};
  var token = localStorage.getItem('token');
  var headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = 'Bearer ' + token;
  var res  = await fetch(API + endpoint, Object.assign({}, options, { headers: headers }));
  var data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Something went wrong');
  return data;
}

/* ─── Auth ───────────────────────────────────── */
function getUser()    { try { return JSON.parse(localStorage.getItem('user')); } catch(e) { return null; } }
function isLoggedIn() { return !!localStorage.getItem('token'); }

/* ─── Dark Mode ──────────────────────────────── */
function initDarkMode() {
  if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark');
  }
}
function toggleDarkMode() {
  document.body.classList.toggle('dark');
  localStorage.setItem('darkMode', document.body.classList.contains('dark'));
  var btn = document.getElementById('dark-toggle-btn');
  if (btn) btn.textContent = document.body.classList.contains('dark') ? '☀️' : '🌙';
}
function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  showToast('Logged out');
  setTimeout(function(){ window.location.href = 'index.html'; }, 500);
}

/* ─── Cart ───────────────────────────────────── */
function getCart() {
  try { return JSON.parse(localStorage.getItem('cart')) || []; } catch(e) { return []; }
}
function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartBadge();
}
function updateCartBadge() {
  var total = 0;
  getCart().forEach(function(i){ total += i.quantity; });
  var badge = document.querySelector('.cart-count');
  if (badge) { badge.textContent = total; badge.style.display = total > 0 ? 'flex' : 'none'; }
}
function addToCart(product, quantity) {
  quantity = quantity || 1;
  var cart = getCart();
  var found = false;
  for (var i = 0; i < cart.length; i++) {
    if (cart[i].id === product.id) { cart[i].quantity += quantity; found = true; break; }
  }
  if (!found) {
    cart.push({ id: product.id, name: product.name, price: product.price, sale_price: product.sale_price || null, image: product.image || '', business_id: product.business_id, business_name: product.business_name || '', unit: product.unit || 'pc', quantity: quantity });
  }
  saveCart(cart);
  showToast(product.name + ' added to cart!', 'success');
}
function removeFromCart(id) { saveCart(getCart().filter(function(i){ return i.id !== id; })); }
function clearCart()        { localStorage.removeItem('cart'); updateCartBadge(); }

/* ─── Wishlist ───────────────────────────────── */
function getWishlist() {
  try { return JSON.parse(localStorage.getItem('wishlist')) || []; } catch(e) { return []; }
}
function saveWishlist(list) { localStorage.setItem('wishlist', JSON.stringify(list)); }
function isWishlisted(id) { return getWishlist().some(function(p){ return p.id === id; }); }
function toggleWishlist(product) {
  var list = getWishlist();
  var idx  = -1;
  for (var i = 0; i < list.length; i++) { if (list[i].id === product.id) { idx = i; break; } }
  if (idx >= 0) { list.splice(idx, 1); showToast('Removed from wishlist'); }
  else          { list.push(product);  showToast('Added to wishlist ❤️', 'success'); }
  saveWishlist(list);
  // Update heart buttons on page
  var btns = document.querySelectorAll('.wish-btn[data-id="' + product.id + '"]');
  btns.forEach(function(b){ b.textContent = isWishlisted(product.id) ? '❤️' : '🤍'; });
}

/* ─── Toast ──────────────────────────────────── */
function showToast(message, type, duration) {
  type = type || 'default'; duration = duration || 3000;
  var container = document.getElementById('toast-container');
  if (!container) { container = document.createElement('div'); container.id = 'toast-container'; document.body.appendChild(container); }
  var toast = document.createElement('div');
  toast.className = 'toast ' + type;
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(function() { toast.style.opacity = '0'; toast.style.transition = 'opacity 0.3s'; setTimeout(function(){ if(toast.parentNode) toast.parentNode.removeChild(toast); }, 300); }, duration);
}

/* ─── Helpers ────────────────────────────────── */
function formatCurrency(amount) { return '₹' + parseFloat(amount || 0).toFixed(2); }
function renderStars(rating) {
  rating = parseFloat(rating) || 0;
  var s = ''; var full = Math.floor(rating); var half = (rating % 1) >= 0.5 ? 1 : 0; var empty = 5 - full - half;
  for(var i=0;i<full;i++) s+='★'; if(half) s+='½'; for(var i=0;i<empty;i++) s+='☆';
  return '<span style="color:#F59E0B">' + s + '</span>';
}

/* ─── Navbar ─────────────────────────────────── */
function renderNavbar() {
  var nav = document.querySelector('.navbar');
  if (!nav) return;
  var user = getUser();
  var cartCount = 0;
  getCart().forEach(function(i){ cartCount += i.quantity; });

  var userSection = '';
  if (user) {
    var isSeller = user.role === 'business_owner' || user.role === 'admin';
    userSection =
      (isSeller ? '<a href="dashboard.html" class="btn btn-outline btn-sm" style="margin-right:0.5rem">🏪 My Shop</a>' : '') +
      '<div style="position:relative;display:inline-block">' +
        '<button id="dd-btn" class="btn btn-ghost btn-sm">👤 ' + user.name.split(' ')[0] + ' ▾</button>' +
        '<div id="dd-menu" style="display:none;position:absolute;top:calc(100% + 8px);right:0;background:#fff;border:1px solid var(--border);border-radius:12px;box-shadow:0 8px 30px rgba(0,0,0,0.12);min-width:200px;padding:0.5rem 0;z-index:9999">' +
          '<a href="dashboard.html"    style="display:block;padding:0.65rem 1rem;font-size:0.9rem;color:var(--dark);text-decoration:none">🏪 My Dashboard</a>' +
          (isSeller
            ? '<a href="add-product.html"  style="display:block;padding:0.65rem 1rem;font-size:0.9rem;color:var(--dark);text-decoration:none">📦 Add Product</a>' +
              '<a href="add-business.html" style="display:block;padding:0.65rem 1rem;font-size:0.9rem;color:var(--dark);text-decoration:none">+ New Business</a>'
            : '') +
          '<a href="orders.html"       style="display:block;padding:0.65rem 1rem;font-size:0.9rem;color:var(--dark);text-decoration:none">📋 My Orders</a>' +
          '<a href="wishlist.html"     style="display:block;padding:0.65rem 1rem;font-size:0.9rem;color:var(--dark);text-decoration:none">❤️ My Wishlist</a>' +
          '<a href="profile.html"      style="display:block;padding:0.65rem 1rem;font-size:0.9rem;color:var(--dark);text-decoration:none">👤 My Profile</a>' +
          '<div style="border-top:1px solid var(--border);margin:0.4rem 0"></div>' +
          '<a href="javascript:void(0)" onclick="logout()" style="display:block;padding:0.65rem 1rem;font-size:0.9rem;color:#DC2626;text-decoration:none">Logout</a>' +
        '</div>' +
      '</div>';
  } else {
    userSection =
      '<a href="login.html"    class="btn btn-outline btn-sm">Login</a>' +
      '<a href="register.html" class="btn btn-primary btn-sm">Register</a>';
  }

  nav.innerHTML =
    '<div class="container"><div class="navbar-inner">' +
      '<a href="index.html" class="navbar-logo">Local<span>Hub</span></a>' +
      '<div class="navbar-search">' +
        '<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>' +
        '<input type="text" id="nav-search" placeholder="Search businesses, products…">' +
      '</div>' +
      '<nav class="navbar-links">' +
        '<button id="dark-toggle-btn" class="dark-toggle" onclick="toggleDarkMode()" title="Toggle dark mode">' + (localStorage.getItem('darkMode')==='true' ? '☀️' : '🌙') + '</button>' +
        '<a href="index.html">Home</a>' +
        '<a href="search.html">🔎 Search</a>' +
        '<a href="business-list.html">Businesses</a>' +
        '<a href="cart.html" style="position:relative">🛒 Cart' +
          '<span class="cart-count" style="display:' + (cartCount > 0 ? 'flex' : 'none') + '">' + cartCount + '</span>' +
        '</a>' +
        userSection +
      '</nav>' +
    '</div></div>';

  // Search handler
  var ns = document.getElementById('nav-search');
  if (ns) {
    ns.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' && ns.value.trim()) {
        window.location.href = 'business-list.html?search=' + encodeURIComponent(ns.value.trim());
      }
    });
  }

  // Dropdown toggle — attached directly after innerHTML set
  var ddBtn  = document.getElementById('dd-btn');
  var ddMenu = document.getElementById('dd-menu');
  if (ddBtn && ddMenu) {
    ddBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      ddMenu.style.display = ddMenu.style.display === 'none' ? 'block' : 'none';
    });
    document.addEventListener('click', function() {
      ddMenu.style.display = 'none';
    });
  }
}

/* ─── Init ───────────────────────────────────── */
document.addEventListener('DOMContentLoaded', function() {
  initDarkMode();
  renderNavbar();
});