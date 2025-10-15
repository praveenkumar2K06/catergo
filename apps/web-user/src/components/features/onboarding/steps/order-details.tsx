import { CalendarIcon, Users } from "lucide-react";
import { DateTimePicker } from "@/components/form/date-time-picker";
import NextImageLoading from "@/components/ui/image-loader";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUnavailableDates } from "@/hooks/use-settings";

interface OrderDetailsProps {
	numberOfPeople: number;
	selectedDate: Date | undefined;
	illustration?: string;
	adminId: string;
	onNumberOfPeopleChange: (count: number) => void;
	onDateChange: (date: Date | undefined) => void;
}

export function OrderDetails({
	numberOfPeople,
	selectedDate,
	illustration,
	adminId,
	onNumberOfPeopleChange,
	onDateChange,
}: OrderDetailsProps) {
	const { data: unavailableDatesData } = useUnavailableDates(adminId);
	const blockedDates =
		unavailableDatesData?.unavailableDates?.map((date) => new Date(date)) ||
		[];

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
				<DateTimePicker
					blockedDates={blockedDates}
					field={{
						value:
							selectedDate !== undefined
								? selectedDate.toString()
								: "",
						onChange: (value) => {
							const date = new Date(value);
							onDateChange(date);
						},
					}}
				/>
			</div>
		</div>
	);
}
