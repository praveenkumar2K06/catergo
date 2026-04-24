import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LoaderCircleIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/auth";
import { DateTimePicker } from "@/components/form/date-time-picker";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { createUser, updateUser } from "@/lib/api/users";
import { createEvent } from "@/lib/api/events";
import { createCartItem } from "@/lib/api/cart";
import { EventMenuSelector } from "@/features/users/event-menu-selector";
import type { User } from "@/types";

interface UserFormProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSuccess?: () => void;
	initialData?: User;
}

interface UserFormData {
	name: string;
	phone: string;
	address: string;
	pincode: string;
	numberOfPeople: number;
	selectedDate: string;
	eventName?: string;
	eventDescription?: string;
	selectedMenuItems: Record<string, number>; // menuId -> quantity
}

const defaultFormData: UserFormData = {
	name: "",
	phone: "",
	address: "",
	pincode: "",
	numberOfPeople: 1,
	selectedDate: new Date().toISOString(),
	eventName: "",
	eventDescription: "",
	selectedMenuItems: {},
};

export function UserForm({
	open,
	onOpenChange,
	onSuccess,
	initialData,
}: UserFormProps) {
	const { user } = useAuth();
	const queryClient = useQueryClient();
	const isEditing = !!initialData?.id;

	const [formData, setFormData] = useState<UserFormData>(defaultFormData);

	const [step, setStep] = useState<"user" | "event">("user");

	// Reset form when dialog opens/closes or initialData changes
	useEffect(() => {
		if (open) {
			setStep("user");
			if (initialData) {
				setFormData({
					name: initialData.name,
					phone: initialData.phone,
					address: initialData.address,
					pincode: initialData.pincode,
					numberOfPeople: initialData.numberOfPeople,
					selectedDate: new Date(
						initialData.selectedDate,
					).toISOString(),
					eventName: initialData.event?.name ?? "",
					eventDescription: initialData.event?.description ?? "",
					selectedMenuItems: initialData.cartItems?.reduce((acc, item) => ({
						...acc,
						[item.menuItem.id]: item.quantity,
					}), {}) ?? {},
				});
			} else {
				setFormData(defaultFormData);
			}
		}
	}, [open, initialData]);

	const createEventMutation = useMutation({
		mutationFn: async ({ userId, adminId, name, date, description }: { userId: string, adminId: string, name: string, date: string, description?: string }) => {
			await createEvent({ userId, adminId, name, date, description });
			
			const promises = Object.entries(formData.selectedMenuItems).map(
				([menuId, quantity]) => {
					if (quantity > 0) {
						return createCartItem({
							userId,
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
			queryClient.invalidateQueries({
				queryKey: ["users"],
			});
			queryClient.invalidateQueries({
				queryKey: ["events"],
			});
			toast.success("User, Event, and Menu Items created successfully");
			onOpenChange(false);
			onSuccess?.();
		},
		onError: (error) => {
			toast.error("User created, but failed to create event/menu items", {
				description: error.message,
			});
			queryClient.invalidateQueries({
				queryKey: ["users"],
			});
			onOpenChange(false);
			onSuccess?.();
		},
	});

	const createMutation = useMutation({
		mutationFn: createUser,
		onSuccess: (data) => {
			if (formData.eventName || Object.keys(formData.selectedMenuItems).length > 0) {
				createEventMutation.mutate({
					userId: data.id,
					adminId: user?.userId ?? "",
					name: formData.eventName || `Event for ${data.name}`,
					date: formData.selectedDate,
					...(formData.eventDescription && { description: formData.eventDescription }),
				});
			} else {
				queryClient.invalidateQueries({
					queryKey: ["users"],
				});
				toast.success("User created successfully");
				onOpenChange(false);
				onSuccess?.();
			}
		},
		onError: (error) => {
			toast.error("Failed to create user", {
				description: error.message,
			});
		},
	});

	const updateMutation = useMutation({
		mutationFn: ({
			id,
			data,
		}: {
			id: string;
			data: Partial<UserFormData>;
		}) => updateUser(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["users"],
			});
			toast.success("User updated successfully");
			onOpenChange(false);
			onSuccess?.();
		},
		onError: (error) => {
			toast.error("Failed to update user", {
				description: error.message,
			});
		},
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		// Validation
		if (!formData.name.trim()) {
			toast.error("Name is required");
			return;
		}
		if (!formData.phone.trim()) {
			toast.error("Phone is required");
			return;
		}
		if (!formData.address.trim()) {
			toast.error("Address is required");
			return;
		}
		if (!formData.pincode.trim()) {
			toast.error("Pincode is required");
			return;
		}
		if (formData.numberOfPeople < 1) {
			toast.error("Number of people must be at least 1");
			return;
		}

		if (isEditing && initialData) {
			updateMutation.mutate({ id: initialData.id, data: formData });
		} else {
			if (step === "user") {
				setStep("event");
			} else {
				createMutation.mutate({
					...formData,
					adminId: user?.userId ?? "",
				});
			}
		}
	};

	const isPending = createMutation.isPending || updateMutation.isPending || createEventMutation.isPending;

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-h-screen sm:max-w-125">
				<DialogHeader>
					<DialogTitle>
						{isEditing ? "Edit User" : step === "user" ? "Add New User" : "Add Event & Menu (Optional)"}
					</DialogTitle>
				</DialogHeader>
				<ScrollArea className="max-h-[90vh] overflow-y-auto px-3">
					<form onSubmit={handleSubmit} className="space-y-4 pt-4">
						{step === "user" ? (
							<>
								<div className="space-y-2">
									<Label htmlFor="user-name">Name</Label>
									<Input
										id="user-name"
										value={formData.name}
										onChange={(e) =>
											setFormData((prev) => ({
												...prev,
												name: e.target.value,
											}))
										}
										placeholder="Enter user name"
										disabled={isPending}
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="user-phone">Phone</Label>
									<Input
										id="user-phone"
										value={formData.phone}
										onChange={(e) =>
											setFormData((prev) => ({
												...prev,
												phone: e.target.value,
											}))
										}
										placeholder="Enter phone number"
										disabled={isPending}
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="user-address">Address</Label>
									<Input
										id="user-address"
										value={formData.address}
										onChange={(e) =>
											setFormData((prev) => ({
												...prev,
												address: e.target.value,
											}))
										}
										placeholder="Enter address"
										disabled={isPending}
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="user-pincode">Pincode</Label>
									<Input
										id="user-pincode"
										value={formData.pincode}
										onChange={(e) =>
											setFormData((prev) => ({
												...prev,
												pincode: e.target.value,
											}))
										}
										placeholder="Enter pincode"
										disabled={isPending}
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="user-numberOfPeople">
										Number of People
									</Label>
									<Input
										id="user-numberOfPeople"
										type="number"
										min={1}
										value={formData.numberOfPeople}
										onChange={(e) =>
											setFormData((prev) => ({
												...prev,
												numberOfPeople:
													Number.parseInt(
														e.target.value,
														10,
													) || 1,
											}))
										}
										disabled={isPending}
									/>
								</div>

								<div className="space-y-2">
									<Label>Event Date & Time</Label>
									<DateTimePicker
										field={{
											value: formData.selectedDate,
											onChange: (value) =>
												setFormData((prev) => ({
													...prev,
													selectedDate: value,
												})),
										}}
									/>
								</div>

								<div className="flex justify-end gap-2 pt-4">
									<Button
										type="button"
										variant="outline"
										onClick={() => onOpenChange(false)}
										disabled={isPending}
									>
										Cancel
									</Button>
									<Button type="button" onClick={() => setStep("event")} disabled={isPending}>
										{isEditing ? "Next" : "Next"} -{">"}
									</Button>
								</div>
							</>
						) : (
							<>
								<EventMenuSelector
									data={{
										eventName: formData.eventName,
										eventDescription: formData.eventDescription,
										selectedMenuItems: formData.selectedMenuItems,
									}}
									onChange={(data) => {
										setFormData((prev) => ({
											...prev,
											eventName: data.eventName,
											eventDescription: data.eventDescription,
											selectedMenuItems: data.selectedMenuItems,
										}));
									}}
									disabled={isPending}
								/>

								<div className="flex justify-end gap-2 pt-4">
									<Button
										type="button"
										variant="outline"
										onClick={() => setStep("user")}
										disabled={isPending}
									>
										Back
									</Button>
									<Button type="submit" disabled={isPending}>
										{isPending ? (
											<>
												<LoaderCircleIcon className="mr-2 h-4 w-4 animate-spin" />
												Saving...
											</>
										) : isEditing ? (
											"Update"
										) : (
											"Create"
										)}
									</Button>
								</div>
							</>
						)}
					</form>
				</ScrollArea>
			</DialogContent>
		</Dialog>
	);
}
