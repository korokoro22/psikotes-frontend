import api from "@/lib/axiosBackend";

export const getAllPeserta = () => api.get('/api/admin/peserta')

export const registerPeserta = (data: {
    nama: string,
    email: string,
    tanggalLahir: string,
    jenisKelamin: string,
    unit: string,
    usia: number,
    pendidikanTerakhir: string,
    jurusan: string,
    posisi: string,
    tokenPeserta: string
}) => api.post('/api/user/peserta', data)

export const getDetailPeserta = (id:number) => api.get(`/api/admin/peserta/detail/${id}`)

export const getFormPeserta = () => api.get('/api/admin/peserta/form')

export const getHasilPeserta = () => api.get('/api/admin/hasiltes')

export const getDetailHasilPeserta = (id: number) => api.get(`api/admin/hasiltes/hasil/${id}`)