let productsCache = [];

async function fetchJSON(url, opts) {
  const res = await fetch(url, { headers: { 'Content-Type': 'application/json' }, ...opts });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

function toast(msg) {
  const t = document.querySelector('.toast');
  t.textContent = msg; t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 1600);
}

async function updateHealth() {
  const pill = document.getElementById('health-pill');
  try {
    const h = await fetchJSON('/health');
    const online = String(h.status).toLowerCase() === 'ok';
    pill.textContent = online ? 'Online' : 'Offline';
    pill.classList.toggle('ok', online);
    pill.classList.toggle('bad', !online);
  } catch {
    pill.textContent = 'Offline';
    pill.classList.remove('ok');
    pill.classList.add('bad');
  }
}

async function loadProducts() {
  productsCache = await fetchJSON('/products');
  const grid = document.getElementById('products');
  grid.innerHTML = '';
  productsCache.forEach(p => {
    const card = document.createElement('div'); card.className = 'card';
    card.innerHTML = `
      <img class="thumb" src="${p.imageUrl}" alt="${p.name}">
      <div class="body">
        <div class="title">${p.name}</div>
        <div class="price">$${Number(p.price).toFixed(2)}</div>
        <div class="actions">
          <button class="add" data-id="${p.id}">Add to cart</button>
          <button class="view" data-id="${p.id}">View</button>
        </div>
      </div>
    `;
    card.querySelector('.add').addEventListener('click', async () => {
      await fetchJSON('/cart/add', { method: 'POST', body: JSON.stringify({ productId: String(p.id), qty: 1 }) });
      await updateCart();
      toast(`Added “${p.name}”`);
    });
    card.querySelector('.view').addEventListener('click', async () => {
      const d = await fetchJSON(`/products/${p.id}`);
      alert(`${d.name}\nPrice: $${Number(d.price).toFixed(2)}`);
    });
    grid.appendChild(card);
  });
}

function money(n) { return `$${Number(n).toFixed(2)}`; }

async function updateCart() {
  const cart = await fetchJSON('/cart');
  const rows = document.getElementById('cartRows');
  const totalItemsEl = document.getElementById('totalItems');
  const totalAmountEl = document.getElementById('totalAmount');
  const cartCountEl = document.getElementById('cart-count');

  rows.innerHTML = '';

  let totalAmount = 0;
  for (const item of cart.items) {
    const p = productsCache.find(x => String(x.id) === String(item.productId));
    const price = p ? Number(p.price) : 0;
    const subtotal = price * item.qty;
    totalAmount += subtotal;

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${p ? p.name : `#${item.productId}`}</td>
      <td class="right">${item.qty}</td>
      <td class="right">${money(price)}</td>
      <td class="right">${money(subtotal)}</td>
    `;
    rows.appendChild(tr);
  }

  totalItemsEl.textContent = cart.totalItems || 0;
  totalAmountEl.textContent = money(totalAmount);
  cartCountEl.textContent = cart.totalItems || 0;
}

document.addEventListener('DOMContentLoaded', async () => {
  const titleEl = document.querySelector('.brand h1');
  const logoEl  = document.querySelector('.brand .logo');
  if (titleEl && logoEl) {
    const first = (titleEl.textContent || 'S').trim().charAt(0).toUpperCase();
    logoEl.textContent = first;
  }

  document.getElementById('clearCart').addEventListener('click', async () => {
    await fetchJSON('/cart/clear', { method: 'POST' });
    await updateCart();
    toast('Cart cleared');
  });

  document.getElementById('checkoutBtn').addEventListener('click', async () => {
    try {
      await fetchJSON('/cart/checkout', { method: 'POST' });
    } catch {  }
    alert('Payment simulated. Thank you!');
  });

  await updateHealth();
  await loadProducts();
  await updateCart();
});
