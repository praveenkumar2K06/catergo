"use client";

import { useState } from "react";
import type { MenuItem } from "@/lib/types";
import { MenuItemCard } from "./menu-item-card";

interface MenuItemsProps {
	activeCategory: string;
	menuItems: MenuItem[];
	onAddToCart: (item: MenuItem, quantity: number) => void;
	cartItems: { [key: string]: number };
	numberOfPeople: number;
}

export function MenuItems({
	activeCategory,
	menuItems,
	onAddToCart,
	cartItems,
	numberOfPeople,
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

	return (
		<div className="grid grid-cols-1 gap-6 p-4 md:grid-cols-2 lg:grid-cols-3">
			{filteredItems.map((item) => (
				<MenuItemCard
					key={item.id}
					item={item}
					quantity={getQuantity(item.id)}
					suggestedQuantity={getSuggestedQuantity(item.id)}
					onQuantityChange={(newQuantity) =>
						updateQuantity(item.id, newQuantity)
					}
					onAddToCart={() => handleAddToCart(item)}
					cartQuantity={cartItems[item.id]}
					numberOfPeople={numberOfPeople}
				/>
			))}
		</div>
	);
}
