import { motion, type Transition } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CartItem, UserData } from "@/lib/types";
import { CartItem as CartItemComponent } from "./cart-item";

interface CartItemsListProps {
	cartItems: CartItem[];
	userData: UserData;
	onUpdateQuantity: (itemId: string, quantity: number) => void;
	onRemoveItem: (itemId: string) => void;
	hidePrices?: boolean;
}

export function CartItemsList({
	cartItems,
	userData,
	onUpdateQuantity,
	onRemoveItem,
	hidePrices = false,
}: CartItemsListProps) {
	const getSuggestedQuantity = (itemId: string) => {
		const cartItem = cartItems.find(
			(cartItem) => cartItem.item.id === itemId,
		);
		if (!cartItem) return 1;
		return Math.max(
			1,
			Math.ceil(userData.numberOfPeople / cartItem.item.qtyPerUnit),
		);
	};

	const containerVariants = {
		hidden: {},
		show: { transition: { staggerChildren: 0.06 } },
	};

	const springTransition: Transition = {
		type: "spring",
		damping: 20,
		stiffness: 300,
		duration: 0.3,
	};

	const itemVariants = {
		hidden: { opacity: 0, y: 8, scale: 0.98 },
		show: {
			opacity: 1,
			y: 0,
			scale: 1,
			transition: springTransition,
		},
	};

	return (
		<Card className="border-border bg-card">
			<CardHeader>
				<CardTitle className="text-foreground text-lg">
					Order Items
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				<motion.div
					variants={containerVariants}
					initial="hidden"
					animate="show"
					className="space-y-4"
				>
					{cartItems.map(({ id, item, quantity }) => (
						<motion.div key={id} layout variants={itemVariants}>
							<CartItemComponent
								// biome-ignore lint/style/noNonNullAssertion: Will Never be Null
								id={id!}
								item={item}
								quantity={quantity}
								suggestedQuantity={getSuggestedQuantity(
									item.id,
								)}
								onUpdateQuantity={onUpdateQuantity}
								onRemoveItem={onRemoveItem}
								hidePrices={hidePrices}
							/>
						</motion.div>
					))}
				</motion.div>
			</CardContent>
		</Card>
	);
}
