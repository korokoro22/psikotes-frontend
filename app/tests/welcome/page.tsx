'use client'

import { motion } from "framer-motion"
import Link from "next/link"
import { useRouter } from "next/navigation"
import test from "node:test"
import { useEffect, useState } from "react"
import Modal from "@/app/components/Modal"
import { updateStatusTest } from "@/services/answers.service"



export default function FrontPage()  {
    const router = useRouter()
    const [data, setData] = useState()
    const [isModalOpen, setIsModalOpen] = useState(false)

//     useEffect(()=> {
//     const tests = sessionStorage.getItem('testSession')
//     console.log(tests)
// }, [])

    const handleModal = () => {
        setIsModalOpen(true)
    }

    const handleTest = async () => {
        const testSession = sessionStorage.getItem('testSession')
        if(!testSession)
            return console.log('gagal')

        const testSessionParsed = JSON.parse(testSession)
        const tests = testSessionParsed.tests[testSessionParsed.currentIndex]

        console.log('ini tests:', testSessionParsed)
        const sessionId = testSessionParsed.sessionId
        if(sessionId && !(tests === null)) {
            const statusTest = await updateStatusTest(sessionId)
            // const indexIncrement = testSessionParsed.currentIndex + 1
            // testSessionParsed.currentIndex = indexIncrement
            // const id = await updateStatusTest(sessionId)
            // const updatedTestString = JSON.stringify(testSessionParsed)
            // sessionStorage.setItem('testSession', updatedTestString)
            router.push(`/tests/${tests.toLowerCase()}`)        
        } else {
            router.push('/result')
        }
    }

    // useEffect(()=> {
    //     const testSession = sessionStorage.getItem('testSession')
    //     if(!testSession)
    //         return console.log('gagal')

    //     const testSessionParsed = JSON.parse(testSession)
    //     const tests = testSessionParsed.tests[testSessionParsed.currentIndex]
    //     console.log('ini tests:', tests)
    // })
    
    return (
        <div>
            <div className="font-sans min-h-screen bg-gradient-to-br from-red-50 to-indigo-100">
                <main className="container mx-auto px-4 py-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-8 "
                    >
                        <div>
                            <h2 className="text-2xl text-left md:text-3xl font-bold text-slate-800 mb-4">Selamat Datang di Sesi Tes Anda</h2>
                            <p className="mt-3 text-base text-slate-700 text-left">Pendaftaran Anda telah berhasil dan data Anda telah diverifikasi oleh sistem.
                            Pada tahap selanjutnya, Anda akan mengikuti rangkaian tes psikologi sesuai dengan token yang telah diberikan kepada Anda.

                            <span className="block mt-2">Setiap tes memiliki tujuan dan aturan pengerjaan yang berbeda.
                            Oleh karena itu, sangat disarankan untuk membaca petunjuk pada setiap tes dengan saksama sebelum memulai..</span></p>
                            <div className="mt-8">
                                <h3 className="text-lg font-semibold text-slate-800 mb-3">Petunjuk Umum</h3>
                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-slate-700">
                                <li className="flex gap-3 items-start">
                                    <span className="flex-none mt-1 w-2.5 h-2.5 bg-slate-400 rounded-full"></span>
                                    Pastikan Anda berada di tempat yang nyaman dan minim gangguan.
                                </li>
                                <li className="flex gap-3 items-start">
                                    <span className="flex-none mt-1 w-2.5 h-2.5 bg-slate-400 rounded-full"></span>
                                    Gunakan perangkat dan koneksi internet yang stabil.
                                </li>
                                <li className="flex gap-3 items-start">
                                    <span className="flex-none mt-1 w-2.5 h-2.5 bg-slate-400 rounded-full"></span>
                                    Kerjakan tes secara mandiri dan jujur.
                                </li>
                                <li className="flex gap-3 items-start">
                                    <span className="flex-none mt-1 w-2.5 h-2.5 bg-slate-400 rounded-full"></span>
                                    Jangan menutup atau memuat ulang halaman sebelum tes selesai.
                                </li>
                                </ul>
                            </div>
                        </div>
                        <div className="mt-8 border-t pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
                            <div className="text-sm text-slate-600">
                                <strong className="text-slate-800">Sebelum mulai:</strong> pastikan diri anda telah siap dan fokus.
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    className="px-5 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium shadow hover:scale-[1.01] active:scale-95 transition-transform"
                                    aria-label="Mulai CFIT Subtes 1"
                                    onClick={handleModal}
                                >
                                    Selanjutnya
                                </button>
                                <Modal isOpen={isModalOpen} onClose={()=> setIsModalOpen(false)}>
                                    <p className='text-gray-800'>Anda akan memasuki sesi tes. Setelah tes dimulai, waktu akan berjalan dan sesi tidak dapat diulang.</p>
                                    <p className='text-gray-600 text-sm mt-3'>(Pastikan koneksi internet stabil dan Anda berada di lingkungan yang kondusif.)</p>
                                    <div className='flex gap-x-3 justify-evenly mt-4'>
                                    <button 
                                    className='px-5 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium shadow hover:scale-[1.02] active:scale-95 transition'
                                    onClick={()=> setIsModalOpen(false)}
                                    >
                                        Kembali
                                    </button>

                                    <button 
                                    className='px-5 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium shadow hover:scale-[1.02] active:scale-95 transition'
                                    onClick={handleTest}
                                    >
                                        Mulai Tes
                                    </button>
                                    </div>
                                    

                                </Modal>
                            </div>
                            
                        </div>
                        
                    </motion.div>
                </main>
                
            </div>
        </div>
    )
}