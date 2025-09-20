import { Link } from "@tanstack/react-router";
import { User2 } from "lucide-react";
import {
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";

export function AppSidebarHeader() {
	return (
		<SidebarHeader>
			<SidebarMenu>
				<SidebarMenuItem>
					<SidebarMenuButton size="lg" asChild>
						<Link to="/dashboard">
							<div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
								<User2 className="size-4" />
							</div>
							<div className="grid flex-1 text-left text-sm leading-tight">
								<span className="truncate font-semibold">
									Cater Go Admin
								</span>
							</div>
						</Link>
					</SidebarMenuButton>
				</SidebarMenuItem>
			</SidebarMenu>
		</SidebarHeader>
	);
}

export default AppSidebarHeader;
