import React from "react";
import { useAppContext } from "../context/AppContext";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";
import { Moon, Sun, LogOut, User as UserIcon } from "lucide-react";

const RoleSwitcher = () => {
  const { theme, toggleTheme } = useAppContext();
  const { user } = useAuth();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

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

      {/* User Profile & Logout */}
      {user && (
        <div className="flex items-center gap-3 bg-gray-100 dark:bg-gray-700 p-1.5 rounded-lg pr-3">
          <div className="bg-white dark:bg-gray-800 p-1 rounded-md shadow-sm">
            <UserIcon className="w-4 h-4 text-gray-600 dark:text-gray-300" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate max-w-[120px] sm:max-w-[160px]">
              {user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[120px] sm:max-w-[160px]">
              {user.email}
            </span>
          </div>
          <div className="w-px h-4 bg-gray-300 dark:bg-gray-600 mx-1"></div>
          <button
            onClick={handleSignOut}
            className="text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default RoleSwitcher;
