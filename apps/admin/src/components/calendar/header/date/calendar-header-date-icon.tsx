import { format } from "date-fns";
import { useCalendarContext } from "../../calendar-context";
export default function CalendarHeaderDateIcon() {
	const { calendarIconIsToday, date: calendarDate } = useCalendarContext();
	const date = calendarIconIsToday ? new Date() : calendarDate;
	return (
		<div className="flex size-14 flex-col items-start overflow-hidden rounded-lg border">
			<p className="flex h-6 w-full items-center justify-center bg-primary text-center font-semibold text-background text-xs uppercase">
				{format(date, "MMM")}
			</p>
			<p className="flex w-full items-center justify-center font-bold text-lg">
				{format(date, "dd")}
			</p>
		</div>
	);
}
