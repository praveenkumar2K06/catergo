import { useNavigate } from "@tanstack/react-router";
import { CalendarContext } from "./calendar-context";
import type { CalendarEvent, Mode } from "./calendar-types";

export default function CalendarProvider({
	events,
	setEvents,
	mode,
	setMode,
	date,
	setDate,
	calendarIconIsToday = true,
	children,
}: {
	events: CalendarEvent[];
	setEvents: (events: CalendarEvent[]) => void;
	mode: Mode;
	setMode: (mode: Mode) => void;
	date: Date;
	setDate: (date: Date) => void;
	calendarIconIsToday: boolean;
	children: React.ReactNode;
}) {
	const navigate = useNavigate();

	const handleSelectedEventChange = (event: CalendarEvent) => {
		navigate({
			to: "/event/$id",
			params: { id: event.id },
		});
	};

	return (
		<CalendarContext.Provider
			value={{
				events,
				setEvents,
				mode,
				setMode,
				date,
				setDate,
				calendarIconIsToday,
				setSelectedEvent: handleSelectedEventChange,
			}}
		>
			{children}
		</CalendarContext.Provider>
	);
}
