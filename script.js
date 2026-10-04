// Sample initial transactions
const initialTransactions = [
    {
        id: "TXN-1001",
        type: "Income",
        description: "Monthly College Teaching Assistant Stipend",
        category: "Salary",
        amount: 1500.00,
        date: "2026-10-01"
    },
    {
        id: "TXN-1002",
        type: "Expense",
        description: "Semester Textbooks & Study Materials",
        category: "Education",
        amount: 120.00,
        date: "2026-10-02"
    },
    {
        id: "TXN-1003",
        type: "Expense",
        description: "Campus Cafeteria & Groceries",
        category: "Food",
        amount: 65.50,
        date: "2026-10-03"
    },
    {
        id: "TXN-1004",
        type: "Expense",
        description: "Metro Train Monthly Transit Pass",
        category: "Travel",
        amount: 80.00,
        date: "2026-10-03"
    },
    {
        id: "TXN-1005",
        type: "Expense",
        description: "High-speed Internet & Utility Bill",
        category: "Bills",
        amount: 55.00,
        date: "2026-10-04"
    }
];

// App State
let transactions = [];

// Initialize
document.addEventListener("DOMContentLoaded", () => {
    // Set default date to today
    const dateInput = document.getElementById("txnDate");
    if (dateInput) {
        dateInput.value = new Date().toISOString().split("T")[0];
    }

    // Load transactions from localStorage or use initial samples
    const stored = localStorage.getItem("financeTransactions");
    if (stored) {
        try {
            transactions = JSON.parse(stored);
        } catch (e) {
            transactions = [...initialTransactions];
        }
    } else {
        transactions = [...initialTransactions];
        saveToLocalStorage();
    }

    // Attach form submit listener
    const form = document.getElementById("transactionForm");
    form.addEventListener("submit", handleAddTransaction);

    // Initial render
    updateDashboard();
});

// Save to LocalStorage
function saveToLocalStorage() {
    localStorage.setItem("financeTransactions", JSON.stringify(transactions));
}

// Show Alerts
function showAlert(message, type = "success") {
    const alertBox = document.getElementById("alertBox");
    alertBox.textContent = message;
    alertBox.className = `alert alert-${type}`;
    alertBox.classList.remove("d-none");

    setTimeout(() => {
        alertBox.classList.add("d-none");
    }, 3500);
}

// Switch Tab Navigation
function switchTab(tab) {
    const navLinks = document.querySelectorAll(".nav-link");
    navLinks.forEach(link => link.classList.remove("active"));

    if (tab === "dashboard") {
        document.getElementById("dashboardSection").scrollIntoView({ behavior: "smooth" });
        navLinks[0].classList.add("active");
    } else if (tab === "transactions") {
        document.getElementById("transactionsSection").scrollIntoView({ behavior: "smooth" });
        navLinks[1].classList.add("active");
    } else if (tab === "add") {
        document.getElementById("addSection").scrollIntoView({ behavior: "smooth" });
        navLinks[2].classList.add("active");
    } else if (tab === "reports") {
        document.getElementById("reportsSection").scrollIntoView({ behavior: "smooth" });
        navLinks[3].classList.add("active");
    }
}

// Handle Add Transaction
function handleAddTransaction(e) {
    e.preventDefault();

    const type = document.getElementById("txnType").value;
    const category = document.getElementById("txnCategory").value;
    const amountVal = parseFloat(document.getElementById("txnAmount").value);
    const date = document.getElementById("txnDate").value;
    const description = document.getElementById("txnDescription").value.trim();

    if (!description || isNaN(amountVal) || amountVal <= 0 || !date) {
        showAlert("Please enter a valid description, date and positive amount.", "danger");
        return;
    }

    const newTxn = {
        id: "TXN-" + Date.now().toString().slice(-6),
        type: type,
        category: category,
        amount: amountVal,
        date: date,
        description: description
    };

    transactions.unshift(newTxn);
    saveToLocalStorage();

    // Reset Form
    document.getElementById("txnDescription").value = "";
    document.getElementById("txnAmount").value = "";

    updateDashboard();
    showAlert(`Successfully recorded ${type.toLowerCase()} of $${amountVal.toFixed(2)}!`, "success");
}

// Delete Transaction
function deleteTransaction(id) {
    if (confirm("Are you sure you want to delete this transaction entry?")) {
        transactions = transactions.filter(t => t.id !== id);
        saveToLocalStorage();
        updateDashboard();
        showAlert("Transaction deleted successfully.", "success");
    }
}

// Recalculate and update the whole dashboard
function updateDashboard() {
    let totalIncome = 0;
    let totalExpenses = 0;

    transactions.forEach(t => {
        if (t.type === "Income") {
            totalIncome += t.amount;
        } else if (t.type === "Expense") {
            totalExpenses += t.amount;
        }
    });

    const balance = totalIncome - totalExpenses;
    const savings = balance > 0 ? balance : 0;

    // Update Stat Cards
    document.getElementById("totalBalance").textContent = `$${balance.toFixed(2)}`;
    document.getElementById("totalIncome").textContent = `$${totalIncome.toFixed(2)}`;
    document.getElementById("totalExpenses").textContent = `$${totalExpenses.toFixed(2)}`;
    document.getElementById("totalSavings").textContent = `$${savings.toFixed(2)}`;

    // Update Transaction Count
    document.getElementById("transactionCountBadge").textContent = `${transactions.length} entries`;

    // Render Table
    renderTransactionsTable();

    // Render Category Expense Report
    renderCategoryReport(totalExpenses);
}

// Render Transactions Table
function renderTransactionsTable() {
    const tbody = document.getElementById("transactionTableBody");
    tbody.innerHTML = "";

    if (transactions.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; color: #718096; padding: 2rem;">
                    No transactions recorded yet. Use the "Add Transaction" form above.
                </td>
            </tr>
        `;
        return;
    }

    transactions.forEach(t => {
        const tr = document.createElement("tr");
        const isIncome = t.type === "Income";
        const badgeClass = isIncome ? "badge-income" : "badge-expense";
        const amountClass = isIncome ? "amount-income" : "amount-expense";
        const prefix = isIncome ? "+$" : "-$";

        tr.innerHTML = `
            <td>${t.date}</td>
            <td><strong>${escapeHtml(t.description)}</strong></td>
            <td><span class="badge">${t.category}</span></td>
            <td><span class="${badgeClass}">${t.type}</span></td>
            <td class="${amountClass}">${prefix}${t.amount.toFixed(2)}</td>
            <td>
                <button class="btn-sm-danger" onclick="deleteTransaction('${t.id}')">Delete</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Render Expense Breakdown Report with Pure CSS/HTML Bars
function renderCategoryReport(totalExpenses) {
    const container = document.getElementById("categoryBarsContainer");
    container.innerHTML = "";

    // Calculate sum per category for Expenses
    const categories = ["Food", "Travel", "Shopping", "Bills", "Education", "Other"];
    const categoryTotals = {};

    categories.forEach(cat => { categoryTotals[cat] = 0; });

    transactions.forEach(t => {
        if (t.type === "Expense") {
            const cat = categories.includes(t.category) ? t.category : "Other";
            categoryTotals[cat] += t.amount;
        }
    });

    if (totalExpenses === 0) {
        container.innerHTML = `<p style="color: #718096; text-align: center; padding: 1rem;">No expense data recorded to visualize yet.</p>`;
        return;
    }

    categories.forEach(cat => {
        const amount = categoryTotals[cat];
        const percentage = totalExpenses > 0 ? ((amount / totalExpenses) * 100).toFixed(1) : 0;

        const row = document.createElement("div");
        row.className = "bar-row";
        row.innerHTML = `
            <div class="bar-meta">
                <span>${cat}</span>
                <span>$${amount.toFixed(2)} (${percentage}%)</span>
            </div>
            <div class="bar-track">
                <div class="bar-fill" style="width: ${percentage}%"></div>
            </div>
        `;
        container.appendChild(row);
    });
}

// Basic HTML escaping for security
function escapeHtml(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
