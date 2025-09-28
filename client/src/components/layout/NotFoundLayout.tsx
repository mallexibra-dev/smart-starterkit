import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import dotsPattern from "@/assets/dots-pattern.svg";

interface NotFoundLayoutProps {
  children: ReactNode;
}

export const NotFoundLayout = ({ children }: NotFoundLayoutProps) => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate({ to: "/" });
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden">
      {/* Background dengan gradient dan pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-indigo-50 to-purple-100 dark:from-gray-900 dark:via-purple-900/20 dark:to-gray-800"></div>
      
      {/* Decorative elements */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-purple-200/30 dark:bg-purple-800/20 rounded-full blur-xl"></div>
      <div className="absolute top-40 right-32 w-24 h-24 bg-indigo-200/30 dark:bg-indigo-800/20 rounded-full blur-lg"></div>
      <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-purple-300/20 dark:bg-purple-700/20 rounded-full blur-2xl"></div>
      <div className="absolute bottom-20 right-20 w-28 h-28 bg-indigo-300/25 dark:bg-indigo-700/25 rounded-full blur-xl"></div>
      
      {/* Grid pattern overlay menggunakan file SVG */}
      <div 
        className="absolute inset-0 opacity-50"
        style={{
          backgroundImage: `url(${dotsPattern})`,
          backgroundRepeat: 'repeat'
        }}
      ></div>
      
      {/* Main content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4">
        <div className="text-center max-w-4xl mx-auto">
          {children}
          
          {/* Tombol kembali dengan styling yang lebih elegan */}
          <div className="mt-12">
            <Button 
              onClick={handleGoHome}
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Kembali ke Dashboard
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}; 