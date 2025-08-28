import { useMemo } from "react";
import type { CartItem } from "@/lib/types";

export const useCartCalculations = (cartItems: CartItem[]) => {
	return useMemo(() => {
		const totalItems = cartItems.reduce(
			(sum, { quantity }) => sum + quantity,
			0,
		);
		const subtotal = cartItems.reduce(
			(sum, { item, quantity }) => sum + item.price * quantity,
			0,
		);
		const deliveryFee = subtotal > 500 ? 0 : 40;
		const taxRate = 0.05;
		const taxes = Math.round(subtotal * taxRate);
		const total = subtotal + deliveryFee + taxes;

		return { totalItems, subtotal, deliveryFee, taxes, total };
	}, [cartItems]);
};
