import { Calendar, Clock, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface EventDetailsCardProps {
	eventDate: string | Date;
	createdAt: string | Date;
	numberOfPeople?: number;
}

export function EventDetailsCard({
	eventDate,
	createdAt,
	numberOfPeople,
}: EventDetailsCardProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Calendar className="h-5 w-5" />
					Event Details
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
					<div className="flex items-center gap-3">
						<div className="rounded-lg bg-primary/10 p-2">
							<Calendar className="h-4 w-4 text-primary" />
						</div>
						<div>
							<p className="text-muted-foreground text-sm">
								Event Date
							</p>
							<p className="font-medium">
								{new Date(eventDate).toLocaleDateString()}
							</p>
						</div>
					</div>
					<div className="flex items-center gap-3">
						<div className="rounded-lg bg-primary/10 p-2">
							<Clock className="h-4 w-4 text-primary" />
						</div>
						<div>
							<p className="text-muted-foreground text-sm">
								Created
							</p>
							<p className="font-medium">
								{new Date(createdAt).toLocaleDateString()}
							</p>
						</div>
					</div>
					<div className="flex items-center gap-3">
						<div className="rounded-lg bg-primary/10 p-2">
							<Users className="h-4 w-4 text-primary" />
						</div>
						<div>
							<p className="text-muted-foreground text-sm">
								Guest Count
							</p>
							<p className="font-medium">
								{numberOfPeople || "N/A"} people
							</p>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
