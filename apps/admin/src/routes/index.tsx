import { createFileRoute, redirect } from "@tanstack/react-router";
import LoginPage from "@/features/auth/login-page";

export const Route = createFileRoute("/")({
	beforeLoad: ({ context }) => {
		if (context.auth.isAuthenticated) {
			return redirect({ to: "/dashboard" });
		}
	},
	loader: () => ({
		crumb: "Login",
	}),
	component: LoginPage,
});
