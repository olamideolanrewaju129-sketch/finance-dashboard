import React from "react";
import { useAppContext } from "../context/AppContext";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const COLORS = ["#3b82f6", "#10b981", "#ef4444", "#f59e0b", "#8b5cf6", "#ec4899"];

const Chart = () => {
  const { transactions, theme } = useAppContext();

  // Prepare data for Line Chart (Balance/Income/Expense over time)
  // Simplifying by accumulating by date
  const dateMap = {};
  transactions.forEach((t) => {
    if (!dateMap[t.date]) {
      dateMap[t.date] = { date: t.date, income: 0, expense: 0 };
    }
    if (t.type === "income") dateMap[t.date].income += t.amount;
    else dateMap[t.date].expense += t.amount;
  });

  const lineData = Object.values(dateMap).sort((a, b) => new Date(a.date) - new Date(b.date));

  // Prepare data for Pie Chart (Expense Categories Breakdown)
  const categoryMap = {};
  transactions
    .filter((t) => t.type === "expense")
    .forEach((t) => {
      categoryMap[t.category] = (categoryMap[t.category] || 0) + t.amount;
    });

  const pieData = Object.keys(categoryMap).map((key) => ({
    name: key,
    value: categoryMap[key],
  }));

  const axisColor = theme === "dark" ? "#9ca3af" : "#4b5563";
  const gridColor = theme === "dark" ? "#374151" : "#e5e7eb";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      {/* Line Chart */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-6">Cash Flow Trend</h3>
        {lineData.length > 0 ? (
          <div className="h-72 w-full">
            <ResponsiveContainer>
              <LineChart data={lineData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                <XAxis dataKey="date" stroke={axisColor} fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke={axisColor} fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `₦${val / 1000}k`} />
                <Tooltip
                  contentStyle={{ backgroundColor: theme === "dark" ? "#1f2937" : "#fff", borderColor: gridColor, color: theme === "dark" ? "#fff" : "#000" }}
                  formatter={(value) => `₦${value.toLocaleString()}`}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '14px', paddingTop: '10px' }} />
                <Line type="monotone" dataKey="income" name="Income" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="expense" name="Expense" stroke="#ef4444" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-72 flex items-center justify-center text-gray-500">No data available for trend</div>
        )}
      </div>

      {/* Pie Chart */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-6">Spending by Category</h3>
        {pieData.length > 0 ? (
          <div className="h-72 w-full">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value" stroke="none">
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: theme === "dark" ? "#1f2937" : "#fff", borderColor: gridColor, color: theme === "dark" ? "#fff" : "#000" }}
                  formatter={(value) => `₦${value.toLocaleString()}`}
                />
                <Legend layout="horizontal" verticalAlign="bottom" align="center" iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-72 flex items-center justify-center text-gray-500">No expense data available</div>
        )}
      </div>
    </div>
  );
};

export default Chart;
