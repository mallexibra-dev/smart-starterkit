import { createRootRoute, Outlet, redirect } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { getCurrentUser } from "@/services/auth.service";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export const Route = createRootRoute({
  beforeLoad: async ({ location }) => {
    const isAuthPage = location.pathname.startsWith("/auth");

    if (!isAuthPage) {
      try {
        const user = await getCurrentUser();
        if (!user.success) {
          throw redirect({
            to: "/auth/login",
            search: { redirect: location.href }
          });
        }
      } catch {
        throw redirect({
          to: "/auth/login",
          search: { redirect: location.href }
        });
      }
    }
  },
  component: RootLayout,
});

function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
      <TanStackRouterDevtools />
    </QueryClientProvider>
  );
}