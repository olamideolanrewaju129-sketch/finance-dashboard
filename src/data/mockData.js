export const mockTransactions = [
  {
    id: 1,
    date: "2026-04-01",
    amount: 50000,
    category: "Salary",
    type: "income",
  },
  {
    id: 2,
    date: "2026-04-02",
    amount: 5000,
    category: "Food",
    type: "expense",
  },
  {
    id: 3,
    date: "2026-04-03",
    amount: 3000,
    category: "Transport",
    type: "expense",
  },
  {
    id: 4,
    date: "2026-04-03",
    amount: 15000,
    category: "Freelance",
    type: "income",
  },
  {
    id: 5,
    date: "2026-04-04",
    amount: 8000,
    category: "Subscriptions",
    type: "expense",
  },
  {
    id: 6,
    date: "2026-04-05",
    amount: 20000,
    category: "Groceries",
    type: "expense",
  }
];

export const initializeData = () => {
  const stored = localStorage.getItem("dashboard_transactions");
  if (!stored) {
    localStorage.setItem("dashboard_transactions", JSON.stringify(mockTransactions));
    return mockTransactions;
  }
  return JSON.parse(stored);
};
