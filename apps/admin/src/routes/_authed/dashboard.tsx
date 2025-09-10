import { useSuspenseQuery } from "@tanstack/react-query";
import {
	createFileRoute,
	useNavigate,
	useSearch,
} from "@tanstack/react-router";
import { addHours } from "date-fns";
import { useMemo, useState } from "react";
import z from "zod";
import Calendar from "@/components/calendar/calendar";
import { EVENT_COLORS } from "@/components/calendar/calendar-tailwind-classes";
import type { CalendarEvent, Mode } from "@/components/calendar/calendar-types";
import { fetchEventsQuery } from "@/lib/api/events";

const calendarSearchSchema = z.object({
	month: z
		.number()
		.min(1)
		.max(12)
		.default(new Date().getMonth() + 1),
});

export const Route = createFileRoute("/_authed/dashboard")({
	component: DashboardPage,
	validateSearch: calendarSearchSchema,
	loaderDeps: ({ search }) => {
		return {
			month: search.month,
		};
	},
	loader: async ({ context, deps }) => {
		await context.queryClient.ensureQueryData(fetchEventsQuery(deps.month));

		return {
			crumb: "Home",
		};
	},
});

function DashboardPage() {
	const search = useSearch({ from: "/_authed/dashboard" });
	const navigate = useNavigate();

	const [mode, setMode] = useState<Mode>("month");
	const [date, setDate] = useState(
		new Date(new Date().getFullYear(), search.month - 1),
	);
	const { data } = useSuspenseQuery(fetchEventsQuery(date.getMonth() + 1));

	const events = useMemo<CalendarEvent[]>(() => {
		return data.data.map((event, idx) => {
			const start = new Date(event.date);
			return {
				id: event.id,
				title: event.name,
				color: EVENT_COLORS[idx % EVENT_COLORS.length],
				start,
				end: addHours(start, 1),
			};
		});
	}, [data]);

	const setNewDate = (newDate: Date) => {
		setDate(newDate);
		navigate({
			to: "/",
			search: { month: newDate.getMonth() + 1 },
			replace: true,
		});
	};

	return (
		<Calendar
			events={events}
			setEvents={() => {}}
			mode={mode}
			setMode={setMode}
			date={date}
			setDate={setNewDate}
		/>
	);
}
