import { ShoppingCart } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { fadeAnimation } from "@/lib/animations";
import type { CartItem } from "@/lib/types";

interface FloatingCartButtonProps {
	cartItems: CartItem[];
	onProceedToCart: (cartItems: CartItem[]) => void;
}

export function FloatingCartButton({
	cartItems,
	onProceedToCart,
}: FloatingCartButtonProps) {
	const getTotalItems = () => {
		return cartItems.reduce((total, { quantity }) => total + quantity, 0);
	};

	const getTotalPrice = () => {
		return cartItems.reduce(
			(total, { item, quantity }) => total + item.price * quantity,
			0,
		);
	};

	return (
		<AnimatePresence>
			{getTotalItems() > 0 && (
				<motion.div
					className="fixed right-4 bottom-4 z-20"
					{...fadeAnimation}
					tabIndex={-1}
				>
					<Button
						onClick={() => onProceedToCart(cartItems)}
						className="h-14 px-8"
						size={"lg"}
					>
						<ShoppingCart className="mr-2 h-5 w-5" />
						<div className="flex flex-col items-start">
							<span className="font-medium text-sm">
								{getTotalItems()} items
							</span>
							<span className="text-xs">₹{getTotalPrice()}</span>
						</div>
					</Button>
				</motion.div>
			)}
		</AnimatePresence>
	);
}

interface CartButtonProps {
	cartItems: CartItem[];
	onProceedToCart: (cartItems: CartItem[]) => void;
}

export function CartButton({ cartItems, onProceedToCart }: CartButtonProps) {
	const totalItems = useMemo(
		() =>
			Object.values(cartItems).reduce(
				(total, { quantity }) => total + quantity,
				0,
			),
		[cartItems],
	);

	const getTotalItems = () => totalItems;

	if (getTotalItems() === 0) return null;

	return (
		<AnimatePresence>
			{getTotalItems() > 0 && (
				<motion.div {...fadeAnimation} tabIndex={-1}>
					<Button onClick={() => onProceedToCart(cartItems)}>
						<ShoppingCart className="mr-2 h-4 w-4" />
						Cart
						<Badge className="bg-primary-foreground text-primary hover:bg-primary-foreground">
							{getTotalItems()}
						</Badge>
					</Button>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
