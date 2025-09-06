import {
	addDays,
	addMonths,
	addWeeks,
	endOfWeek,
	format,
	startOfWeek,
	subDays,
	subMonths,
	subWeeks,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCalendarContext } from "../../calendar-context";

export default function CalendarHeaderDateChevrons() {
	const { mode, date, setDate } = useCalendarContext();

	function handleDateBackward() {
		switch (mode) {
			case "month":
				setDate(subMonths(date, 1));
				break;
			case "week":
				setDate(subWeeks(date, 1));
				break;
			case "day":
				setDate(subDays(date, 1));
				break;
		}
	}

	function getDisplayText(date: Date, mode: "month" | "week" | "day") {
		switch (mode) {
			case "month":
				return format(date, "MMMM yyyy");
			case "week": {
				const start = startOfWeek(date, { weekStartsOn: 1 });
				const end = endOfWeek(date, { weekStartsOn: 1 });
				if (format(start, "MMM") === format(end, "MMM")) {
					return `${format(start, "MMM d")} – ${format(end, "d, yyyy")}`;
				}
				return `${format(start, "MMM d")} – ${format(end, "MMM d, yyyy")}`;
			}
			case "day":
				return format(date, "MMMM d, yyyy");
		}
	}

	function handleDateForward() {
		switch (mode) {
			case "month":
				setDate(addMonths(date, 1));
				break;
			case "week":
				setDate(addWeeks(date, 1));
				break;
			case "day":
				setDate(addDays(date, 1));
				break;
		}
	}

	return (
		<div className="flex items-center gap-2">
			<Button
				variant="outline"
				className="h-7 w-7 p-1"
				onClick={handleDateBackward}
			>
				<ChevronLeft className="min-h-5 min-w-5" />
			</Button>

			<span className="min-w-[140px] text-center font-medium">
				{getDisplayText(date, mode)}
			</span>

			<Button
				variant="outline"
				className="h-7 w-7 p-1"
				onClick={handleDateForward}
			>
				<ChevronRight className="min-h-5 min-w-5" />
			</Button>
		</div>
	);
}
