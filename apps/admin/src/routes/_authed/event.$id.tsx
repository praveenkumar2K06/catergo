import { createFileRoute } from "@tanstack/react-router";
import EventDetailPage from "@/features/event/event-detail-page";

export const Route = createFileRoute("/_authed/event/$id")({
	component: EventDetailPage,
	loader: ({ params }) => {
		return {
			crumb: "Event Detail",
			eventId: params.id,
		};
	},
});
