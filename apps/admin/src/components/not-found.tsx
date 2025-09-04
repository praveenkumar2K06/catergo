import { Link } from "@tanstack/react-router";
import type React from "react";
import { Button } from "./ui/button";

export function NotFound({ children }: { children?: React.ReactNode }) {
	return (
		<div className="h-full w-full flex flex-col items-center justify-center gap-8 p-8 text-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-xl">
			{/* Large 404 or Error Icon */}
			<div className="text-8xl font-bold text-gray-300 dark:text-gray-600 select-none">
				404
			</div>

			{/* Main content */}
			<div className="max-w-md space-y-4">
				<h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
					Page Not Found
				</h1>
				<div className="text-gray-600 dark:text-gray-400 text-lg">
					{children || (
						<p>
							Sorry, the page you are looking for doesn't exist or has been
							moved.
						</p>
					)}
				</div>
			</div>

			{/* Action buttons */}
			<div className="flex items-center gap-4 flex-wrap">
				<Button
					variant="outline"
					onClick={() => window.history.back()}
					className="min-w-[120px] hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
				>
					← Go Back
				</Button>
				<Button asChild className="min-w-[120px]">
					<Link to="/">🏠 Home</Link>
				</Button>
			</div>

			{/* Decorative element */}
			<div className="mt-8 text-xs text-gray-400 dark:text-gray-600">
				Lost? Don't worry, it happens to the best of us.
			</div>
		</div>
	);
}
