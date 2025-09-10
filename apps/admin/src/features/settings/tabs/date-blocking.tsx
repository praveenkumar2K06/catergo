import {
	CalendarDaysIcon,
	CalendarIcon,
	CalendarXIcon,
	InfoIcon,
	TrashIcon,
	XIcon,
} from "lucide-react";
import { toast } from "sonner";
import ErrorDisplay from "@/components/shared/layout/error";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
	useAddBlockedDate,
	useRemoveBlockedDate,
	useSettings,
} from "@/hooks/use-settings";
import DateBlockingSkeleton from "../skeleton/date-blocking-skeleton";

export const DateBlockingSettings = () => {
	const { data: settings, isLoading, isError } = useSettings();
	const addBlockedDateMutation = useAddBlockedDate();
	const removeBlockedDateMutation = useRemoveBlockedDate();

	const blockedDates =
		settings?.blockedDates?.map((date) => new Date(date)) || [];

	const handleDateSelect = async (date: Date | undefined) => {
		if (!date) return;

		const dateString = date.toISOString();
		const isBlocked = blockedDates.some(
			(blockedDate) => blockedDate.toDateString() === date.toDateString(),
		);

		try {
			if (isBlocked) {
				await removeBlockedDateMutation.mutateAsync(dateString);
				toast.success("Date unblocked successfully");
			} else {
				await addBlockedDateMutation.mutateAsync(dateString);
				toast.success("Date blocked successfully");
			}
		} catch {
			toast.error(
				isBlocked ? "Failed to unblock date" : "Failed to block date",
			);
		}
	};

	const handleRemoveDate = async (date: Date) => {
		try {
			await removeBlockedDateMutation.mutateAsync(date.toISOString());
			toast.success("Date unblocked successfully");
		} catch {
			toast.error("Failed to unblock date");
		}
	};

	if (isLoading) {
		return <DateBlockingSkeleton />;
	}

	if (isError) {
		return <ErrorDisplay type="server" className="h-max" />;
	}

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
						Click on dates to block/unblock them from receiving
						orders
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
					<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
						<div className="space-y-4">
							<div className="rounded-lg border p-4">
								<div className="mb-3 flex items-center gap-2">
									<CalendarDaysIcon className="h-4 w-4" />
									<span className="font-medium text-sm">
										Select Dates
									</span>
								</div>
								<Calendar
									mode="multiple"
									selected={blockedDates}
									onSelect={(dates) => {
										if (dates && Array.isArray(dates)) {
											const newDates = dates.filter(
												(date) =>
													!blockedDates.some(
														(blocked) =>
															blocked.toDateString() ===
															date.toDateString(),
													),
											);
											const removedDates =
												blockedDates.filter(
													(blocked) =>
														!dates.some(
															(date) =>
																date.toDateString() ===
																blocked.toDateString(),
														),
												);

											newDates.forEach((date) => {
												handleDateSelect(date);
											});
											removedDates.forEach((date) => {
												handleDateSelect(date);
											});
										}
									}}
									className="mx-auto my-0 rounded-md border-0"
									disabled={() =>
										addBlockedDateMutation.isPending ||
										removeBlockedDateMutation.isPending
									}
								/>
							</div>
						</div>

						<div className="space-y-4">
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2">
									<InfoIcon className="h-4 w-4" />
									<h4 className="font-medium">
										Blocked Dates
									</h4>
								</div>
								{blockedDates.length > 0 && (
									<AlertDialog>
										<AlertDialogTrigger asChild>
											<Button
												variant="outline"
												size="sm"
												className="text-destructive hover:text-destructive"
												disabled={
													removeBlockedDateMutation.isPending
												}
											>
												<TrashIcon className="mr-1 h-3 w-3" />
												Clear All
											</Button>
										</AlertDialogTrigger>
										<AlertDialogContent>
											<AlertDialogHeader>
												<AlertDialogTitle>
													Clear All Blocked Dates
												</AlertDialogTitle>
												<AlertDialogDescription>
													Are you sure you want to
													remove all blocked dates?
													This action cannot be
													undone.
												</AlertDialogDescription>
											</AlertDialogHeader>
											<AlertDialogFooter>
												<AlertDialogCancel>
													Cancel
												</AlertDialogCancel>
												<AlertDialogAction
													onClick={() => {
														blockedDates.forEach(
															(date) => {
																handleRemoveDate(
																	date,
																);
															},
														);
													}}
													className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
												>
													Clear All
												</AlertDialogAction>
											</AlertDialogFooter>
										</AlertDialogContent>
									</AlertDialog>
								)}
							</div>

							<div className="rounded-lg border bg-card">
								<ScrollArea className="h-[280px]">
									<div className="p-4">
										{blockedDates.length === 0 ? (
											<div className="flex flex-col items-center justify-center py-8 text-center">
												<CalendarIcon className="mb-2 h-8 w-8 text-muted-foreground/50" />
												<p className="text-muted-foreground text-sm">
													No dates blocked
												</p>
												<p className="text-muted-foreground text-xs">
													Click on calendar dates to
													block them
												</p>
											</div>
										) : (
											<div className="space-y-3">
												{blockedDates
													.sort(
														(a, b) =>
															a.getTime() -
															b.getTime(),
													)
													.map((date, index) => (
														<div
															key={date.toISOString()}
														>
															<div className="flex items-center justify-between rounded-md border bg-muted/50 p-3">
																<div className="flex items-center gap-3">
																	<div className="flex h-8 w-8 items-center justify-center rounded-full bg-destructive/10">
																		<CalendarXIcon className="h-4 w-4 text-destructive" />
																	</div>
																	<div>
																		<Badge
																			variant="secondary"
																			className="font-mono"
																		>
																			{date.toLocaleDateString(
																				"en-US",
																				{
																					weekday:
																						"short",
																					year: "numeric",
																					month: "short",
																					day: "numeric",
																				},
																			)}
																		</Badge>
																	</div>
																</div>
																<Button
																	variant="ghost"
																	size="sm"
																	onClick={() =>
																		handleRemoveDate(
																			date,
																		)
																	}
																	disabled={
																		removeBlockedDateMutation.isPending
																	}
																	className="text-muted-foreground hover:text-destructive"
																>
																	<XIcon className="h-4 w-4" />
																</Button>
															</div>
															{index <
																blockedDates.length -
																	1 && (
																<Separator className="my-2" />
															)}
														</div>
													))}
											</div>
										)}
									</div>
								</ScrollArea>
							</div>

							{blockedDates.length > 0 && (
								<div className="rounded-lg bg-muted/50 p-3">
									<div className="flex items-center gap-2 text-muted-foreground text-xs">
										<InfoIcon className="h-3 w-3" />
										<span>
											{blockedDates.length} date
											{blockedDates.length !== 1
												? "s"
												: ""}{" "}
											blocked from orders
										</span>
									</div>
								</div>
							)}
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
};
