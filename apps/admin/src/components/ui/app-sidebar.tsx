import { Sidebar } from "@/components/ui/sidebar";
import AppSidebarHeader from "./app-sidebar-header";
import AppSidebarNav from "./app-sidebar-nav";
import AppSidebarUser from "./app-sidebar-user";

interface AppSidebarProps {
	user: {
		id: string;
		name: string;
		email: string;
	};
}

export function AppSidebar({ user }: AppSidebarProps) {
	return (
		<Sidebar variant="inset">
			<AppSidebarHeader />
			<AppSidebarNav />
			<AppSidebarUser user={user} />
		</Sidebar>
	);
}
