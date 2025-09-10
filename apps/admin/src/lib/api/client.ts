import axios from "axios";

export const apiClient = axios.create({
	baseURL: import.meta.env.VITE_SERVER_URL,
	withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
	const token = localStorage.getItem("admin_token");
	const parsed = token ? JSON.parse(token) : null;
	if (parsed) {
		config.headers.Authorization = `Bearer ${parsed.token}`;
	}
	return config;
});
