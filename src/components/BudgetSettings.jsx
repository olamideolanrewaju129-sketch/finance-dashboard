import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";
import { Settings, Plus, Trash2, Save, ChevronDown, ChevronUp } from "lucide-react";
import clsx from "clsx";

const BudgetSettings = () => {
  const { budgets, updateBudgets, transactions, role } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState(null);
  const [saved, setSaved] = useState(false);

  const expenseByCategory = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});

  const totalSpent = Object.values(expenseByCategory).reduce((sum, amt) => sum + amt, 0);

  const openForm = () => {
    setForm({
      monthlyTotal: budgets.monthlyTotal.toString(),
      categories: Object.entries(budgets.categories).map(([category, limit]) => ({
        category,
        limit: limit.toString(),
      })),
    });
    setIsOpen(true);
    setSaved(false);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!form) return;

    const monthlyTotal = parseFloat(form.monthlyTotal);
    if (!monthlyTotal || monthlyTotal <= 0) return;

    const categories = {};
    for (const row of form.categories) {
      if (!row.category.trim() || !row.limit) continue;
      const limit = parseFloat(row.limit);
      if (limit > 0) {
        categories[row.category.trim()] = limit;
      }
    }

    updateBudgets({ monthlyTotal, categories });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const addCategoryRow = () => {
    setForm((prev) => ({
      ...prev,
      categories: [...prev.categories, { category: "", limit: "" }],
    }));
  };

  const removeCategoryRow = (index) => {
    setForm((prev) => ({
      ...prev,
      categories: prev.categories.filter((_, i) => i !== index),
    }));
  };

  const updateCategoryRow = (index, field, value) => {
    setForm((prev) => ({
      ...prev,
      categories: prev.categories.map((row, i) =>
        i === index ? { ...row, [field]: value } : row
      ),
    }));
  };

  const getUsagePercent = (spent, limit) => {
    if (!limit) return 0;
    return Math.min((spent / limit) * 100, 100);
  };

  const getUsageColor = (percent) => {
    if (percent >= 100) return "bg-red-500";
    if (percent >= 80) return "bg-amber-500";
    return "bg-green-500";
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden mt-6">
      <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <div>
            <h3 className="text-lg font-bold text-gray-800 dark:text-white">Budget Settings</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              Monthly limit: ₦{budgets.monthlyTotal.toLocaleString()} · Spent: ₦{totalSpent.toLocaleString()}
            </p>
          </div>
        </div>

        {role === "admin" && (
          <button
            onClick={() => (isOpen ? setIsOpen(false) : openForm())}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors self-start sm:self-auto"
          >
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            {isOpen ? "Close" : "Edit Budgets"}
          </button>
        )}
      </div>

      {/* Budget overview */}
      <div className="p-6">
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1.5">
            <span className="text-gray-600 dark:text-gray-400">Overall monthly budget</span>
            <span className="font-medium text-gray-900 dark:text-white">
              ₦{totalSpent.toLocaleString()} / ₦{budgets.monthlyTotal.toLocaleString()}
            </span>
          </div>
          <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className={clsx("h-full rounded-full transition-all", getUsageColor(getUsagePercent(totalSpent, budgets.monthlyTotal)))}
              style={{ width: `${getUsagePercent(totalSpent, budgets.monthlyTotal)}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Object.entries(budgets.categories).map(([category, limit]) => {
            const spent = expenseByCategory[category] || 0;
            const percent = getUsagePercent(spent, limit);
            return (
              <div key={category} className="p-4 rounded-xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-750/50">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-800 dark:text-white">{category}</span>
                  <span className={clsx(
                    "text-xs font-medium px-2 py-0.5 rounded-full",
                    percent >= 100
                      ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                      : percent >= 80
                      ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                      : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                  )}>
                    {percent.toFixed(0)}%
                  </span>
                </div>
                <div className="h-1.5 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden mb-2">
                  <div
                    className={clsx("h-full rounded-full transition-all", getUsageColor(percent))}
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  ₦{spent.toLocaleString()} of ₦{limit.toLocaleString()}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Edit form (admin only) */}
      {isOpen && role === "admin" && form && (
        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 border-t border-blue-100 dark:border-blue-800">
          <form onSubmit={handleSave} className="space-y-6">
            <div className="max-w-xs">
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Monthly Total Budget (₦)
              </label>
              <input
                type="number"
                min="1"
                required
                value={form.monthlyTotal}
                onChange={(e) => setForm({ ...form, monthlyTotal: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  Category Budgets
                </label>
                <button
                  type="button"
                  onClick={addCategoryRow}
                  className="flex items-center gap-1 text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add category
                </button>
              </div>

              <div className="space-y-3">
                {form.categories.map((row, index) => (
                  <div key={index} className="flex flex-wrap items-end gap-3">
                    <div className="flex-1 min-w-[140px]">
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Category
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Food"
                        required
                        value={row.category}
                        onChange={(e) => updateCategoryRow(index, "category", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    <div className="flex-1 min-w-[140px]">
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Limit (₦)
                      </label>
                      <input
                        type="number"
                        min="1"
                        required
                        value={row.limit}
                        onChange={(e) => updateCategoryRow(index, "limit", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeCategoryRow(index)}
                      disabled={form.categories.length <= 1}
                      className="p-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed h-[38px]"
                      aria-label="Remove category"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="submit"
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                <Save className="w-4 h-4" />
                Save Budgets
              </button>
              {saved && (
                <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                  Budgets saved!
                </span>
              )}
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default BudgetSettings;
