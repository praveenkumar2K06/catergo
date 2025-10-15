import { useMemo } from "react";
import { APP_CONSTANTS } from "@/lib/constants";
import type { CartItem } from "@/lib/types";
import { Settings } from "@/lib/api/settings";

export const useCartCalculations = (cartItems: CartItem[], settings: Settings | undefined, numberOfPeople: number) => {
	return useMemo(() => {
		const totalItems = cartItems.reduce(
			(sum, { quantity }) => sum + quantity,
			0,
		);
		const subtotal = cartItems.reduce(
			(sum, { item, quantity }) => sum + item.price * quantity,
			0,
		);

		const discount = settings?.bulkOrderDiscount || 0;
		const minPersons = settings?.bulkOrderMinPersons || 0;
		if (minPersons > 0 && numberOfPeople >= minPersons) {
			const discountAmount = Math.round((subtotal * discount) / 100);
			const discountedSubtotal = subtotal - discountAmount;
			const deliveryFee =
				discountedSubtotal > APP_CONSTANTS.CART.FREE_DELIVERY_THRESHOLD
					? 0
					: APP_CONSTANTS.CART.DELIVERY_FEE;
			const taxes = Math.round(discountedSubtotal * APP_CONSTANTS.CART.TAX_RATE);
			const total = discountedSubtotal + deliveryFee + taxes;

			return { totalItems, subtotal: discountedSubtotal, deliveryFee, taxes, total };
		}
		const deliveryFee =
			subtotal > APP_CONSTANTS.CART.FREE_DELIVERY_THRESHOLD
				? 0
				: APP_CONSTANTS.CART.DELIVERY_FEE;
		const taxes = Math.round(subtotal * APP_CONSTANTS.CART.TAX_RATE);
		const total = subtotal + deliveryFee + taxes;

		return { totalItems, subtotal, deliveryFee, taxes, total };
	}, [cartItems, settings]);
};
