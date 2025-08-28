"use client";

import { useMutation } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useCallback } from "react";
import { toast } from "sonner";
import { OnboardingFlow } from "@/components/features/onboarding/onboarding-flow";
import { useOrder } from "@/components/providers/order-provider";
import { createUser, updateUser } from "@/lib/api/users";
import type { UserData } from "@/lib/types";

export const Route = createFileRoute("/")({
	ssr: false,
	component: App,
});

function App() {
	const { userData, setUserData } = useOrder();
	const navigate = useNavigate();

	const createUserMutation = useMutation<UserData, Error, UserData>({
		mutationFn: createUser,
		onError(_, __, ___) {
			toast.error("Failed to create profile. Please try again.");
		},
		onSuccess(data, _variables, _context) {
			onProceedToMenu(data);
		},
	});

	const updateUserMutation = useMutation<UserData, Error, UserData>({
		mutationFn: updateUser.bind(null, userData?.id || ""),
		onError(_, __, ___) {
			toast.error("Failed to update profile. Please try again.");
		},
		onSuccess(data, _variables, _context) {
			onProceedToMenu(data);
		},
	});

	const onProceedToMenu = useCallback(
		(data: UserData): void => {
			setUserData(data);
			navigate({ to: "/menu" });
		},
		[setUserData, navigate],
	);

	return (
		<div className="h-screen w-screen">
			<OnboardingFlow
				userData={userData}
				mutation={userData ? updateUserMutation : createUserMutation}
			/>
		</div>
	);
}
