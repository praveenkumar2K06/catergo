import { createFileRoute, Outlet, useLoaderData } from "@tanstack/react-router";
import { PathBreadcrumbs } from "@/components/path-breadcrumbs";
import { ModeToggle } from "@/components/shared/layout/mode-toggle";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import LoginPage from "@/features/auth/login-page";

export const Route = createFileRoute("/_authed")({
	beforeLoad: ({ context }) => {
		if (!context.user) {
			throw new Error("Not authenticated");
		}
	},
	errorComponent: ({ error }) => {
		if (error.message === "Not authenticated") {
			return <LoginPage />;
		}

		throw error;
	},
	loader({ context }) {
		if (!context.user) {
			throw new Error("Not authenticated");
		}
		return context.user;
	},
	component: AuthLayout,
});

function AuthLayout() {
	const user = useLoaderData({ from: "/_authed" });

	return (
		<SidebarProvider>
			<AppSidebar user={user} />
			<SidebarInset>
				<header className="flex h-16 shrink-0 items-center justify-between gap-2">
					<div className="flex items-center gap-2 px-4">
						<SidebarTrigger className="-ml-1" />
						<Separator
							orientation="vertical"
							className="mr-2 data-[orientation=vertical]:h-4"
						/>
						<PathBreadcrumbs />
					</div>
					<div className="flex items-center gap-3 px-4">
						<ModeToggle />
					</div>
				</header>

				<main className="flex flex-1 flex-col gap-4 p-4 pt-0">
					<Outlet />
				</main>
			</SidebarInset>
		</SidebarProvider>
	);
}
