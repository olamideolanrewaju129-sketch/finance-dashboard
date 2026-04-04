import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";
import { Search, Filter, Trash2, PlusCircle, ArrowUpRight, ArrowDownRight } from "lucide-react";
import clsx from "clsx";

const TransactionTable = () => {
  const { transactions, role, deleteTransaction, addTransaction } = useAppContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  // Local state for adding transaction
  const [newTx, setNewTx] = useState({ date: "", amount: "", category: "", type: "expense" });
  const [isAdding, setIsAdding] = useState(false);

  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch = t.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || t.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newTx.amount || !newTx.category || !newTx.date) return;
    
    addTransaction({
      id: Date.now(),
      date: newTx.date,
      amount: parseFloat(newTx.amount),
      category: newTx.category,
      type: newTx.type,
    });
    setNewTx({ date: "", amount: "", category: "", type: "expense" });
    setIsAdding(false);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden mt-6">
      
      <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white">Recent Transactions</h3>
        
        <div className="flex flex-wrap items-center gap-3">
          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-sm bg-gray-50 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-48 transition-colors"
            />
          </div>

          {/* Filter */}
          <div className="relative flex items-center">
            <Filter className="w-4 h-4 absolute left-3 text-gray-400 pointer-events-none" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="pl-9 pr-8 py-2 appearance-none border border-gray-200 dark:border-gray-600 rounded-lg text-sm bg-gray-50 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            >
              <option value="all">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>

          {/* Admin Add Button */}
          {role === "admin" && (
            <button
              onClick={() => setIsAdding(!isAdding)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              {isAdding ? "Cancel" : "Add"}
            </button>
          )}
        </div>
      </div>

      {isAdding && role === "admin" && (
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 border-b border-blue-100 dark:border-blue-800">
          <form onSubmit={handleAdd} className="flex flex-wrap items-end gap-4">
            <div className="flex-1 min-w-[120px]">
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
              <input type="date" required value={newTx.date} onChange={(e) => setNewTx({...newTx, date: e.target.value})} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm dark:bg-gray-700 dark:text-white" />
            </div>
            <div className="flex-1 min-w-[120px]">
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Amount (₦)</label>
              <input type="number" min="0" required value={newTx.amount} onChange={(e) => setNewTx({...newTx, amount: e.target.value})} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm dark:bg-gray-700 dark:text-white" />
            </div>
            <div className="flex-1 min-w-[120px]">
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
              <input type="text" placeholder="e.g. Salary, Food" required value={newTx.category} onChange={(e) => setNewTx({...newTx, category: e.target.value})} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm dark:bg-gray-700 dark:text-white" />
            </div>
            <div className="flex-1 min-w-[120px]">
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Type</label>
              <select value={newTx.type} onChange={(e) => setNewTx({...newTx, type: e.target.value})} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm dark:bg-gray-700 dark:text-white">
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>
            <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors h-[38px]">
              Save
            </button>
          </form>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-300">
            <tr>
              <th className="px-6 py-4 font-medium">Date</th>
              <th className="px-6 py-4 font-medium">Category</th>
              <th className="px-6 py-4 font-medium">Type</th>
              <th className="px-6 py-4 font-medium text-right">Amount</th>
              {role === "admin" && <th className="px-6 py-4 font-medium text-right">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.length === 0 ? (
              <tr>
                <td colSpan={role === "admin" ? 5 : 4} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-full mb-3">
                      <Search className="w-6 h-6 text-gray-400" />
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 font-medium">No transactions found</p>
                    <p className="text-sm text-gray-400 mt-1">Try adjusting your filters or search term.</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredTransactions.map((tx) => (
                <tr key={tx.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">{tx.date}</td>
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{tx.category}</td>
                  <td className="px-6 py-4">
                    <span className={clsx(
                      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
                      tx.type === "income" ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                    )}>
                      {tx.type === "income" ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                      {tx.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-semibold text-gray-900 dark:text-white">
                    ₦{tx.amount.toLocaleString()}
                  </td>
                  {role === "admin" && (
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => deleteTransaction(tx.id)}
                        className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        aria-label="Delete transaction"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionTable;
