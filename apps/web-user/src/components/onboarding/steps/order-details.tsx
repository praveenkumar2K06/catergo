import { format, isSameDay } from "date-fns";
import { CalendarIcon, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import NextImageLoading from "@/components/ui/image-loader";
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
	illustration?: string;
	onNumberOfPeopleChange: (count: number) => void;
	onDateChange: (date: Date | undefined) => void;
}

export function OrderDetails({
	numberOfPeople,
	selectedDate,
	blockedDates,
	illustration,
	onNumberOfPeopleChange,
	onDateChange,
}: OrderDetailsProps) {
	return (
		<div className="space-y-6">
			{illustration && (
				<div className="mb-6 flex items-center justify-center">
					<NextImageLoading
						src={illustration}
						alt="Order details illustration"
						className="h-auto max-w-xs"
					/>
				</div>
			)}
			<div className="group space-y-3">
				<Label
					htmlFor="people"
					className="flex items-center gap-2 font-medium text-base"
				>
					<div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 transition-colors group-focus-within:bg-primary/20">
						<Users className="h-4 w-4 text-primary" />
					</div>
					Number of People
				</Label>
				<Input
					id="people"
					type="number"
					min="1"
					placeholder="How many people will be dining?"
					value={numberOfPeople || ""}
					onChange={(e) =>
						onNumberOfPeopleChange(
							Number.parseInt(e.target.value, 10) || 1,
						)
					}
					className="h-12 px-4 text-base transition-all duration-200 focus:ring-2 focus:ring-primary/20"
					autoFocus
				/>
			</div>

			<div className="group space-y-3">
				<Label className="flex items-center gap-2 font-medium text-base">
					<div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 transition-colors group-focus-within:bg-primary/20">
						<CalendarIcon className="h-4 w-4 text-primary" />
					</div>
					Delivery Date
				</Label>
				<Popover>
					<PopoverTrigger asChild>
						<Button
							variant="outline"
							className={cn(
								"h-12 w-full justify-start text-left font-normal text-base transition-all duration-200 hover:bg-muted/50 focus:ring-2 focus:ring-primary/20",
								!selectedDate && "text-muted-foreground",
								selectedDate && "text-foreground",
							)}
						>
							<CalendarIcon className="mr-3 h-4 w-4" />
							{selectedDate
								? format(selectedDate, "EEEE, MMMM do, yyyy")
								: "Select your preferred delivery date"}
						</Button>
					</PopoverTrigger>
					<PopoverContent
						className="w-auto border-border/50 p-0 shadow-lg"
						align="start"
					>
						<Calendar
							mode="single"
							selected={selectedDate}
							onSelect={onDateChange}
							disabled={(date) =>
								blockedDates.some((d) => isSameDay(d, date)) ||
								date < new Date()
							}
							className="rounded-lg"
						/>
					</PopoverContent>
				</Popover>
			</div>
		</div>
	);
}
