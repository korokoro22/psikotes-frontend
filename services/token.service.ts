import api from "@/lib/axiosBackend";

export const getAllToken = (
  currentPage: number,
  limit: number,
  status?: string,
  startDate?: string,
  endDate?: string,
) =>
  api.get(
    `/api/admin/token?page=${currentPage}&limit=${limit}&status=${status || ""}&startDate=${startDate || ""}&endDate=${endDate || ""}`,
  );

export const postToken = (data: {
  tests: string[];
  kuota: number;
  activeDate: string;
  expiredDate: string;
}) => api.post("/api/admin/token", data);

export const statusToken = (id: number, status: any) =>
  api.put(`/api/admin/token/${id}`, status);

export const getFormToken = () => api.get("/api/admin/token/form");

export const getAllStatusService = (startDate?: string, endDate?: string) =>
  api.get(
    `/api/admin/token/status?startDate=${startDate || ""}&endDate=${endDate || ""}`,
  );

export const refreshTokenService = () =>
  api.put(`/api/admin/token/ref/refreshtoken`);
