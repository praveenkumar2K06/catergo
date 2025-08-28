import { animated, useSpring } from "@react-spring/web";
import type { UseMutationResult } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import type { UserData } from "@/lib/types";
import { useOnboardingValidation } from "../../hooks/use-onboarding-validation";
import { AutoHeightTransition } from "../animations/AutoHeightTransition";
import { ModeToggle } from "../mode-toggle";
import { NavigationButtons } from "./navigation-buttons";
import { ProgressIndicator } from "./progress-indicator";
import { AddressDetails } from "./steps/address-details";
import { OrderDetails } from "./steps/order-details";
import { PersonalDetails } from "./steps/personal-details";

interface OnboardingProps {
	userData: UserData | null;
	mutation: UseMutationResult<UserData, Error, UserData>;
}

export function OnboardingFlow({ userData, mutation }: OnboardingProps) {
	const [currentStep, setCurrentStep] = useState(1);
	const [direction, setDirection] = useState(1);
	const isAnimatingRef = useRef(false);

	const { isStepValid } = useOnboardingValidation();
	const [data, setData] = useState<UserData>(
		userData || {
			name: "",
			phone: "",
			address: "",
			pincode: "",
			numberOfPeople: 1,
			selectedDate: undefined,
		},
	);

	const springs = useSpring({
		opacity: isAnimatingRef.current ? 0 : 1,
		transform: isAnimatingRef.current
			? `translateX(${-30 * direction}px)`
			: "translateX(0px)",
		config: { tension: 280, friction: 25 },
	});

	const blockedDates = useMemo(
		() => [
			new Date(2025, 7, 30), // Aug 30, 2025
			new Date(2025, 8, 2), // Sep 2, 2025
		],
		[],
	);

	const updateData = useCallback(
		(field: keyof UserData, value: string | number | Date | undefined) => {
			setData((prev) => ({ ...prev, [field]: value }));
		},
		[],
	);

	const nextStep = useCallback(() => {
		if (isAnimatingRef.current) return;

		if (currentStep < 3) {
			setDirection(1);
			isAnimatingRef.current = true;

			setTimeout(() => {
				setCurrentStep((s) => s + 1);
				isAnimatingRef.current = false;
			}, 300);
		} else {
			mutation.mutate(data);
		}
	}, [currentStep, data, mutation.mutate]);

	const prevStep = useCallback(() => {
		if (isAnimatingRef.current) return;

		if (currentStep > 1) {
			setDirection(-1);
			isAnimatingRef.current = true;

			setTimeout(() => {
				setCurrentStep((s) => s - 1);
				isAnimatingRef.current = false;
			}, 300);
		}
	}, [currentStep]);

	const isCurrentStepValid = useMemo(
		() => isStepValid(currentStep, data),
		[isStepValid, currentStep, data],
	);

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Enter" && isCurrentStepValid) {
				nextStep();
			} else if (e.key === "Escape" && currentStep > 1) {
				prevStep();
			}
		};

		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [isCurrentStepValid, nextStep, prevStep, currentStep]);

	const stepTitles = useMemo(
		() => ({
			1: "Personal Details",
			2: "Delivery Address",
			3: "Order Details",
		}),
		[],
	);

	const stepDescriptions = useMemo(
		() => ({
			1: "Let's start with your basic information",
			2: "Where should we deliver your order?",
			3: "When and for how many people?",
		}),
		[],
	);

	return (
		<div className="flex min-h-screen items-center justify-center bg-background p-4">
			<div className="absolute top-4 right-4">
				<ModeToggle />
			</div>
			<div className="w-full max-w-md">
				<ProgressIndicator currentStep={currentStep} totalSteps={3} />

				<Card className="border-0 shadow-lg">
					<CardHeader className="text-center">
						<CardTitle className="font-bold text-2xl">
							{stepTitles[currentStep as keyof typeof stepTitles]}
						</CardTitle>
						<CardDescription>
							{
								stepDescriptions[
									currentStep as keyof typeof stepDescriptions
								]
							}
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-6">
						<AutoHeightTransition>
							<animated.div
								style={springs}
								className="space-y-4 p-2"
							>
								{currentStep === 1 && (
									<PersonalDetails
										name={data.name}
										phone={data.phone}
										illustration={
											"/icons/personal-details.png"
										}
										onNameChange={(name) =>
											updateData("name", name)
										}
										onPhoneChange={(phone) =>
											updateData("phone", phone)
										}
									/>
								)}
								{currentStep === 2 && (
									<AddressDetails
										address={data.address}
										pincode={data.pincode}
										illustration={"/icons/address.png"}
										onAddressChange={(address) =>
											updateData("address", address)
										}
										onPincodeChange={(pincode) =>
											updateData("pincode", pincode)
										}
									/>
								)}
								{currentStep === 3 && (
									<OrderDetails
										numberOfPeople={data.numberOfPeople}
										selectedDate={data.selectedDate}
										blockedDates={blockedDates}
										illustration={
											"/icons/order-details.png"
										}
										onNumberOfPeopleChange={(count) =>
											updateData("numberOfPeople", count)
										}
										onDateChange={(date) =>
											updateData("selectedDate", date)
										}
									/>
								)}
							</animated.div>
						</AutoHeightTransition>

						<NavigationButtons
							currentStep={currentStep}
							totalSteps={3}
							isStepValid={isCurrentStepValid}
							onPrevious={prevStep}
							onNext={nextStep}
							isLoading={mutation.isPending}
						/>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
