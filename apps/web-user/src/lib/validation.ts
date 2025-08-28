import { APP_CONSTANTS } from "@/lib/constants";
import type { CartItem, MenuItem, UserData } from "@/lib/types";

export const validateCartQuantity = (quantity: number): boolean => {
	return (
		Number.isInteger(quantity) &&
		quantity >= APP_CONSTANTS.CART.MIN_QUANTITY &&
		quantity <= APP_CONSTANTS.CART.MAX_QUANTITY
	);
};

export const validateMenuItem = (item: MenuItem): boolean => {
	return !!(item.id && item.name && item.price > 0 && item.category && true);
};

export const validateCartItem = (cartItem: CartItem): boolean => {
	return !!(
		cartItem.id &&
		validateMenuItem(cartItem.item) &&
		validateCartQuantity(cartItem.quantity)
	);
};

export const validateUserData = (userData: UserData): boolean => {
	return !!(
		userData.name &&
		userData.phone &&
		userData.address &&
		userData.pincode &&
		userData.numberOfPeople > 0 &&
		userData.selectedDate
	);
};

export const sanitizeQuantity = (quantity: number): number => {
	const parsed = Number.parseInt(String(quantity), 10);
	if (Number.isNaN(parsed)) return APP_CONSTANTS.CART.MIN_QUANTITY;

	return Math.max(
		APP_CONSTANTS.CART.MIN_QUANTITY,
		Math.min(parsed, APP_CONSTANTS.CART.MAX_QUANTITY),
	);
};

export const formatPrice = (price: number, currency?: string): string => {
	if (Number.isNaN(price))
		return `${currency || APP_CONSTANTS.CURRENCY.SYMBOL}0`;
	return `${currency || APP_CONSTANTS.CURRENCY.SYMBOL}${price.toFixed(0)}`;
};
