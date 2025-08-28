import { useMemo } from "react";
import { APP_CONSTANTS } from "@/lib/constants";
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
		const deliveryFee =
			subtotal > APP_CONSTANTS.CART.FREE_DELIVERY_THRESHOLD
				? 0
				: APP_CONSTANTS.CART.DELIVERY_FEE;
		const taxes = Math.round(subtotal * APP_CONSTANTS.CART.TAX_RATE);
		const total = subtotal + deliveryFee + taxes;

		return { totalItems, subtotal, deliveryFee, taxes, total };
	}, [cartItems]);
};
