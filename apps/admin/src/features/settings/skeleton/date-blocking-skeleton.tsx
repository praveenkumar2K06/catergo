import { CalendarIcon, CalendarXIcon } from "lucide-react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function DateBlockingSkeleton() {
	return (
		<div className="space-y-6">
			<div>
				<h2 className="flex items-center gap-2 font-bold text-lg">
					<CalendarXIcon className="h-5 w-5" />
					Date Blocking Settings
				</h2>
				<p className="text-muted-foreground text-sm">
					Manage blocked dates and unavailable periods for orders.
				</p>
			</div>
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<CalendarIcon className="h-4 w-4" />
						Calendar Date Blocking
					</CardTitle>
					<CardDescription>
						Select specific dates to block from receiving orders
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
						<div className="space-y-4">
							<Skeleton className="h-[280px] w-full rounded-md" />
						</div>
						<div className="space-y-4">
							<Skeleton className="h-6 w-48" />
							<div className="space-y-2">
								<Skeleton className="h-8 w-full" />
								<Skeleton className="h-8 w-full" />
								<Skeleton className="h-8 w-full" />
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
