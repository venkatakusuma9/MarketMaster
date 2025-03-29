// Initialize LocalStorage with sample data if empty
function initializeStorage() {
  const sampleItems = [
    { id: 1, name: "Laptop", qty: 10, price: 999, image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45" },
    { id: 2, name: "Smartphone", qty: 15, price: 699, image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9" },
    { id: 3, name: "Headphones", qty: 20, price: 199, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e" }
  ];

  if (!localStorage.getItem('stock')) {
    localStorage.setItem('stock', JSON.stringify(sampleItems));
  }
  if (!localStorage.getItem('cart')) {
    localStorage.setItem('cart', JSON.stringify([]));
  }
  if (!localStorage.getItem('transactions')) {
    localStorage.setItem('transactions', JSON.stringify([]));
  }
}

// DOM Elements
const itemGrid = document.getElementById('itemGrid');
const searchBar = document.getElementById('searchBar');
const cartButton = document.getElementById('cartButton');
const cartCount = document.querySelector('.cart-count');

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
  initializeStorage();
  renderItems(JSON.parse(localStorage.getItem('stock')));
  updateCartCount();
  
  // Set up event listeners
  cartButton.addEventListener('click', () => {
    window.location.href = 'cart.html';
  });

  // Simple and reliable search functionality
  searchBar.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase().trim();
    const allItems = JSON.parse(localStorage.getItem('stock')) || [];
    
    if (!searchTerm) {
      renderItems(allItems);
      return;
    }

    const filteredItems = allItems.filter(item => 
      item.name.toLowerCase().includes(searchTerm)
    );
    renderItems(filteredItems);
  });

  // Initial render of all items
  renderItems(JSON.parse(localStorage.getItem('stock')) || []);

  document.getElementById('logButton').addEventListener('click', () => {
    if (localStorage.getItem('adminLoggedIn')) {
      window.location.href = 'logs.html';
    } else {
      alert('Please login as admin first');
      window.location.href = 'admin.html';
    }
  });

  document.getElementById('adminButton').addEventListener('click', () => {
    window.location.href = 'admin.html';
  });
});

// Render items to the grid
function renderItems(items) {
  itemGrid.innerHTML = items.map(item => `
    <div class="item-card bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
      <img src="${item.image}" alt="${item.name}" class="w-full h-48 object-cover">
      <div class="p-4">
        <h3 class="font-bold text-lg">${item.name}</h3>
        <p class="text-gray-600">Available: ${item.qty}</p>
        <button 
          class="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition add-to-cart" 
          data-id="${item.id}"
        >
          Add to Cart
        </button>
      </div>
    </div>
  `).join('');

  // Add event listeners to all "Add to Cart" buttons
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('add-to-cart') || e.target.closest('.add-to-cart')) {
      const button = e.target.classList.contains('add-to-cart') ? e.target : e.target.closest('.add-to-cart');
      const itemId = parseInt(button.dataset.id);
      addToCart(itemId);
    }
  });
}

// Add item to cart (default quantity 1)
function addToCart(itemId) {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const existingItem = cart.find(item => item.id === itemId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ id: itemId, quantity: 1 });
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  window.location.href = 'cart.html';
}

// Update cart count indicator
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem('cart'));
  cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);
  cartCount.classList.add('animate-pulse');
  setTimeout(() => cartCount.classList.remove('animate-pulse'), 500);
}