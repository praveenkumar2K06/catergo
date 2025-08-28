import { Badge } from "@/components/ui/badge";

interface FoodItemBadgeProps {
	isVeg: boolean;
	variant?: "default" | "secondary";
	showText?: boolean;
	className?: string;
}

export function FoodItemBadge({
	isVeg,
	variant = "secondary",
	showText = false,
	className = "",
}: FoodItemBadgeProps) {
	const icon = isVeg ? "🟢" : "🔴";
	const text = isVeg ? "Veg" : "Non-Veg";

	return (
		<Badge variant={variant} className={className}>
			{showText ? `${icon} ${text}` : icon}
		</Badge>
	);
}
