import api from "@/lib/axiosBackend";

export const getAllPeserta = (
    currentPage: number, 
    limit: number, 
    posisi?: string 
) => api.get(`/api/admin/peserta?page=${currentPage}&limit=${limit}&posisi=${posisi || ''}`)

export const registerPeserta = (
    data: {
        nama: string,
        email: string,
        nik: string,
        tanggalLahir: string,
        jenisKelamin: string,
        unit: string,
        usia: number,
        pendidikanTerakhir: string,
        jurusan: string,
        posisi: string,
        tokenPeserta: string,
        // statusCode: number
    }
) => api.post('/api/user/peserta', data)

export const getDetailPeserta = (id:number) => api.get(`/api/admin/peserta/detail/${id}`)

export const getFormPeserta = () => api.get('/api/admin/peserta/form')

export const getHasilPeserta = () => api.get('/api/admin/hasiltes')

export const getDetailHasilPeserta = (id: number) => api.get(`api/admin/hasiltes/hasil/${id}`)

export const userExpiredDate = (nik: string) => api.patch(`api/user/user-expired/${nik}`) 

export const getAllPosition = () => api.get(`/api/admin/peserta/posisi`)

// export const setTrueService = (id: number) => api.put(`api/user/user-expired/${id}`)