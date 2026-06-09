import axios from "axios";

const api = axios.create({
  // baseURL: process.env.NEXT_PUBLIC_BACKEND_URL, //local
  baseURL: process.env.NEXT_PUBLIC_API_URL, //render
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.data?.message === "Token expired." &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/refresh`,
          {},
          { withCredentials: true },
        );
        return api(originalRequest); // retry request asal
      } catch {
        // Refresh gagal → redirect ke login
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  },
);

export default api;
