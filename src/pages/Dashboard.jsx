import React from "react";
import { useAppContext } from "../context/AppContext";
import SummaryCard from "../components/SummaryCard";
import Chart from "../components/Chart";
import TransactionTable from "../components/TransactionTable";
import RoleSwitcher from "../components/RoleSwitcher";
import Insights from "../components/Insights";
import BudgetSettings from "../components/BudgetSettings";
import { Wallet, ArrowUpCircle, ArrowDownCircle } from "lucide-react";

const Dashboard = () => {
  const { transactions } = useAppContext();

  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const expenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const balance = income - expenses;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white hidden sm:block">FinanceDash</h1>
          </div>
          
          <RoleSwitcher />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Welcome Section */}
        <div className="mb-8 animate-fade-in-up">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Here's a summary of your financial activity.</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="animate-fade-in-up animation-delay-100 card-hover">
            <SummaryCard
              title="Total Balance"
              amount={balance}
              icon={Wallet}
              color="text-blue-600 dark:text-blue-400"
              type="currency"
            />
          </div>
          <div className="animate-fade-in-up animation-delay-200 card-hover">
            <SummaryCard
              title="Total Income"
              amount={income}
              icon={ArrowUpCircle}
              color="text-green-600 dark:text-green-400"
              type="currency"
            />
          </div>
          <div className="animate-fade-in-up animation-delay-300 card-hover">
            <SummaryCard
              title="Total Expenses"
              amount={expenses}
              icon={ArrowDownCircle}
              color="text-red-600 dark:text-red-400"
              type="currency"
            />
          </div>
        </div>

        <BudgetSettings />

        {/* Charts & Insights Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-2">
            {/* The Chart component internally handles a 2-col responsive grid, but we will adjust it a bit to fit this flow */}
            <Chart />
          </div>
          <div className="lg:col-span-1">
            <Insights />
          </div>
        </div>

        {/* Transactions Section */}
        <TransactionTable />

      </main>
    </div>
  );
};

export default Dashboard;
