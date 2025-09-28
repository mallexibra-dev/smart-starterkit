import { Home, User, Sun, Moon } from "lucide-react";
import { useState, ReactNode } from "react";

interface HeaderProps {
  title?: string;
  pageTitle?: string;
  customContent?: ReactNode;
}

export const Header = ({
  title = "Dashboard",
  pageTitle,
  customContent,
}: HeaderProps) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const displayTitle = pageTitle || `${title} Page`;

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    // Add logic to toggle dark mode on document/html element
    document.documentElement.classList.toggle("dark");
  };

  return (
    <div className="bg-gradient-to-r from-white via-purple-50/50 to-white dark:from-gray-800 dark:via-purple-900/30 dark:to-gray-800 rounded-xl border border-purple-200/50 dark:border-purple-700/30 p-3 shadow-lg backdrop-blur-sm">
      <div className="flex items-center justify-between">
        {/* Page Title Section */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
            {customContent ? (
              customContent
            ) : (
              <>
                <Home className="w-4 h-4 text-purple-500" />
                <span className="text-purple-700 dark:text-purple-300 font-semibold">
                  {displayTitle}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Profile and Actions Section */}
        <div className="flex items-center space-x-3">
          {/* Dark Mode Toggle Switch */}
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleDarkMode}
              className="relative inline-flex h-6 w-12 items-center rounded-full bg-gradient-to-r from-purple-200 to-purple-300 dark:from-purple-700 dark:to-purple-800 transition-all duration-300 ease-in-out shadow-md hover:shadow-lg"
            >
              <span
                className={`${
                  isDarkMode ? "translate-x-7" : "translate-x-1"
                } inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-transform duration-300 ease-in-out`}
              />
              <Moon className="absolute left-[6px] w-2.5 h-2.5 text-purple-600 dark:text-purple-300" />
              <Sun className="absolute right-[6px] w-2.5 h-2.5 text-purple-600 dark:text-purple-300" />
            </button>
          </div>

          <div className="flex items-center space-x-2 bg-gradient-to-r from-purple-100 to-purple-200 dark:from-purple-800/50 dark:to-purple-700/50 rounded-lg p-1.5 border border-purple-200/50 dark:border-purple-600/30">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="hidden sm:block">
              <p className="text-xs font-semibold text-purple-800 dark:text-purple-200">
                Admin User
              </p>
              <p className="text-[10px] text-purple-600 dark:text-purple-400">
                admin@example.com
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
