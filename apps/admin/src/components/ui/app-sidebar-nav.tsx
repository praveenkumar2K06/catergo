import { Link } from "@tanstack/react-router";
import {
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import { navigationItems } from "@/data/navigation";

export function AppSidebarNav() {
	return (
		<SidebarContent>
			<SidebarGroup>
				<SidebarGroupLabel>Navigation</SidebarGroupLabel>
				<SidebarGroupContent>
					<SidebarMenu>
						{navigationItems.map((item) => (
							<SidebarMenuItem key={item.href}>
								<SidebarMenuButton asChild>
									<Link
										to={item.href}
										className="flex items-center gap-2 data-[status='active']:hover:bg-primary/90"
										activeProps={{
											className:
												"bg-primary text-primary-foreground",
										}}
									>
										<item.icon className="size-4" />
										<span>{item.title}</span>
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
						))}
					</SidebarMenu>
				</SidebarGroupContent>
			</SidebarGroup>
		</SidebarContent>
	);
}

export default AppSidebarNav;
