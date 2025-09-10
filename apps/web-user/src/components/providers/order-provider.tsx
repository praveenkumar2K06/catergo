import { clientOnly, createIsomorphicFn } from "@tanstack/react-start";
import { createContext, type ReactNode, use, useEffect, useState } from "react";
import type { CartItem, UserData } from "@/lib/types";

interface OrderContextType {
	catererId: string | null;
	setCatererId: (id: string | null) => void;
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
	.server(() => ({ catererId: null, userData: null, cartItems: [] }))
	.client(() => {
		try {
			const stored = localStorage.getItem(orderStorageKey);
			return stored
				? JSON.parse(stored)
				: { catererId: null, userData: null, cartItems: [] };
		} catch {
			return { catererId: null, userData: null, cartItems: [] };
		}
	});

const setStoredOrder = clientOnly(
	(orderData: {
		catererId: string | null;
		userData: UserData | null;
		cartItems: CartItem[];
	}) => {
		localStorage.setItem(orderStorageKey, JSON.stringify(orderData));
	},
);

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: ReactNode }) {
	const storedOrder = getStoredOrder();
	const [catererId, setCatererId] = useState<string | null>(
		() => storedOrder.catererId,
	);
	const [userData, setUserData] = useState<UserData | null>(
		() => storedOrder.userData,
	);
	const [cartItems, setCartItems] = useState<CartItem[]>(
		() => storedOrder.cartItems,
	);

	// Update localStorage whenever order data changes
	useEffect(() => {
		const timeout = setTimeout(() => {
			setStoredOrder({ catererId, userData, cartItems });
		}, 150);
		return () => clearTimeout(timeout);
	}, [catererId, userData, cartItems]);

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
		setCatererId(null);
		setUserData(null);
		setCartItems([]);
	};

	return (
		<OrderContext.Provider
			value={{
				catererId,
				setCatererId,
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
		</OrderContext.Provider>
	);
}

export const useOrder = () => {
	const context = use(OrderContext);
	if (!context) {
		throw new Error("useOrder must be used within an OrderProvider");
	}
	return context;
};
