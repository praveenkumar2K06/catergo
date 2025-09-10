import { useQuery } from "@tanstack/react-query";
import { fetchEventByIdQuery } from "@/lib/api/events";
import { Route } from "@/routes/_authed/event.$id";
import {
	CustomerInformationCard,
	ErrorState,
	EventDetailsCard,
	EventHeader,
	LoadingState,
	NotFoundState,
	OrderItemsCard,
	QuickStatsCard,
} from "./components";

export default function EventDetailPage() {
	const { id } = Route.useParams();

	const { data, isPending, isError } = useQuery(fetchEventByIdQuery(id));

	if (isPending) {
		return <LoadingState />;
	}

	if (isError) {
		return <ErrorState />;
	}

	const event = data.data;
	if (!event) {
		return <NotFoundState />;
	}

	return (
		<div className="container mx-auto space-y-6 py-6">
			{/* Header */}
			<EventHeader eventName={event.name} eventId={event.id} />

			<div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
				{/* Event Details */}
				<div className="space-y-6 lg:col-span-2">
					<EventDetailsCard
						eventDate={event.date}
						createdAt={event.createdAt}
						numberOfPeople={event.user?.numberOfPeople}
					/>

					{/* Customer Information */}
					{event.user && (
						<CustomerInformationCard user={event.user} />
					)}

					{/* Cart Items */}
					{event.user?.cartItems && (
						<OrderItemsCard cartItems={event.user.cartItems} />
					)}
				</div>

				{/* Sidebar */}
				<div className="space-y-6">
					{/* Quick Stats */}
					<QuickStatsCard
						cartItems={event.user?.cartItems}
						numberOfPeople={event.user?.numberOfPeople}
					/>
				</div>
			</div>
		</div>
	);
}
