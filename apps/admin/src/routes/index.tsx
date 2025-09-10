import { createFileRoute, redirect } from "@tanstack/react-router";
import LoginPage from "@/features/auth/login-page";

export const Route = createFileRoute("/")({
	beforeLoad: ({ context }) => {
		if (context.user) {
			return redirect({ to: "/dashboard" });
		}
	},
	component: LoginPage,
});
