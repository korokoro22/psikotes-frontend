'use client'

import { motion } from "framer-motion"
import Link from "next/link"
import { useRouter } from "next/navigation"
import test from "node:test"
import { useEffect, useState } from "react"
import Modal from "@/app/components/Modal"
import { updateStatusTest } from "@/services/answers.service"
import TestHeader from "@/app/components/TestHeader"
import { useBackGuard } from "@/lib/useBackGuard"
import BackGuardModal from "@/app/components/BackGuardModal"

function IconSoal() {
  return (
    <svg 
      className="w-8 h-8 inline-block " 
      viewBox="0 0 24 24" 
      fill="none" 
      aria-hidden
    >
      {/* Kertas */}
      <path 
        d="M6 3h9l3 3v15a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />

      {/* Lipatan pojok kanan atas */}
      <path 
        d="M15 3v4h4" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />

      {/* Garis tulisan */}
      <path 
        d="M8 10h8M8 13h8M8 16h5" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconJumlahSoal() {
  return (
    <svg
      className="w-8 h-8 inline-block"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      {/* Bullet list */}
      <path
        d="M5 7h.01M5 12h.01M5 17h.01"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      {/* Garis list */}
      <path
        d="M9 7h10M9 12h10M9 17h6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      {/* Badge jumlah */}
      <circle
        cx="17"
        cy="17"
        r="3"
        stroke="currentColor"
        strokeWidth="1.5"
      />

      {/* Simbol count */}
      <path
        d="M16 17h2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconMenulis() {
  return (
    <svg
      className="w-8 h-8 inline-block"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      {/* Body kertas (sudut agak soft, tidak tajam) */}
      <rect
        x="5"
        y="3"
        width="14"
        height="18"
        rx="2.5"
        stroke="currentColor"
        strokeWidth="1.6"
      />

      {/* Garis tulisan */}
      <path
        d="M8 9h8M8 12h8M8 15h5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function FrontPage()  {
    const router = useRouter()
    const [data, setData] = useState()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [dataTests, setDataTests] = useState([])

//     useEffect(()=> {
//     const tests = sessionStorage.getItem('testSession')
//     console.log(tests)
// }, [])

    const handleModal = () => {
        setIsModalOpen(true)
    }

    const handleTest = async () => {
        try {
            const setLoading = setIsLoading(true)
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
        } catch (error) {
            const setLoading = setIsLoading(false)
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

    useEffect(() => {
    document.title = "Welcome - Psychological Tests";
  }, [])

  const { modalProps } = useBackGuard();

    // const tests = async () => {
    //     const testSession = sessionStorage.getItem('testSession')
    //     if(!testSession)
    //         return console.log('gagal')

    //     const testSessionParsed = JSON.parse(testSession)
    //     const tests = testSessionParsed.tests
    //     setDataTests(tests)
    // }

    useEffect(()=> {
        const testSession = sessionStorage.getItem('testSession')
        if(!testSession)
            return console.log('gagal')

        const testSessionParsed = JSON.parse(testSession)
        const tests = testSessionParsed.tests
        setDataTests(tests)
    }, [])

    const testsQuestion = (tests:string) => {
        let questions: number
        switch(tests) {
            case 'CFIT':
                questions = 46
                break
            case 'DISC':
                questions = 24
                break    
            case 'MSDT':
                questions = 64
                break
            case 'PAPIKOSTICK':
                questions = 90
                break
            case 'KRAEPELIN':
                questions = 45
                break
            case 'MBTI':
                questions = 70
                break 
            default:
                questions = 0
        }

        return questions
    }

    const questionsTotal = (tests: any) => {
        let total = 0
        for (let test of tests) {
            if (test === 'CFIT') {
                total += 63
            } else if ( test === 'DISC') {
                total += 24
            } else if (test === 'MSDT') {
                total += 64
            } else if (test === 'PAPIKOSTICK') {
                total += 90
            } else if (test === 'KRAEPELIN') {
                total += 45
            } else if (test === 'MBTI') {
                total +=70
            } else {
                total += 0
            }       
        }
        return total
    }

    
    
    return (
        <div className="select-none">
            <div className="font-sans min-h-screen bg-gradient-to-br from-red-50 to-indigo-100">
                <header
                                className='bg-white shadow-sm py-4 sticky top-0 z-10'
                            >
                                <TestHeader />
                            </header>
                <main className="container px-4 py-10 gap-x-10 mx-auto">
                    <div className="flex justify-between gap-x-10">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="max-w-5xl bg-white rounded-2xl shadow-lg p-8 w-2/3"
                        >
                            <div>
                                <h2 className="text-2xl text-left md:text-3xl font-bold text-slate-800 mb-8">Selamat Datang di Sesi Tes Anda</h2>
                                <p className="mt-3 text-base text-slate-700 text-left">Pendaftaran Anda telah berhasil dan data Anda telah diverifikasi oleh sistem.
                                Pada tahap selanjutnya, Anda akan mengikuti rangkaian tes psikologi sesuai dengan token yang telah diberikan kepada Anda.

                                <span className="block mt-2">Setiap tes memiliki tujuan dan aturan pengerjaan yang berbeda.
                                Oleh karena itu, sangat disarankan untuk membaca petunjuk pada setiap tes dengan saksama sebelum memulai.</span></p>
                                <div className="mt-8 bg-blue-50 p-5 border border-blue-200 rounded-lg">
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
                            
                            
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="max-w-5xl bg-white rounded-2xl shadow-lg p-8 w-1/3 flex flex-col gap-y-3"
                        >
                            <p className="text-slate-800 font-bold text-2xl mb-3">Ringkasan Tes</p>
                            <div className="flex flex-col gap-y-3">
                                <p className="text-slate-700">Tes ini terdiri dari beberapa jenis tes dengan total soal dan jumlah tes sebagai berikut:</p>
                                <div className="flex justify-between w-full gap-x-5">
                                    <div className="bg-amber-50 border items-center border-amber-100 px-5 py-2 rounded-lg w-1/2 flex gap-x-2">
                                        <div className="text-amber-600">
                                            <IconSoal  />
                                        </div>
                                        <div>
                                            <h3 className="text-slate-800 text-sm">Total Soal</h3>
                                            <p className="text-slate-700 text-lg font-bold">{questionsTotal(dataTests)}</p>
                                        </div>
                                    </div>
                                    <div className="bg-emerald-50 border items-center border-emerald-100 px-5 py-2 rounded-lg w-1/2 flex gap-x-2">
                                        <div className="text-emerald-600">
                                            <IconJumlahSoal  />
                                        </div>
                                        <div>
                                            <h3 className="text-slate-800 text-sm">Jumlah Tes</h3>
                                            <p className="text-slate-700 text-lg font-bold">{dataTests.length}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-y-4">
                                    <div>
                                        <p>Rincian tes yang dikerjakan:</p>
                                    </div>
                                    {/* <div className="overflow-hidden rounded-lg border-t border-r border-l  border-slate-300">
                                        <table className="w-full table-fixed border-collapse border-separate border-spacing-0 border-slate-300">
                                            <tbody>
                                                <tr className="  bg-blue-50 ">
                                                    <td className=" border-b border-slate-300 text-slate-800 w-1/6"><IconMenulis /></td>
                                                    <td className=" border-b border-slate-300 py-2 font-semibold text-slate-800 w-3/6">Tes 1</td>
                                                    <td className=" border-b border-slate-300 py-2 text-slate-700 w-2/6">20 soal</td>
                                                </tr>  
                                                
                                                <tr className="  bg-blue-50 last:border-b-0 ">
                                                    <td className=" border-b  border-slate-300 text-slate-800 w-1/6"><IconMenulis /></td>
                                                    <td className=" border-b border-slate-300 py-2 font-semibold text-slate-800 w-3/6">Tes 1</td>
                                                    <td className=" border-b border-slate-300 py-2 text-slate-700 w-2/6">20 soal</td>
                                                </tr>  
                                                
                                                 
                                            </tbody>
                                        </table>
                                    </div> */}
                                    {/* <!-- Wrapper Div handles rounding and overflow --> */}
                                    <div className="overflow-hidden rounded-lg border border-gray-200 ">
                                        <table className="w-full border-collapse bg-white text-left text-sm text-slate-700">
                                            <tbody className="divide-y divide-gray-100 border-t border-gray-100">
                                            {dataTests.map((item, index)=> (
                                                <tr key={index}>
                                                <td className="px-5 py-3 font-bold flex items-center">
                                                    <div className="mr-2"><IconMenulis /></div>
                                                    <div>Tes {index + 1}</div>
                                                </td>
                                                <td className="px-5 py-3 font-semibold">{testsQuestion(item)}<span className="block font-normal">soal</span></td>
                                            </tr>
                                            ))}
                                            </tbody>
                                        </table>
                                    </div>

                                </div>
                            </div>
                            <div>

                            </div>
                        </motion.div>
                    </div>
                    
                    
                </main>
                <div className=" shadow p-6 flex flex-col md:flex-col-reverse items-center justify-between gap-4 bg-white ">
                    <div className="text-sm text-slate-600">
                        <strong className="text-slate-800">Sebelum mulai:</strong> pastikan diri anda telah siap dan fokus.
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            className="px-20 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium shadow hover:scale-[1.01] active:scale-95 transition-transform"
                            aria-label="Mulai CFIT Subtes 1"
                            onClick={handleModal}
                        >
                            MULAI TES
                        </button>
                        <Modal isOpen={isModalOpen} onClose={()=> setIsModalOpen(false)}>
                            <p className='text-gray-800'>Anda akan memasuki halaman petunjuk tes dan contoh soal. Silakan baca dengan saksama sebelum memulai tes.</p>
                            <p className='text-gray-600 text-sm mt-3'>(Pastikan koneksi internet stabil dan Anda berada di lingkungan yang kondusif.)</p>
                            <div className='flex gap-x-3 justify-evenly mt-4'>
                                <button 
                                    className={`px-5 py-2 rounded-lg bg-gradient-to-r  text-white font-medium shadow hover:scale-[1.02] active:scale-95 transition ${
                                        isLoading
                                        ? 'bg-slate-400'
                                        : 'from-blue-600 to-indigo-600'
                                        }`}
                                    onClick={()=> setIsModalOpen(false)}
                                    disabled={isLoading}
                                >
                                    Kembali
                                </button>
                                            
                                {isLoading ? (
                                    <button 
                                        className='disabled:pointer-events-none px-5 py-2 rounded-lg bg-gradient-to-r bg-slate-400 text-white font-medium shadow hover:scale-[1.02] active:scale-95 transition'
                                        onClick={handleTest}
                                        disabled={isLoading}
                                    >
                                        Mohon Tunggu...
                                    </button>
                                    ): (
                                    <button 
                                        className='px-5 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium shadow hover:scale-[1.02] active:scale-95 transition'
                                        onClick={handleTest}
                                        disabled={isLoading}
                                    >
                                        Mulai Tes
                                    </button>
                                    )}          
                            </div>
                        </Modal>
                    </div>     
                </div>
            </div>
            <BackGuardModal {...modalProps} />
        </div>
    )
}