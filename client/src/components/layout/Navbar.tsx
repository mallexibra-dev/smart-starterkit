import { useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { Button } from "../ui/button";
import { 
  Home, 
  Package, 
  Users, 
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
    return location.pathname === path;
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
                  className={`w-full ${isCollapsed ? 'justify-center px-2' : 'justify-start px-3'} h-12 text-gray-700 dark:text-gray-300 hover:bg-purple-100 dark:hover:bg-purple-800/30 transition-all duration-200 rounded-xl group ${
                    isActive('/') 
                      ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-500/25 hover:from-purple-600 hover:to-purple-700' 
                      : 'hover:shadow-md hover:shadow-purple-200/50 dark:hover:shadow-purple-800/20'
                  }`}
                >
                  <Home className={`w-5 h-5 ${isCollapsed ? '' : 'mr-3'} transition-colors ${isActive('/') ? 'text-white' : 'text-purple-500 group-hover:text-purple-600'}`} />
                  {!isCollapsed && <span className="transition-opacity duration-300">Dashboard</span>}
                </Button>
              </Link>

              <Link to={"/analytics" as any} title={isCollapsed ? "Analytics" : ""}>
                <Button 
                  variant="ghost" 
                  className={`w-full ${isCollapsed ? 'justify-center px-2' : 'justify-start px-3'} h-12 text-gray-700 dark:text-gray-300 hover:bg-purple-100 dark:hover:bg-purple-800/30 transition-all duration-200 rounded-xl group ${
                    isActive('/analytics') 
                      ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-500/25 hover:from-purple-600 hover:to-purple-700' 
                      : 'hover:shadow-md hover:shadow-purple-200/50 dark:hover:shadow-purple-800/20'
                  }`}
                >
                  <BarChart3 className={`w-5 h-5 ${isCollapsed ? '' : 'mr-3'} transition-colors ${isActive('/analytics') ? 'text-white' : 'text-purple-500 group-hover:text-purple-600'}`} />
                  {!isCollapsed && <span className="transition-opacity duration-300">Analytics</span>}
                </Button>
              </Link>

              <Link to={"/users" as any} title={isCollapsed ? "Users" : ""}>
                <Button 
                  variant="ghost" 
                  className={`w-full ${isCollapsed ? 'justify-center px-2' : 'justify-start px-3'} h-12 text-gray-700 dark:text-gray-300 hover:bg-purple-100 dark:hover:bg-purple-800/30 transition-all duration-200 rounded-xl group ${
                    isActive('/users') 
                      ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-500/25 hover:from-purple-600 hover:to-purple-700' 
                      : 'hover:shadow-md hover:shadow-purple-200/50 dark:hover:shadow-purple-800/20'
                  }`}
                >
                  <Users className={`w-5 h-5 ${isCollapsed ? '' : 'mr-3'} transition-colors ${isActive('/users') ? 'text-white' : 'text-purple-500 group-hover:text-purple-600'}`} />
                  {!isCollapsed && <span className="transition-opacity duration-300">Users</span>}
                </Button>
              </Link>
            </div>
          </div>

          {/* Management Section - Hide when collapsed */}
          {!isCollapsed && (
            <div className="space-y-3 transition-all duration-300">
              <h3 className="text-sm font-medium text-purple-600 dark:text-purple-400 uppercase tracking-wider px-3 font-semibold">
                Management
              </h3>
              
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="master-item" className="border-none">
                  <AccordionTrigger 
                    value="master-item" 
                    className="px-3 py-3 h-12 text-gray-700 dark:text-gray-300 hover:bg-purple-100 dark:hover:bg-purple-800/30 transition-all duration-200 rounded-xl group hover:shadow-md hover:shadow-purple-200/50 dark:hover:shadow-purple-800/20"
                  >
                    <div className="flex items-center">
                      <Package className="w-5 h-5 mr-3 text-purple-500 group-hover:text-purple-600 transition-colors" />
                      Master Data
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-0">
                    <div className="ml-8 space-y-1">
                      <Link to={"/products" as any}>
                        <Button 
                          variant="ghost" 
                          className={`w-full justify-start h-10 text-sm text-gray-600 dark:text-gray-400 hover:bg-purple-100 dark:hover:bg-purple-800/30 hover:text-purple-700 dark:hover:text-purple-300 transition-all duration-200 rounded-lg group ${
                            isActive('/products') 
                              ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-md shadow-purple-500/25' 
                              : 'hover:shadow-sm hover:shadow-purple-200/30 dark:hover:shadow-purple-800/10'
                          }`}
                        >
                          Products
                        </Button>
                      </Link>
                      <Link to={"/categories" as any}>
                        <Button 
                          variant="ghost" 
                          className={`w-full justify-start h-10 text-sm text-gray-600 dark:text-gray-400 hover:bg-purple-100 dark:hover:bg-purple-800/30 hover:text-purple-700 dark:hover:text-purple-300 transition-all duration-200 rounded-lg group ${
                            isActive('/categories') 
                              ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-md shadow-purple-500/25' 
                              : 'hover:shadow-sm hover:shadow-purple-200/30 dark:hover:shadow-purple-800/10'
                          }`}
                        >
                          Categories
                        </Button>
                      </Link>
                      <Link to={"/suppliers" as any}>
                        <Button 
                          variant="ghost" 
                          className={`w-full justify-start h-10 text-sm text-gray-600 dark:text-gray-400 hover:bg-purple-100 dark:hover:bg-purple-800/30 hover:text-purple-700 dark:hover:text-purple-300 transition-all duration-200 rounded-lg group ${
                            isActive('/suppliers') 
                              ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-md shadow-purple-500/25' 
                              : 'hover:shadow-sm hover:shadow-purple-200/30 dark:hover:shadow-purple-800/10'
                          }`}
                        >
                          Suppliers
                        </Button>
                      </Link>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="reports-item" className="border-none">
                  <AccordionTrigger 
                    value="reports-item" 
                    className="px-3 py-3 h-12 text-gray-700 dark:text-gray-300 hover:bg-purple-100 dark:hover:bg-purple-800/30 transition-all duration-200 rounded-xl group hover:shadow-md hover:shadow-purple-200/50 dark:hover:shadow-purple-800/20"
                  >
                    <div className="flex items-center">
                      <FileText className="w-5 h-5 mr-3 text-purple-500 group-hover:text-purple-600 transition-colors" />
                      Reports
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-0">
                    <div className="ml-8 space-y-1">
                      <Link to={"/reports/sales" as any}>
                        <Button 
                          variant="ghost" 
                          className={`w-full justify-start h-10 text-sm text-gray-600 dark:text-gray-400 hover:bg-purple-100 dark:hover:bg-purple-800/30 hover:text-purple-700 dark:hover:text-purple-300 transition-all duration-200 rounded-lg group ${
                            isActive('/reports/sales') 
                              ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-md shadow-purple-500/25' 
                              : 'hover:shadow-sm hover:shadow-purple-200/30 dark:hover:shadow-purple-800/10'
                          }`}
                        >
                          Sales Report
                        </Button>
                      </Link>
                      <Link to={"/reports/inventory" as any}>
                        <Button 
                          variant="ghost" 
                          className={`w-full justify-start h-10 text-sm text-gray-600 dark:text-gray-400 hover:bg-purple-100 dark:hover:bg-purple-800/30 hover:text-purple-700 dark:hover:text-purple-300 transition-all duration-200 rounded-lg group ${
                            isActive('/reports/inventory') 
                              ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-md shadow-purple-500/25' 
                              : 'hover:shadow-sm hover:shadow-purple-200/30 dark:hover:shadow-purple-800/10'
                          }`}
                        >
                          Inventory Report
                        </Button>
                      </Link>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          )}
        </div>
      </div>

      {/* Footer Section */}
      <div className={`p-4 space-y-1 bg-gradient-to-t from-purple-50 to-transparent dark:from-purple-900/10 dark:to-transparent rounded-b-2xl ${isCollapsed ? 'px-2' : 'px-4'} transition-all duration-300`}>
        <Link to={"/settings" as any} title={isCollapsed ? "Settings" : ""}>
          <Button 
            variant="ghost" 
            className={`w-full ${isCollapsed ? 'justify-center px-2' : 'justify-start px-3'} h-12 text-gray-700 dark:text-gray-300 hover:bg-purple-100 dark:hover:bg-purple-800/30 transition-all duration-200 rounded-xl group ${
              isActive('/settings') 
                ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-500/25 hover:from-purple-600 hover:to-purple-700' 
                : 'hover:shadow-md hover:shadow-purple-200/50 dark:hover:shadow-purple-800/20'
            }`}
          >
            <Settings className={`w-5 h-5 ${isCollapsed ? '' : 'mr-3'} transition-colors ${isActive('/settings') ? 'text-white' : 'text-purple-500 group-hover:text-purple-600'}`} />
            {!isCollapsed && <span className="transition-opacity duration-300">Settings</span>}
          </Button>
        </Link>

        <Link to={"/help" as any} title={isCollapsed ? "Help & Support" : ""}>
          <Button 
            variant="ghost" 
            className={`w-full ${isCollapsed ? 'justify-center px-2' : 'justify-start px-3'} h-12 text-gray-700 dark:text-gray-300 hover:bg-purple-100 dark:hover:bg-purple-800/30 transition-all duration-200 rounded-xl group ${
              isActive('/help') 
                ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-500/25 hover:from-purple-600 hover:to-purple-700' 
                : 'hover:shadow-md hover:shadow-purple-200/50 dark:hover:shadow-purple-800/20'
            }`}
          >
            <HelpCircle className={`w-5 h-5 ${isCollapsed ? '' : 'mr-3'} transition-colors ${isActive('/help') ? 'text-white' : 'text-purple-500 group-hover:text-purple-600'}`} />
            {!isCollapsed && <span className="transition-opacity duration-300">Help & Support</span>}
          </Button>
        </Link>
      </div>
    </nav>
  );
};