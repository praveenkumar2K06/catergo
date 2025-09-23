import axios from "axios";

export interface CatererResponse {
	success: boolean;
	message: string;
}

export interface GetAllCatererResponse {
	success: boolean;
	data: { id: string; email: string; name: string }[];
}

export const verifyCaterer = async (catererId: string) => {
	await new Promise((r) => setTimeout(r, 500));
	return axios
		.post(`${import.meta.env.VITE_SERVER_URL}/api/caterer/verify`, {
			catererId,
		})
		.then((res) => res.data as Promise<CatererResponse>);
};

export const getAllCaterers = async () => {
	await new Promise((r) => setTimeout(r, 500));
	return axios
		.get(`${import.meta.env.VITE_SERVER_URL}/api/caterer/all`)
		.then((res) => res.data as Promise<GetAllCatererResponse>);
};
