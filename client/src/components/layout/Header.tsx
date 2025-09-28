import { Link } from "@tanstack/react-router";
import { Button } from "../ui/button";
import { ChevronRight, Home, User, LogOut, Sun, Moon } from "lucide-react";
import { useState } from "react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface HeaderProps {
  breadcrumbs?: BreadcrumbItem[];
  title?: string;
}

export const Header = ({
  breadcrumbs = [],
  title = "Dashboard",
}: HeaderProps) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const defaultBreadcrumbs: BreadcrumbItem[] = [
    { label: "Home", href: "/" },
    { label: title },
  ];

  const allBreadcrumbs =
    breadcrumbs.length > 0 ? breadcrumbs : defaultBreadcrumbs;

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    // Add logic to toggle dark mode on document/html element
    document.documentElement.classList.toggle("dark");
  };

  return (
    <div className="bg-gradient-to-r from-white via-purple-50/50 to-white dark:from-gray-800 dark:via-purple-900/30 dark:to-gray-800 rounded-2xl border border-purple-200/50 dark:border-purple-700/30 p-4 shadow-lg backdrop-blur-sm">
      <div className="flex items-center justify-between">
        {/* Breadcrumb Section */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-300">
            {allBreadcrumbs.map((item, index) => (
              <div key={index} className="flex items-center">
                {index === 0 && <Home className="w-4 h-4 mr-1 text-purple-500" />}
                {item.href ? (
                  <Link
                    to={item.href}
                    className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors font-medium"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span
                    className={
                      index === allBreadcrumbs.length - 1
                        ? "text-purple-700 dark:text-purple-300 font-semibold"
                        : "text-gray-500 dark:text-gray-400"
                    }
                  >
                    {item.label}
                  </span>
                )}
                {index < allBreadcrumbs.length - 1 && (
                  <ChevronRight className="w-4 h-4 mx-2 text-purple-400 dark:text-purple-500" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Profile and Actions Section */}
        <div className="flex items-center space-x-4">
          {/* Dark Mode Toggle Switch */}
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleDarkMode}
              className="relative inline-flex h-8 w-14 items-center rounded-full bg-gradient-to-r from-purple-200 to-purple-300 dark:from-purple-700 dark:to-purple-800 transition-all duration-300 ease-in-out shadow-md hover:shadow-lg"
            >
              <span
                className={`${
                  isDarkMode ? "translate-x-7" : "translate-x-1"
                } inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform duration-300 ease-in-out`}
              />
              <Moon className="absolute left-[10px] w-3 h-3 text-purple-600 dark:text-purple-300" />
              <Sun className="absolute right-[10px] w-3 h-3 text-purple-600 dark:text-purple-300" />
            </button>
          </div>

          <div className="flex items-center space-x-3 bg-gradient-to-r from-purple-100 to-purple-200 dark:from-purple-800/50 dark:to-purple-700/50 rounded-xl p-2 border border-purple-200/50 dark:border-purple-600/30">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
              <User className="w-5 h-5 text-white" />
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-semibold text-purple-800 dark:text-purple-200">
                Admin User
              </p>
              <p className="text-xs text-purple-600 dark:text-purple-400">
                admin@example.com
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
