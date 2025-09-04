import { LayoutDashboard, Package, Settings } from "lucide-react";

export interface NavigationItem {
	title: string;
	href: string;
	icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
	badge?: string | number;
	children?: NavigationItem[];
}

export const navigationItems: NavigationItem[] = [
	{
		title: "Dashboard",
		href: "/",
		icon: LayoutDashboard,
	},
	{
		title: "Users",
		href: "/users",
		icon: Package,
	},
	{
		title: "Settings",
		href: "/settings",
		icon: Settings,
	},
];
