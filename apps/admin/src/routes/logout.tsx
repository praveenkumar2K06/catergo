import { createFileRoute, redirect, useRouter } from "@tanstack/react-router";

export const Route = createFileRoute("/logout")({
	preload: false,
	loader: async ({ context }) => {
		const router = useRouter();
		await context.auth.logout();

		await router.invalidate();

		await new Promise((r) => setTimeout(r, 1000));

		return redirect({ to: "/" });
	},
});
