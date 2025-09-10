import { Info } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSettings, useUpdateSettings } from "@/hooks/use-settings";

export const OrderSettings = () => {
	const { data: settings, isLoading } = useSettings();
	const updateSettingsMutation = useUpdateSettings();

	const [maxOrdersPerDay, setMaxOrdersPerDay] = useState<number>(50);
	const [enableDailyLimit, setEnableDailyLimit] = useState<boolean>(true);

	useEffect(() => {
		if (settings) {
			setMaxOrdersPerDay(settings.maxOrdersPerDay);
			setEnableDailyLimit(settings.enableDailyOrderLimit);
		}
	}, [settings]);

	const handleSave = async () => {
		try {
			await updateSettingsMutation.mutateAsync({
				maxOrdersPerDay,
				enableDailyOrderLimit: enableDailyLimit,
			});
			toast.success("Order settings saved successfully");
		} catch {
			toast.error("Failed to save order settings");
		}
	};

	if (isLoading) {
		return (
			<div className="space-y-6">
				<div>
					<h2 className="font-bold text-lg">
						Order Management Settings
					</h2>
					<p className="text-muted-foreground text-sm">
						Configure order limits, quantities, and management
						options.
					</p>
				</div>

				<Card>
					<CardHeader>
						<div className="space-y-2">
							<div className="h-6 w-48 animate-pulse rounded bg-muted" />
							<div className="h-4 w-64 animate-pulse rounded bg-muted" />
						</div>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<div className="h-4 w-32 animate-pulse rounded bg-muted" />
								<div className="h-10 w-full animate-pulse rounded bg-muted" />
							</div>
						</div>
						<div className="flex items-center space-x-2">
							<div className="h-4 w-4 animate-pulse rounded bg-muted" />
							<div className="h-4 w-36 animate-pulse rounded bg-muted" />
						</div>
						<div className="h-20 w-full animate-pulse rounded-lg bg-muted/50" />
					</CardContent>
				</Card>

				<div className="flex justify-end">
					<div className="h-10 w-40 animate-pulse rounded bg-muted" />
				</div>
			</div>
		);
	}
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
					<CardTitle>Daily Order Limits</CardTitle>
					<CardDescription>
						Set maximum number of orders per day
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="max-orders">
								Maximum Orders Per Day
							</Label>
							<Input
								id="max-orders"
								type="number"
								placeholder="50"
								min="1"
								max="500"
								value={maxOrdersPerDay}
								onChange={(e) =>
									setMaxOrdersPerDay(
										Number.parseInt(e.target.value, 10) ||
											1,
									)
								}
							/>
						</div>
					</div>
					<div className="flex items-center space-x-2">
						<Checkbox
							id="enable-daily-limit"
							checked={enableDailyLimit}
							onCheckedChange={(checked) =>
								setEnableDailyLimit(checked === true)
							}
						/>
						<Label htmlFor="enable-daily-limit">
							Enable daily order limit
						</Label>
					</div>
					{enableDailyLimit && (
						<div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
							<div className="flex items-start gap-2">
								<Info className="mt-0.5 h-4 w-4 text-blue-600" />
								<div className="text-sm">
									<p className="font-medium text-blue-900">
										Daily limit is enabled
									</p>
									<p className="text-blue-700">
										New orders will be rejected once the
										daily limit of {maxOrdersPerDay} orders
										is reached.
									</p>
								</div>
							</div>
						</div>
					)}
				</CardContent>
			</Card>

			<div className="flex justify-end">
				<Button
					onClick={handleSave}
					disabled={updateSettingsMutation.isPending}
				>
					{updateSettingsMutation.isPending
						? "Saving..."
						: "Save Order Settings"}
				</Button>
			</div>
		</div>
	);
};
