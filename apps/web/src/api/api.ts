import axios from "axios";

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
      originalRequest &&
      !originalRequest?._retry &&
      !originalRequest?.url?.includes("/auth/refresh-token")
    ) {
      originalRequest._retry = true;

      try {
        await api.post("/auth/refresh-token");
        return api(originalRequest);
      } catch (refreshErr) {
        return Promise.reject(refreshErr);
      }
    }
    return Promise.reject(error);
  },
);

export default api;
