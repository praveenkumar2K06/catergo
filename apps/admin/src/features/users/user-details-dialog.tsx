import { format } from "date-fns";
import {
	Calendar,
	CalendarCheck,
	Clock,
	Drumstick,
	Leaf,
	MapPin,
	Phone,
	ShoppingCart,
	User as UserIcon,
	Users,
	LoaderCircleIcon,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/auth";
import { toast } from "sonner";
import { createEvent } from "@/lib/api/events";
import { createCartItem } from "@/lib/api/cart";
import { EventMenuSelector } from "@/features/users/event-menu-selector";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
	Table,
	TableBody,
	TableCell,
	TableFooter,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import type { User } from "@/types";

interface UserDetailsDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	user: User | null;
}

export function UserDetailsDialog({
	open,
	onOpenChange,
	user,
}: UserDetailsDialogProps) {
	const { user: authUser } = useAuth();
	const queryClient = useQueryClient();

	const [isCreating, setIsCreating] = useState(false);
	const [eventName, setEventName] = useState("");
	const [eventDescription, setEventDescription] = useState("");
	const [selectedMenuItems, setSelectedMenuItems] = useState<
		Record<string, number>
	>({});

	useEffect(() => {
		if (!open) {
			setIsCreating(false);
			setEventName("");
			setEventDescription("");
			setSelectedMenuItems({});
		}
	}, [open]);

	const createEventMutation = useMutation({
		mutationFn: async () => {
			if (!user) throw new Error("No user selected");
			await createEvent({
				userId: user.id,
				adminId: authUser?.userId ?? "",
				name: eventName || `Event for ${user.name}`,
				date: new Date(user.selectedDate).toISOString(),
				...(eventDescription && { description: eventDescription }),
			});

			const promises = Object.entries(selectedMenuItems).map(
				([menuId, quantity]) => {
					if (quantity > 0) {
						return createCartItem({
							userId: user.id,
							menuId,
							quantity,
						});
					}
					return Promise.resolve();
				},
			);

			await Promise.all(promises);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["users"] });
			queryClient.invalidateQueries({ queryKey: ["events"] });
			toast.success("Event and Menu Items created successfully");
			setIsCreating(false);
		},
		onError: (error: Error) => {
			toast.error("Failed to create event/menu items", {
				description: error.message,
			});
		},
	});

	if (!user) return null;

	const hasEvent = !!user.event;
	const hasCartItems = user.cartItems && user.cartItems.length > 0;

	const cartTotal =
		user.cartItems?.reduce((total, item) => {
			return total + item.menuItem.price * item.quantity;
		}, 0) ?? 0;

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-h-screen sm:max-w-150">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<UserIcon className="h-5 w-5" />
						User Details
					</DialogTitle>
				</DialogHeader>
				<ScrollArea className="max-h-[90vh] overflow-y-auto px-3">
					<div className="space-y-6 pt-4">
						{/* User Information Card */}
						<Card>
							<CardHeader className="pb-3">
								<CardTitle className="text-lg">
									{user.name}
								</CardTitle>
								<CardDescription>
									Customer Information
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-3">
								<div className="flex items-center gap-3">
									<Phone className="h-4 w-4 text-muted-foreground" />
									<span>{user.phone}</span>
								</div>
								<div className="flex items-center gap-3">
									<MapPin className="h-4 w-4 text-muted-foreground" />
									<span>
										{user.address}, {user.pincode}
									</span>
								</div>
								<div className="flex items-center gap-3">
									<Users className="h-4 w-4 text-muted-foreground" />
									<span>{user.numberOfPeople} People</span>
								</div>
								<div className="flex items-center gap-3">
									<Calendar className="h-4 w-4 text-muted-foreground" />
									<span>
										Selected Date:{" "}
										{format(
											new Date(user.selectedDate),
											"PPP 'at' p",
										)}
									</span>
								</div>
							</CardContent>
						</Card>

						<Separator />

						{/* Event Information Card */}
						<Card>
							<CardHeader className="pb-3">
								<div className="flex items-center justify-between">
									<CardTitle className="flex items-center gap-2 text-lg">
										<CalendarCheck className="h-5 w-5" />
										Event
									</CardTitle>
									<Badge
										variant={
											hasEvent ? "default" : "secondary"
										}
									>
										{hasEvent ? "Booked" : "No Event"}
									</Badge>
								</div>
								<CardDescription>
									{hasEvent
										? "Event associated with this user"
										: "No event has been created for this user yet"}
								</CardDescription>
							</CardHeader>
							{hasEvent && user.event && (
								<CardContent className="space-y-3">
									<div className="space-y-2">
										<h4 className="font-semibold">
											{user.event.name}
										</h4>
										{user.event.description && (
											<p className="text-muted-foreground text-sm">
												{user.event.description}
											</p>
										)}
									</div>
									<div className="flex items-center gap-3">
										<Calendar className="h-4 w-4 text-muted-foreground" />
										<span>
											Event Date:{" "}
											{format(
												new Date(user.event.date),
												"PPP 'at' p",
											)}
										</span>
									</div>
									<div className="flex items-center gap-3">
										<Clock className="h-4 w-4 text-muted-foreground" />
										<span className="text-muted-foreground text-sm">
											Created:{" "}
											{format(
												new Date(user.event.createdAt),
												"PPP",
											)}
										</span>
									</div>
								</CardContent>
							)}
							{!hasEvent && !isCreating && (
								<CardContent className="space-y-4">
									<p className="text-muted-foreground text-sm">
										This user has not booked any event yet.
										Events are created when users finalize
										their order.
									</p>
									<Button
										onClick={() => setIsCreating(true)}
										variant="outline"
									>
										Create Event & Menu
									</Button>
								</CardContent>
							)}
							{!hasEvent && isCreating && (
								<CardContent className="space-y-4 animate-in fade-in zoom-in-95">
									<EventMenuSelector 
										data={{
											eventName,
											eventDescription,
											selectedMenuItems
										}}
										onChange={(data) => {
											setEventName(data.eventName ?? "");
											setEventDescription(data.eventDescription ?? "");
											setSelectedMenuItems(data.selectedMenuItems);
										}}
										disabled={createEventMutation.isPending}
									/>
									<div className="flex justify-end gap-2 pt-4">
										<Button
											type="button"
											variant="outline"
											onClick={() => setIsCreating(false)}
											disabled={createEventMutation.isPending}
										>
											Cancel
										</Button>
										<Button
											type="button"
											onClick={() => createEventMutation.mutate()}
											disabled={createEventMutation.isPending}
										>
											{createEventMutation.isPending ? (
												<>
													<LoaderCircleIcon className="mr-2 h-4 w-4 animate-spin" />
													Creating...
												</>
											) : (
												"Create"
											)}
										</Button>
									</div>
								</CardContent>
							)}
						</Card>

						<Separator />

						{/* Cart Items Card */}
						<Card>
							<CardHeader className="pb-3">
								<div className="flex items-center justify-between">
									<CardTitle className="flex items-center gap-2 text-lg">
										<ShoppingCart className="h-5 w-5" />
										Cart Items
									</CardTitle>
									<Badge
										variant={
											hasCartItems
												? "default"
												: "secondary"
										}
									>
										{hasCartItems
											? `${user.cartItems?.length} Items`
											: "Empty"}
									</Badge>
								</div>
								<CardDescription>
									{hasCartItems
										? "Items ordered by this user"
										: "No items in cart"}
								</CardDescription>
							</CardHeader>
							{hasCartItems && user.cartItems && (
								<CardContent>
									<Table>
										<TableHeader>
											<TableRow>
												<TableHead>Item</TableHead>
												<TableHead className="text-center">
													Type
												</TableHead>
												<TableHead className="text-center">
													Qty
												</TableHead>
												<TableHead className="text-right">
													Price
												</TableHead>
												<TableHead className="text-right">
													Total
												</TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											{user.cartItems.map((cartItem) => (
												<TableRow key={cartItem.id}>
													<TableCell>
														<div className="flex flex-col">
															<span className="font-medium">
																{
																	cartItem
																		.menuItem
																		.name
																}
															</span>
															<span className="text-muted-foreground text-xs">
																{
																	cartItem
																		.menuItem
																		.category
																}
															</span>
														</div>
													</TableCell>
													<TableCell className="text-center">
														{cartItem.menuItem
															.isVeg ? (
															<div className="flex items-center justify-center gap-1">
																<Leaf className="h-4 w-4 text-green-600" />
															</div>
														) : (
															<div className="flex items-center justify-center gap-1">
																<Drumstick className="h-4 w-4 text-red-600" />
															</div>
														)}
													</TableCell>
													<TableCell className="text-center">
														{cartItem.quantity}{" "}
														{
															cartItem.menuItem
																.metrics
														}
													</TableCell>
													<TableCell className="text-right">
														₹
														{cartItem.menuItem.price.toFixed(
															2,
														)}
													</TableCell>
													<TableCell className="text-right font-medium">
														₹
														{(
															cartItem.menuItem
																.price *
															cartItem.quantity
														).toFixed(2)}
													</TableCell>
												</TableRow>
											))}
										</TableBody>
										<TableFooter>
											<TableRow>
												<TableCell colSpan={4}>
													Total
												</TableCell>
												<TableCell className="text-right font-bold">
													₹{cartTotal.toFixed(2)}
												</TableCell>
											</TableRow>
										</TableFooter>
									</Table>
								</CardContent>
							)}
							{!hasCartItems && (
								<CardContent>
									<p className="text-muted-foreground text-sm">
										This user hasn't added any items to
										their cart yet.
									</p>
								</CardContent>
							)}
						</Card>
					</div>
				</ScrollArea>
			</DialogContent>
		</Dialog>
	);
}
