import { useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo } from "react";
import { MenuPage } from "@/components/features/menu/menu-page";
import { useOrder } from "@/components/providers/order-provider";
import ErrorDisplay from "@/components/shared/layout/error";
import Loader from "@/components/shared/layout/loader";
import { useSettings } from "@/hooks/use-settings";
import { menuQueryOptions } from "@/lib/api/menu-items";
import { getUnavailableDates } from "@/lib/api/settings";
import { updateUser } from "@/lib/api/users";
import {
	handleMutationError,
	handleMutationSuccess,
} from "@/lib/error-handlers";
import type { CartItem, UserData } from "@/lib/types";

export const Route = createFileRoute("/menu")({
	component: RouteComponent,
});

function RouteComponent() {
	const navigate = useNavigate();
	const {
		userData,
		cartItems,
		setCartItems,
		updateQuantity,
		catererId,
		setUserData,
	} = useOrder();
	const {
		data: menuItems,
		isPending,
		isError,
		refetch,
	} = useQuery(menuQueryOptions(catererId));
	const { data: settings } = useSettings(userData?.adminId || "");

	const { data: unavailableDatesData } = useQuery({
		queryKey: ["unavailableDates", userData?.adminId],
		queryFn: () => getUnavailableDates(userData?.adminId || ""),
		enabled: !!userData?.adminId,
	});

	const blockedDates = useMemo(() => {
		if (!unavailableDatesData) return [];
		return unavailableDatesData.unavailableDates.map((d) => new Date(d));
	}, [unavailableDatesData]);

	useEffect(() => {
		if (!userData) {
			navigate({ to: "/" });
		}
	}, [userData, navigate]);

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

	const handleBackToOnboarding = () => {
		navigate({ to: "/" });
	};

	const handleProceedToCart = (items: CartItem[]) => {
		setCartItems(items);

		navigate({ to: "/cart" });
	};

	if (!userData || isPending) return <Loader variant="catering" />;

	if (isError) return <ErrorDisplay onRetry={refetch} showRetry />;

	return (
		<main className="min-h-screen">
			<MenuPage
				userData={userData}
				menuItems={menuItems.data}
				cartItems={cartItems}
				setCartItems={setCartItems}
				updateQuantity={updateQuantity}
				onBack={handleBackToOnboarding}
				onProceedToCart={handleProceedToCart}
				hidePrices={settings?.hidePrices ?? false}
				onUpdateUserData={handleUpdateUserData}
				blockedDates={blockedDates}
				isUpdatingUserData={updateUserMutation.isPending}
			/>
		</main>
	);
}
