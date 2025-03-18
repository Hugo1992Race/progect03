document.getElementById('themeToggle').addEventListener('click', function() {
    const currentTheme = document.body.className;
    document.body.className = currentTheme === 'light-theme' ? 'dark-theme' : 'light-theme';
});

let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
const expenseList = document.getElementById('expense-list');
const totalAmount = document.getElementById('total-amount');
const categoryFilter = document.getElementById('category-filter');
const sortDateButton = document.getElementById('sort-date');
const sortAmountButton = document.getElementById('sort-amount');

document.getElementById('add-expense-button').addEventListener('click', addExpense);
categoryFilter.addEventListener('change', filterExpenses);
sortDateButton.addEventListener('click', () => sortExpenses('date'));
sortAmountButton.addEventListener('click', () => sortExpenses('amount'));

function addExpense() {
    const name = document.getElementById('expense-name').value;
    const amount = parseFloat(document.getElementById('expense-amount').value);
    const category = document.getElementById('expense-category').value; 

    if (!name || amount <= 0 || !category) {
        alert('Пожалуйста, заполните все поля корректно.');
        return;
    }

    const expense = {
        name,
        amount,
        category,
        date: new Date().toLocaleDateString()
    };
    
    expenses.push(expense);
    localStorage.setItem('expenses', JSON.stringify(expenses));
    renderExpenses();
    resetForm();
}

function renderExpenses() {
    expenseList.innerHTML = '';
    let total = 0;

    expenses.forEach(expense => {
        const li = document.createElement('li');
        li.className = expense.category;
        li.innerHTML = `${expense.name} - ${expense.amount} ₽ (${expense.date}) <button onclick="removeExpense('${expense.name}')">Удалить</button>`;
        expenseList.appendChild(li);
        total += expense.amount;
    });

    totalAmount.innerText = `Итог: ${total} ₽`;
}

function resetForm() {
    document.getElementById('expense-name').value = '';
    document.getElementById('expense-amount').value = '';
    document.getElementById('expense-category').value = '';
}

function removeExpense(name) {
    expenses = expenses.filter(expense => expense.name !== name);
    localStorage.setItem('expenses', JSON.stringify(expenses));
    renderExpenses();
}

function filterExpenses() {
    const category = categoryFilter.value;
    const filteredExpenses = category ? expenses.filter(expense => expense.category === category) : expenses;
    renderFilteredExpenses(filteredExpenses);
}

function renderFilteredExpenses(filteredExpenses) {
    expenseList.innerHTML = '';
    let total = 0;

    filteredExpenses.forEach(expense => {
        const li = document.createElement('li');
        li.className = expense.category;
        li.innerHTML = `${expense.name} - ${expense.amount} ₽ (${expense.date}) <button onclick="removeExpense('${expense.name}')">Удалить</button>`;
        expenseList.appendChild(li);
        total += expense.amount;
    });

    totalAmount.innerText = `Итог: ${total} ₽`;
}

function sortExpenses(criteria) {
    if (criteria === 'date') {
        expenses.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (criteria === 'amount') {
        expenses.sort((a, b) => b.amount - a.amount);
    }
    renderExpenses();
}

// Инициализация при загрузке страницы
renderExpenses();
