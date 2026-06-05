import api from "@/lib/axiosBackend";

export const login = (data: { username: string; password: string }) =>
  api.post("/api/auth/login", data);

export const logout = () => api.post("/api/auth/logout");
