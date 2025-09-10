import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { useOrder } from "@/components/providers/order-provider";
import ErrorDisplay from "@/components/shared/layout/error";
import Loader from "@/components/shared/layout/loader";
import { verifyCaterer } from "@/lib/api/caterer";

export const Route = createFileRoute("/caterer/$id")({
	component: RouteComponent,
});

function RouteComponent() {
	const { id: catererId } = Route.useParams();
	const navigate = Route.useNavigate();
	const { setCatererId } = useOrder();

	const { data, isError } = useQuery({
		queryKey: ["caterer", catererId],
		queryFn: () => verifyCaterer(catererId),
	});

	useEffect(() => {
		if (data) {
			setCatererId(catererId);
			navigate({ to: "/menu" });
		}
	}, [data, catererId, navigate, setCatererId]);

	if (isError) {
		return <ErrorDisplay message="Caterer not found or invalid link." />;
	}

	return <Loader variant="catering" />;
}
