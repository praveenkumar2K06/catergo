import { createFileRoute } from "@tanstack/react-router";
import SettingsPage from "@/features/settings";

export const Route = createFileRoute("/_authed/settings")({
	component: SettingsPage,
	loader: async ({ context }) => {
		return {
			crumb: "Settings",
			adminId: context.auth?.user?.userId,
		};
	},
});
