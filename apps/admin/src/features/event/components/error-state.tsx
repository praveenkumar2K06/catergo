import { Button } from "@/components/ui/button";

interface ErrorStateProps {
	message?: string;
	onRetry?: () => void;
}

export function ErrorState({
	message = "Error loading event details",
	onRetry = () => window.location.reload(),
}: ErrorStateProps) {
	return (
		<div className="flex min-h-[400px] items-center justify-center">
			<div className="text-center">
				<p className="mb-4 text-destructive">{message}</p>
				<Button variant="outline" onClick={onRetry}>
					Try Again
				</Button>
			</div>
		</div>
	);
}
