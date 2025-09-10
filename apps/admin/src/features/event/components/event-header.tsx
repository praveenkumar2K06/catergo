interface EventHeaderProps {
	eventName: string;
	eventId: string;
}

export function EventHeader({ eventName, eventId }: EventHeaderProps) {
	return (
		<div className="flex items-center justify-between">
			<div>
				<h1 className="font-bold text-3xl">{eventName}</h1>
				<p className="mt-1 text-muted-foreground">
					Event ID: {eventId}
				</p>
			</div>
		</div>
	);
}
