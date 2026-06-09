import axios from "axios";

let isRefreshing = false;
let failedQueue: { resolve: Function; reject: Function }[] = [];

const processQueue = (error: any) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve();
  });
  failedQueue = [];
};

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
    const message = error.response?.data?.message;
    const shouldRefresh =
      message === "Token expired." ||
      message === "Unauthorized. No token provided.";

    if (shouldRefresh && !originalRequest._retry) {
      if (isRefreshing) {
        // Request lain menunggu refresh selesai
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => api(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/refreshtoken`,
          {},
          { withCredentials: true },
        );
        processQueue(null); // semua request yang antri dilanjutkan
        return api(originalRequest);
      } catch (err) {
        processQueue(err); // semua request yang antri di-reject
        window.location.href = "/login";
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default api;
