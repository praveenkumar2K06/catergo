import { format, isSameDay } from "date-fns";
import { cn } from "../../../lib/utils";

export default function CalendarBodyHeader({
	date,
	onlyDay = false,
}: {
	date: Date;
	onlyDay?: boolean;
}) {
	const isToday = isSameDay(date, new Date());

	return (
		<div className="sticky top-0 z-10 flex w-full items-center justify-center gap-1 border-b bg-background py-2">
			<span
				className={cn(
					"font-medium text-xs",
					isToday ? "text-primary" : "text-muted-foreground",
				)}
			>
				{format(date, "EEE")}
			</span>
			{!onlyDay && (
				<span
					className={cn(
						"font-medium text-xs",
						isToday ? "font-bold text-primary" : "text-foreground",
					)}
				>
					{format(date, "dd")}
				</span>
			)}
		</div>
	);
}
