import { Link, useMatches } from "@tanstack/react-router";
import { Home } from "lucide-react";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export function PathBreadcrumbs() {
	const matches = useMatches();

	if (matches.some((match) => match.status === "pending")) return null;
	const matchesWithCrumbs = matches.filter(
		// @ts-ignore
		(match) => match.loaderData?.crumb,
	);

	if (matchesWithCrumbs.length === 0) {
		return null;
	}

	return (
		<Breadcrumb>
			<BreadcrumbList>
				<BreadcrumbItem>
					<BreadcrumbLink asChild>
						<Link to="/">
							<Home className="h-4 w-4" />
						</Link>
					</BreadcrumbLink>
				</BreadcrumbItem>

				{matchesWithCrumbs.map((match) => (
					<div key={match.id} className="flex items-center gap-2">
						<BreadcrumbSeparator />
						<BreadcrumbItem>
							<BreadcrumbLink asChild>
								<Link to={match.pathname}>
									{/* @ts-ignore */}
									{match.loaderData?.crumb}
								</Link>
							</BreadcrumbLink>
						</BreadcrumbItem>
					</div>
				))}
			</BreadcrumbList>
		</Breadcrumb>
	);
}
