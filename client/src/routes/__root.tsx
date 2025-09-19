import { createRootRoute, Outlet, redirect } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { api } from "@/lib/axios";

export const Route = createRootRoute({
	beforeLoad: async ({ location }) => {
		const isAuthPage = location.pathname.startsWith("/auth");
		try {
			await api.get("/auth/me");
			return;
		} catch {
			if (!isAuthPage) {
				throw redirect({ to: "/auth/login", search: { redirect: location.href } });
			}
		}
	},
	component: () => (
		<>
			<Outlet />
			<TanStackRouterDevtools />
		</>
	),
});