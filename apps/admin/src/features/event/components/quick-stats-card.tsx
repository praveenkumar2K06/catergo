import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { CartItem } from "@/types/events";

interface QuickStatsCardProps {
	cartItems?: CartItem[];
	numberOfPeople?: number;
}

function getTotalItems(cartItems: CartItem[]): number {
	return cartItems.reduce(
		(total: number, item: CartItem) => total + item.quantity,
		0,
	);
}

function getTotalOrderValue(cartItems: CartItem[]): number {
	return cartItems.reduce((total: number, item: CartItem) => {
		const itemTotal = item.menuItem
			? item.menuItem.price * item.quantity
			: 0;
		return total + itemTotal;
	}, 0);
}

export function QuickStatsCard({
	cartItems = [],
	numberOfPeople,
}: QuickStatsCardProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Quick Stats</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="flex items-center justify-between">
					<span className="text-muted-foreground text-sm">
						Total Items
					</span>
					<Badge variant="outline">{getTotalItems(cartItems)}</Badge>
				</div>
				<Separator />
				<div className="flex items-center justify-between">
					<span className="text-muted-foreground text-sm">
						Order Value
					</span>
					<Badge variant="outline">
						₹{getTotalOrderValue(cartItems).toFixed(2)}
					</Badge>
				</div>
				<Separator />
				<div className="flex items-center justify-between">
					<span className="text-muted-foreground text-sm">
						Guest Count
					</span>
					<Badge variant="outline">{numberOfPeople || 0}</Badge>
				</div>
				<Separator />
				<div className="flex items-center justify-between">
					<span className="text-muted-foreground text-sm">
						Cart Items
					</span>
					<Badge variant="outline">{cartItems.length}</Badge>
				</div>
			</CardContent>
		</Card>
	);
}
