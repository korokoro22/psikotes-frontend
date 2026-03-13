import api from "@/lib/axiosBackend"

export const getContohCfit1Service = () => api.get(`/api/user/questions/cfit1/contoh`)
export const getSoalCfit1Service = () => api.get(`/api/user/questions/cfit1/soal`)

export const getContohCfit2Service = () => api.get(`/api/user/questions/cfit2/contoh`)
export const getSoalCfit2Service = () => api.get(`/api/user/questions/cfit2/soal`)

export const getContohCfit3Service = () => api.get(`/api/user/questions/cfit3/contoh`)
export const getSoalCfit3Service = () => api.get(`/api/user/questions/cfit3/soal`)

export const getContohCfit4Service = () => api.get(`/api/user/questions/cfit4/contoh`)
export const getSoalCfit4Service = () => api.get(`/api/user/questions/cfit4/soal`)

export const getSoalDiscService = () => api.get(`/api/user/questions/disc`)
