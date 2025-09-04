import { Link } from "@tanstack/react-router";
import type React from "react";
import { Button } from "./ui/button";

export function NotFound({ children }: { children?: React.ReactNode }) {
	return (
		<div className="flex h-full w-full flex-col items-center justify-center gap-8 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 p-8 text-center dark:from-gray-900 dark:to-gray-800">
			{/* Large 404 or Error Icon */}
			<div className="select-none font-bold text-8xl text-gray-300 dark:text-gray-600">
				404
			</div>

			{/* Main content */}
			<div className="max-w-md space-y-4">
				<h1 className="font-semibold text-2xl text-gray-900 dark:text-gray-100">
					Page Not Found
				</h1>
				<div className="text-gray-600 text-lg dark:text-gray-400">
					{children || (
						<p>
							Sorry, the page you are looking for doesn't exist or
							has been moved.
						</p>
					)}
				</div>
			</div>

			{/* Action buttons */}
			<div className="flex flex-wrap items-center gap-4">
				<Button
					variant="outline"
					onClick={() => window.history.back()}
					className="min-w-[120px] transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
				>
					← Go Back
				</Button>
				<Button asChild className="min-w-[120px]">
					<Link to="/">🏠 Home</Link>
				</Button>
			</div>

			{/* Decorative element */}
			<div className="mt-8 text-gray-400 text-xs dark:text-gray-600">
				Lost? Don't worry, it happens to the best of us.
			</div>
		</div>
	);
}
