import { motion, type Variants } from "motion/react";
import { AnimatedButton } from "@/components/ui/button";
import type { CartItem, UserData } from "@/lib/types";
import { BillSummary } from "./bill-summary";
import { CartHeader } from "./cart-header";
import { CartItemsList } from "./cart-items-list";
import { DeliveryInfo } from "./delivery-info";
import { EmptyCart } from "./empty-cart";

interface CartPageProps {
	userData: UserData;
	cartItems: CartItem[];
	onBack: () => void;
	onUpdateQuantity: (itemId: string, quantity: number) => void;
	onRemoveItem: (itemId: string) => void;
	onProceedToCheckout: () => void;
	onCreateNewOrder: () => void;
}

export function CartPage({
	userData,
	cartItems,
	onBack,
	onUpdateQuantity,
	onRemoveItem,
	onProceedToCheckout,
	onCreateNewOrder,
}: CartPageProps) {
	const totalItems = cartItems.reduce(
		(sum, { quantity }) => sum + quantity,
		0,
	);
	const subtotal = cartItems.reduce(
		(sum, { item, quantity }) => sum + item.price * quantity,
		0,
	);
	const deliveryFee = subtotal > 500 ? 0 : 40;
	const taxes = Math.round(subtotal * 0.05); // 5% tax
	const total = subtotal + deliveryFee + taxes;

	const container = {
		hidden: { opacity: 0, y: 8 },
		show: {
			opacity: 1,
			y: 0,
			transition: {
				staggerChildren: 0.08,
				when: "beforeChildren",
			},
		},
	} as Variants;

	const item = {
		hidden: { opacity: 0, y: 6, scale: 0.995 },
		show: {
			opacity: 1,
			y: 0,
			scale: 1,
			transition: {
				type: "spring",
				stiffness: 300,
				damping: 24,
			},
		},
	} as Variants;

	if (cartItems.length === 0) {
		return <EmptyCart onBack={onBack} />;
	}

	return (
		<motion.div
			variants={container}
			initial="hidden"
			animate="show"
			className="min-h-screen bg-background text-foreground"
		>
			<motion.div variants={item}>
				<CartHeader
					totalItems={totalItems}
					userData={userData}
					onBack={onBack}
				/>
			</motion.div>

			<div className="mx-auto max-w-2xl space-y-4 p-4">
				<motion.div variants={item}>
					<DeliveryInfo userData={userData} />
				</motion.div>

				<motion.div variants={item}>
					<CartItemsList
						cartItems={cartItems}
						userData={userData}
						onUpdateQuantity={onUpdateQuantity}
						onRemoveItem={onRemoveItem}
					/>
				</motion.div>

				<motion.div variants={item}>
					<BillSummary
						totalItems={totalItems}
						subtotal={subtotal}
						deliveryFee={deliveryFee}
						taxes={taxes}
						total={total}
					/>
				</motion.div>

				<motion.div variants={item}>
					<div className="flex w-full flex-row items-center justify-between gap-4">
						<AnimatedButton
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
							transition={{
								type: "spring",
								stiffness: 300,
								damping: 24,
							}}
							size="lg"
							onClick={onCreateNewOrder}
							className="flex-1 font-medium text-lg"
						>
							Create New Order
						</AnimatedButton>
						<AnimatedButton
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
							transition={{
								type: "spring",
								stiffness: 300,
								damping: 24,
							}}
							variant="secondary"
							onClick={onProceedToCheckout}
							className="flex-1 font-medium text-lg"
							size="lg"
						>
							Proceed to Checkout • ₹{total}
						</AnimatedButton>
					</div>
				</motion.div>
			</div>
		</motion.div>
	);
}
