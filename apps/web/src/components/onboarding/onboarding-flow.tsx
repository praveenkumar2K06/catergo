"use client";

import { animated, useSpring } from "@react-spring/web";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	type OnboardingData,
	useOnboardingValidation,
} from "@/hooks/use-onboarding-validation";
import { AutoHeightTransition } from "../animations/AutoHeightTransition";
import { ModeToggle } from "../mode-toggle";
import { AddressDetails } from "./address-details";
import { NavigationButtons } from "./navigation-buttons";
import { OrderDetails } from "./order-details";
import { PersonalDetails } from "./personal-details";
import { ProgressIndicator } from "./progress-indicator";

export function OnboardingFlow() {
	const [currentStep, setCurrentStep] = useState(1);
	const [direction, setDirection] = useState(1);
	const [isAnimating, setIsAnimating] = useState(false);

	const { isStepValid } = useOnboardingValidation();
	const [data, setData] = useState<OnboardingData>({
		name: "",
		phone: "",
		address: "",
		pincode: "",
		numberOfPeople: 1,
		selectedDate: undefined,
	});

	const springs = useSpring({
		opacity: isAnimating ? 0 : 1,
		transform: isAnimating
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

	useEffect(() => {
		const storedData = localStorage.getItem("onboardingData");
		if (storedData) {
			setData(JSON.parse(storedData));
		}
	}, []);

	const updateData = useCallback(
		(
			field: keyof OnboardingData,
			value: string | number | Date | undefined,
		) => {
			setData((prev) => ({ ...prev, [field]: value }));
		},
		[],
	);

	const nextStep = useCallback(() => {
		if (isAnimating) return;

		if (currentStep < 3) {
			setDirection(1);
			setIsAnimating(true);

			setTimeout(() => {
				setCurrentStep((s) => s + 1);
				setIsAnimating(false);
			}, 300);
		} else {
			localStorage.setItem("onboardingData", JSON.stringify(data));
			console.log("Onboarding complete:", data);
			toast.success("Onboarding complete!", {
				description: "You can now start using the app.",
			});
		}
	}, [currentStep, data, isAnimating]);

	const prevStep = useCallback(() => {
		if (isAnimating) return;

		if (currentStep > 1) {
			setDirection(-1);
			setIsAnimating(true);

			setTimeout(() => {
				setCurrentStep((s) => s - 1);
				setIsAnimating(false);
			}, 300);
		}
	}, [currentStep, isAnimating]);

	const isCurrentStepValid = useMemo(
		() => isStepValid(currentStep, data),
		[isStepValid, currentStep, data],
	);

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
						/>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
