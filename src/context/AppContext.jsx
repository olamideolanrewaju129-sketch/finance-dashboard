import React, { createContext, useContext, useState, useEffect } from "react";
import { initializeData, initializeBudgets } from "../data/mockData";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState({ monthlyTotal: 0, categories: {} });
  const [role, setRole] = useState("viewer"); // 'viewer' or 'admin'
  const [theme, setTheme] = useState("light");

  // Load initial data
  useEffect(() => {
    const data = initializeData();
    setTransactions(data);
    setBudgets(initializeBudgets());
    
    // Load theme setting
    const savedTheme = localStorage.getItem("dashboard_theme") || "light";
    setTheme(savedTheme);
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  useEffect(() => {
    // Save to local storage whenever transactions change
    if (transactions.length > 0) {
      localStorage.setItem("dashboard_transactions", JSON.stringify(transactions));
    }
  }, [transactions]);

  useEffect(() => {
    if (budgets.monthlyTotal > 0) {
      localStorage.setItem("dashboard_budgets", JSON.stringify(budgets));
    }
  }, [budgets]);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("dashboard_theme", newTheme);
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const addTransaction = (transaction) => {
    setTransactions((prev) => [transaction, ...prev]);
  };

  const deleteTransaction = (id) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const updateBudgets = (newBudgets) => {
    setBudgets(newBudgets);
  };

  return (
    <AppContext.Provider
      value={{
        transactions,
        budgets,
        role,
        setRole,
        theme,
        toggleTheme,
        addTransaction,
        deleteTransaction,
        updateBudgets,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
