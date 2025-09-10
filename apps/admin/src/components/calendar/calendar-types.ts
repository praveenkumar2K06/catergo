export type CalendarProps = {
	events: CalendarEvent[];
	setEvents: (events: CalendarEvent[]) => void;
	mode: Mode;
	setMode: (mode: Mode) => void;
	date: Date;
	setDate: (date: Date) => void;
	calendarIconIsToday?: boolean;
};

export type CalendarContextType = CalendarProps & {
	setSelectedEvent: (event: CalendarEvent) => void;
};
export type CalendarEvent = {
	id: string;
	title: string;
	color: string;
	start: Date;
	end: Date;
};

export const calendarModes = ["day", "week", "month"] as const;
export type Mode = (typeof calendarModes)[number];
