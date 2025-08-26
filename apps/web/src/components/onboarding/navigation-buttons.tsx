import { animated, useSpring, useTransition } from "@react-spring/web";
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
	const sharedConfig = { tension: 200, friction: 20 };

	const containerTransition = useTransition(true, {
		from: { opacity: 0, transform: "translateY(20px)" },
		enter: { opacity: 1, transform: "translateY(0px)" },
		config: sharedConfig,
	});

	const prevButtonTransition = useTransition(currentStep > 1, {
		from: { opacity: 0, transform: "translateX(-20px)", width: "0%" },
		enter: { opacity: 1, transform: "translateX(0px)", width: "50%" },
		leave: { opacity: 0, transform: "translateX(-20px)", width: "0%" },
		config: sharedConfig,
	});

	const nextButtonSpring = useSpring({
		width: currentStep > 1 ? "50%" : "100%",
		marginLeft: currentStep > 1 ? "0.75rem" : "0rem",
		transform: `scale(${isStepValid ? 1 : 0.95})`,
		opacity: isStepValid ? 1 : 0.6,
		config: sharedConfig,
	});

	return containerTransition((containerStyle) => (
		<animated.div style={containerStyle} className="flex p-2">
			{prevButtonTransition(
				(style, show) =>
					show && (
						<animated.div
							style={style}
							className="overflow-hidden p-1"
						>
							<Button
								variant="outline"
								onClick={onPrevious}
								className="w-full whitespace-nowrap"
							>
								Previous
							</Button>
						</animated.div>
					),
			)}
			<animated.div style={nextButtonSpring} className={"p-1"}>
				<Button
					onClick={onNext}
					disabled={!isStepValid}
					className="w-full whitespace-nowrap transition-colors duration-200"
				>
					{currentStep === totalSteps ? "Continue to Menu" : "Next"}
				</Button>
			</animated.div>
		</animated.div>
	));
}
