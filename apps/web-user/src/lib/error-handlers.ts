import { AxiosError } from "axios";
import { toast } from "sonner";

export const handleMutationError = (
	error: Error,
	fallbackMessage: string,
	customAction?: () => void,
) => {
	console.error("Mutation Error:", error);

	if (error instanceof AxiosError) {
		// Handle Axios error
		toast.error(error.response?.statusText || fallbackMessage, {
			description: error.message,
			action: customAction
				? {
						label: "Retry",
						onClick: customAction,
					}
				: undefined,
		});
	} else {
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
	}
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
