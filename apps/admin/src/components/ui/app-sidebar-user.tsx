import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate, useRouter } from "@tanstack/react-router";
import { Calendar, CalendarDays, ChevronUp, Clock } from "lucide-react";
import { useAuth } from "@/auth";
import {
	SidebarFooter,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import { userMenuItems } from "@/data/navigation";
import { fetchTodaysEvents } from "@/lib/api/events";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { Badge } from "./badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "./card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "./dropdown-menu";
import { ScrollArea } from "./scroll-area";

interface AppSidebarUserProps {
	user: {
		id: string;
		name: string;
		email: string;
	};
}

export function AppSidebarUser({ user }: AppSidebarUserProps) {
	const router = useRouter();
	const auth = useAuth();
	const navigate = useNavigate();
	const { isPending, data } = useQuery({
		queryKey: ["todays-events"],
		queryFn: fetchTodaysEvents,
	});

	return (
		<>
			<SidebarFooter className="border-t">
				<div className="flex items-center justify-between px-4 py-3">
					<div className="flex items-center gap-2">
						<CalendarDays className="h-4 w-4 text-muted-foreground" />
						<span className="font-medium text-sm">
							Today's Events
						</span>
					</div>
					<Badge variant="secondary" className="text-xs">
						{data?.data?.length || 0}
					</Badge>
				</div>
				<ScrollArea className="max-h-52 space-y-2 px-4 pb-2">
					{isPending ? (
						<div className="flex items-center justify-center py-8">
							<div className="h-6 w-6 animate-spin rounded-full border-primary border-b-2" />
						</div>
					) : data?.data && data.data.length > 0 ? (
						data.data.map((event) => (
							<Card
								key={event.id}
								className="border-l-4 border-l-primary bg-gradient-to-r from-primary/5 to-transparent shadow-sm transition-all duration-200 hover:from-primary/10 hover:shadow-md"
							>
								<CardHeader className="p-3">
									<CardTitle className="flex items-start justify-between text-sm leading-tight">
										<span className="flex-1 truncate font-semibold text-foreground">
											{event.name}
										</span>
									</CardTitle>
									<CardDescription className="mt-1 flex items-center gap-1.5 text-xs">
										<Clock className="h-3 w-3 text-muted-foreground" />
										<span className="text-muted-foreground">
											{new Date(
												event.date,
											).toLocaleTimeString([], {
												hour: "2-digit",
												minute: "2-digit",
												hour12: true,
											})}
										</span>
									</CardDescription>
								</CardHeader>
							</Card>
						))
					) : (
						<Card className="border-2 border-dashed bg-muted/20">
							<CardContent className="flex flex-col items-center justify-center px-4 py-6">
								<Calendar className="mb-2 h-8 w-8 text-muted-foreground/50" />
								<p className="text-center text-muted-foreground text-xs">
									No events scheduled for today
								</p>
								<p className="mt-1 text-center text-muted-foreground/70 text-xs">
									Enjoy your free time!
								</p>
							</CardContent>
						</Card>
					)}
				</ScrollArea>
			</SidebarFooter>

			<SidebarFooter>
				<SidebarMenu>
					<SidebarMenuItem>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<SidebarMenuButton
									size="lg"
									className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
								>
									<Avatar className="h-8 w-8 rounded-lg">
										<AvatarImage alt={user.name} />
										<AvatarFallback className="rounded-lg">
											{user.name.charAt(0).toUpperCase()}
										</AvatarFallback>
									</Avatar>
									<div className="grid flex-1 text-left text-sm leading-tight">
										<span className="truncate font-semibold">
											{user.name}
										</span>
										<span className="truncate text-xs">
											{user.email}
										</span>
									</div>
									<ChevronUp className="ml-auto size-4" />
								</SidebarMenuButton>
							</DropdownMenuTrigger>
							<DropdownMenuContent
								className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
								side="bottom"
								align="end"
								sideOffset={4}
							>
								{userMenuItems.map((item) => (
									<DropdownMenuItem key={item.href} asChild>
										{item.title === "Logout" ? (
											<button
												type="button"
												className="flex w-full items-center gap-2"
												onClick={async () => {
													await auth.logout();
													await router.invalidate();
													await new Promise((r) =>
														setTimeout(r, 1000),
													);
													await navigate({ to: "/" });
												}}
											>
												<item.icon className="size-4" />
												{item.title}
											</button>
										) : (
											<Link
												to={item.href}
												className="flex items-center gap-2"
											>
												<item.icon className="size-4" />
												{item.title}
											</Link>
										)}
									</DropdownMenuItem>
								))}
							</DropdownMenuContent>
						</DropdownMenu>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarFooter>
		</>
	);
}

export default AppSidebarUser;
