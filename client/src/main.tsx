import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/contexts/theme-context";
import { Toaster } from "@/components/ui/sonner";
import { ErrorBoundary } from "./components/layout/error-boundary";
import "./index.css";

const queryClient = new QueryClient();

import { routeTree } from "./routeTree.gen";

const router = createRouter({ routeTree });

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
      <ErrorBoundary
        onError={(error, errorInfo) => {
          // Log to error tracking service in production
          if (process.env.NODE_ENV === 'production') {
            console.error('Production error:', error, errorInfo);
          }
        }}
      >
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <RouterProvider router={router} />
            <Toaster />
          </ThemeProvider>
        </QueryClientProvider>
      </ErrorBoundary>
    </StrictMode>
  );
}
