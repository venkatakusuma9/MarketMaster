// Initialize logs page
document.addEventListener('DOMContentLoaded', () => {
  loadTransactionLogs();
  setupEventListeners();
});

// Load transaction logs
function loadTransactionLogs(filterDate = null) {
  const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
  const logsTable = document.getElementById('logsTable');

  if (transactions.length === 0) {
    logsTable.innerHTML = '<tr><td colspan="3" class="py-4 text-center text-gray-500">No transactions found</td></tr>';
    return;
  }

  // Filter transactions by date if specified
  const filteredTransactions = filterDate 
    ? transactions.filter(t => new Date(t.date).toDateString() === new Date(filterDate).toDateString())
    : transactions;

  logsTable.innerHTML = filteredTransactions.map(transaction => {
    const date = new Date(transaction.date);
    const formattedDate = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    
    return `
      <tr class="border-b hover:bg-gray-50">
        <td class="py-3 px-4">${formattedDate}</td>
        <td class="py-3 px-4">
          <div class="max-h-20 overflow-y-auto">
            ${transaction.items.map(item => `
              <div class="text-sm">
                ${item.quantity}x ${item.name} @ $${item.price.toFixed(2)} = $${item.total.toFixed(2)}
              </div>
            `).join('')}
          </div>
        </td>
        <td class="py-3 px-4 text-right font-medium">$${transaction.total.toFixed(2)}</td>
      </tr>
    `;
  }).join('');
}

// Set up event listeners
function setupEventListeners() {
  // Date filter
  document.getElementById('filterButton').addEventListener('click', () => {
    const dateFilter = document.getElementById('dateFilter').value;
    loadTransactionLogs(dateFilter || null);
  });

  // Set today's date as default filter
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('dateFilter').value = today;
  loadTransactionLogs(today);
}