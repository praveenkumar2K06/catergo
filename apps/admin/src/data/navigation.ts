import { LayoutDashboard, Package, Settings, User } from "lucide-react";

export const navigationItems = [
	{
		title: "Dashboard",
		href: "/",
		icon: LayoutDashboard,
	},
	{
		title: "Users",
		href: "/users",
		icon: User,
	},
	{
		title: "Menu",
		href: "/menu",
		icon: Package,
	},
	{
		title: "Settings",
		href: "/settings",
		icon: Settings,
	},
];
