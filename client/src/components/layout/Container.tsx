import { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Header } from "./Header";

interface ContainerProps {
  children: ReactNode;
}

export const Container = ({ children }: ContainerProps) => {
  return (
    <div className="h-screen w-full bg-gradient-to-br from-purple-50 via-indigo-50 to-purple-100 dark:from-gray-900 dark:via-purple-900/20 dark:to-gray-800 p-4 flex">
      <Navbar />
      <main className="flex-1 flex flex-col pl-4">
        {/* Header tetap fixed */}
        <div className="flex-shrink-0">
          <Header />
        </div>
        
        {/* Container yang bisa di-scroll tanpa scrollbar */}
        <div className="flex-1 overflow-auto scrollbar-hide p-8 bg-gradient-to-br from-white/90 via-purple-50/30 to-white/90 dark:from-gray-800/90 dark:via-purple-900/20 dark:to-gray-800/90 backdrop-blur-sm rounded-2xl mt-4 border border-purple-200/30 dark:border-purple-700/30 shadow-lg">
          {children}
        </div>
      </main>
    </div>
  );
};
