import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function OrderSettingsSkeleton() {
	return (
		<div className="space-y-6">
			<div>
				<h2 className="font-bold text-lg">Order Management Settings</h2>
				<p className="text-muted-foreground text-sm">
					Configure order limits, quantities, and management options.
				</p>
			</div>

			<Card>
				<CardHeader>
					<div className="space-y-2">
						<Skeleton className="h-6 w-48" />
						<Skeleton className="h-4 w-64" />
					</div>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<Skeleton className="h-4 w-32" />
							<Skeleton className="h-10 w-full" />
						</div>
					</div>
					<div className="flex items-center space-x-2">
						<Skeleton className="h-4 w-4" />
						<Skeleton className="h-4 w-36" />
					</div>
					<Skeleton className="h-20 w-full" />
				</CardContent>
			</Card>

			<div className="flex justify-end">
				<Skeleton className="h-10 w-40" />
			</div>
		</div>
	);
}
