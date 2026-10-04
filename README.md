# Personal Finance Dashboard

An interactive personal finance tracking and budgeting dashboard built for a Web Technology course project.

## Features

- **Summary Cards**: Dynamically calculated Total Balance, Total Income, Total Expenses, and Net Savings.
- **Add Transaction**: Form allowing users to log either Income or Expense with description, category, date, and amount.
- **Categories**: Food, Travel, Shopping, Bills, Education, Salary, and Other.
- **Transactions Table**: Formatted transaction history with color-coded badges, date, amounts, and row deletion capability.
- **Real-Time Recalculation**: All summary cards and category charts dynamically update immediately upon adding or deleting any entry.
- **Visual Reports**: Category-wise expense breakdown visualized using pure HTML/CSS progress bars without external charting libraries.
- **Data Persistence**: Uses `localStorage` to ensure transactions persist across page reloads, pre-populated with realistic sample data.

## Technologies Used

- **HTML5**: Semantic tables, form controls, and structured dashboard cards.
- **CSS3**: Dashboard layout with CSS grid, custom theme variables, custom progress bars, badge styling, and responsive media queries.
- **JavaScript (ES6)**: State management, mathematical aggregates, DOM updating, input validation, and `localStorage`.

## File Structure

```
Personal_Finance_Dashboard/
├── index.html    # Dashboard layout and components
├── style.css     # Dashboard and table styling
├── script.js     # Finance calculations, table rendering, and localStorage
└── README.md     # Project documentation
```

## How to Run

1. Open `index.html` in your web browser.
2. No server, Node.js, or external library dependencies required.
