import { LayoutDashboard, LogOut, Package, Settings, User } from "lucide-react";

export const navigationItems = [
	{
		title: "Dashboard",
		href: "/dashboard",
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

export const userMenuItems = [
	{
		title: "Logout",
		href: "/logout",
		icon: LogOut,
	},
];
