import React, { createContext, useContext, useState, useEffect } from "react";
import { initializeData } from "../data/mockData";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [role, setRole] = useState("viewer"); // 'viewer' or 'admin'
  const [theme, setTheme] = useState("light");

  // Load initial data
  useEffect(() => {
    const data = initializeData();
    setTransactions(data);
    
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

  return (
    <AppContext.Provider
      value={{
        transactions,
        role,
        setRole,
        theme,
        toggleTheme,
        addTransaction,
        deleteTransaction,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
