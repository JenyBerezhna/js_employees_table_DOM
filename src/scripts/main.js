'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const table = document.querySelector('.employees-table');
  const sortDirection = {}; // ✅ Track sorting direction for each column

  table.querySelectorAll('th').forEach((header, index) => {
    header.addEventListener('click', () => {
      sortDirection[index] = sortDirection[index] === 'asc' ? 'desc' : 'asc';
      sortTableByColumn(table, index, sortDirection[index]);
    });
  });

  function sortTableByColumn(targetTable, columnIndex, direction) {
    const tbody = targetTable.querySelector('tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));

    rows.sort((rowA, rowB) => {
      const cellA = rowA.cells[columnIndex].textContent.trim();
      const cellB = rowB.cells[columnIndex].textContent.trim();

      return direction === 'asc'
        ? cellA.localeCompare(cellB, undefined, { numeric: true })
        : cellB.localeCompare(cellA, undefined, { numeric: true });
    });

    rows.forEach((row) => tbody.appendChild(row));
  }
});

document
  .querySelector('.employees-table tbody')
  .addEventListener('click', (clickEvent) => {
    document
      .querySelectorAll('.employees-table tbody tr')
      .forEach((row) => row.classList.remove('active')); // ✅ Deselect previous

    const clickedRow = clickEvent.target.closest('tr');

    if (clickedRow) {
      clickedRow.classList.add('active'); // ✅ Highlight selected row
    }
  });

document.addEventListener('DOMContentLoaded', () => {
  const form = document.createElement('form');

  form.classList.add('new-employee-form');

  form.innerHTML = `
    <label>Name: <input name="name" type="text" data-qa="name" required></label>
    <label>Position: <input name="position" type="text" data-qa="position" required></label>
    <label>Office:
      <select name="office" data-qa="office">
        <option>Tokyo</option><option>Singapore</option><option>London</option>
        <option>New York</option><option>Edinburgh</option><option>San Francisco</option>
      </select>
    </label>
    <label>Age: <input name="age" type="number" data-qa="age" required></label>
    <label>Salary: <input name="salary" type="number" data-qa="salary" required></label>
    <button type="submit">Save to table</button>
  `;
  document.body.appendChild(form);

  form.addEventListener('submit', (currentevent) => {
    currentevent.preventDefault();

    const employeeName = form.name.value.trim();
    const position = form.position.value.trim();
    const office = form.office.value;
    const age = parseInt(form.age.value, 10);
    const salary = parseFloat(form.salary.value);

    if (employeeName.length < 4) {
      return showNotification('error', 'Name must be at least 4 characters');
    }

    if (age < 18 || age > 90) {
      return showNotification('error', 'Age must be between 18 and 90');
    }

    const row = document.createElement('tr');

    row.innerHTML = `<td>${employeeName}</td><td>${position}</td><td>${office}</td><td>${age}</td><td>${salary.toFixed(2)}</td>`;
    document.querySelector('.employees-table tbody').appendChild(row);

    showNotification('success', 'Employee added successfully!');
    form.reset();
  });
});

function showNotification(type, message) {
  const notification = document.createElement('div');

  notification.className = `notification ${type}`;

  notification.setAttribute('data-qa', 'notification');
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => notification.remove(), 3000); // ✅ Auto-remove after 3 sec
}

document
  .querySelector('.employees-table tbody')
  .addEventListener('dblclick', (dblClickEvent) => {
    const cell = dblClickEvent.target;

    if (!cell.matches('td') || cell.querySelector('input')) {
      return;
    }

    const input = document.createElement('input');

    input.classList.add('cell-input');
    input.value = cell.textContent;
    cell.textContent = ''; //  Clear cell content for input
    cell.appendChild(input);
    input.focus();

    input.addEventListener('blur', () => saveEdit(cell, input));

    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        saveEdit(cell, input);
      }
    });
  });

function saveEdit(cell, input) {
  const trimmedValue = input.value.trim();
  const originalValue = input.dataset.originalValue;

  cell.textContent = trimmedValue || originalValue; // original value if empty
}
