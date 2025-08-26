"use client";

import { format, isSameDay } from "date-fns";
import { CalendarIcon, MapPin, Phone, User, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { ModeToggle } from "./mode-toggle";

interface OnboardingData {
	name: string;
	phone: string;
	address: string;
	pincode: string;
	numberOfPeople: number;
	selectedDate: Date | undefined;
}

export function OnboardingFlow() {
	const [currentStep, setCurrentStep] = useState(1);
	const [data, setData] = useState<OnboardingData>({
		name: "",
		phone: "",
		address: "",
		pincode: "",
		numberOfPeople: 1,
		selectedDate: undefined,
	});

	const blockedDates = [
		new Date(2025, 7, 30), // Aug 30, 2025
		new Date(2025, 8, 2), // Sep 2, 2025
	];

	useEffect(() => {
		const storedData = localStorage.getItem("onboardingData");
		if (storedData) {
			setData(JSON.parse(storedData));
		}
	}, []);

	// biome-ignore lint/suspicious/noExplicitAny: Field Input
	const updateData = (field: keyof OnboardingData, value: any) => {
		setData((prev) => ({ ...prev, [field]: value }));
	};

	const nextStep = () => {
		if (currentStep < 3) {
			setCurrentStep(currentStep + 1);
		} else {
			localStorage.setItem("onboardingData", JSON.stringify(data));
			console.log("Onboarding complete:", data);
			toast.success("Onboarding complete!", {
				description: "You can now start using the app.",
			});
			// TODO: Navigate to menu page
		}
	};

	const prevStep = () => {
		if (currentStep > 1) {
			setCurrentStep(currentStep - 1);
		}
	};

	const isStepValid = () => {
		switch (currentStep) {
			case 1:
				return data.name.trim() !== "" && data.phone.trim() !== "";
			case 2:
				return data.address.trim() !== "" && data.pincode.trim() !== "";
			case 3:
				return (
					data.numberOfPeople > 0 && data.selectedDate !== undefined
				);
			default:
				return false;
		}
	};

	return (
		<div className="flex min-h-screen items-center justify-center bg-background p-4">
			<div className="absolute top-4 right-4">
				<ModeToggle />
			</div>
			<div className="w-full max-w-md">
				{/* Progress Indicator */}
				<div className="mb-8">
					<div className="mb-2 flex items-center justify-between">
						{[1, 2, 3].map((step) => (
							<div
								key={step}
								className={cn(
									"flex h-8 w-8 items-center justify-center rounded-full font-medium text-sm",
									step <= currentStep
										? "bg-primary text-primary-foreground"
										: "bg-muted text-muted-foreground",
								)}
							>
								{step}
							</div>
						))}
					</div>
					<div className="h-2 w-full rounded-full bg-muted">
						<div
							className="h-2 rounded-full bg-primary transition-all duration-300"
							style={{ width: `${(currentStep / 3) * 100}%` }}
						/>
					</div>
				</div>

				<Card className="border-0 shadow-lg">
					<CardHeader className="text-center">
						<CardTitle className="font-bold text-2xl">
							{currentStep === 1 && "Personal Details"}
							{currentStep === 2 && "Delivery Address"}
							{currentStep === 3 && "Order Details"}
						</CardTitle>
						<CardDescription>
							{currentStep === 1 &&
								"Let's start with your basic information"}
							{currentStep === 2 &&
								"Where should we deliver your order?"}
							{currentStep === 3 &&
								"When and for how many people?"}
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-6">
						{/* Step 1: Personal Details */}
						{currentStep === 1 && (
							<>
								<div className="space-y-2">
									<Label
										htmlFor="name"
										className="flex items-center gap-2"
									>
										<User className="h-4 w-4 text-primary" />
										Full Name
									</Label>
									<Input
										id="name"
										placeholder="Enter your full name"
										value={data.name}
										onChange={(e) =>
											updateData("name", e.target.value)
										}
									/>
								</div>
								<div className="space-y-2">
									<Label
										htmlFor="phone"
										className="flex items-center gap-2"
									>
										<Phone className="h-4 w-4 text-primary" />
										Phone Number
									</Label>
									<Input
										id="phone"
										placeholder="Enter your phone number"
										value={data.phone}
										onChange={(e) =>
											updateData("phone", e.target.value)
										}
									/>
								</div>
							</>
						)}

						{/* Step 2: Address Details */}
						{currentStep === 2 && (
							<>
								<div className="space-y-2">
									<Label
										htmlFor="address"
										className="flex items-center gap-2"
									>
										<MapPin className="h-4 w-4 text-primary" />
										Delivery Address
									</Label>
									<Input
										id="address"
										placeholder="Enter your complete address"
										value={data.address}
										onChange={(e) =>
											updateData(
												"address",
												e.target.value,
											)
										}
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="pincode">Pin Code</Label>
									<Input
										id="pincode"
										placeholder="Enter pin code"
										value={data.pincode}
										onChange={(e) =>
											updateData(
												"pincode",
												e.target.value,
											)
										}
									/>
								</div>
							</>
						)}

						{/* Step 3: Order Details */}
						{currentStep === 3 && (
							<>
								<div className="space-y-2">
									<Label
										htmlFor="people"
										className="flex items-center gap-2"
									>
										<Users className="h-4 w-4 text-primary" />
										Number of People
									</Label>
									<Input
										id="people"
										type="number"
										min="1"
										placeholder="How many people?"
										value={data.numberOfPeople}
										onChange={(e) =>
											updateData(
												"numberOfPeople",
												Number.parseInt(
													e.target.value,
													10,
												) || 1,
											)
										}
									/>
								</div>
								<div className="space-y-2">
									<Label className="flex items-center gap-2">
										<CalendarIcon className="h-4 w-4 text-primary" />
										Delivery Date
									</Label>
									<Popover>
										<PopoverTrigger asChild>
											<Button
												variant="outline"
												className={cn(
													"w-full justify-start text-left font-normal",
													!data.selectedDate &&
														"text-muted-foreground",
												)}
											>
												<CalendarIcon className="mr-2 h-4 w-4" />
												{data.selectedDate
													? format(
															data.selectedDate,
															"PPP",
														)
													: "Pick a date"}
											</Button>
										</PopoverTrigger>
										<PopoverContent className="w-auto p-0">
											<Calendar
												mode="single"
												selected={data.selectedDate}
												onSelect={(date) =>
													updateData(
														"selectedDate",
														date,
													)
												}
												disabled={(date) =>
													blockedDates.some((d) =>
														isSameDay(d, date),
													) || date < new Date()
												}
												autoFocus
											/>
										</PopoverContent>
									</Popover>
								</div>
							</>
						)}

						{/* Navigation Buttons */}
						<div className="flex gap-3 pt-4">
							{currentStep > 1 && (
								<Button
									variant="outline"
									onClick={prevStep}
									className="flex-1"
								>
									Previous
								</Button>
							)}
							<Button
								onClick={nextStep}
								disabled={!isStepValid()}
								className="flex-1"
							>
								{currentStep === 3
									? "Continue to Menu"
									: "Next"}
							</Button>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
