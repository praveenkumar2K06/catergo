import { cn } from "@/lib/utils";

interface ProgressIndicatorProps {
	currentStep: number;
	totalSteps: number;
}

export function ProgressIndicator({
	currentStep,
	totalSteps,
}: ProgressIndicatorProps) {
	return (
		<div className="mb-8">
			<div className="mb-2 flex items-center justify-between">
				{Array.from({ length: totalSteps }, (_, i) => i + 1).map(
					(step) => (
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
					),
				)}
			</div>
			<div className="h-2 w-full rounded-full bg-muted">
				<div
					className="h-2 rounded-full bg-primary transition-all duration-300"
					style={{ width: `${(currentStep / totalSteps) * 100}%` }}
				/>
			</div>
		</div>
	);
}
