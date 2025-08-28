import { Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { FoodItemBadge } from "@/components/shared/ui/food-item-badge";
import { FoodItemImage } from "@/components/shared/ui/food-item-image";
import { PriceDisplay } from "@/components/shared/ui/price-display";
import { QuantityControl } from "@/components/shared/ui/quantity-control";
import { Button } from "@/components/ui/button";
import { fadeAnimation } from "@/lib/animations";
import type { MenuItem } from "@/lib/types";

interface CartItemProps {
	id: string;
	item: MenuItem;
	quantity: number;
	suggestedQuantity: number;
	onUpdateQuantity: (itemId: string, quantity: number) => void;
	onRemoveItem: (itemId: string) => void;
}

export function CartItem({
	id,
	item,
	quantity,
	suggestedQuantity,
	onUpdateQuantity,
	onRemoveItem,
}: CartItemProps) {
	const updateQuantity = (newQuantity: number) => {
		if (newQuantity <= 0) {
			onRemoveItem(id);
		} else {
			onUpdateQuantity(id, newQuantity);
		}
	};

	return (
		<motion.div
			className="flex items-center gap-4 rounded-lg bg-popover p-3"
			whileHover={{ scale: 1.01 }}
			transition={{ type: "spring", stiffness: 300, damping: 24 }}
		>
			<FoodItemImage item={item} className="h-16 w-16 rounded-lg" />

			<div className="min-w-0 flex-1">
				<div className="mb-1 flex items-start justify-between">
					<h3 className="truncate font-medium text-foreground">
						{item.name}
					</h3>
					<Button
						variant="outline"
						size="icon"
						onClick={() => onRemoveItem(id)}
						className="text-destructive hover:text-destructive"
					>
						<Trash2 className="h-4 w-4" />
					</Button>
				</div>

				<div className="mb-2 flex items-center gap-2">
					<FoodItemBadge isVeg={item.isVeg} />
					<PriceDisplay
						price={item.price}
						className="text-muted-foreground text-sm"
					/>
				</div>

				<div className="flex items-center justify-between">
					<QuantityControl
						quantity={quantity}
						suggestedQuantity={suggestedQuantity}
						onQuantityChange={updateQuantity}
						size="sm"
					/>

					<div className="text-right">
						<PriceDisplay
							price={item.price}
							quantity={quantity}
							showTotal={true}
							className="font-semibold text-foreground"
						/>
						<AnimatePresence>
							{quantity !== suggestedQuantity && (
								<motion.div
									{...fadeAnimation}
									className="text-muted-foreground text-xs"
								>
									Suggested: {suggestedQuantity}
								</motion.div>
							)}
						</AnimatePresence>
					</div>
				</div>
			</div>
		</motion.div>
	);
}
