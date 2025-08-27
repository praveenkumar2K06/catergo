import { clientOnly, createIsomorphicFn } from "@tanstack/react-start";
import { createContext, type ReactNode, use, useEffect, useState } from "react";
import type { CartItems, UserData } from "@/lib/types";

interface OrderContextType {
	userData: UserData | null;
	setUserData: (data: UserData) => void;
	cartItems: CartItems;
	setCartItems: (items: CartItems) => void;
	updateQuantity: (itemId: string, quantity: number) => void;
	removeItem: (itemId: string) => void;
	clearOrder: () => void;
}

const orderStorageKey = "cater-go-order";

const getStoredOrder = createIsomorphicFn()
	.server(() => ({ userData: null, cartItems: {} }))
	.client(() => {
		try {
			const stored = localStorage.getItem(orderStorageKey);
			return stored
				? JSON.parse(stored)
				: { userData: null, cartItems: {} };
		} catch {
			return { userData: null, cartItems: {} };
		}
	});

const setStoredOrder = clientOnly(
	(orderData: { userData: UserData | null; cartItems: CartItems }) => {
		localStorage.setItem(orderStorageKey, JSON.stringify(orderData));
	},
);

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: ReactNode }) {
	const storedOrder = getStoredOrder();
	const [userData, setUserData] = useState<UserData | null>(
		storedOrder.userData,
	);
	const [cartItems, setCartItems] = useState<CartItems>(
		storedOrder.cartItems,
	);

	// Update localStorage whenever order data changes
	useEffect(() => {
		setStoredOrder({ userData, cartItems });
	}, [userData, cartItems]);

	const updateQuantity = (itemId: string, quantity: number) => {
		setCartItems((prev) => ({
			...prev,
			[itemId]: { ...prev[itemId], quantity },
		}));
	};

	const removeItem = (itemId: string) => {
		setCartItems((prev) => {
			const newItems = { ...prev };
			delete newItems[itemId];
			return newItems;
		});
	};

	const clearOrder = () => {
		setUserData(null);
		setCartItems({});
	};

	return (
		<OrderContext
			value={{
				userData,
				setUserData,
				cartItems,
				setCartItems,
				updateQuantity,
				removeItem,
				clearOrder,
			}}
		>
			{children}
		</OrderContext>
	);
}

export const useOrder = () => {
	const context = use(OrderContext);
	if (!context) {
		throw new Error("useOrder must be used within an OrderProvider");
	}
	return context;
};
