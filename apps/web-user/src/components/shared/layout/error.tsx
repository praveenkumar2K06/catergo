import {
	AlertCircle,
	ChefHat,
	RefreshCw,
	UtensilsCrossed,
	WifiOff,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ErrorProps {
	title?: string;
	message?: string;
	onRetry?: () => void;
	showRetry?: boolean;
	type?: "general" | "network" | "server" | "notFound";
	className?: string;
}

const errorConfig = {
	general: {
		icon: AlertCircle,
		iconColor: "text-red-500",
		bgColor: "bg-red-50 dark:bg-red-950/20",
		badgeVariant: "destructive" as const,
		title: "Oops! Something went wrong",
		message:
			"We're having trouble processing your request. Please try again in a moment.",
	},
	network: {
		icon: WifiOff,
		iconColor: "text-orange-500",
		bgColor: "bg-orange-50 dark:bg-orange-950/20",
		badgeVariant: "outline" as const,
		title: "Connection Problem",
		message:
			"Unable to connect to our servers. Please check your internet connection and try again.",
	},
	server: {
		icon: ChefHat,
		iconColor: "text-purple-500",
		bgColor: "bg-purple-50 dark:bg-purple-950/20",
		badgeVariant: "secondary" as const,
		title: "Kitchen's Taking a Break",
		message:
			"Our servers are temporarily unavailable. We're working to get everything back online.",
	},
	notFound: {
		icon: UtensilsCrossed,
		iconColor: "text-blue-500",
		bgColor: "bg-blue-50 dark:bg-blue-950/20",
		badgeVariant: "outline" as const,
		title: "Menu Item Not Found",
		message:
			"The item you're looking for isn't available right now. Let's get you back to our delicious menu!",
	},
};

export default function ErrorDisplay({
	title,
	message,
	onRetry,
	showRetry = true,
	type = "general",
	className,
}: ErrorProps) {
	const config = errorConfig[type];
	const IconComponent = config.icon;

	return (
		<div
			className={cn(
				"flex h-screen min-h-[400px] items-center justify-center p-4",
				className,
			)}
		>
			<Card className="w-full max-w-md">
				<CardHeader className="pb-4 text-center">
					<div
						className={cn(
							"mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full",
							config.bgColor,
						)}
					>
						<IconComponent
							className={cn("h-8 w-8", config.iconColor)}
						/>
					</div>

					<div className="mb-3 flex justify-center">
						<Badge
							variant={config.badgeVariant}
							className="text-xs"
						>
							Error{" "}
							{type !== "general" &&
								`• ${type.charAt(0).toUpperCase() + type.slice(1)}`}
						</Badge>
					</div>

					<CardTitle className="font-semibold text-xl">
						{title || config.title}
					</CardTitle>
				</CardHeader>

				<CardContent className="space-y-4 text-center">
					<CardDescription className="text-base leading-relaxed">
						{message || config.message}
					</CardDescription>

					{showRetry && onRetry && (
						<div className="pt-2">
							<Button
								onClick={onRetry}
								variant="default"
								size="lg"
								className="w-full"
							>
								<RefreshCw className="mr-2 h-4 w-4" />
								Try Again
							</Button>
						</div>
					)}

					<div className="pt-2">
						<p className="text-muted-foreground text-xs">
							If the problem persists, please contact our support
							team
						</p>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
