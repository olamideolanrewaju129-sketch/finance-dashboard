# Finance Dashboard UI

This project is a clean, interactive finance dashboard interface built with **React (Vite)**, **TailwindCSS (v4)**, and **Recharts**. It is designed to evaluate frontend development structure, UX/UI choices, and state management.

## Features

- **Summary Cards**: "Total Balance", "Income", and "Expenses" prominently displayed.
- **Data Visualization**: A Line Chart tracking balance and pie chart for top spending categories (`recharts`).
- **Transaction Table**: An organized view of mocked transactions.
  - Category Search
  - Income/Expense Filtering
  - Empty states when no data is found.
- **Smart Insights**: Automatically calculates your highest spending category and alerts you if expenses exceed income.
- **Role-Based UI (Simulation)**:
  - Default is **Viewer** mode (View-only context).
  - Can be toggled to **Admin** via the top right corner.
  - **Admin** unlocks the ability to "Add" and "Delete" transactions.
- **Dark Mode**: Toggle switch in the navigation bar.
- **Data Persistence**: Transactions and theme choice are saved to React Context and `localStorage`.

## Tech Stack

- Context API for state management.
- Recharts for data visualization.
- lucide-react for iconography.
- Vite + React 19 for optimal compile speeds.
- Tailwind CSS v4 for utility-first styling.

## How to Run It

1. `npm install` (if taking over the project freshly cloned)
2. `npm run dev`
3. Navigate to `http://localhost:5173/` in your browser.

## Assumptions Made

- Roles are completely mocked via Context switch and do not talk to a backend or handle secure RBAC logic.
- Adding a transaction without specific forms just utilizes an inline quick-add row when the Admin hits "Add".
- Recharts dependency was selected due to Recharts producing some of the fastest charting prototypes in React while cleanly matching arbitrary aesthetics.
