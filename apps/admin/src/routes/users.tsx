import { createFileRoute } from "@tanstack/react-router";
import UsersPage from "@/features/users";

export const Route = createFileRoute("/users")({
	component: UsersPage,
	loader: async () => {
		return {
			crumb: "Users",
		};
	},
});
