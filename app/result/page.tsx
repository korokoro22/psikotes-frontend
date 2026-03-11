'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Brain } from 'lucide-react'
import { triggerN8n } from '@/services/answers.service'

export default function ResultPage() {
  const router = useRouter()
  // const [userData, setUserData] = useState<any>(null)

  // useEffect(() => {
  //   const storedUserData = localStorage.getItem('userData')
  //   if (storedUserData) {
  //     setUserData(JSON.parse(storedUserData))
  //   }
  // }, [])

  const handleAnswer = async () => {
    const testSession = sessionStorage.getItem('testSession')
    if(!testSession) {
      return (console.log('gagal'))
    }
    const testSessionParsed = JSON.parse(testSession)
    // const pesertaId = testSessionParsed.pesertaId
    // const trigger = await triggerN8n(pesertaId)
    sessionStorage.clear()
    router.push('/')
  }

  // if (!userData) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100">
  //       <p className="text-gray-600 text-lg font-medium">Memuat data...</p>
  //     </div>
  //   )
  // }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm py-4 sticky top-0 z-10">
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Brain className="text-blue-600" size={28} />
            <h1 className="text-xl font-bold text-gray-800">Tes Psikologi Rekrutmen</h1>
          </div>
        </div>
      </header>

      {/* Konten utama */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-lg p-10 text-center max-w-md w-full">
          <h2 className="text-2xl font-semibold text-slate-800 mb-3">
            Terima Kasih!
          </h2>
          <p className="text-slate-600 text-sm mb-6 leading-relaxed">
            Terima kasih telah menyelesaikan tes psikologi sebagai bagian dari proses rekrutmen.  
            Hasil tes Anda akan dievaluasi oleh tim HR kami untuk mendukung proses seleksi.  
            Mohon menunggu informasi selanjutnya dari pihak perusahaan.
          </p>

          <div className="mt-6">
            <button
              onClick={() => handleAnswer()}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2.5 rounded-lg hover:shadow-md transition-all duration-200"
            >
              Kembali ke halaman utama
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
