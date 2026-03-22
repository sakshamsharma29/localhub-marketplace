// frontend/js/cart.js

// ─── Cart Storage ─────────────────────────────
function getCart() {
  return JSON.parse(localStorage.getItem('lh_cart') || '[]');
}
function saveCart(cart) {
  localStorage.setItem('lh_cart', JSON.stringify(cart));
}
function clearCart() {
  localStorage.removeItem('lh_cart');
}

// ─── Add to Cart ──────────────────────────────
function addToCart(product, qty = 1) {
  const cart = getCart();

  // All items must be from the same business
  if (cart.length > 0 && cart[0].business_id !== product.business_id) {
    if (!confirm('Your cart has items from another shop. Clear cart and add this item?')) return false;
    cart.length = 0;
  }

  const idx = cart.findIndex(i => i.id === product.id);
  if (idx > -1) {
    cart[idx].quantity += qty;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.sale_price || product.price,
      image: product.image,
      business_id: product.business_id,
      business_name: product.business_name,
      quantity: qty,
      unit: product.unit || 'piece',
    });
  }
  saveCart(cart);
  showToast(`${product.name} added to cart`, 'success');
  updateCartBadge();
  return true;
}

// ─── Remove from Cart ─────────────────────────
function removeFromCart(productId) {
  const cart = getCart().filter(i => i.id !== productId);
  saveCart(cart);
  updateCartBadge();
}

// ─── Update Quantity ──────────────────────────
function updateQty(productId, qty) {
  const cart = getCart();
  const idx = cart.findIndex(i => i.id === productId);
  if (idx === -1) return;
  if (qty <= 0) { removeFromCart(productId); return; }
  cart[idx].quantity = qty;
  saveCart(cart);
  updateCartBadge();
}

// ─── Cart Totals ──────────────────────────────
function getCartTotals() {
  const cart = getCart();
  const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const delivery = subtotal > 0 && subtotal < 300 ? 30 : 0;
  return { subtotal, delivery, total: subtotal + delivery };
}

// ─── Update Navbar Badge ──────────────────────
function updateCartBadge() {
  const count = getCartCount();
  document.querySelectorAll('.cart-count').forEach(el => {
    el.textContent = count;
    el.style.display = count > 0 ? 'flex' : 'none';
  });
}

// ─── Render Cart Page ─────────────────────────
function renderCartPage() {
  const container = document.getElementById('cart-items');
  const summaryEl = document.getElementById('cart-summary');
  if (!container) return;

  const cart = getCart();
  if (cart.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
        <h3>Your cart is empty</h3>
        <p>Browse local businesses and add some items</p>
        <a href="/business-list.html" class="btn btn-primary">Start Shopping</a>
      </div>`;
    if (summaryEl) summaryEl.innerHTML = '';
    return;
  }

  container.innerHTML = cart.map(item => `
    <div class="cart-item" data-id="${item.id}">
      <div class="cart-item-img">
        <img src="${item.image || 'images/products/placeholder.jpg'}" alt="${item.name}" onerror="this.src='images/products/placeholder.jpg'">
      </div>
      <div class="cart-item-details">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-business">${item.business_name || ''}</div>
        <div class="cart-item-price">₹${item.price.toFixed(2)} / ${item.unit}</div>
      </div>
      <div class="qty-control" style="margin-left:auto">
        <button class="qty-btn" onclick="changeCartQty(${item.id}, -1)">−</button>
        <span class="qty-val">${item.quantity}</span>
        <button class="qty-btn" onclick="changeCartQty(${item.id}, 1)">+</button>
      </div>
      <div style="margin-left:1rem; font-weight:700; min-width:70px; text-align:right">
        ₹${(item.price * item.quantity).toFixed(2)}
      </div>
      <button class="cart-remove" onclick="removeItem(${item.id})" title="Remove">✕</button>
    </div>`).join('');

  renderSummary(summaryEl);
}

function changeCartQty(id, delta) {
  const cart = getCart();
  const item = cart.find(i => i.id === id);
  if (!item) return;
  updateQty(id, item.quantity + delta);
  renderCartPage();
}

function removeItem(id) {
  removeFromCart(id);
  renderCartPage();
  showToast('Item removed', 'warning');
}

function renderSummary(el) {
  if (!el) return;
  const { subtotal, delivery, total } = getCartTotals();
  el.innerHTML = `
    <div class="order-summary">
      <h3 style="margin-bottom:1.25rem">Order Summary</h3>
      <div class="summary-row"><span>Subtotal</span><span>₹${subtotal.toFixed(2)}</span></div>
      <div class="summary-row">
        <span>Delivery</span>
        <span class="${delivery === 0 ? 'free-delivery' : ''}">${delivery === 0 ? 'FREE' : '₹' + delivery.toFixed(2)}</span>
      </div>
      ${delivery > 0 ? `<div style="font-size:0.8rem;color:var(--muted);margin:0.25rem 0 0.5rem">Add ₹${(300 - subtotal).toFixed(0)} more for free delivery</div>` : ''}
      <div class="summary-row"><span>Total</span><span>₹${total.toFixed(2)}</span></div>
      <a href="/checkout.html" class="btn btn-primary btn-full" style="margin-top:1.25rem">Proceed to Checkout</a>
      <a href="/business-list.html" class="btn btn-ghost btn-full" style="margin-top:0.75rem">Continue Shopping</a>
    </div>`;
}
