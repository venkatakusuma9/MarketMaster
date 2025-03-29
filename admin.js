// Admin credentials (for demo purposes)
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'admin123' // In production, use proper authentication
};

// Load items from localStorage
function loadItems() {
  const stock = JSON.parse(localStorage.getItem('stock')) || [];
  const itemList = document.getElementById('itemList');

  itemList.innerHTML = stock.length ? stock.map(item => `
    <div class="flex justify-between items-center border-b pb-4" data-id="${item.id}">
      <div class="flex items-center space-x-4">
        <img src="${item.image}" alt="${item.name}" class="w-16 h-16 object-cover rounded">
        <div>
          <h3 class="font-medium">${item.name}</h3>
          <p class="text-sm text-gray-500">$${item.price} | Qty: ${item.qty}</p>
        </div>
      </div>
      <button class="remove-btn text-red-500 hover:text-red-700 p-2">
        <i class="fas fa-trash"></i>
      </button>
    </div>
  `).join('') : '<p class="text-gray-500">No items in inventory</p>';
}

// Initialize admin dashboard
document.addEventListener('DOMContentLoaded', () => {
  // Check authentication
  if (!localStorage.getItem('adminLoggedIn')) {
    window.location.href = 'admin.html';
    return;
  }

  loadItems();

  // Add new item
  document.getElementById('addItemButton').addEventListener('click', () => {
    const name = prompt('Item name:');
    const price = parseFloat(prompt('Item price:'));
    const qty = parseInt(prompt('Initial quantity:') || 0);
    const image = prompt('Image URL:') || 'https://via.placeholder.com/150';

    if (name && !isNaN(price)) {
      const stock = JSON.parse(localStorage.getItem('stock')) || [];
      stock.push({
        id: Date.now(),
        name,
        price,
        qty,
        image
      });
      localStorage.setItem('stock', JSON.stringify(stock));
      loadItems();
    }
  });

  // Delete item
  document.addEventListener('click', (e) => {
    if (e.target.closest('.remove-btn')) {
      const itemId = parseInt(e.target.closest('[data-id]').dataset.id);
      if (confirm('Delete this item?')) {
        const stock = JSON.parse(localStorage.getItem('stock')).filter(item => item.id !== itemId);
        localStorage.setItem('stock', JSON.stringify(stock));
        loadItems();
      }
    }
  });
});