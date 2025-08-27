import { useCallback } from "react";
import type { UserData } from "@/lib/types";

export function useOnboardingValidation() {
	const isStepValid = useCallback((step: number, data: UserData) => {
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
