import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import MenuPage from "@/features/menu";
import { fetchMenuQuery } from "@/lib/api/menu-items";

const menuSearchSchema = z.object({
	page: z.number().min(0).optional(),
	pageSize: z.number().min(1).optional(),
	name: z.string().optional(),
});

export const Route = createFileRoute("/_authed/menu")({
	component: MenuPage,
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
			fetchMenuQuery(deps.page ?? 0, deps.pageSize ?? 10, deps.name),
		);
		return {
			crumb: "Menu",
			adminId: context.user?.id,
		};
	},
});
