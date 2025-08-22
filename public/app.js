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
    pill.textContent = `Health: ${h.status}`;
    pill.classList.remove('bad'); pill.classList.add('ok');
  } catch {
    pill.textContent = 'Health: down';
    pill.classList.remove('ok'); pill.classList.add('bad');
  }
}

async function loadProducts() {
  const products = await fetchJSON('/products');
  const grid = document.getElementById('products');
  grid.innerHTML = '';
  products.forEach(p => {
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

async function updateCart() {
  const c = await fetchJSON('/cart');
  document.getElementById('cart-json').textContent = JSON.stringify(c, null, 2);
  document.getElementById('cart-count').textContent = c.totalItems || 0;
}

document.addEventListener('DOMContentLoaded', async () => {
  document.getElementById('clearCart').addEventListener('click', async () => {
    await fetchJSON('/cart/clear', { method: 'POST' });
    await updateCart();
    toast('Cart cleared');
  });

  await updateHealth();
  await loadProducts();
  await updateCart();
});
