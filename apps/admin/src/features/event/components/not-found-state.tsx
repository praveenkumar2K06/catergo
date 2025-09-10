interface NotFoundStateProps {
	message?: string;
}

export function NotFoundState({
	message = "Event not found",
}: NotFoundStateProps) {
	return (
		<div className="flex min-h-[400px] items-center justify-center">
			<p className="text-muted-foreground">{message}</p>
		</div>
	);
}
