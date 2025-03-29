// Initialize cart page
document.addEventListener('DOMContentLoaded', () => {
  loadCartItems();
  setupEventListeners();
});

// Load cart items from localStorage
function loadCartItems() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const stock = JSON.parse(localStorage.getItem('stock')) || [];
  const cartItemsContainer = document.getElementById('cartItems');
  const priceInputsContainer = document.getElementById('priceInputs');

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '<p class="text-gray-500">Your cart is empty</p>';
    priceInputsContainer.innerHTML = '';
    return;
  }

  cartItemsContainer.innerHTML = cart.map(item => {
    const product = stock.find(p => p.id === item.id);
    return `
      <div class="flex justify-between items-center border-b pb-4" data-id="${item.id}">
        <div>
          <h3 class="font-medium">${product?.name || 'Unknown Product'}</h3>
          <p class="text-sm text-gray-500">Available: ${product?.qty || 0}</p>
        </div>
        <div class="flex items-center space-x-4">
          <button class="quantity-btn bg-gray-200 px-3 py-1 rounded" data-action="decrease">
            <i class="fas fa-minus"></i>
          </button>
          <span class="quantity">${item.quantity}</span>
          <button class="quantity-btn bg-gray-200 px-3 py-1 rounded" data-action="increase">
            <i class="fas fa-plus"></i>
          </button>
          <button class="remove-btn text-red-500 hover:text-red-700">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
    `;
  }).join('');

  priceInputsContainer.innerHTML = cart.map(item => {
    const product = stock.find(p => p.id === item.id);
    return `
      <div class="flex items-center justify-between" data-id="${item.id}">
        <span>${product?.name || 'Unknown Product'}</span>
        <div class="flex items-center">
          <span class="mr-2">$</span>
          <input 
            type="number" 
            min="0" 
            step="0.01" 
            value="${product?.price || 0}" 
            class="price-input w-20 border rounded px-2 py-1"
          >
          <span class="ml-2">per unit</span>
        </div>
      </div>
    `;
  }).join('');
}

// Set up event listeners
function setupEventListeners() {
  // Quantity adjustment buttons
  document.querySelectorAll('.quantity-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const action = e.currentTarget.dataset.action;
      const itemElement = e.currentTarget.closest('[data-id]');
      const itemId = parseInt(itemElement.dataset.id);
      updateQuantity(itemId, action);
    });
  });

  // Remove item buttons
  document.querySelectorAll('.remove-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const itemElement = e.currentTarget.closest('[data-id]');
      const itemId = parseInt(itemElement.dataset.id);
      removeFromCart(itemId);
    });
  });

  // Add more items button
  document.getElementById('addMoreItems').addEventListener('click', () => {
    window.location.href = 'index.html';
  });

  // Generate bill button
  document.getElementById('generateBill').addEventListener('click', generateBill);
}

// Update item quantity in cart
function updateQuantity(itemId, action) {
  const cart = JSON.parse(localStorage.getItem('cart'));
  const itemIndex = cart.findIndex(item => item.id === itemId);
  
  if (itemIndex !== -1) {
    if (action === 'increase') {
      cart[itemIndex].quantity += 1;
    } else if (action === 'decrease' && cart[itemIndex].quantity > 1) {
      cart[itemIndex].quantity -= 1;
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCartItems();
  }
}

// Remove item from cart
function removeFromCart(itemId) {
  let cart = JSON.parse(localStorage.getItem('cart'));
  cart = cart.filter(item => item.id !== itemId);
  localStorage.setItem('cart', JSON.stringify(cart));
  loadCartItems();
}

// Generate bill and redirect to bill page
function generateBill() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const stock = JSON.parse(localStorage.getItem('stock')) || [];
  
  if (cart.length === 0) {
    alert('Your cart is empty!');
    return;
  }

  // Get prices from inputs
  const priceInputs = document.querySelectorAll('.price-input');
  priceInputs.forEach(input => {
    const itemId = parseInt(input.closest('[data-id]').dataset.id);
    const price = parseFloat(input.value) || 0; // Default to 0 if invalid
    
    // Update price in stock
    const stockItem = stock.find(item => item.id === itemId);
    if (stockItem) {
      stockItem.price = price;
    }
  });

  localStorage.setItem('stock', JSON.stringify(stock));
  window.location.href = 'bill.html';
}
