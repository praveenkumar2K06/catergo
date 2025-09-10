interface LoadingStateProps {
	message?: string;
}

export function LoadingState({
	message = "Loading event details...",
}: LoadingStateProps) {
	return (
		<div className="flex min-h-[400px] items-center justify-center">
			<div className="text-center">
				<div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-primary border-b-2" />
				<p className="text-muted-foreground">{message}</p>
			</div>
		</div>
	);
}
