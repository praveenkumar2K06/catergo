import { useLoaderData } from "@tanstack/react-router";
import { Info } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import ErrorDisplay from "@/components/shared/layout/error";
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
import OrderSettingsSkeleton from "../skeleton/order-settings-skeleton";

export const OrderSettings = () => {
	const updateSettingsMutation = useUpdateSettings();

	const [maxOrdersPerDay, setMaxOrdersPerDay] = useState<number>(50);
	const [bulkDiscount, setBulkDiscount] = useState<number>(10);
	const [bulkDiscountPersons, setBulkDiscountPersons] = useState<number>(5);
	const [enableDailyLimit, setEnableDailyLimit] = useState<boolean>(true);
	const [hidePrices, setHidePrices] = useState<boolean>(false);
	const loader = useLoaderData({ from: "/_authed/settings" });
	const {
		data: settings,
		isLoading,
		isError,
	} = useSettings(loader.adminId || "");

	useEffect(() => {
		if (settings) {
			setMaxOrdersPerDay(settings.maxOrdersPerDay);
			setEnableDailyLimit(settings.enableDailyOrderLimit);
			setBulkDiscount(settings.bulkOrderDiscount);
			setBulkDiscountPersons(settings.bulkOrderMinPersons);
			setHidePrices(settings.hidePrices ?? false);
		}
	}, [settings]);

	const handleSave = async () => {
		try {
			await updateSettingsMutation.mutateAsync({
				maxOrdersPerDay,
				enableDailyOrderLimit: enableDailyLimit,
				bulkOrderDiscount: bulkDiscount,
				bulkOrderMinPersons: bulkDiscountPersons,
				hidePrices,
			});
			toast.success("Order settings saved successfully");
		} catch {
			toast.error("Failed to save order settings");
		}
	};

	if (isLoading) {
		return <OrderSettingsSkeleton />;
	}

	if (isError) {
		return <ErrorDisplay type="server" className="h-max" />;
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
					<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
						<div className="space-y-2">
							<Label htmlFor="bulk-discount-persons">
								Bulk Order Minimum Persons
							</Label>
							<Input
								id="bulk-discount-persons"
								type="number"
								placeholder="5"
								min="1"
								max="100"
								value={bulkDiscountPersons}
								onChange={(e) =>
									setBulkDiscountPersons(
										Number.parseInt(e.target.value, 10) ||
											1,
									)
								}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="bulk-discount">
								Bulk Order Discount (%)
							</Label>
							<Input
								id="bulk-discount"
								type="number"
								placeholder="10"
								min="0"
								max="100"
								value={bulkDiscount}
								onChange={(e) =>
									setBulkDiscount(
										Number.parseInt(e.target.value, 10) ||
											0,
									)
								}
							/>
						</div>
					</div>
					<div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950">
						<div className="flex items-start gap-2">
							<Info className="mt-0.5 h-4 w-4 text-blue-600 dark:text-blue-400" />
							<div className="text-sm">
								<p className="font-medium text-blue-900 dark:text-blue-100">
									Bulk Order Discount
								</p>
								<p className="text-blue-700 dark:text-blue-300">
									If the number of people is 0, discount is
									not applied. Otherwise, orders with at least{" "}
									{bulkDiscountPersons} persons receive a{" "}
									{bulkDiscount}% discount.
								</p>
							</div>
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
						<div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950">
							<div className="flex items-start gap-2">
								<Info className="mt-0.5 h-4 w-4 text-blue-600 dark:text-blue-400" />
								<div className="text-sm">
									<p className="font-medium text-blue-900 dark:text-blue-100">
										Daily limit is enabled
									</p>
									<p className="text-blue-700 dark:text-blue-300">
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

			<Card>
				<CardHeader>
					<CardTitle>Display Settings</CardTitle>
					<CardDescription>
						Configure what customers see on the user-facing site
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="flex items-center space-x-2">
						<Checkbox
							id="hide-prices"
							checked={hidePrices}
							onCheckedChange={(checked) =>
								setHidePrices(checked === true)
							}
						/>
						<Label htmlFor="hide-prices">
							Hide prices on user side
						</Label>
					</div>
					{hidePrices && (
						<div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950">
							<div className="flex items-start gap-2">
								<Info className="mt-0.5 h-4 w-4 text-blue-600 dark:text-blue-400" />
								<div className="text-sm">
									<p className="font-medium text-blue-900 dark:text-blue-100">
										Prices are hidden
									</p>
									<p className="text-blue-700 dark:text-blue-300">
										Menu item prices will not be visible to
										customers on the user-facing website.
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
