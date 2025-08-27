import { ChefHat, Coffee, Loader2, UtensilsCrossed } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface LoaderProps {
	size?: "sm" | "md" | "lg";
	className?: string;
	text?: string;
	variant?: "default" | "minimal" | "card" | "catering";
	type?: "preparing" | "cooking" | "serving" | "loading";
}

const sizeClasses = {
	sm: "h-4 w-4",
	md: "h-6 w-6",
	lg: "h-8 w-8",
};

const cateringConfig = {
	preparing: {
		icon: UtensilsCrossed,
		text: "Preparing your order...",
		color: "text-blue-500",
		bgColor:
			"bg-blue-50 border-blue-100 dark:bg-blue-950/20 dark:border-blue-900/30",
		badgeVariant: "outline" as const,
		animation: "animate-spin",
	},
	cooking: {
		icon: ChefHat,
		text: "Cooking in progress...",
		color: "text-orange-500",
		bgColor:
			"bg-orange-50 border-orange-100 dark:bg-orange-950/20 dark:border-orange-900/30",
		badgeVariant: "secondary" as const,
		animation: "animate-pulse",
	},
	serving: {
		icon: Coffee,
		text: "Almost ready to serve...",
		color: "text-green-500",
		bgColor:
			"bg-green-50 border-green-100 dark:bg-green-950/20 dark:border-green-900/30",
		badgeVariant: "default" as const,
		animation: "animate-bounce",
	},
	loading: {
		icon: Loader2,
		text: "Loading...",
		color: "text-primary",
		bgColor: "bg-primary/5 border-primary/10",
		badgeVariant: "outline" as const,
		animation: "animate-spin",
	},
};

export default function Loader({
	size = "md",
	className,
	text,
	variant = "default",
	type = "loading",
}: LoaderProps) {
	if (variant === "minimal") {
		return (
			<Loader2
				className={cn("animate-spin", sizeClasses[size], className)}
			/>
		);
	}

	if (variant === "catering") {
		const config = cateringConfig[type];
		const IconComponent = config.icon;

		return (
			<div className="flex h-screen min-h-[300px] items-center justify-center p-4">
				<Card className="w-full max-w-sm animate-pulse-slow shadow-lg">
					<CardContent className="flex flex-col items-center justify-center space-y-6 p-8">
						<div
							className={cn(
								"flex h-16 w-16 items-center justify-center rounded-full border",
								config.bgColor,
							)}
						>
							<IconComponent
								className={cn(
									"h-8 w-8",
									config.color,
									config.animation,
								)}
							/>
						</div>

						<div className="space-y-4 text-center">
							<div className="space-y-2">
								<p className="font-semibold text-base text-foreground">
									{text || config.text}
								</p>
							</div>

							<div className="flex justify-center space-x-1.5">
								<div className="h-2 w-2 animate-bounce rounded-full bg-current opacity-75" />
								<div className="h-2 w-2 animate-bounce rounded-full bg-current opacity-60 [animation-delay:0.1s]" />
								<div className="h-2 w-2 animate-bounce rounded-full bg-current opacity-45 [animation-delay:0.2s]" />
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		);
	}

	if (variant === "card") {
		return (
			<div className="flex h-full min-h-[200px] items-center justify-center p-4">
				<Card className="w-full max-w-sm shadow-lg">
					<CardContent className="flex flex-col items-center justify-center space-y-6 p-8">
						<div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
							<Loader2
								className={cn(
									"animate-spin text-primary",
									sizeClasses[size],
									className,
								)}
							/>
						</div>
						{text && (
							<div className="space-y-2 text-center">
								<p className="font-medium text-foreground">
									{text}
								</p>
								<div className="flex justify-center space-x-1">
									<div className="h-1 w-1 animate-bounce rounded-full bg-primary opacity-75" />
									<div className="h-1 w-1 animate-bounce rounded-full bg-primary opacity-50 [animation-delay:0.1s]" />
									<div className="h-1 w-1 animate-bounce rounded-full bg-primary opacity-25 [animation-delay:0.2s]" />
								</div>
							</div>
						)}
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="flex h-full min-h-[200px] flex-col items-center justify-center p-8">
			<Loader2
				className={cn(
					"animate-spin text-primary",
					sizeClasses[size],
					className,
				)}
			/>
			{text && (
				<p className="mt-4 text-muted-foreground text-sm">{text}</p>
			)}
		</div>
	);
}
