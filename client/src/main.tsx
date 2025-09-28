import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./index.css";

const queryClient = new QueryClient();

import { routeTree } from "./routeTree.gen";
import { NotFoundLayout } from "./components/layout/NotFoundLayout";

const router = createRouter({ 
  routeTree,
  defaultNotFoundComponent: () => {
    return (
      <NotFoundLayout>
        {/* Hero section dengan 404 yang besar dan elegan */}
        <div className="mb-16">
          <div className="relative">
            {/* 404 dengan efek glow */}
            <div className="text-[12rem] md:text-[16rem] font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-800 dark:from-purple-400 dark:via-indigo-400 dark:to-purple-600 leading-none">
              404
            </div>
            
            {/* Glow effect */}
            <div className="absolute inset-0 text-[12rem] md:text-[16rem] font-black text-purple-600/20 dark:text-purple-400/20 leading-none blur-sm">
              404
            </div>
          </div>
          
          {/* Decorative line dengan gradient */}
          <div className="flex justify-center mt-8">
            <div className="w-32 h-1 bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-600 rounded-full"></div>
          </div>
        </div>

        {/* Content section */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Oops! Halaman Tidak Ditemukan
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Sepertinya Anda tersesat di dunia digital. Halaman yang Anda cari mungkin telah pindah, 
            dihapus, atau tidak pernah ada.
          </p>
        </div>
      </NotFoundLayout>
    );
  }
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error(
    "Root element not found. Check if it's in your index.html or if the id is correct."
  );
}

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </StrictMode>
  );
}
