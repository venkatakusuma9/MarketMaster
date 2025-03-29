// Initialize bill page
document.addEventListener('DOMContentLoaded', () => {
  try {
    generateBill();
    setupEventListeners();
  } catch (error) {
    console.error('Error initializing bill page:', error);
    alert('An error occurred while loading the bill. Please try again.');
  }
});

// Generate and display the bill
function generateBill() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const stock = JSON.parse(localStorage.getItem('stock')) || [];
  const billItemsContainer = document.getElementById('billItems');
  const totalAmountElement = document.getElementById('totalAmount');

  if (cart.length === 0) {
    billItemsContainer.innerHTML = '<p class="text-gray-500">No items in cart</p>';
    totalAmountElement.textContent = '$0.00';
    return;
  }

  let total = 0;
  billItemsContainer.innerHTML = cart.map(item => {
    const product = stock.find(p => p.id === item.id);
    const itemTotal = product ? (product.price * item.quantity) : 0;
    total += itemTotal;

    return `
      <div class="flex justify-between items-center border-b pb-2 mb-2">
        <div>
          <h3 class="font-medium">${product?.name || 'Unknown Product'}</h3>
          <p class="text-sm text-gray-500">${item.quantity} × $${product?.price?.toFixed(2) || '0.00'}</p>
        </div>
        <span class="font-medium">$${itemTotal.toFixed(2)}</span>
      </div>
    `;
  }).join('');

  totalAmountElement.textContent = `$${total.toFixed(2)}`;
}

// Set up event listeners
function setupEventListeners() {
  // Edit cart button
  document.getElementById('editCart').addEventListener('click', () => {
    window.location.href = 'cart.html';
  });

  // Save transaction button
  document.getElementById('saveTransaction').addEventListener('click', saveTransaction);
}

// Save transaction to logs and update stock
function saveTransaction() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const stock = JSON.parse(localStorage.getItem('stock')) || [];
  const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
  
  // Calculate total
  let total = 0;
  const transactionItems = cart.map(item => {
    const product = stock.find(p => p.id === item.id);
    const itemTotal = product ? (product.price * item.quantity) : 0;
    total += itemTotal;

    // Update stock quantity
    if (product) {
      product.qty = Math.max(0, product.qty - item.quantity);
    }

    return {
      id: item.id,
      name: product?.name || 'Unknown Product',
      quantity: item.quantity,
      price: product?.price || 0,
      total: itemTotal
    };
  });

  // Create transaction record
  const transaction = {
    date: new Date().toISOString(),
    items: transactionItems,
    total: total
  };

  // Update storage
  transactions.push(transaction);
  localStorage.setItem('transactions', JSON.stringify(transactions));
  localStorage.setItem('stock', JSON.stringify(stock));
  localStorage.setItem('cart', JSON.stringify([])); // Clear cart

  // Redirect to home
  window.location.href = 'index.html';
}