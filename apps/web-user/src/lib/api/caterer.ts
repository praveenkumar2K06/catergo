import axios from "axios";

export interface CatererResponse {
	success: boolean;
	message: string;
}

export const verifyCaterer = async (catererId: string) => {
	await new Promise((r) => setTimeout(r, 500));
	return axios
		.post(`${import.meta.env.VITE_SERVER_URL}/api/caterer/verify`, {
			catererId,
		})
		.then((res) => res.data as Promise<CatererResponse>);
};
