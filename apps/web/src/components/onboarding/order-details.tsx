import { format, isSameDay } from "date-fns";
import { CalendarIcon, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface OrderDetailsProps {
	numberOfPeople: number;
	selectedDate: Date | undefined;
	blockedDates: Date[];
	onNumberOfPeopleChange: (count: number) => void;
	onDateChange: (date: Date | undefined) => void;
}

export function OrderDetails({
	numberOfPeople,
	selectedDate,
	blockedDates,
	onNumberOfPeopleChange,
	onDateChange,
}: OrderDetailsProps) {
	return (
		<>
			<div className="space-y-2">
				<Label htmlFor="people" className="flex items-center gap-2">
					<Users className="h-4 w-4 text-primary" />
					Number of People
				</Label>
				<Input
					id="people"
					type="number"
					min="1"
					placeholder="How many people?"
					value={numberOfPeople}
					onChange={(e) =>
						onNumberOfPeopleChange(
							Number.parseInt(e.target.value, 10) || 1,
						)
					}
				/>
			</div>
			<div className="space-y-2">
				<Label className="flex items-center gap-2">
					<CalendarIcon className="h-4 w-4 text-primary" />
					Delivery Date
				</Label>
				<Popover>
					<PopoverTrigger asChild>
						<Button
							variant="outline"
							className={cn(
								"w-full justify-start text-left font-normal",
								!selectedDate && "text-muted-foreground",
							)}
						>
							<CalendarIcon className="mr-2 h-4 w-4" />
							{selectedDate
								? format(selectedDate, "PPP")
								: "Pick a date"}
						</Button>
					</PopoverTrigger>
					<PopoverContent className="w-auto p-0">
						<Calendar
							mode="single"
							selected={selectedDate}
							onSelect={onDateChange}
							disabled={(date) =>
								blockedDates.some((d) => isSameDay(d, date)) ||
								date < new Date()
							}
							autoFocus
						/>
					</PopoverContent>
				</Popover>
			</div>
		</>
	);
}
