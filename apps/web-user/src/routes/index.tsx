"use client";

import { useMutation } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useCallback } from "react";
import { CatererEntry } from "@/components/features/onboarding/caterer-selector";
import { OnboardingFlow } from "@/components/features/onboarding/onboarding-flow";
import { useOrder } from "@/components/providers/order-provider";
import { createUser, updateUser } from "@/lib/api/users";
import { handleMutationError } from "@/lib/error-handlers";
import type { UserData } from "@/lib/types";

export const Route = createFileRoute("/")({
	ssr: false,
	component: App,
});

function App() {
	const {
		userData,
		setUserData,
		catererId,
		catererName,
		setCatererId,
		setCatererName,
	} = useOrder();
	const navigate = useNavigate();

	const createUserMutation = useMutation({
		mutationFn: createUser,
		onError(error) {
			handleMutationError(
				error,
				"Failed to create profile. Please try again.",
			);
		},
		onSuccess(data) {
			onProceedToMenu(data);
		},
	});

	const updateUserMutation = useMutation<UserData, Error, UserData>({
		mutationFn: updateUser.bind(null, userData?.id || ""),
		onError(error) {
			handleMutationError(
				error,
				"Failed to update profile. Please try again.",
			);
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
			{catererId && catererName ? (
				<OnboardingFlow
					userData={userData}
					caterer={{
						id: catererId,
						name: catererName,
					}}
					mutation={
						userData ? updateUserMutation : createUserMutation
					}
					onChangeCatererClick={() => setCatererId(null)}
				/>
			) : (
				<CatererEntry
					onComplete={(id, name) => {
						setCatererId(id);
						setCatererName(name);
					}}
				/>
			)}
		</div>
	);
}
