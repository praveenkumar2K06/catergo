import { ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CartItem } from "@/types/events";

interface OrderItemsCardProps {
	cartItems: CartItem[];
}

function getTotalItems(cartItems: CartItem[]): number {
	return cartItems.reduce(
		(total: number, item: CartItem) => total + item.quantity,
		0,
	);
}

export function OrderItemsCard({ cartItems }: OrderItemsCardProps) {
	if (!cartItems || cartItems.length === 0) {
		return null;
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<ShoppingCart className="h-5 w-5" />
					Order Items ({getTotalItems(cartItems)} items)
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="space-y-3">
					{cartItems.map((item) => (
						<div key={item.id} className="rounded-lg border p-4">
							{item.menuItem ? (
								<div className="flex items-start justify-between gap-4">
									<div className="flex-1">
										<div className="mb-2 flex items-center gap-2">
											<h4 className="font-semibold text-lg">
												{item.menuItem.name}
											</h4>
											<Badge
												variant={
													item.menuItem.isVeg
														? "default"
														: "destructive"
												}
												className="text-xs"
											>
												{item.menuItem.isVeg
													? "Veg"
													: "Non-Veg"}
											</Badge>
										</div>
										<p className="mb-2 text-muted-foreground text-sm">
											{item.menuItem.description}
										</p>
										<div className="flex items-center gap-4 text-sm">
											<span className="font-medium text-primary">
												₹
												{item.menuItem.price.toFixed(2)}
											</span>
											<span className="text-muted-foreground">
												{item.menuItem.qtyPerUnit}{" "}
												{item.menuItem.metrics}
											</span>
										</div>
									</div>
									<div className="text-right">
										<Badge
											variant="secondary"
											className="mb-2"
										>
											Qty: {item.quantity}
										</Badge>
										<p className="text-muted-foreground text-xs">
											Total: ₹
											{(
												item.menuItem.price *
												item.quantity
											).toFixed(2)}
										</p>
										<p className="text-muted-foreground text-xs">
											Added:{" "}
											{new Date(
												item.createdAt,
											).toLocaleDateString()}
										</p>
									</div>
								</div>
							) : (
								<div className="flex items-center justify-between">
									<div className="flex-1">
										<h4 className="font-medium">
											Menu Item ID: {item.menuItemId}
										</h4>
										<p className="text-muted-foreground text-sm">
											Item ID: {item.id}
										</p>
									</div>
									<div className="text-right">
										<Badge
											variant="secondary"
											className="mb-2"
										>
											Qty: {item.quantity}
										</Badge>
										<p className="text-muted-foreground text-xs">
											Added:{" "}
											{new Date(
												item.createdAt,
											).toLocaleDateString()}
										</p>
									</div>
								</div>
							)}
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
}
