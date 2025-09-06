import CalendarBody from "./body/calendar-body";
import CalendarProvider from "./calendar-provider";
import type { CalendarProps } from "./calendar-types";
import CalendarHeaderActions from "./header/actions/calendar-header-actions";
import CalendarHeaderActionsMode from "./header/actions/calendar-header-actions-mode";
import CalendarHeader from "./header/calendar-header";
import CalendarHeaderDate from "./header/date/calendar-header-date";

export default function Calendar({
	events,
	setEvents,
	mode,
	setMode,
	date,
	setDate,
	calendarIconIsToday = true,
}: CalendarProps) {
	return (
		<CalendarProvider
			events={events}
			setEvents={setEvents}
			mode={mode}
			setMode={setMode}
			date={date}
			setDate={setDate}
			calendarIconIsToday={calendarIconIsToday}
		>
			<CalendarHeader>
				<CalendarHeaderDate />
				<CalendarHeaderActions>
					<CalendarHeaderActionsMode />
				</CalendarHeaderActions>
			</CalendarHeader>
			<CalendarBody />
		</CalendarProvider>
	);
}
