import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import UsersPage from "@/features/users";
import { fetchUsersQuery } from "@/lib/api/users";

const menuSearchSchema = z.object({
	page: z.number().min(0).optional(),
	pageSize: z.number().min(1).optional(),
	name: z.string().optional(),
});

export const Route = createFileRoute("/_authed/users")({
	component: UsersPage,
	validateSearch: menuSearchSchema,
	loaderDeps: ({ search }) => {
		return {
			page: search.page,
			pageSize: search.pageSize,
			name: search.name,
		};
	},
	loader: async ({ context, deps }) => {
		await context.queryClient.ensureQueryData(
			fetchUsersQuery(deps.page ?? 0, deps.pageSize ?? 10, deps.name),
		);
		return {
			crumb: "Users",
		};
	},
});
