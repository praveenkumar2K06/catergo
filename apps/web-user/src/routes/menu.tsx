import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { MenuPage } from "@/components/features/menu/menu-page";
import { useOrder } from "@/components/providers/order-provider";
import ErrorDisplay from "@/components/shared/layout/error";
import Loader from "@/components/shared/layout/loader";
import { menuQueryOptions } from "@/lib/api/menu-items";
import type { CartItem } from "@/lib/types";

export const Route = createFileRoute("/menu")({
	loader: async ({ context }) => {
		await context.queryClient.ensureQueryData(menuQueryOptions);
	},
	pendingComponent: () => <Loader variant="catering" />,
	errorComponent: () => <ErrorDisplay type="notFound" />,
	component: RouteComponent,
	ssr: false,
});

function RouteComponent() {
	const navigate = useNavigate();
	const { userData, cartItems, setCartItems, updateQuantity } = useOrder();
	const {
		data: menuItems,
		isPending,
		isError,
		refetch,
	} = useQuery(menuQueryOptions);

	useEffect(() => {
		if (!userData) {
			navigate({ to: "/" });
		}
	}, [userData, navigate]);

	const handleBackToOnboarding = () => {
		navigate({ to: "/" });
	};

	const handleProceedToCart = (items: CartItem[]) => {
		setCartItems(items);

		//TODO: Go to Cart
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
			/>
		</main>
	);
}
