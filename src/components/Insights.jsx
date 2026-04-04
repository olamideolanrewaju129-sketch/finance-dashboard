import React from "react";
import { useAppContext } from "../context/AppContext";
import { Lightbulb, TrendingUp, TrendingDown, AlertCircle } from "lucide-react";

const Insights = () => {
  const { transactions } = useAppContext();

  // Calculate insights
  const expenseTransactions = transactions.filter((t) => t.type === "expense");
  const incomeTransactions = transactions.filter((t) => t.type === "income");

  const totalIncome = incomeTransactions.reduce((acc, t) => acc + t.amount, 0);
  const totalExpense = expenseTransactions.reduce((acc, t) => acc + t.amount, 0);

  // Highest spending category
  const categoryMap = {};
  expenseTransactions.forEach((t) => {
    categoryMap[t.category] = (categoryMap[t.category] || 0) + t.amount;
  });

  let topCategory = "None";
  let topAmount = 0;
  Object.keys(categoryMap).forEach((category) => {
    if (categoryMap[category] > topAmount) {
      topAmount = categoryMap[category];
      topCategory = category;
    }
  });

  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome) * 100 : 0;
  
  const getInsights = () => {
    const insights = [];

    if (topCategory !== "None") {
      insights.push({
        id: 1,
        text: `Highest spending: ${topCategory}`,
        sub: `You spent ₦${topAmount.toLocaleString()} on ${topCategory.toLowerCase()}`,
        icon: AlertCircle,
        color: "text-amber-500",
        bg: "bg-amber-100 dark:bg-amber-900/30",
      });
    }

    if (totalIncome > totalExpense) {
      insights.push({
        id: 2,
        text: "Income is higher than expenses",
        sub: `You saved ${savingsRate.toFixed(1)}% of your income!`,
        icon: TrendingUp,
        color: "text-green-500",
        bg: "bg-green-100 dark:bg-green-900/30",
      });
    } else if (totalExpense > totalIncome && totalIncome > 0) {
      insights.push({
        id: 3,
        text: "Expenses exceed income",
        sub: "You are spending more than you earn.",
        icon: TrendingDown,
        color: "text-red-500",
        bg: "bg-red-100 dark:bg-red-900/30",
      });
    } else if (transactions.length === 0) {
      insights.push({
        id: 4,
        text: "No active insights",
        sub: "Add some transactions to see your spending patterns.",
        icon: Lightbulb,
        color: "text-gray-500",
        bg: "bg-gray-100 dark:bg-gray-800",
      });
    }

    return insights;
  };

  const insightsData = getInsights();

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 mt-6 md:mt-0">
      <div className="flex items-center gap-2 mb-6">
        <Lightbulb className="w-5 h-5 text-yellow-500" />
        <h3 className="text-lg font-bold text-gray-800 dark:text-white">Smart Insights</h3>
      </div>
      
      <div className="space-y-4">
        {insightsData.map((insight) => {
          const Icon = insight.icon;
          return (
            <div key={insight.id} className="flex gap-4 p-4 rounded-xl border border-gray-50 dark:border-gray-700 bg-gray-50 dark:bg-gray-750/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-200">
              <div className={`p-3 rounded-full h-fit mt-1 ${insight.bg}`}>
                <Icon className={`w-5 h-5 ${insight.color}`} />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-100">{insight.text}</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                  {insight.sub}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Insights;
