import { animated, useSpring } from "@react-spring/web";
import type { UseMutationResult } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AutoHeightTransition } from "@/components/shared/animations/AutoHeightTransition";
import { ModeToggle } from "@/components/shared/layout/mode-toggle";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { useOnboardingValidation } from "@/hooks/use-onboarding-validation";
import type { UserData } from "@/lib/types";
import { NavigationButtons } from "./navigation-buttons";
import { ProgressIndicator } from "./progress-indicator";
import { AddressDetails } from "./steps/address-details";
import { OrderDetails } from "./steps/order-details";
import { PersonalDetails } from "./steps/personal-details";

interface OnboardingProps {
	userData: UserData | null;
	caterer: {
		id: string;
		name: string;
	};
	mutation: UseMutationResult<UserData, Error, UserData>;
	onChangeCatererClick?: () => void;
}

export function OnboardingFlow({
	userData,
	mutation,
	caterer,
	onChangeCatererClick,
}: OnboardingProps) {
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
			mutation.mutate({
				...data,
				adminId: caterer.id,
			} as UserData);
		}
	}, [currentStep, data, mutation.mutate, caterer.id]);

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
				<div className="mb-6 rounded-lg border bg-card p-4 text-center shadow-sm">
					<div className="mb-2 flex items-center justify-center gap-2">
						<div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
							<span className="font-semibold text-primary text-sm">
								{caterer.id.charAt(0).toUpperCase()}
							</span>
						</div>
						<div>
							<h3 className="font-semibold text-foreground">
								{caterer.name}
							</h3>
							<p className="text-muted-foreground text-xs">
								ID: {caterer.id}
							</p>
						</div>
					</div>
					{onChangeCatererClick && (
						<Button
							variant="outline"
							size="sm"
							onClick={onChangeCatererClick}
							className="mt-2 h-7 text-xs"
						>
							Change Caterer
						</Button>
					)}
				</div>
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
