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
  BarChart,
  Bar,
} from "recharts";
import ChartCard from "./ChartCard";

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

  // Prepare data for Pie Chart & Bar Chart (Expense Categories Breakdown)
  const categoryMap = {};
  transactions
    .filter((t) => t.type === "expense")
    .forEach((t) => {
      categoryMap[t.category] = (categoryMap[t.category] || 0) + t.amount;
    });

  const categoryData = Object.keys(categoryMap).map((key) => ({
    name: key,
    value: categoryMap[key],
  }));

  const axisColor = theme === "dark" ? "#9ca3af" : "#4b5563";
  const gridColor = theme === "dark" ? "#374151" : "#e5e7eb";
  const tooltipStyle = {
    backgroundColor: theme === "dark" ? "#1f2937" : "#fff",
    borderColor: gridColor,
    color: theme === "dark" ? "#fff" : "#000",
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      {/* Line Chart */}
      <div className="lg:col-span-2">
        <ChartCard
          title="Income vs. Expenses Trend"
          isEmpty={lineData.length === 0}
          emptyMessage="No data available for trend"
        >
          <ResponsiveContainer>
            <LineChart data={lineData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
              <XAxis dataKey="date" stroke={axisColor} fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke={axisColor} fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `₦${val / 1000}k`} />
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(value) => `₦${value.toLocaleString()}`}
              />
              <Legend iconType="circle" wrapperStyle={{ fontSize: "14px", paddingTop: "10px" }} />
              <Line type="monotone" dataKey="income" name="Income" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="expense" name="Expense" stroke="#ef4444" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Pie Chart */}
      <ChartCard
        title="Expenses by Category (Pie)"
        isEmpty={categoryData.length === 0}
        emptyMessage="No expense data available"
      >
        <ResponsiveContainer>
          <PieChart>
            <Pie data={categoryData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value" stroke="none">
              {categoryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={tooltipStyle}
              formatter={(value) => `₦${value.toLocaleString()}`}
            />
            <Legend layout="horizontal" verticalAlign="bottom" align="center" iconType="circle" />
          </PieChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Bar Chart */}
      <ChartCard
        title="Expenses by Category (Bar)"
        isEmpty={categoryData.length === 0}
        emptyMessage="No expense data available"
      >
        <ResponsiveContainer>
          <BarChart data={categoryData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
            <XAxis dataKey="name" stroke={axisColor} fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke={axisColor} fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `₦${val / 1000}k`} />
            <Tooltip
              contentStyle={tooltipStyle}
              formatter={(value) => `₦${value.toLocaleString()}`}
              cursor={{ fill: theme === "dark" ? "#374151" : "#f3f4f6" }}
            />
            <Bar dataKey="value" name="Amount" radius={[4, 4, 0, 0]}>
              {categoryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
};

export default Chart;
