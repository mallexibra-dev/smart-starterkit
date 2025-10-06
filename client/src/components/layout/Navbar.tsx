import { useState } from "react";
import { Button } from "../ui/button";
import { 
  Home, 
  Package, 
  Settings, 
  BarChart3, 
  FileText,
  HelpCircle,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Link, useLocation } from "@tanstack/react-router";

export const Navbar = () => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + "/");
  };

  const toggleNavbar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <nav className={`h-full ${isCollapsed ? 'w-20' : 'w-80'} bg-gradient-to-br from-purple-50 via-white to-purple-100 dark:from-purple-900/20 dark:via-gray-800 dark:to-purple-800/20 rounded-2xl border border-purple-200/50 dark:border-purple-700/30 flex flex-col shadow-xl backdrop-blur-sm transition-all duration-300 ease-in-out`}>
      {/* Header Section */}
      <div className="p-6 bg-gradient-to-r from-purple-500 via-purple-600 to-purple-500 dark:from-purple-600 dark:via-purple-700 dark:to-purple-600 rounded-t-2xl shadow-lg">
        <div className="flex items-center justify-between">
          <div className={`${isCollapsed ? 'hidden' : 'block'} transition-all duration-300`}>
            <h1 className="text-2xl font-serif font-bold text-white drop-shadow-sm">Smart Starter</h1>
            <p className="text-purple-100 text-sm mt-1 font-medium">Dashboard Management</p>
          </div>
          
          {/* Toggle Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleNavbar}
            className="text-white hover:bg-purple-700/30 transition-all duration-200 p-2 rounded-lg"
            title={isCollapsed ? "Buka Navbar" : "Tutup Navbar"}
          >
            {isCollapsed ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <ChevronLeft className="w-5 h-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Navigation Section */}
      <div className={`flex-1 px-4 py-6 ${isCollapsed ? 'px-2' : 'px-4'} transition-all duration-300`}>
        <div className="space-y-6">
          {/* Menu Section */}
          <div className="space-y-3">
            {!isCollapsed && (
              <h3 className="text-sm font-medium text-purple-600 dark:text-purple-400 uppercase tracking-wider px-3 transition-opacity duration-300">
                Menu
              </h3>
            )}
            
            <div className="space-y-1">
              <Link to="/" title={isCollapsed ? "Dashboard" : ""}>
                <Button
                  variant="ghost"
                  className={`w-full ${isCollapsed ? 'justify-center px-2' : 'justify-start px-3'} h-12 text-gray-700 dark:text-gray-300 hover:bg-purple-100 dark:hover:bg-purple-800/30 transition-all duration-200 rounded-xl cursor-pointer ${
                    isActive('/')
                      ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-500/25 hover:from-purple-600 hover:to-purple-700'
                      : 'hover:shadow-md hover:shadow-purple-200/50 dark:hover:shadow-purple-800/20'
                  }`}
                >
                  <Home className={`w-5 h-5 ${isCollapsed ? '' : 'mr-3'} ${isActive('/') ? 'text-white' : 'text-gray-700 dark:text-gray-300'}`} />
                  {!isCollapsed && <span className={`transition-opacity duration-300 ${isActive('/') ? 'text-white' : 'text-gray-700 dark:text-gray-300'}`}>Dashboard</span>}
                </Button>
              </Link>

              <Link to={"/analytics" as any} title={isCollapsed ? "Analytics" : ""}>
                <Button
                  variant="ghost"
                  className={`w-full ${isCollapsed ? 'justify-center px-2' : 'justify-start px-3'} h-12 text-gray-700 dark:text-gray-300 hover:bg-purple-100 dark:hover:bg-purple-800/30 transition-all duration-200 rounded-xl group cursor-pointer ${
                    isActive('/analytics')
                      ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-500/25 hover:from-purple-600 hover:to-purple-700'
                      : 'hover:shadow-md hover:shadow-purple-200/50 dark:hover:shadow-purple-800/20'
                  }`}
                >
                  <BarChart3 className={`w-5 h-5 ${isCollapsed ? '' : 'mr-3'} ${isActive('/analytics') ? 'text-white' : 'text-gray-700 dark:text-gray-300'}`} />
                  {!isCollapsed && <span className={`transition-opacity duration-300 ${isActive('/analytics') ? 'text-white' : 'text-gray-700 dark:text-gray-300'}`}>Analytics</span>}
                </Button>
              </Link>
            </div>
          </div>

          {/* Master Data & Productions */}
          {!isCollapsed && (
            <div className="space-y-3 transition-all duration-300">
              <h3 className="text-sm font-medium text-purple-600 dark:text-purple-400 uppercase tracking-wider px-3">
                Master Data
              </h3>
              <div className="ml-2 space-y-1">
                <Link to={"/products" as any}>
                  <Button
                    variant="ghost"
                    className={`w-full justify-start h-10 text-sm text-gray-600 dark:text-gray-400 hover:bg-purple-100 dark:hover:bg-purple-800/30 hover:text-gray-700 dark:hover:text-gray-300 transition-all duration-200 rounded-lg group cursor-pointer ${
                      isActive('/products')
                        ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-md shadow-purple-500/25'
                        : 'hover:shadow-sm hover:shadow-purple-200/30 dark:hover:shadow-purple-800/10'
                    }`}
                  >
                    <Package className={`w-4 h-4 mr-2 ${isActive('/products') ? 'text-white' : 'text-gray-600 dark:text-gray-400'}`} />
                    <span className={`${isActive('/products') ? 'text-white' : 'text-gray-600 dark:text-gray-400'}`}>Products</span>
                  </Button>
                </Link>
              </div>

              <h3 className="text-sm font-medium text-purple-600 dark:text-purple-400 uppercase tracking-wider px-3">
                Productions
              </h3>
              <div className="ml-2 space-y-1">
                <Link to={"/transactions" as any}>
                  <Button
                    variant="ghost"
                    className={`w-full justify-start h-10 text-sm text-gray-600 dark:text-gray-400 hover:bg-purple-100 dark:hover:bg-purple-800/30 hover:text-gray-700 dark:hover:text-gray-300 transition-all duration-200 rounded-lg group cursor-pointer ${
                      isActive('/transactions')
                        ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-md shadow-purple-500/25'
                        : 'hover:shadow-sm hover:shadow-purple-200/30 dark:hover:shadow-purple-800/10'
                    }`}
                  >
                    <FileText className={`w-4 h-4 mr-2 ${isActive('/transactions') ? 'text-white' : 'text-gray-600 dark:text-gray-400'}`} />
                    <span className={`${isActive('/transactions') ? 'text-white' : 'text-gray-600 dark:text-gray-400'}`}>Transactions</span>
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer Section */}
      <div className={`p-4 space-y-1 bg-gradient-to-t from-purple-50 to-transparent dark:from-purple-900/10 dark:to-transparent rounded-b-2xl ${isCollapsed ? 'px-2' : 'px-4'} transition-all duration-300`}>
        <Link to={"/settings" as any} title={isCollapsed ? "Settings" : ""}>
          <Button
            variant="ghost"
            className={`w-full ${isCollapsed ? 'justify-center px-2' : 'justify-start px-3'} h-12 text-gray-700 dark:text-gray-300 hover:bg-purple-100 dark:hover:bg-purple-800/30 transition-all duration-200 rounded-xl group cursor-pointer ${
              isActive('/settings')
                ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-500/25 hover:from-purple-600 hover:to-purple-700'
                : 'hover:shadow-md hover:shadow-purple-200/50 dark:hover:shadow-purple-800/20'
            }`}
          >
            <Settings className={`w-5 h-5 ${isCollapsed ? '' : 'mr-3'} ${isActive('/settings') ? 'text-white' : 'text-gray-700 dark:text-gray-300'}`} />
            {!isCollapsed && <span className={`transition-opacity duration-300 ${isActive('/settings') ? 'text-white' : 'text-gray-700 dark:text-gray-300'}`}>Settings</span>}
          </Button>
        </Link>

        <Link to={"/help" as any} title={isCollapsed ? "Help & Support" : ""}>
          <Button
            variant="ghost"
            className={`w-full ${isCollapsed ? 'justify-center px-2' : 'justify-start px-3'} h-12 text-gray-700 dark:text-gray-300 hover:bg-purple-100 dark:hover:bg-purple-800/30 transition-all duration-200 rounded-xl group cursor-pointer ${
              isActive('/help')
                ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-500/25 hover:from-purple-600 hover:to-purple-700'
                : 'hover:shadow-md hover:shadow-purple-200/50 dark:hover:shadow-purple-800/20'
            }`}
          >
            <HelpCircle className={`w-5 h-5 ${isCollapsed ? '' : 'mr-3'} ${isActive('/help') ? 'text-white' : 'text-gray-700 dark:text-gray-300'}`} />
            {!isCollapsed && <span className={`transition-opacity duration-300 ${isActive('/help') ? 'text-white' : 'text-gray-700 dark:text-gray-300'}`}>Help & Support</span>}
          </Button>
        </Link>
      </div>
    </nav>
  );
};