import type { UserData } from "@/lib/types";

interface WelcomeBannerProps {
	userData: UserData;
}

export function WelcomeBanner({ userData }: WelcomeBannerProps) {
	return (
		<div className="m-4 rounded-2xl bg-gradient-to-br from-primary via-primary to-primary/80 p-4 text-primary-foreground shadow-lg">
			<div className="flex items-center justify-between">
				<div className="space-y-2">
					<div className="flex items-center gap-2">
						<div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-foreground/20">
							<span className="text-sm">🎯</span>
						</div>
						<p className="font-medium">
							Smart Quantity Suggestions
						</p>
					</div>
					<p className="text-sm opacity-90">
						Perfect portions for your group of{" "}
						{userData.numberOfPeople} people
					</p>
					<p className="text-xs opacity-75">
						Quantities are pre-calculated, but you can adjust as
						needed
					</p>
				</div>
				<div className="rounded-xl bg-primary-foreground/10 p-3 text-center backdrop-blur-sm">
					<p className="font-medium text-sm">
						{userData.selectedDate
							? new Date(
									userData.selectedDate,
								).toLocaleDateString("en-US", {
									weekday: "short",
									month: "short",
									day: "numeric",
								})
							: "Date TBD"}
					</p>
					<p className="text-xs opacity-75">Delivery</p>
				</div>
			</div>
		</div>
	);
}
