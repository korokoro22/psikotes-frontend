'use client'

import { useEffect, useState } from "react"
import KraepelinLineChart from "./KraepelinLineChartComponent"

type Answer = -1 | 0 | 1

const TOTAL_COLUMNS = 3

function calculatePanker(answers: Answer[][]) {
  let totalWorked = 0

  answers.forEach(column => {
    column.forEach(value => {
      if (value === 1 || value === -1) {
        totalWorked += 1
      }
    })
  })

  return totalWorked / TOTAL_COLUMNS
}

interface KraepelinScoring {
    id: number
    keajeganVariabel: number
    kecepatanVariabel: number
    ketahananVariabel: number
    ketelitianVariabel: number
    skorKeajegan: number
    skorKecepatan: number
    skorKetahanan: number
    skorKetelitian: number
    totalPerLajur: string
}

export default function Kraepelin({data}:any) {

  // ⛔ nanti ini diganti dari hasil tes asli
  const [answers] = useState<Answer[][]>([
    [1, 1, -1, 1, 1, 1, -1, 1, -1, 1, 1, -1, -1, 1, 1, 1, 0, 0, 0, 0],
    [1, -1, -1, 1, 1, -1, 1, 1, -1, 1, -1, 1, 1, 1, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 1, -1, -1, 1, 1, 1, -1, -1, 1, 1, 1, -1, 0, 0],
    [1, 1, -1, -1, 1, 1, 1, 1, -1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 1, 1, -1, -1, -1, 1, 1, 1, -1, 1, 1, -1, 0, 0],
    // ... sampai 45 kolom
  ])

  const [score, setScore] = useState<KraepelinScoring>()

  const [total, setTotal] = useState([0])

  useEffect(()=> {
    setScore(data)
    console.log("ini kraepelin scoring", score)
  }, [score])

  useEffect(()=> {
    if(score && score.totalPerLajur) {
    const totalLajur = score?.totalPerLajur.split(",")
    const convertedTotalLajur = totalLajur.map(Number)
    setTotal(convertedTotalLajur) }
  }, [score])

    const formatDesimal = (nilai:any) => {
        if(!nilai)
            return ""
        return nilai.toString().replace(".", ",");
    };

  return (
    // <div className="p-6">
    //   <h1 className="text-xl font-bold mb-4">Hasil Tes Kraepelin</h1>
    //   <div className="flex flex-col gap-y-3">
    //     <div className="text-base">
    //       <strong>PANKER:</strong> 1
    //     </div>
    //     <div className="text-base">
    //       <strong>JANKER:</strong> 2
    //     </div>
    //     <div className="text-base">
    //       <strong>HANKER (Keajegan Kerja):</strong> 3
    //     </div>
    //     <div className="text-base">
    //       <strong>TIANKER (Ketelitian Kerja):</strong> 4
    //     </div>

    //     <div className="p-8">
    //       <h1 className="text-lg font-bold mb-6">Grafik (jawaban benar dan salah) tiap kolom</h1>
    //       <KraepelinLineChart answers={answers} />
    //     </div>

    //     <div>

    //     </div>

    //   </div>
      
    // </div>

    <div className="pb-5 border-gray-300">
            <div className="mb-4">
                <p className="font-bold text-2xl">Hasil Tes Kraepelin</p>
            </div>
            <div className="p-8">
                <h1 className="text-lg font-bold mb-6">Grafik (jawaban benar dan salah) tiap kolom</h1>
                <KraepelinLineChart jawaban={total} />
            </div>
            <div>
                <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
                    <table className="w-full border-collapse">
                        <tbody>
                            <tr className="text-center text-sm font-semibold text-gray-700  ">
                                <td className="px-4 py-2 border border-gray-300">
                                    Kompetensi
                                </td>
                                <td className="px-4 py-2 border border-gray-300">
                                    Pengertian
                                </td>
                                <td className="px-4 py-2 border border-gray-300">
                                    Skor
                                </td>
                                <td className="px-4 py-2 border border-gray-300">
                                    Indikator
                                </td>
                            </tr>
                            <tr className="text-center text-sm font-semibold text-gray-700  ">
                                <td className="px-4 py-2 border border-gray-300">
                                    Kecepatan kerja
                                </td>
                                <td className="px-4 py-2 border border-gray-300">
                                    Kuantitas pekerjaan dalam satu waktu
                                </td>
                                <td className="px-4 py-2 border border-gray-300">
                                    {formatDesimal(score?.skorKecepatan.toFixed(3))}
                                </td>
                                <td className="px-4 py-2 border border-gray-300">
                                    {score?.kecepatanVariabel}
                                </td>
                            </tr>
                            <tr className="text-center text-sm font-semibold text-gray-700  ">
                                <td className="px-4 py-2 border border-gray-300">
                                    Ketelitian Kerja
                                </td>
                                <td className="px-4 py-2 border border-gray-300">
                                    Jumlah kesalahan saat bekerja	
                                </td>
                                <td className="px-4 py-2 border border-gray-300">
                                    {formatDesimal(score?.skorKetelitian.toFixed(3))}
                                </td>
                                <td className="px-4 py-2 border border-gray-300">
                                    {score?.ketelitianVariabel}
                                </td>
                            </tr>
                            <tr className="text-center text-sm font-semibold text-gray-700  ">
                                <td className="px-4 py-2 border border-gray-300">
                                    Keajegan Kerja
                                </td>
                                <td className="px-4 py-2 border border-gray-300">
                                    Kestabilan kerja saat menghadapi tekanan	
                                </td>
                                <td className="px-4 py-2 border border-gray-300">
                                    {formatDesimal(score?.skorKeajegan.toFixed(3))}
                                </td>
                                <td className="px-4 py-2 border border-gray-300">
                                    {score?.keajeganVariabel}
                                </td>
                            </tr>
                            <tr className="text-center text-sm font-semibold text-gray-700  ">
                                <td className="px-4 py-2 border border-gray-300">
                                    Ketahanan Kerja
                                </td> 
                                <td className="px-4 py-2 border border-gray-300">
                                    Kemampuan bertahan dalam pekerjaan monoton
                                </td>
                                <td className="px-4 py-2 border border-gray-300">
                                    {formatDesimal(score?.skorKetahanan.toFixed(3))}
                                </td>
                                <td className="px-4 py-2 border border-gray-300">
                                    {score?.ketahananVariabel}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
  )
}