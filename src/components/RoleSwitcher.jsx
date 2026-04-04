import React from "react";
import { useAppContext } from "../context/AppContext";
import { User, Shield, Moon, Sun } from "lucide-react";

const RoleSwitcher = () => {
  const { role, setRole, theme, toggleTheme } = useAppContext();

  return (
    <div className="flex items-center gap-4">
      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-200"
        aria-label="Toggle dark mode"
      >
        {theme === "dark" ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-gray-600" />}
      </button>

      {/* Role Switcher */}
      <div className="relative inline-flex bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
        <button
          onClick={() => setRole("viewer")}
          className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ${
            role === "viewer"
              ? "bg-white dark:bg-gray-800 shadow-sm text-gray-900 dark:text-white"
              : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          }`}
        >
          <User className="w-4 h-4" />
          Viewer
        </button>
        <button
          onClick={() => setRole("admin")}
          className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ${
            role === "admin"
              ? "bg-white dark:bg-gray-800 shadow-sm text-gray-900 dark:text-white"
              : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          }`}
        >
          <Shield className="w-4 h-4" />
          Admin
        </button>
      </div>
    </div>
  );
};

export default RoleSwitcher;
