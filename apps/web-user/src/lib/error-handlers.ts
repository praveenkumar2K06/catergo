import { toast } from "sonner";

export const handleMutationError = (
	error: Error,
	fallbackMessage: string,
	customAction?: () => void,
) => {
	console.error("Mutation Error:", error);

	// Show user-friendly error message
	toast.error(fallbackMessage, {
		description: error.message,
		action: customAction
			? {
					label: "Retry",
					onClick: customAction,
				}
			: undefined,
	});
};

export const handleMutationSuccess = (
	message: string,
	description?: string,
	action?: { label: string; onClick: () => void },
) => {
	toast.success(message, {
		description,
		action,
	});
};
