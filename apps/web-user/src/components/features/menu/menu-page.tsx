import { useMutation, useQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import {
	type CreateCartItemRequest,
	createCartItem,
	type UpdateCartQuantityRequest,
	updateCartQuantity,
} from "@/lib/api/cart";
import { categoriesQueryOptions } from "@/lib/api/categories";
import { commonAnimations } from "@/lib/common-animations";
import {
	handleMutationError,
	handleMutationSuccess,
} from "@/lib/error-handlers";
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
	hidePrices?: boolean;
	onUpdateUserData?: (
		numberOfPeople: number,
		selectedDate: Date | undefined,
	) => void;
	blockedDates?: Date[];
	isUpdatingUserData?: boolean;
}

export function MenuPage({
	userData,
	menuItems,
	cartItems,
	setCartItems,
	updateQuantity,
	onBack,
	onProceedToCart,
	hidePrices = false,
	onUpdateUserData,
	blockedDates = [],
	isUpdatingUserData = false,
}: MenuPageProps) {
	const [activeCategoryId, setActiveCategoryId] = useState("all");

	// Fetch categories from the API
	const { data: fetchedCategories = [] } = useQuery(
		categoriesQueryOptions(userData.adminId || null),
	);

	// Combine "All Items" with fetched categories
	const categories = useMemo(() => {
		const allItemsCategory = {
			id: "all",
			name: "All Items",
			icon: "🍽️",
			order: -1,
		};
		return [allItemsCategory, ...fetchedCategories];
	}, [fetchedCategories]);

	// Get the active category name for filtering menu items
	const activeCategoryName = useMemo(() => {
		if (activeCategoryId === "all") return "all";
		const category = categories.find((c) => c.id === activeCategoryId);
		return category?.name || "all";
	}, [activeCategoryId, categories]);

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
					onError: (error) => {
						updateQuantity(item.id, prevQuantity);
						handleMutationError(
							error,
							"Failed to update item quantity",
						);
					},
					onSuccess: () => {
						handleMutationSuccess(
							"Item quantity updated successfully",
						);
					},
				},
			);
		}

		if (cartItem === undefined) {
			// Create
			addToCartMutation.mutate(
				{ menuId: item.id, quantity },
				{
					onError: (error) => {
						setCartItems(prevCartItems);
						handleMutationError(
							error,
							"Failed to add item to cart",
						);
					},
					onSuccess(data, variables, _) {
						setCartItems((prev) => [
							...prev,
							{ id: data.id, item, quantity: variables.quantity },
						]);
						handleMutationSuccess(
							`${item.name} added to cart`,
							`Quantity: ${quantity}`,
							{
								label: "View Cart",
								onClick: () => onProceedToCart(cartItems),
							},
						);
					},
				},
			);
		}
	};

	return (
		<motion.div
			variants={commonAnimations.container}
			initial="hidden"
			animate="show"
			className="min-h-screen bg-background"
		>
			{/* Header */}
			<motion.div variants={commonAnimations.item}>
				<MenuHeader
					userData={userData}
					onBack={onBack}
					cartButton={
						<CartButton
							cartItems={cartItems}
							onProceedToCart={onProceedToCart}
						/>
					}
					onUpdateUserData={onUpdateUserData}
					blockedDates={blockedDates}
					isUpdating={isUpdatingUserData}
				/>
			</motion.div>

			{/* Welcome Banner */}
			<motion.div variants={commonAnimations.item}>
				<WelcomeBanner userData={userData} />
			</motion.div>

			{/* Categories */}
			<motion.div variants={commonAnimations.item}>
				<MenuCategories
					categories={categories}
					activeCategory={activeCategoryId}
					onCategoryChange={setActiveCategoryId}
				/>
			</motion.div>

			{/* Menu Items */}
			<motion.div variants={commonAnimations.item}>
				<MenuItems
					activeCategory={activeCategoryName}
					menuItems={menuItems}
					cartItems={cartItems}
					onAddToCart={handleAddToCart}
					numberOfPeople={userData.numberOfPeople}
					hidePrices={hidePrices}
				/>
			</motion.div>

			{/* Floating Cart Button */}
			<motion.div variants={commonAnimations.item}>
				<FloatingCartButton
					cartItems={cartItems}
					onProceedToCart={onProceedToCart}
				/>
			</motion.div>
		</motion.div>
	);
}
