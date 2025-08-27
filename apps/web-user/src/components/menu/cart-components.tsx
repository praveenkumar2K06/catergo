import { useTransition } from "@react-spring/web";
import { ShoppingCart } from "lucide-react";
import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { AnimatedButton } from "@/components/ui/button";
import type { CartItems } from "@/lib/types";

interface FloatingCartButtonProps {
	cartItems: CartItems;
	onProceedToCart: (cartItems: CartItems) => void;
}

export function FloatingCartButton({
	cartItems,
	onProceedToCart,
}: FloatingCartButtonProps) {
	const getTotalItems = () => {
		return Object.values(cartItems).reduce(
			(total, { quantity }) => total + quantity,
			0,
		);
	};

	const getTotalPrice = () => {
		return Object.values(cartItems).reduce(
			(total, { item, quantity }) => total + item.price * quantity,
			0,
		);
	};

	const buttonTransition = useTransition(getTotalItems() > 1, {
		from: {
			opacity: 0,
		},
		enter: {
			opacity: 1,
		},
		leave: {
			opacity: 0,
		},
		config: { duration: 150 },
	});

	if (getTotalItems() === 0) return null;

	return (
		<div className="fixed right-4 bottom-4 z-20">
			{buttonTransition(
				(style, show) =>
					show && (
						<AnimatedButton
							style={style}
							onClick={() => onProceedToCart(cartItems)}
							className="h-14 rounded-full bg-primary px-6 text-primary-foreground shadow-lg hover:bg-primary/90"
						>
							<ShoppingCart className="mr-2 h-5 w-5" />
							<div className="flex flex-col items-start">
								<span className="font-medium text-sm">
									{getTotalItems()} items
								</span>
								<span className="text-xs">
									₹{getTotalPrice()}
								</span>
							</div>
						</AnimatedButton>
					),
			)}
		</div>
	);
}

interface CartButtonProps {
	cartItems: CartItems;
	onProceedToCart: (cartItems: CartItems) => void;
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

	const buttonTransition = useTransition(totalItems > 0, {
		from: {
			opacity: 0,
		},
		enter: {
			opacity: 1,
		},
		leave: {
			opacity: 0,
		},
		config: { duration: 100 },
	});

	if (getTotalItems() === 0) return null;

	return (
		<>
			{buttonTransition(
				(style, show) =>
					show && (
						<AnimatedButton
							style={style}
							onClick={() => onProceedToCart(cartItems)}
							className="relative bg-primary text-primary-foreground shadow-lg transition-all duration-200 hover:bg-primary/90 hover:shadow-xl"
						>
							<ShoppingCart className="mr-2 h-4 w-4" />
							Cart
							<Badge className="ml-2 bg-primary-foreground text-primary hover:bg-primary-foreground">
								{getTotalItems()}
							</Badge>
						</AnimatedButton>
					),
			)}
		</>
	);
}
