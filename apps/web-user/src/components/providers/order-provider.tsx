import {
	createContext,
	type ReactNode,
	useContext,
	useEffect,
	useState,
} from "react";
import type { CartItem, UserData } from "@/lib/types";

interface OrderContextType {
	catererId: string | null;
	setCatererId: (id: string | null) => void;
	catererName: string | null;
	setCatererName: (name: string | null) => void;
	userData: UserData | null;
	setUserData: (data: UserData) => void;
	cartItems: CartItem[];
	setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
	updateQuantity: (itemId: string, quantity: number) => void;
	removeItem: (itemId: string) => void;
	clearOrder: () => void;
}

const orderStorageKey = "cater-go-order";

function getStoredOrder() {
	if (typeof window === "undefined") {
		return {
			catererId: null,
			catererName: null,
			userData: null,
			cartItems: [],
		};
	}
	try {
		const stored = localStorage.getItem(orderStorageKey);
		return stored
			? JSON.parse(stored)
			: {
					catererId: null,
					catererName: null,
					userData: null,
					cartItems: [],
				};
	} catch {
		return {
			catererId: null,
			catererName: null,
			userData: null,
			cartItems: [],
		};
	}
}

function setStoredOrder(orderData: {
	catererId: string | null;
	catererName: string | null;
	userData: UserData | null;
	cartItems: CartItem[];
}) {
	if (typeof window !== "undefined") {
		localStorage.setItem(orderStorageKey, JSON.stringify(orderData));
	}
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: ReactNode }) {
	const storedOrder = getStoredOrder();
	const [catererId, setCatererId] = useState<string | null>(
		() => storedOrder.catererId,
	);
	const [catererName, setCatererName] = useState<string | null>(
		() => storedOrder.catererName,
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
			setStoredOrder({ catererId, catererName, userData, cartItems });
		}, 150);
		return () => clearTimeout(timeout);
	}, [catererId, catererName, userData, cartItems]);

	const updateQuantity = (itemId: string, quantity: number) => {
		setCartItems((prev) =>
			prev.map((ci) => (ci.id === itemId ? { ...ci, quantity } : ci)),
		);
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
				catererName,
				setCatererName,
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
	const context = useContext(OrderContext);
	if (!context) {
		throw new Error("useOrder must be used within an OrderProvider");
	}
	return context;
};
