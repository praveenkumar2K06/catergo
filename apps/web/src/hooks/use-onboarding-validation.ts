import { useCallback } from "react";

export interface OnboardingData {
	name: string;
	phone: string;
	address: string;
	pincode: string;
	numberOfPeople: number;
	selectedDate: Date | undefined;
}

export function useOnboardingValidation() {
	const isStepValid = useCallback((step: number, data: OnboardingData) => {
		switch (step) {
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
	}, []);

	return { isStepValid };
}
