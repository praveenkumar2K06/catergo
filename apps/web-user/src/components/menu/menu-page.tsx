import { useMutation } from "@tanstack/react-query";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { containerPage, itemPage } from "@/lib/animations";
import {
	type CreateCartItemRequest,
	createCartItem,
	type UpdateCartQuantityRequest,
	updateCartQuantity,
} from "@/lib/api/cart";
import type { CartItem, MenuItem, UserData } from "@/lib/types";
import {
	CartButton,
	FloatingCartButton,
} from "./components/cart/cart-components";
import { MenuHeader } from "./components/header/menu-header";
import { WelcomeBanner } from "./components/header/welcome-banner";
import { MenuCategories } from "./components/items/menu-categories";
import { MenuItems } from "./components/items/menu-items";

interface MenuPageProps {
	userData: UserData;
	menuItems: MenuItem[];
	cartItems: CartItem[];
	setCartItems: (value: React.SetStateAction<CartItem[]>) => void;
	updateQuantity: (itemId: string, quantity: number) => void;
	onBack: () => void;
	onProceedToCart: (cartItems: CartItem[]) => void;
}

export function MenuPage({
	userData,
	menuItems,
	cartItems,
	setCartItems,
	updateQuantity,
	onBack,
	onProceedToCart,
}: MenuPageProps) {
	const [activeCategory, setActiveCategory] = useState("all");

	const addToCartMutation = useMutation<
		CartItem,
		Error,
		Omit<CreateCartItemRequest, "userId">
	>({
		mutationFn: createCartItem.bind(null, userData?.id || ""),
	});

	const updateQuantityMutation = useMutation<
		CartItem,
		Error,
		UpdateCartQuantityRequest
	>({
		mutationFn: updateCartQuantity,
	});

	const handleAddToCart = (item: MenuItem, quantity: number) => {
		const prevCartItems = cartItems;
		const cartItem = cartItems.find((ci) => ci.item.id === item.id);

		if (cartItem?.id) {
			// Update
			const prevQuantity = cartItem.quantity;
			const newQuantity = prevQuantity + quantity;
			updateQuantity(cartItem.id, newQuantity);
			updateQuantityMutation.mutate(
				{
					id: cartItem.id,
					quantity: newQuantity,
				},
				{
					onError: () => {
						updateQuantity(item.id, prevQuantity);
						toast.error(
							"Failed to update item quantity. Please try again.",
						);
					},
					onSuccess: () => {
						toast.success("Item quantity updated successfully.");
					},
				},
			);
		}

		if (cartItem === undefined) {
			// Create
			addToCartMutation.mutate(
				{ menuId: item.id, quantity },
				{
					onError: () => {
						setCartItems(prevCartItems);
						toast.error(
							"Failed to add item to cart. Please try again.",
						);
					},
					onSuccess(data, variables, _) {
						setCartItems((prev) => [
							...prev,
							{ id: data.id, item, quantity: variables.quantity },
						]);
						toast.success("Item added to cart successfully.");
					},
				},
			);
		}
	};

	return (
		<motion.div
			variants={containerPage}
			initial="hidden"
			animate="show"
			className="min-h-screen bg-background"
		>
			{/* Header */}
			<motion.div variants={itemPage}>
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
			</motion.div>

			{/* Welcome Banner */}
			<motion.div variants={itemPage}>
				<WelcomeBanner userData={userData} />
			</motion.div>

			{/* Categories */}
			<motion.div variants={itemPage}>
				<MenuCategories
					activeCategory={activeCategory}
					onCategoryChange={setActiveCategory}
				/>
			</motion.div>

			{/* Menu Items */}
			<motion.div variants={itemPage}>
				<MenuItems
					activeCategory={activeCategory}
					menuItems={menuItems}
					cartItems={cartItems}
					onAddToCart={handleAddToCart}
					numberOfPeople={userData.numberOfPeople}
				/>
			</motion.div>

			{/* Floating Cart Button */}
			<motion.div variants={itemPage}>
				<FloatingCartButton
					cartItems={cartItems}
					onProceedToCart={onProceedToCart}
				/>
			</motion.div>
		</motion.div>
	);
}
