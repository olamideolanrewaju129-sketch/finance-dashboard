import React, { useState, useId } from "react";
import { useAppContext } from "../context/AppContext";
import { validateBudgetForm, parseBudgetForm } from "../utils/budgetValidation";
import { Settings, Plus, Trash2, Save, ChevronDown, ChevronUp } from "lucide-react";
import clsx from "clsx";

const NAIRA = "\u20A6";

const formatNaira = (amount) => `${NAIRA}${amount.toLocaleString()}`;

const emptyErrors = () => ({
  monthlyTotal: null,
  categories: [],
  form: null,
});

const BudgetSettings = () => {
  const { budgets, updateBudgets, transactions } = useAppContext();
  const formId = useId();
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState(null);
  const [errors, setErrors] = useState(emptyErrors());
  const [statusMessage, setStatusMessage] = useState("");

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
    setErrors(emptyErrors());
    setStatusMessage("");
    setIsOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    const result = validateBudgetForm(form);
    setErrors(result.errors);

    if (!result.isValid) {
      setStatusMessage("Please fix the errors below before saving.");
      return;
    }

    updateBudgets(parseBudgetForm(form));
    setStatusMessage("Budgets saved successfully.");
    setErrors(emptyErrors());
  };

  const addCategoryRow = () => {
    setForm((prev) => ({
      ...prev,
      categories: [...prev.categories, { category: "", limit: "" }],
    }));
    setErrors((prev) => ({
      ...prev,
      categories: [...prev.categories, { category: null, limit: null }],
    }));
  };

  const removeCategoryRow = (index) => {
    setForm((prev) => ({
      ...prev,
      categories: prev.categories.filter((_, i) => i !== index),
    }));
    setErrors((prev) => ({
      ...prev,
      categories: prev.categories.filter((_, i) => i !== index),
    }));
  };

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (field === "monthlyTotal") {
      setErrors((prev) => ({ ...prev, monthlyTotal: null }));
    }
  };

  const updateCategoryRow = (index, field, value) => {
    setForm((prev) => ({
      ...prev,
      categories: prev.categories.map((row, i) =>
        i === index ? { ...row, [field]: value } : row
      ),
    }));
    setErrors((prev) => ({
      ...prev,
      categories: prev.categories.map((rowErrors, i) =>
        i === index ? { ...rowErrors, [field]: null, ...(field === "category" ? {} : {}) } : rowErrors
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

  const monthlyTotalId = `${formId}-monthly-total`;
  const monthlyTotalErrorId = `${formId}-monthly-total-error`;

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 mt-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-blue-600 dark:text-blue-400" aria-hidden="true" />
          <div>
            <h3 className="text-lg font-bold text-gray-800 dark:text-white">Budget Settings</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
              Monthly limit: {formatNaira(budgets.monthlyTotal)} · Spent: {formatNaira(totalSpent)}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => (isOpen ? setIsOpen(false) : openForm())}
          aria-expanded={isOpen}
          aria-controls={`${formId}-panel`}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors self-start sm:self-auto focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
        >
          {isOpen ? <ChevronUp className="w-4 h-4" aria-hidden="true" /> : <ChevronDown className="w-4 h-4" aria-hidden="true" />}
          {isOpen ? "Close" : "Edit Budgets"}
        </button>
      </div>

      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {statusMessage}
      </div>

      <div className="mb-6">
        <div className="flex justify-between text-sm mb-1.5">
          <span className="text-gray-600 dark:text-gray-400">Overall monthly budget</span>
          <span className="font-medium text-gray-900 dark:text-white">
            {formatNaira(totalSpent)} / {formatNaira(budgets.monthlyTotal)}
          </span>
        </div>
        <div
          className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden"
          role="progressbar"
          aria-valuenow={Math.round(getUsagePercent(totalSpent, budgets.monthlyTotal))}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Overall monthly budget usage"
        >
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
            <div
              key={category}
              className="flex gap-4 p-4 rounded-xl border border-gray-50 dark:border-gray-700 bg-gray-50 dark:bg-gray-750/50"
            >
              <div className="flex-1">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-100">{category}</h4>
                  <span
                    className={clsx(
                      "text-xs font-medium px-2 py-0.5 rounded-full",
                      percent >= 100
                        ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                        : percent >= 80
                        ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                        : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    )}
                  >
                    {percent.toFixed(0)}%
                  </span>
                </div>
                <div
                  className="h-1.5 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden mb-2"
                  role="progressbar"
                  aria-valuenow={Math.round(percent)}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${category} budget usage`}
                >
                  <div
                    className={clsx("h-full rounded-full transition-all", getUsageColor(percent))}
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                  {formatNaira(spent)} of {formatNaira(limit)}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {isOpen && form && (
        <div
          id={`${formId}-panel`}
          className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700"
        >
          <form onSubmit={handleSave} noValidate className="space-y-6" aria-label="Budget settings form">
            <div className="max-w-xs">
              <label
                htmlFor={monthlyTotalId}
                className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Monthly Total Budget ({NAIRA})
              </label>
              <input
                id={monthlyTotalId}
                type="text"
                inputMode="decimal"
                value={form.monthlyTotal}
                onChange={(e) => updateField("monthlyTotal", e.target.value)}
                aria-invalid={errors.monthlyTotal ? "true" : "false"}
                aria-describedby={errors.monthlyTotal ? monthlyTotalErrorId : undefined}
                className={clsx(
                  "w-full px-3 py-2 border rounded-md text-sm dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500",
                  errors.monthlyTotal
                    ? "border-red-500 dark:border-red-400"
                    : "border-gray-300 dark:border-gray-600"
                )}
              />
              {errors.monthlyTotal && (
                <p
                  id={monthlyTotalErrorId}
                  role="alert"
                  aria-live="polite"
                  className="mt-1 text-xs text-red-600 dark:text-red-400"
                >
                  {errors.monthlyTotal}
                </p>
              )}
            </div>

            <fieldset className="space-y-3">
              <legend className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-3">
                Category Budgets
              </legend>

              {errors.form && (
                <p role="alert" aria-live="polite" className="text-xs text-red-600 dark:text-red-400">
                  {errors.form}
                </p>
              )}

              {form.categories.map((row, index) => {
                const categoryId = `${formId}-category-${index}`;
                const limitId = `${formId}-limit-${index}`;
                const categoryErrorId = `${formId}-category-error-${index}`;
                const limitErrorId = `${formId}-limit-error-${index}`;
                const rowErrors = errors.categories[index] || { category: null, limit: null };

                return (
                  <div key={index} className="flex flex-wrap items-start gap-3">
                    <div className="flex-1 min-w-[140px]">
                      <label
                        htmlFor={categoryId}
                        className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Category
                      </label>
                      <input
                        id={categoryId}
                        type="text"
                        placeholder="e.g. Food"
                        value={row.category}
                        onChange={(e) => updateCategoryRow(index, "category", e.target.value)}
                        aria-invalid={rowErrors.category ? "true" : "false"}
                        aria-describedby={rowErrors.category ? categoryErrorId : undefined}
                        className={clsx(
                          "w-full px-3 py-2 border rounded-md text-sm dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500",
                          rowErrors.category
                            ? "border-red-500 dark:border-red-400"
                            : "border-gray-300 dark:border-gray-600"
                        )}
                      />
                      {rowErrors.category && (
                        <p
                          id={categoryErrorId}
                          role="alert"
                          aria-live="polite"
                          className="mt-1 text-xs text-red-600 dark:text-red-400"
                        >
                          {rowErrors.category}
                        </p>
                      )}
                    </div>
                    <div className="flex-1 min-w-[140px]">
                      <label
                        htmlFor={limitId}
                        className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Limit ({NAIRA})
                      </label>
                      <input
                        id={limitId}
                        type="text"
                        inputMode="decimal"
                        value={row.limit}
                        onChange={(e) => updateCategoryRow(index, "limit", e.target.value)}
                        aria-invalid={rowErrors.limit ? "true" : "false"}
                        aria-describedby={rowErrors.limit ? limitErrorId : undefined}
                        className={clsx(
                          "w-full px-3 py-2 border rounded-md text-sm dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500",
                          rowErrors.limit
                            ? "border-red-500 dark:border-red-400"
                            : "border-gray-300 dark:border-gray-600"
                        )}
                      />
                      {rowErrors.limit && (
                        <p
                          id={limitErrorId}
                          role="alert"
                          aria-live="polite"
                          className="mt-1 text-xs text-red-600 dark:text-red-400"
                        >
                          {rowErrors.limit}
                        </p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeCategoryRow(index)}
                      disabled={form.categories.length <= 1}
                      aria-label={`Remove ${row.category || "category"} budget`}
                      className="p-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed mt-5 focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      <Trash2 className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </div>
                );
              })}

              <button
                type="button"
                onClick={addCategoryRow}
                className="flex items-center gap-1 text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
              >
                <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                Add category
              </button>
            </fieldset>

            <div className="flex items-center gap-3">
              <button
                type="submit"
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
              >
                <Save className="w-4 h-4" aria-hidden="true" />
                Save Budgets
              </button>
              {statusMessage && (
                <p
                  aria-live="polite"
                  className={clsx(
                    "text-sm font-medium",
                    statusMessage.includes("successfully")
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                  )}
                >
                  {statusMessage}
                </p>
              )}
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default BudgetSettings;
