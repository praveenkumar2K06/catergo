import { motion, type Transition } from "motion/react";
import { useState } from "react";
import type { CartItem, MenuItem } from "@/lib/types";
import { MenuItemCard } from "./menu-item-card";

interface MenuItemsProps {
	activeCategory: string;
	menuItems: MenuItem[];
	onAddToCart: (item: MenuItem, quantity: number) => void;
	cartItems: CartItem[];
	numberOfPeople: number;
	hidePrices?: boolean;
}

export function MenuItems({
	activeCategory,
	menuItems,
	onAddToCart,
	cartItems,
	numberOfPeople,
	hidePrices = false,
}: MenuItemsProps) {
	const [quantities, setQuantities] = useState<{ [key: string]: number }>({});

	const filteredItems =
		activeCategory === "all"
			? menuItems
			: menuItems.filter((item) => item.category === activeCategory);

	const getSuggestedQuantity = (itemId: string) => {
		const item = menuItems.find((item) => item.id === itemId);
		if (!item) return 1;
		return Math.max(1, Math.ceil(numberOfPeople / item.qtyPerUnit));
	};

	const getQuantity = (itemId: string) => {
		return quantities[itemId] || getSuggestedQuantity(itemId);
	};

	const updateQuantity = (itemId: string, newQuantity: number) => {
		if (newQuantity < 1) return;
		setQuantities((prev) => ({ ...prev, [itemId]: newQuantity }));
	};

	const handleAddToCart = (item: MenuItem) => {
		const quantity = getQuantity(item.id);
		onAddToCart(item, quantity);
	};

	const containerVariants = {
		hidden: {},
		show: { transition: { staggerChildren: 0.06 } },
	};

	const springTransition: Transition = {
		type: "spring",
		damping: 20,
		stiffness: 300,
		duration: 0.3,
	};

	const itemVariants = {
		hidden: { opacity: 0, y: 8, scale: 0.98 },
		show: {
			opacity: 1,
			y: 0,
			scale: 1,
			transition: springTransition,
		},
	};

	return (
		<motion.div
			className="grid grid-cols-1 gap-6 p-4 md:grid-cols-2 lg:grid-cols-3"
			variants={containerVariants}
			initial="hidden"
			animate="show"
		>
			{filteredItems.map((item) => (
				<motion.div key={item.id} layout variants={itemVariants}>
					<MenuItemCard
						item={item}
						quantity={getQuantity(item.id)}
						suggestedQuantity={getSuggestedQuantity(item.id)}
						onQuantityChange={(newQuantity) =>
							updateQuantity(item.id, newQuantity)
						}
						onAddToCart={() => handleAddToCart(item)}
						cartQuantity={
							cartItems.find((ci) => ci.item.id === item.id)
								?.quantity || 0
						}
						numberOfPeople={numberOfPeople}
						hidePrices={hidePrices}
					/>
				</motion.div>
			))}
		</motion.div>
	);
}
