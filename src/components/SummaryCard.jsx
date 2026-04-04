import React from "react";
import clsx from "clsx";

const SummaryCard = ({ title, amount, icon: Icon, color, type }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-between transition-transform hover:-translate-y-1 hover:shadow-md">
      <div>
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{title}</h3>
        <p className={clsx("text-2xl font-bold", color)}>
          {type === "currency" ? `₦${amount.toLocaleString()}` : amount}
        </p>
      </div>
      <div className={clsx("p-3 rounded-full", `${color.replace('text-', 'bg-').replace('600', '100')} dark:bg-gray-700 dark:bg-opacity-50`)}>
        <Icon className={clsx("w-6 h-6", color)} />
      </div>
    </div>
  );
};

export default SummaryCard;
