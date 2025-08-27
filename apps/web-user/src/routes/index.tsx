"use client";

import { createFileRoute } from "@tanstack/react-router";
import { useCallback } from "react";
import { toast } from "sonner";
import { OnboardingFlow } from "@/components/onboarding/onboarding-flow";
import { useOrder } from "@/components/providers/order-provider";
import type { UserData } from "@/lib/types";

export const Route = createFileRoute("/")({
	ssr: false,
	component: App,
});

function App() {
	const { userData, setUserData } = useOrder();

	const onProceedToMenu = useCallback(
		(data: UserData): void => {
			localStorage.setItem("userData", JSON.stringify(data));
			setUserData(data);

			// TODO: Navigate to main menu
			toast.success("Navigating to main menu");
			console.log("Navigating to main menu with user data:", data);
		},
		[setUserData],
	);

	return (
		<div className="h-screen w-screen">
			<OnboardingFlow
				userData={userData}
				onProceedToMenu={onProceedToMenu}
			/>
		</div>
	);
}
