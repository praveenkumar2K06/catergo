import { useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo } from "react";
import { toast } from "sonner";
import { CartPage } from "@/components/features/cart/cart-page";
import { useOrder } from "@/components/providers/order-provider";
import ErrorDisplay from "@/components/shared/layout/error";
import Loader from "@/components/shared/layout/loader";
import { useSettings } from "@/hooks/use-settings";
import { removeCartItem, updateCartQuantity } from "@/lib/api/cart";
import { createEvent } from "@/lib/api/event";
import { getUnavailableDates } from "@/lib/api/settings";
import { updateUser } from "@/lib/api/users";
import {
	handleMutationError,
	handleMutationSuccess,
} from "@/lib/error-handlers";
import type { UserData } from "@/lib/types";

export const Route = createFileRoute("/cart")({
	component: Cart,
});

export default function Cart() {
	const {
		userData,
		catererId,
		cartItems,
		setCartItems,
		updateQuantity,
		removeItem,
		clearOrder,
		setUserData,
	} = useOrder();

	const { data: settings, error } = useSettings(userData?.adminId || "");

	const { data: unavailableDatesData } = useQuery({
		queryKey: ["unavailableDates", userData?.adminId],
		queryFn: () => getUnavailableDates(userData?.adminId || ""),
		enabled: !!userData?.adminId,
	});

	const blockedDates = useMemo(() => {
		if (!unavailableDatesData) return [];
		return unavailableDatesData.unavailableDates.map((d) => new Date(d));
	}, [unavailableDatesData]);

	const navigate = useNavigate();

	useEffect(() => {
		if (!userData) {
			navigate({ to: "/" });
		}
	}, [userData, navigate]);

	const handleBackToMenu = () => {
		navigate({ to: "/menu" });
	};

	const createNewOrder = () => {
		localStorage.clear();
		clearOrder();
		navigate({ to: "/" });
	};

	const updateUserMutation = useMutation<UserData, Error, UserData>({
		mutationFn: updateUser.bind(null, userData?.id || ""),
		onError: (error) => {
			handleMutationError(error, "Failed to update user details");
		},
		onSuccess: (data) => {
			setUserData(data);
			handleMutationSuccess("User details updated successfully");
		},
	});

	const handleUpdateUserData = (
		numberOfPeople: number,
		selectedDate: Date | undefined,
	) => {
		if (userData) {
			updateUserMutation.mutate({
				...userData,
				numberOfPeople,
				selectedDate,
			});
		}
	};

	const updateQuantityMutation = useMutation({
		mutationFn: updateCartQuantity,
	});

	const deleteItemMutation = useMutation({
		mutationFn: removeCartItem,
	});

	const createEventMutation = useMutation({
		mutationFn: createEvent,
		onError(error) {
			handleMutationError(
				error,
				"Failed to create event. Please try again.",
			);
		},
		onSuccess() {
			handleMutationSuccess("Event created successfully.");
		},
	});

	const handleUpdateQuantity = (itemId: string, quantity: number) => {
		const cartItem = cartItems.find((item) => item.id === itemId);
		const prevCartItemQuantity = cartItem?.quantity || 0;
		if (cartItem) {
			updateQuantity(itemId, quantity);
			updateQuantityMutation.mutate(
				{
					id: itemId,
					quantity,
				},
				{
					onError: (error) => {
						updateQuantity(itemId, prevCartItemQuantity);
						console.error("Error updating item quantity:", error);
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
	};

	const handleRemoveItem = (itemId: string) => {
		const item = cartItems.find((ci) => ci.id === itemId);
		if (item) {
			removeItem(itemId);
			deleteItemMutation.mutate(itemId, {
				onError: (error) => {
					setCartItems((prevItems) => [...prevItems, item]);
					console.error("Error removing item:", error);
					toast.error("Failed to remove item. Please try again.");
				},
				onSuccess: () => {
					toast.success("Item removed successfully.");
				},
			});
		}
	};

	const handleProceedToCheckout = (
		eventName: string,
		eventDescription: string,
	) => {
		if (userData?.id && userData.selectedDate && catererId) {
			const selectedDate = new Date(userData.selectedDate);
			createEventMutation.mutate({
				userId: userData.id,
				adminId: catererId,
				name: eventName || "New Event",
				date: selectedDate.toISOString(),
				...(eventDescription && { description: eventDescription }),
			});
		}
	};

	if (!userData) return <Loader variant="catering" />;

	if (error) {
		return <ErrorDisplay type="server" className="h-max" />;
	}

	return (
		<main className="min-h-screen">
			<CartPage
				userData={userData}
				cartItems={cartItems}
				onCreateNewOrder={createNewOrder}
				onBack={handleBackToMenu}
				onUpdateQuantity={handleUpdateQuantity}
				onRemoveItem={handleRemoveItem}
				settings={settings}
				onProceedToCheckout={handleProceedToCheckout}
				isLoading={createEventMutation.isPending}
				onUpdateUserData={handleUpdateUserData}
				blockedDates={blockedDates}
				isUpdatingUserData={updateUserMutation.isPending}
			/>
		</main>
	);
}
