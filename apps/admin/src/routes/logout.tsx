import { createFileRoute, redirect } from "@tanstack/react-router";
import { logoutFn } from "@/lib/auth-functions";

export const Route = createFileRoute("/logout")({
	preload: false,
	loader: async () => {
		localStorage.clear();
		await logoutFn();

		return redirect({ to: "/" });
	},
});
