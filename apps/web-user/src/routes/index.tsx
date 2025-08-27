"use client";

import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useCallback } from "react";
import { OnboardingFlow } from "@/components/onboarding/onboarding-flow";
import { useOrder } from "@/components/providers/order-provider";
import type { UserData } from "@/lib/types";

export const Route = createFileRoute("/")({
	ssr: false,
	component: App,
});

function App() {
	const { userData, setUserData } = useOrder();
	const navigate = useNavigate();

	const onProceedToMenu = useCallback(
		(data: UserData): void => {
			localStorage.setItem("userData", JSON.stringify(data));
			setUserData(data);
			navigate({ to: "/menu" });
		},
		[setUserData, navigate],
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
