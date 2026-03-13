import api from "@/lib/axiosBackend"

export const storeAnswersCfit = (
    sessionId: number,
    data: {
        questionId: number,
        answers: string[],
        subtest: number
    }[]
) => api.post(`/api/user/answers/cfit/${sessionId}`, data)

export const storeAnswersDisc = (
    sessionId: number,
    data: {
        most: { groupId: number; questionIndex:number}[]
        least: { groupId: number; questionIndex:number}[]
    }
) => api.post(`/api/user/answers/disc/${sessionId}`, data)

export const storeAnswersKraepelin = (
    sessionId: number,
    data: string
) => api.post(`/api/user/answers/kraepelin/${sessionId}`, data)

export const updateStatusTest = (
    sessionId: number
) =>api.put(`/api/user/peserta/status/${sessionId}`)

export const triggerN8n = (
    pesertaId: number,
    tests: string
) => api.post(`/api/n8n/trigger/${pesertaId}`, 
    { tests },  // ✅ wrap dalam object
    { headers: { 'Content-Type': 'application/json' } 
})