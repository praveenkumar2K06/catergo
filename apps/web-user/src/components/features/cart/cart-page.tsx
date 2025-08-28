import { motion } from "motion/react";
import { AnimatedButton } from "@/components/ui/button";
import { useCartCalculations } from "@/hooks/use-cart-calculations";
import { commonAnimations } from "@/lib/common-animations";
import type { CartItem, UserData } from "@/lib/types";
import { CartItemsList } from "./components/items/cart-items-list";
import { CartHeader } from "./components/layout/cart-header";
import { EmptyCart } from "./components/layout/empty-cart";
import { BillSummary } from "./components/summary/bill-summary";
import { DeliveryInfo } from "./components/summary/delivery-info";

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
	const { totalItems, subtotal, deliveryFee, taxes, total } =
		useCartCalculations(cartItems);

	if (cartItems.length === 0) {
		return <EmptyCart onBack={onBack} />;
	}

	return (
		<motion.div
			variants={commonAnimations.container}
			initial="hidden"
			animate="show"
			className="min-h-screen bg-background text-foreground"
		>
			<motion.div variants={commonAnimations.item}>
				<CartHeader
					totalItems={totalItems}
					userData={userData}
					onBack={onBack}
				/>
			</motion.div>

			<div className="mx-auto max-w-2xl space-y-4 p-4">
				<motion.div variants={commonAnimations.item}>
					<DeliveryInfo userData={userData} />
				</motion.div>

				<motion.div variants={commonAnimations.item}>
					<CartItemsList
						cartItems={cartItems}
						userData={userData}
						onUpdateQuantity={onUpdateQuantity}
						onRemoveItem={onRemoveItem}
					/>
				</motion.div>

				<motion.div variants={commonAnimations.item}>
					<BillSummary
						totalItems={totalItems}
						subtotal={subtotal}
						deliveryFee={deliveryFee}
						taxes={taxes}
						total={total}
					/>
				</motion.div>

				<motion.div variants={commonAnimations.item}>
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
