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
} from "lucide-react";
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
	if (!user) return null;

	const hasEvent = !!user.event;
	const hasCartItems = user.cartItems && user.cartItems.length > 0;

	const cartTotal =
		user.cartItems?.reduce((total, item) => {
			return total + item.menuItem.price * item.quantity;
		}, 0) ?? 0;

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-h-screen sm:max-w-[600px]">
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
							{!hasEvent && (
								<CardContent>
									<p className="text-muted-foreground text-sm">
										This user has not booked any event yet.
										Events are created when users finalize
										their order.
									</p>
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
