import axios from "axios";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
    // baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials:true,
    headers: {
        'Content-Type': 'application/json'
    },
    // timeout: 10000
})

export default api