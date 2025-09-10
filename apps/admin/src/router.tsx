import { createRouter as createTanstackRouter } from "@tanstack/react-router";
import { NotFound } from "./components/not-found";
import ErrorDisplay from "./components/shared/layout/error";
import Loader from "./components/shared/layout/loader";
import * as TanstackQuery from "./integrations/tanstack-query/root-provider";
// Import the generated route tree
import { routeTree } from "./routeTree.gen";

// Create a new router instance
export const createRouter = () => {
	const rqContext = TanstackQuery.getContext();

	const router = createTanstackRouter({
		routeTree,
		context: { ...rqContext },
		defaultPreload: "intent",
		defaultViewTransition: true,
		defaultErrorComponent: () => <ErrorDisplay type="server" />,
		defaultPendingComponent: () => <Loader variant="catering" />,
		defaultNotFoundComponent: NotFound,
		Wrap: (props: { children: React.ReactNode }) => {
			return (
				<TanstackQuery.Provider {...rqContext}>
					{props.children}
				</TanstackQuery.Provider>
			);
		},
	});

	return router;
};

// Register the router instance for type safety
declare module "@tanstack/react-router" {
	interface Register {
		router: ReturnType<typeof createRouter>;
	}
}
