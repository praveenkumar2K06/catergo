import { useMutation } from "@tanstack/react-query";
import { motion, type Variants } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import {
	type CreateCartItemRequest,
	createCartItem,
	type UpdateCartQuantityRequest,
	updateCartQuantity,
} from "@/lib/api/cart";
import type { CartItem, MenuItem, UserData } from "@/lib/types";
import { CartButton, FloatingCartButton } from "./cart-components";
import { MenuCategories } from "./menu-categories";
import { MenuHeader } from "./menu-header";
import { MenuItems } from "./menu-items";
import { WelcomeBanner } from "./welcome-banner";

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

	const container = {
		hidden: { opacity: 0, y: 8 },
		show: {
			opacity: 1,
			y: 0,
			transition: {
				staggerChildren: 0.08,
				when: "beforeChildren",
			},
		},
	} as Variants;

	const item = {
		hidden: { opacity: 0, y: 6, scale: 0.995 },
		show: {
			opacity: 1,
			y: 0,
			scale: 1,
			transition: {
				type: "spring",
				stiffness: 300,
				damping: 24,
			},
		},
	} as Variants;

	return (
		<motion.div
			variants={container}
			initial="hidden"
			animate="show"
			className="min-h-screen bg-background"
		>
			{/* Header */}
			<motion.div variants={item}>
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
			<motion.div variants={item}>
				<WelcomeBanner userData={userData} />
			</motion.div>

			{/* Categories */}
			<motion.div variants={item}>
				<MenuCategories
					activeCategory={activeCategory}
					onCategoryChange={setActiveCategory}
				/>
			</motion.div>

			{/* Menu Items */}
			<motion.div variants={item}>
				<MenuItems
					activeCategory={activeCategory}
					menuItems={menuItems}
					cartItems={cartItems}
					onAddToCart={handleAddToCart}
					numberOfPeople={userData.numberOfPeople}
				/>
			</motion.div>

			{/* Floating Cart Button */}
			<motion.div variants={item}>
				<FloatingCartButton
					cartItems={cartItems}
					onProceedToCart={onProceedToCart}
				/>
			</motion.div>
		</motion.div>
	);
}
