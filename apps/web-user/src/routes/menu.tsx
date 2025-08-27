import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import ErrorDisplay from "@/components/error";
import Loader from "@/components/loader";
import { MenuPage } from "@/components/menu/menu-page";
import { useOrder } from "@/components/providers/order-provider";
import { menuQueryOptions } from "@/lib/api/menu-items";
import type { CartItems } from "@/lib/types";

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
	const { userData, setCartItems } = useOrder();
	const {
		data: menuItems,
		isPending,
		isError,
		refetch,
	} = useQuery(menuQueryOptions);

	const handleBackToOnboarding = () => {
		navigate({ to: "/" });
	};

	const handleProceedToCart = (items: CartItems) => {
		setCartItems(items);

		//TODO: Go to Cart
	};

	useEffect(() => {
		if (!userData) {
			navigate({ to: "/" });
		}
	}, [userData, navigate]);

	if (!userData || isPending) return <Loader variant="catering" />;

	if (isError) return <ErrorDisplay onRetry={refetch} showRetry />;

	return (
		<main className="min-h-screen">
			<MenuPage
				userData={userData}
				menuItems={menuItems.data}
				onBack={handleBackToOnboarding}
				onProceedToCart={handleProceedToCart}
			/>
		</main>
	);
}
