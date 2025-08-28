import { useMutation } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { toast } from "sonner";
import { CartPage } from "@/components/cart/cart-page";
import Loader from "@/components/loader";
import { useOrder } from "@/components/providers/order-provider";
import {
	removeCartItem,
	type UpdateCartQuantityRequest,
	updateCartQuantity,
} from "@/lib/api/cart";
import type { CartItem } from "@/lib/types";

export const Route = createFileRoute("/cart")({
	component: Cart,
});

export default function Cart() {
	const {
		userData,
		cartItems,
		setCartItems,
		updateQuantity,
		removeItem,
		clearOrder,
	} = useOrder();

	const navigate = useNavigate();

	useEffect(() => {
		if (!userData) {
			navigate({ to: "/" });
		}
	}, [userData, navigate]);

	const handleBackToMenu = () => {
		navigate({ to: "/menu" });
	};

	const createNewOrder = () => {
		localStorage.clear();
		clearOrder();
		navigate({ to: "/" });
	};

	const updateQuantityMutation = useMutation<
		CartItem,
		Error,
		UpdateCartQuantityRequest
	>({
		mutationFn: updateCartQuantity,
	});

	const deleteItemMutation = useMutation({
		mutationFn: removeCartItem,
	});

	const handleUpdateQuantity = (itemId: string, quantity: number) => {
		const cartItem = cartItems.find((item) => item.id === itemId);
		const prevCartItemQuantity = cartItem?.quantity || 0;
		if (cartItem) {
			updateQuantity(itemId, quantity);
			updateQuantityMutation.mutate(
				{
					id: itemId,
					quantity,
				},
				{
					onError: (error) => {
						updateQuantity(itemId, prevCartItemQuantity);
						console.error("Error updating item quantity:", error);
						toast.error(
							"Failed to update item quantity. Please try again.",
						);
					},
					onSuccess: () => {
						toast.success("Item quantity updated successfully.");
					},
				},
			);
		}
	};

	const handleRemoveItem = (itemId: string) => {
		const item = cartItems.find((ci) => ci.id === itemId);
		if (item) {
			removeItem(itemId);
			deleteItemMutation.mutate(itemId, {
				onError: (error) => {
					setCartItems((prevItems) => [...prevItems, item]);
					console.error("Error removing item:", error);
					toast.error("Failed to remove item. Please try again.");
				},
				onSuccess: () => {
					toast.success("Item removed successfully.");
				},
			});
		}
	};

	const handleProceedToCheckout = () => {
		// navigate({ to: "/checkout" });
	};

	if (!userData) return <Loader variant="catering" />;

	return (
		<main className="min-h-screen">
			<CartPage
				userData={userData}
				cartItems={cartItems}
				onCreateNewOrder={createNewOrder}
				onBack={handleBackToMenu}
				onUpdateQuantity={handleUpdateQuantity}
				onRemoveItem={handleRemoveItem}
				onProceedToCheckout={handleProceedToCheckout}
			/>
		</main>
	);
}
