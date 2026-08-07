import React from "react";

const ChartCard = ({ title, isEmpty, emptyMessage, children }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col h-full">
      <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-6">
        {title}
      </h3>
      {isEmpty ? (
        <div className="flex-1 flex items-center justify-center text-gray-500">
          {emptyMessage || "No data available"}
        </div>
      ) : (
        <div className="flex-1 w-full min-h-[280px]">
          {children}
        </div>
      )}
    </div>
  );
};

export default ChartCard;
