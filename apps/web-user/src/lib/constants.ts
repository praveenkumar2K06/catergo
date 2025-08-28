export const APP_CONSTANTS = {
	CART: {
		FREE_DELIVERY_THRESHOLD: 500,
		DELIVERY_FEE: 40,
		TAX_RATE: 0.05,
		MAX_QUANTITY: 99,
		MIN_QUANTITY: 1,
	},
	CURRENCY: {
		SYMBOL: "₹",
		LOCALE: "en-IN",
	},
	IMAGES: {
		MENU_ITEM_FALLBACK: "https://placehold.co/600x400/png",
		CART_ITEM_FALLBACK: "https://placehold.co/100x100/png",
	},
} as const;
