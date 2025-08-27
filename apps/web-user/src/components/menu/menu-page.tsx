import { useState } from "react";
import type { CartItems, MenuItem, UserData } from "@/lib/types";
import { CartButton, FloatingCartButton } from "./cart-components";
import { MenuCategories } from "./menu-categories";
import { MenuHeader } from "./menu-header";
import { MenuItems } from "./menu-items";
import { WelcomeBanner } from "./welcome-banner";

interface MenuPageProps {
	userData: UserData;
	menuItems: MenuItem[];
	onBack: () => void;
	onProceedToCart: (cartItems: CartItems) => void;
}

export function MenuPage({
	userData,
	onBack,
	onProceedToCart,
	menuItems,
}: MenuPageProps) {
	const [activeCategory, setActiveCategory] = useState("all");
	const [cartItems, setCartItems] = useState<CartItems>({});

	const handleAddToCart = (item: MenuItem, quantity: number) => {
		setCartItems((prev) => ({
			...prev,
			[item.id]: {
				item,
				quantity: (prev[item.id]?.quantity || 0) + quantity,
			},
		}));
	};

	const cartItemCounts = Object.fromEntries(
		Object.entries(cartItems).map(([id, { quantity }]) => [id, quantity]),
	);

	return (
		<div className="min-h-screen bg-background">
			{/* Header */}
			<MenuHeader
				userData={userData}
				onBack={onBack}
				cartButton={
					<CartButton
						cartItems={cartItems}
						onProceedToCart={onProceedToCart}
					/>
				}
			/>

			{/* Welcome Banner */}
			<WelcomeBanner userData={userData} />

			{/* Categories */}
			<MenuCategories
				activeCategory={activeCategory}
				onCategoryChange={setActiveCategory}
			/>

			{/* Menu Items */}
			<MenuItems
				activeCategory={activeCategory}
				menuItems={menuItems}
				onAddToCart={handleAddToCart}
				cartItems={cartItemCounts}
				numberOfPeople={userData.numberOfPeople}
			/>

			{/* Floating Cart Button */}
			<FloatingCartButton
				cartItems={cartItems}
				onProceedToCart={onProceedToCart}
			/>
		</div>
	);
}
