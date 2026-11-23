const products = [
  { id: 1, name: 'Everyday headphones', category: 'Audio', price: 64, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=700&q=80', description: 'Comfortable sound for work and travel.' },
  { id: 2, name: 'Studio desk lamp', category: 'Home', price: 42, image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=700&q=80', description: 'A warm, focused glow for your desk.' },
  { id: 3, name: 'Canvas daypack', category: 'Accessories', price: 58, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=700&q=80', description: 'Lightweight storage for daily essentials.' },
  { id: 4, name: 'Minimal wristwatch', category: 'Accessories', price: 89, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=700&q=80', description: 'A clean silhouette with an easy fit.' },
  { id: 5, name: 'Ceramic pour-over set', category: 'Kitchen', price: 36, image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=700&q=80', description: 'A simple ritual for better mornings.' },
  { id: 6, name: 'Wireless speaker', category: 'Audio', price: 72, image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=700&q=80', description: 'Room-filling sound in a compact body.' },
  { id: 7, name: 'Soft knit throw', category: 'Home', price: 49, image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=700&q=80', description: 'An extra layer for slow evenings.' },
  { id: 8, name: 'Insulated bottle', category: 'Kitchen', price: 24, image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=700&q=80', description: 'Keep a favorite drink close at hand.' }
];

const grid = document.querySelector('#product-grid');
const searchInput = document.querySelector('#search-input');
const resultCount = document.querySelector('#result-count');
const cartPanel = document.querySelector('#cart-panel');
const cart = new Map();

function money(amount) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

function renderProducts() {
  const term = searchInput.value.trim().toLowerCase();
  const matches = products.filter((product) => `${product.name} ${product.category} ${product.description}`.toLowerCase().includes(term));
  resultCount.textContent = `${matches.length} ${matches.length === 1 ? 'item' : 'items'}`;

  if (!matches.length) {
    grid.innerHTML = '<p class="store-empty">No products match your search. Try another name or category.</p>';
    return;
  }

  grid.innerHTML = matches.map((product) => `
    <article class="store-card">
      <img src="${product.image}" alt="${product.name}" loading="lazy">
      <div class="store-card-content">
        <p class="store-category">${product.category}</p>
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <div class="store-card-bottom">
          <span class="store-price">${money(product.price)}</span>
          <button class="store-add" type="button" data-add="${product.id}">Add to bag</button>
        </div>
      </div>
    </article>`).join('');
}

function renderCart() {
  const items = [...cart.entries()];
  const count = items.reduce((sum, [, quantity]) => sum + quantity, 0);
  const total = items.reduce((sum, [id, quantity]) => sum + products.find((product) => product.id === id).price * quantity, 0);
  document.querySelector('#cart-count').textContent = count;
  document.querySelector('#cart-total').textContent = money(total);
  document.querySelector('#cart-items').innerHTML = items.length
    ? items.map(([id, quantity]) => {
      const product = products.find((item) => item.id === id);
      return `<div class="cart-row"><div>${product.name}<small>${money(product.price)} × ${quantity}</small></div><button type="button" data-remove="${id}" aria-label="Remove ${product.name}">Remove</button></div>`;
    }).join('')
    : '<p class="demo-subtitle" style="margin-top:18px">Your bag is empty. Add a product to get started.</p>';
}

function setCartOpen(open) {
  cartPanel.classList.toggle('open', open);
  cartPanel.setAttribute('aria-hidden', String(!open));
  cartPanel.inert = !open;
  document.querySelector('#cart-open').setAttribute('aria-expanded', String(open));
  if (open) document.querySelector('#cart-close').focus();
  else document.querySelector('#cart-open').focus();
}

document.querySelector('#search-form').addEventListener('submit', (event) => event.preventDefault());
searchInput.addEventListener('input', renderProducts);
grid.addEventListener('click', (event) => {
  const button = event.target.closest('[data-add]');
  if (!button) return;
  const id = Number(button.dataset.add);
  cart.set(id, (cart.get(id) || 0) + 1);
  renderCart();
  button.textContent = 'Added';
  window.setTimeout(() => { if (button.isConnected) button.textContent = 'Add to bag'; }, 800);
});
document.querySelector('#cart-items').addEventListener('click', (event) => {
  const button = event.target.closest('[data-remove]');
  if (!button) return;
  cart.delete(Number(button.dataset.remove));
  renderCart();
});
document.querySelector('#cart-open').addEventListener('click', () => setCartOpen(true));
document.querySelector('#cart-close').addEventListener('click', () => setCartOpen(false));
document.addEventListener('keydown', (event) => { if (event.key === 'Escape') setCartOpen(false); });

renderProducts();
renderCart();
