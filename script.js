let entries = JSON.parse(localStorage.getItem('entries')) || [];

document.addEventListener('DOMContentLoaded', () => {
  renderEntries(entries);
  calculateTotals(entries);
});


document.getElementById('add-entry').addEventListener('click', () => {
  const description = document.getElementById('description').value;
  const amount = parseFloat(document.getElementById('amount').value);
  const type = document.getElementById('type').value;

  if (description && amount && !isNaN(amount)) {
    const entry = { id: Date.now(), description, amount, type };
    entries.push(entry);
    localStorage.setItem('entries', JSON.stringify(entries));
    renderEntries(entries);
    calculateTotals(entries);
    clearForm();
  }
});


function renderEntries(entries) {
  const entriesList = document.getElementById('entries-list');
  entriesList.innerHTML = '';
  
  const filteredEntries = filterEntries(entries);
  filteredEntries.forEach(entry => {
    const listItem = document.createElement('li');
    listItem.innerHTML = `
      <span>${entry.description} - $${entry.amount} (${entry.type})</span>
      <span>
        <button onclick="editEntry(${entry.id})">Edit</button>
        <button onclick="deleteEntry(${entry.id})">Delete</button>
      </span>
    `;
    entriesList.appendChild(listItem);
  });
}


function filterEntries(entries) {
  const filterValue = document.querySelector('input[name="filter"]:checked').value;
  if (filterValue === 'income') return entries.filter(e => e.type === 'income');
  if (filterValue === 'expense') return entries.filter(e => e.type === 'expense');
  return entries;
}


function calculateTotals(entries) {
  const totalIncome = entries.filter(e => e.type === 'income').reduce((acc, entry) => acc + entry.amount, 0);
  const totalExpense = entries.filter(e => e.type === 'expense').reduce((acc, entry) => acc + entry.amount, 0);
  const netBalance = totalIncome - totalExpense;
  
  document.getElementById('total-income').textContent = totalIncome.toFixed(2);
  document.getElementById('total-expense').textContent = totalExpense.toFixed(2);
  document.getElementById('net-balance').textContent = netBalance.toFixed(2);
}


function editEntry(id) {
  const entry = entries.find(e => e.id === id);
  document.getElementById('description').value = entry.description;
  document.getElementById('amount').value = entry.amount;
  document.getElementById('type').value = entry.type;

  deleteEntry(id);
}


function deleteEntry(id) {
  entries = entries.filter(entry => entry.id !== id);
  localStorage.setItem('entries', JSON.stringify(entries));
  renderEntries(entries);
  calculateTotals(entries);
}


function clearForm() {
  document.getElementById('description').value = '';
  document.getElementById('amount').value = '';
}


document.querySelectorAll('input[name="filter"]').forEach(filter => {
  filter.addEventListener('change', () => renderEntries(entries));
});
