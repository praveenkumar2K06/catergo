import { FoodItemBadge } from "@/components/shared/ui/food-item-badge";
import { FoodItemImage } from "@/components/shared/ui/food-item-image";
import { PriceDisplay } from "@/components/shared/ui/price-display";
import { QuantityControl } from "@/components/shared/ui/quantity-control";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from "@/components/ui/card";
import type { MenuItem } from "@/lib/types";

interface MenuItemCardProps {
	item: MenuItem;
	quantity: number;
	suggestedQuantity: number;
	onQuantityChange: (newQuantity: number) => void;
	onAddToCart: () => void;
	cartQuantity?: number;
	numberOfPeople: number;
	hidePrices?: boolean;
}

export function MenuItemCard({
	item,
	quantity,
	suggestedQuantity,
	onQuantityChange,
	onAddToCart,
	cartQuantity,
	numberOfPeople,
	hidePrices = false,
}: MenuItemCardProps) {
	return (
		<Card className="group overflow-hidden border-border/40 transition-all duration-300 hover:border-primary/20 hover:shadow-xl">
			<CardHeader>
				<div className="relative overflow-hidden">
					<FoodItemImage item={item} showOverlay={true} />
					<div className="absolute top-2 left-2 flex gap-1">
						<FoodItemBadge
							isVeg={item.isVeg}
							showText={true}
							className="backdrop-blur-sm"
						/>
					</div>
				</div>
			</CardHeader>

			<CardContent className="p-4">
				<div className="mb-2 flex items-start justify-between">
					<h3 className="font-semibold text-foreground text-lg">
						{item.name}
					</h3>
					<PriceDisplay
						price={item.price}
						className="text-lg"
						hidePrices={hidePrices}
					/>
				</div>

				<p className="mb-3 line-clamp-2 text-muted-foreground text-sm">
					{item.description}
				</p>

				<div className="mb-4 flex items-center justify-start">
					<span className="font-medium text-primary text-xs">
						Suggested for {numberOfPeople} people:{" "}
						{suggestedQuantity} {item.metrics}
					</span>
				</div>
			</CardContent>
			<CardFooter className="flex-col items-start">
				<div className="flex w-full items-center justify-between">
					<QuantityControl
						quantity={quantity}
						suggestedQuantity={suggestedQuantity}
						onQuantityChange={onQuantityChange}
						showMetrics={true}
						metrics={item.metrics}
					/>

					<Button
						onClick={onAddToCart}
						className="bg-primary text-primary-foreground hover:bg-primary/90"
						size="sm"
					>
						Add to Cart
					</Button>
				</div>

				{cartQuantity !== 0 && (
					<div className="mt-2 font-medium text-chart-3 text-xs">
						✓ {cartQuantity} {item.metrics} in cart
					</div>
				)}
			</CardFooter>
		</Card>
	);
}
