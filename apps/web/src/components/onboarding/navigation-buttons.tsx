import { Button } from "@/components/ui/button";

interface NavigationButtonsProps {
	currentStep: number;
	totalSteps: number;
	isStepValid: boolean;
	onPrevious: () => void;
	onNext: () => void;
}

export function NavigationButtons({
	currentStep,
	totalSteps,
	isStepValid,
	onPrevious,
	onNext,
}: NavigationButtonsProps) {
	return (
		<div className="flex gap-3 pt-4">
			{currentStep > 1 && (
				<Button
					variant="outline"
					onClick={onPrevious}
					className="flex-1"
				>
					Previous
				</Button>
			)}
			<Button onClick={onNext} disabled={!isStepValid} className="flex-1">
				{currentStep === totalSteps ? "Continue to Menu" : "Next"}
			</Button>
		</div>
	);
}
