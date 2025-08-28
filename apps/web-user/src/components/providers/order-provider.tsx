import { clientOnly, createIsomorphicFn } from "@tanstack/react-start";
import { createContext, type ReactNode, use, useEffect, useState } from "react";
import type { CartItem, UserData } from "@/lib/types";

interface OrderContextType {
	userData: UserData | null;
	setUserData: (data: UserData) => void;
	cartItems: CartItem[];
	setCartItems: (value: React.SetStateAction<CartItem[]>) => void;
	updateQuantity: (itemId: string, quantity: number) => void;
	removeItem: (itemId: string) => void;
	clearOrder: () => void;
}

const orderStorageKey = "cater-go-order";

const getStoredOrder = createIsomorphicFn()
	.server(() => ({ userData: null, cartItems: [] }))
	.client(() => {
		try {
			const stored = localStorage.getItem(orderStorageKey);
			return stored
				? JSON.parse(stored)
				: { userData: null, cartItems: [] };
		} catch {
			return { userData: null, cartItems: [] };
		}
	});

const setStoredOrder = clientOnly(
	(orderData: { userData: UserData | null; cartItems: CartItem[] }) => {
		localStorage.setItem(orderStorageKey, JSON.stringify(orderData));
	},
);

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: ReactNode }) {
	const storedOrder = getStoredOrder();
	const [userData, setUserData] = useState<UserData | null>(
		storedOrder.userData,
	);
	const [cartItems, setCartItems] = useState<CartItem[]>(
		storedOrder.cartItems,
	);

	// Update localStorage whenever order data changes
	useEffect(() => {
		setStoredOrder({ userData, cartItems });
	}, [userData, cartItems]);

	const updateQuantity = (itemId: string, quantity: number) => {
		const cartItem = cartItems.find((ci) => ci.id === itemId);
		if (cartItem) {
			setCartItems((prev) =>
				prev.map((ci) => (ci.id === itemId ? { ...ci, quantity } : ci)),
			);
		}
	};

	const removeItem = (itemId: string) => {
		setCartItems((prev) => prev.filter((ci) => ci.id !== itemId));
	};

	const clearOrder = () => {
		setUserData(null);
		setCartItems([]);
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
