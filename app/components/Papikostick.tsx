'use client'

import { useEffect, useState } from "react"

interface PapikostickScore {
    id: number
    sub1: string
    sub2: string
    sub3: string
    sub4: string
    sub5: string
    sub6: string
    sub7: string
    sub8: string
    sub9: string
    sub10: string
    sub11: string
    sub12: string
    sub13: string
    sub14: string
    sub15: string
    sub16: string
    sub17: string
    sub18: string
    sub19: string
    sub20: string
}

export default function Papikostick({data}:any) {

    const [score, setScore] = useState<PapikostickScore>()

    useEffect(()=> {
        setScore(data)
        console.log('ini score papikostik', score)
    }, [score])

    return(
        <div className="pb-5 border-gray-300">
            <div className="mb-4">
                <p className="font-bold text-2xl">Hasil Tes Papikostick</p>
            </div>
            <div>
                <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
                    <table className="w-full border-collapse">
                        <tbody className="">
                            {/* sub 1 */}
                            <tr className="text-center text-sm font-semibold text-gray-700 ">
                                <td rowSpan ={3}  className="px-4 py-2 border border-gray-300">
                                    Motivasi Kerja
                                </td>
                                <td colSpan ={1} className="px-4 py-2 border border-gray-300">
                                    Kebutuhan untuk berprestasi
                                </td>
                                <td colSpan ={1} className="px-4 py-2 border border-gray-300">
                                    {score?.sub1}
                                </td>
                                
                            </tr>
                            <tr className="text-center text-sm font-semibold text-gray-700  ">
                                <td  className="px-4 py-2 border border-gray-300">
                                    Kebutuhan untuk menyelesaikan tugas
                                </td>
                                <td  className="px-4 py-2 border border-gray-300">
                                    {score?.sub2}
                                </td>
                                
                            </tr>
                            <tr className="text-center text-sm font-semibold text-gray-700  ">
                                <td  className="px-4 py-2 border border-gray-300">
                                    Peran sebagai pekerja keras
                                </td>
                                <td  className="px-4 py-2 border border-gray-300">
                                    {score?.sub3}
                                </td>
                            </tr>

                            {/* sub 2 */}
                            <tr className="text-center text-sm font-semibold text-gray-700  ">
                                <td rowSpan={3} className="px-4 py-2 border border-gray-300">
                                    Gaya Kerja
                                </td>
                                <td colSpan={1} className="px-4 py-2 border border-gray-300">
                                    Tipe Terorganisir
                                </td>
                                <td colSpan={1} className="px-4 py-2 border border-gray-300">
                                    {score?.sub4}
                                </td>
                            </tr>
                            <tr className="text-center text-sm font-semibold text-gray-700  ">
                                <td  className="px-4 py-2 border border-gray-300">
                                    Tipe kerja dengan detail
                                </td>
                                <td  className="px-4 py-2 border border-gray-300">
                                    {score?.sub5}
                                </td>
                            </tr>
                            <tr className="text-center text-sm font-semibold text-gray-700  ">
                                <td  className="px-4 py-2 border border-gray-300">
                                    Tipe teoritis
                                </td>
                                <td  className="px-4 py-2 border border-gray-300">
                                    {score?.sub6}
                                </td>
                                
                            </tr>

                            {/* sub 3 */}
                            <tr className="text-center text-sm font-semibold text-gray-700  ">
                                <td rowSpan={2} className="px-4 py-2 border border-gray-300">
                                    Aktivitas
                                </td>
                                <td colSpan={1} className="px-4 py-2 border border-gray-300">
                                    Tipe semangat
                                </td>
                                <td colSpan={1} className="px-4 py-2 border border-gray-300">
                                    {score?.sub7}
                                </td>
                            </tr>
                            <tr className="text-center text-sm font-semibold text-gray-700  ">
                                <td  className="px-4 py-2 border border-gray-300">
                                    Tipe sibuk
                                </td>
                                <td  className="px-4 py-2 border border-gray-300">
                                    {score?.sub8}
                                </td>
                            </tr>
                            

                            {/* sub 4 */}
                            <tr className="text-center text-sm font-semibold text-gray-700  ">
                                <td rowSpan={2} className="px-4 py-2 border border-gray-300">
                                    Kepatuhan
                                </td>
                                <td colSpan={1} className="px-4 py-2 border border-gray-300">
                                    Kebutuhan untuk diatur dan diawasi
                                </td>
                                <td colSpan={1} className="px-4 py-2 border border-gray-300">
                                    {score?.sub9}
                                </td>
                            </tr>
                            <tr className="text-center text-sm font-semibold text-gray-700  ">
                                <td  className="px-4 py-2 border border-gray-300">
                                    Kebutuhan membantu atasan
                                </td>
                                <td  className="px-4 py-2 border border-gray-300">
                                    {score?.sub10}
                                </td>
                            </tr>
                    

                            {/* sub 5 */}
                            <tr className="text-center text-sm font-semibold text-gray-700  ">
                                <td rowSpan={3} className="px-4 py-2 border border-gray-300">
                                    Kepemimpinan
                                </td>
                                <td colSpan={1} className="px-4 py-2 border border-gray-300">
                                    Gaya kepemimpinan
                                </td>
                                <td colSpan={1} className="px-4 py-2 border border-gray-300">
                                    {score?.sub11}
                                </td>
                            </tr>
                            <tr className="text-center text-sm font-semibold text-gray-700  ">
                                <td  className="px-4 py-2 border border-gray-300">
                                    Kebutuhan untuk mengontrol orang lain
                                </td>
                                <td  className="px-4 py-2 border border-gray-300">
                                    {score?.sub12}
                                </td>
                            </tr>
                            <tr className="text-center text-sm font-semibold text-gray-700  ">
                                <td  className="px-4 py-2 border border-gray-300">
                                    Kemampuan mengambil keputusan
                                </td>
                                <td  className="px-4 py-2 border border-gray-300">
                                    {score?.sub13}
                                </td>
                                
                            </tr>

                            {/* sub 6 */}
                            <tr className="text-center text-sm font-semibold text-gray-700  ">
                                <td rowSpan={4} className="px-4 py-2 border border-gray-300">
                                    Peran sosial
                                </td>
                                <td colSpan={1} className="px-4 py-2 border border-gray-300">
                                    Peran sosial
                                </td>
                                <td colSpan={1} className="px-4 py-2 border border-gray-300">
                                    {score?.sub14}
                                </td>
                            </tr>
                            <tr className="text-center text-sm font-semibold text-gray-700  ">
                                <td  className="px-4 py-2 border border-gray-300">
                                    Kebutuhan menjadi bagian dari grup
                                </td>
                                <td  className="px-4 py-2 border border-gray-300">
                                    {score?.sub15}
                                </td>
                            </tr>
                            <tr className="text-center text-sm font-semibold text-gray-700  ">
                                <td  className="px-4 py-2 border border-gray-300">
                                    Kebutuhan akan kedekatan dan perhatian
                                </td>
                                <td  className="px-4 py-2 border border-gray-300">
                                    {score?.sub16}
                                </td>
                                
                            </tr>
                            <tr className="text-center text-sm font-semibold text-gray-700  ">
                                <td  className="px-4 py-2 border border-gray-300">
                                    Kebutuhan akan penerimaan
                                </td>
                                <td  className="px-4 py-2 border border-gray-300">
                                    {score?.sub17}
                                </td>
                                
                            </tr>

                            {/* sub 7 */}
                            <tr className="text-center text-sm font-semibold text-gray-700  ">
                                <td rowSpan={3} className="px-4 py-2 border border-gray-300">
                                    Temperament
                                </td>
                                <td colSpan={1} className="px-4 py-2 border border-gray-300">
                                    Ketahanan emosional
                                </td>
                                <td colSpan={1} className="px-4 py-2 border border-gray-300">
                                    {score?.sub18}
                                </td>
                            </tr>
                            <tr className="text-center text-sm font-semibold text-gray-700  ">
                                <td  className="px-4 py-2 border border-gray-300">
                                    Kebutuhan untuk maju
                                </td>
                                <td  className="px-4 py-2 border border-gray-300">
                                    {score?.sub19}
                                </td>
                            </tr>
                            <tr className="text-center text-sm font-semibold text-gray-700  ">
                                <td  className="px-4 py-2 border border-gray-300">
                                    Kebutuhan untuk berubah
                                </td>
                                <td  className="px-4 py-2 border border-gray-300">
                                    {score?.sub20}
                                </td>
                                
                            </tr>
                            
                        </tbody>
                    </table>
            </div>
            </div>
            
        </div>
    )
}