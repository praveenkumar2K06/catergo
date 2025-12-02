import { CalendarIcon, Minus, Pencil, Plus, Users } from "lucide-react";
import { useState } from "react";
import { DateTimePicker } from "@/components/form/date-time-picker";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface EditUserDetailsDialogProps {
	numberOfPeople: number;
	selectedDate: Date | undefined;
	blockedDates?: Date[];
	onSave: (numberOfPeople: number, selectedDate: Date | undefined) => void;
	isLoading?: boolean;
	trigger?: React.ReactNode;
}

export function EditUserDetailsDialog({
	numberOfPeople,
	selectedDate,
	blockedDates = [],
	onSave,
	isLoading = false,
	trigger,
}: EditUserDetailsDialogProps) {
	const [open, setOpen] = useState(false);
	const [editedNumberOfPeople, setEditedNumberOfPeople] =
		useState(numberOfPeople);
	const [editedDate, setEditedDate] = useState<Date | undefined>(
		selectedDate,
	);

	const handleDateSelect = (selected: Date | undefined) => {
		if (selected) {
			const newDate = new Date(editedDate || new Date());
			newDate.setFullYear(selected.getFullYear());
			newDate.setMonth(selected.getMonth());
			newDate.setDate(selected.getDate());
			setEditedDate(newDate);
		}
	};

	const handleSave = () => {
		onSave(editedNumberOfPeople, editedDate);
		setOpen(false);
	};

	const handleOpenChange = (isOpen: boolean) => {
		if (isOpen) {
			setEditedNumberOfPeople(numberOfPeople);
			setEditedDate(selectedDate);
		}
		setOpen(isOpen);
	};

	const incrementPeople = () => {
		setEditedNumberOfPeople((prev) => prev + 1);
	};

	const decrementPeople = () => {
		setEditedNumberOfPeople((prev) => Math.max(1, prev - 1));
	};

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogTrigger asChild>
				{trigger || (
					<Button variant="ghost" size="sm" className="h-6 px-2">
						<Pencil className="h-3 w-3" />
						<span className="sr-only">Edit details</span>
					</Button>
				)}
			</DialogTrigger>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Edit Order Details</DialogTitle>
					<DialogDescription>
						Update the number of people and delivery date for your
						order.
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-6 py-4">
					{/* Number of People */}
					<div className="space-y-3">
						<Label className="flex items-center gap-2 font-medium text-sm">
							<div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 transition-colors group-focus-within:bg-primary/20">
								<Users className="h-4 w-4 text-primary" />
							</div>
							Number of People
						</Label>
						<div className="flex items-center gap-4">
							<Button
								type="button"
								variant="outline"
								size="icon"
								onClick={decrementPeople}
								disabled={editedNumberOfPeople <= 1}
							>
								<Minus className="h-4 w-4" />
							</Button>
							<span className="min-w-12 text-center font-semibold text-xl">
								{editedNumberOfPeople}
							</span>
							<Button
								type="button"
								variant="outline"
								size="icon"
								onClick={incrementPeople}
							>
								<Plus className="h-4 w-4" />
							</Button>
						</div>
					</div>

					{/* Date & Time */}
					<Label className="flex items-center gap-2 font-medium text-base">
						<div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 transition-colors group-focus-within:bg-primary/20">
							<CalendarIcon className="h-4 w-4 text-primary" />
						</div>
						Delivery Date
					</Label>
					<DateTimePicker
						blockedDates={blockedDates}
						field={{
							value:
								selectedDate !== undefined
									? selectedDate.toString()
									: "",
							onChange: (value) => {
								const date = new Date(value);
								handleDateSelect(date);
							},
						}}
					/>
				</div>

				<DialogFooter>
					<Button
						variant="outline"
						onClick={() => setOpen(false)}
						disabled={isLoading}
					>
						Cancel
					</Button>
					<Button onClick={handleSave} disabled={isLoading}>
						{isLoading ? "Saving..." : "Save Changes"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
