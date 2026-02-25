import axios from "axios";
// import { refreshToken } from "../auth/AuthProvider";

// const VITE_API_URL = import.meta.env.VITE_API_URL as string;

const api = axios.create({
	baseURL: "/api",
	withCredentials: true,
	timeout: 60000,
	timeoutErrorMessage: "Request took too long. Please try again.",
});

api.interceptors.response.use(
	(res) => res,
	async (error) => {
		const originalRequest = error.config;
		if (
			error.response?.status === 401 &&
			!originalRequest?._retry &&
			!originalRequest?.url?.includes("/auth/refresh-token")
		) {
			originalRequest.retry = true;
			// await refreshToken();
			return api(originalRequest); // Retry original request
		}
		return Promise.reject(error);
	},
);

export default api;
