import api from "@/lib/axiosBackend";

export const getCountAllPeserta = () => api.get(`/api/admin/peserta/count`)

export const getAllPeserta = (
    currentPage: number, 
    limit: number, 
    posisi?: string, 
    nama?: string,
    startDate?:string,
    endDate?:string
) => api.get(`/api/admin/peserta?page=${currentPage}&limit=${limit}&posisi=${posisi || ''}&nama=${nama || ''}&startDate=${startDate || ''}&endDate=${endDate || ''}`)

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

export const getHasilPeserta = (
    currentPage: number, 
    limit: number, 
    posisi?: string, 
    nama?: string,
    startDate?:string,
    endDate?:string
) => api.get(`/api/admin/hasiltes?page=${currentPage}&limit=${limit}&posisi=${posisi || ''}&nama=${nama || ''}&startDate=${startDate || ''}&endDate=${endDate || ''}`)

export const getDetailHasilPeserta = (id: number) => api.get(`api/admin/hasiltes/hasil/${id}`)

export const userExpiredDate = (nik: string) => api.patch(`api/user/user-expired/${nik}`) 

export const getAllPosition = (
    // posisi?:string,
    nama?:string,
    startDate?: string,
    endDate?: string
) => api.get(`/api/admin/peserta/posisi?nama=${nama || ''}&startDate=${startDate || ''}&endDate=${endDate || ''}`)

export const getAllHasilPosition = (
    nama?:string,
    startDate?: string,
    endDate?: string
) => api.get(`/api/admin/hasiltes/posisi?nama=${nama || ''}&startDate=${startDate || ''}&endDate=${endDate || ''}`)

// export const getFilteredTime = (
//     startDate?: string,
//     endDate?: string
// ) => api.get(`/api/admin/peserta/time?startDate=${startDate}&endDate=${endDate}`)

// export const setTrueService = (id: number) => api.put(`api/user/user-expired/${id}`)