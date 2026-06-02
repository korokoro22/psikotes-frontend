'use client'

import { div, ul } from "framer-motion/client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { getAllToken, statusToken } from "@/services/token.service";
import { useRouter, useSearchParams } from "next/navigation";

interface Data {
    id: number
    token: string
    tests: []
    kuota: number
    usedCount: number
    isActive: boolean
    activeDate: string
    expiredDate: string
}

export default function AdminTokenTes() {
    const searchParams = useSearchParams()
    const [isCopied, setIsCopied] = useState(false)
    const [data, setData] = useState<Data[]>([])
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const router = useRouter()
    const prevStartDate = useRef(startDate)
    const prevEndDate = useRef(endDate)
    const limit = 10; // Jumlah item per halaman
    const currentPage = parseInt(searchParams.get('page') || '1');
    const [totalData, setTotalData] = useState(0)
    const [totalPages, setTotalPages] = useState(0)

    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setIsCopied(true);
            setTimeout(() => {
            setIsCopied(false);
            }, 1000);
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            const token = data.find(d => d.id === id)
            const status = token?.isActive ? {status: false} : {status: true}
            // const status = data[id].isActive ? {status: false} : {status: true}
            console.log('ini handledelte:', status)
            await statusToken(id, status)
            setData(currentItem => {
                return currentItem.map(item =>
                    item.id === id
                    ? {...item, isActive: status.status}
                    : item
                )
            }

            )
            return console.log('berhasil dihapus')
        } catch (err:any) {
            return console.log(err)
        }
    }

    const goToPage = (page: number) => {
        router.push(`?page=${page}`)
    }

    useEffect(() => {
        const getTOken = async () => {
        try {
          if (startDate != prevStartDate.current || endDate != prevEndDate.current) {
            prevStartDate.current = startDate
            prevEndDate.current = endDate
            goToPage(1)
            const token = await getAllToken(1, limit, startDate || undefined, endDate || undefined)
            setData(token.data.data)
            setTotalData(token.data.pagination.allData)
            setTotalPages(token.data.pagination.totalPages)
            return
          } else {
            const token = await getAllToken(currentPage, limit, startDate || undefined, endDate || undefined)
                                
                                if(token?.data?.data) {
                                    setData(token.data.data)
                                    setTotalData(token.data.pagination.allData)
                                    setTotalPages(token.data.pagination.totalPages)
                                    
                                }
          }
            
        } catch( err:any) {
            router.push('/login')
        }
    }
    getTOken()
    }, [startDate, endDate, currentPage])

    const convertDate = (date: string | Date) => {
    const newDate = new Date(date)
    
    const datePart = newDate.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        timeZone: 'Asia/Makassar'
    })
    
    const timePart = newDate.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
        timeZone: 'Asia/Makassar'
    }).replace('.', ':')
    
    return `${datePart} ${timePart}`
}
    

    useEffect(()=> {
        console.log(data)
    }, [data])

    useEffect(() => {
    document.title = "Token Tes - Psychological Tests";
  }, [])

    return (
        <div>

  {/* Header */}
  <div className="mb-10 flex items-center justify-between">

    <div>
      <h1 className="text-4xl font-bold tracking-tight text-gray-800">
        Token Tes
      </h1>

      <p className="mt-2 text-sm text-gray-500">
        Kelola token tes psikotes peserta
      </p>
    </div>

    <Link
      href="/admin/tokentes/form"
      className="rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-blue-700"
    >
      Buat Token
    </Link>

  </div>

  <div className="py-2 w-full flex flex-col gap-y-3 mb-6">
    <div className="flex flex-wrap gap-4">

                        {/* Start Date */}
                        <div className="flex gap-1 items-center">
                            <label className="text-sm font-medium text-gray-600">
                            Dari Tanggal
                            </label>

                            <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="
                                rounded-2xl
                                border
                                border-gray-200
                                bg-white
                                px-4
                                py-3
                                text-sm
                                shadow-sm
                                outline-none
                                transition-all
                                duration-200
                                focus:border-blue-500
                                focus:ring-4
                                focus:ring-blue-100
                            "
                            />
                        </div>

                        {/* End Date */}
                        <div className="flex items-center gap-1">
                            <label className="text-sm font-medium text-gray-600">
                            Sampai Tanggal
                            </label>

                            <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="
                                rounded-2xl
                                border
                                border-gray-200
                                bg-white
                                px-4
                                py-3
                                text-sm
                                shadow-sm
                                outline-none
                                transition-all
                                duration-200
                                focus:border-blue-500
                                focus:ring-4
                                focus:ring-blue-100
                            "
                            />
                        </div>
                    </div>
  </div>

      {data?.length > 0 ? (
        <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">

    <table className="w-full border-collapse">

      {/* Table Header */}
      <thead className="bg-gray-200">

        <tr className="text-left text-sm font-semibold text-gray-700">

          <th className="px-6 py-4">
            Token
          </th>

          <th className="px-6 py-4">
            Jenis Tes
          </th>

          <th className="px-6 py-4">
            Kuota
          </th>

          <th className="px-6 py-4">
            Status
          </th>

          <th className="px-6 py-4">
            Masa Aktif (Dari)
          </th>

          <th className="px-6 py-4">
            Masa Aktif (Hingga)
          </th>

          <th className="px-6 py-4">
            Aksi
          </th>

        </tr>

      </thead>

      {/* Table Body */}
      <tbody>

        {data.map((item) => (

          <tr
            key={item.token}
            className="border-t border-gray-100 text-sm transition-colors duration-150 hover:bg-gray-50"
          >

            {/* Token */}
            <td className="px-6 py-5">

              <div className="rounded-xl bg-gray-100 px-4 py-2 font-mono text-sm text-gray-700">
                {item.token}
              </div>

            </td>

            {/* Jenis Tes */}
            <td className="px-6 py-5">

              <div className="flex flex-col gap-2">

                {item.tests.map((list) => (

                  <div
                    key={list}
                    className="w-fit rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700"
                  >
                    {list}
                  </div>

                ))}

              </div>

            </td>

            {/* Kuota */}
            <td className="px-6 py-5 font-medium text-gray-700">
              {item.usedCount}/{item.kuota}
            </td>

            {/* Status */}
            <td className="px-6 py-5">

              <div
                className={`w-fit rounded-full px-4 py-1 text-xs font-semibold text-white ${
                  item.isActive
                    ? 'bg-green-500'
                    : 'bg-red-500'
                }`}
              >
                {item.isActive
                  ? 'Aktif'
                  : 'Tidak Aktif'}
              </div>

            </td>

            {/* Active Date */}
            <td className="px-6 py-5 text-gray-600">
              {convertDate(item.activeDate)}
            </td>

            {/* Expired Date */}
            <td className="px-6 py-5 text-gray-600">
              {convertDate(item.expiredDate)}
            </td>

            {/* Action */}
            <td className="px-6 py-5">

              <div className="flex flex-col gap-3">

                {/* Copy Button */}
                <button
                  onClick={() => copyToClipboard(item.token)}
                  className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-blue-700"
                >

                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 64 64"
                    xmlns="http://www.w3.org/2000/svg"
                    strokeWidth="3"
                    stroke="currentColor"
                    fill="none"
                  >
                    <rect x="11.13" y="17.72" width="33.92" height="36.85" rx="2.5"/>
                    <path d="M19.35,14.23V13.09a3.51,3.51,0,0,1,3.33-3.66H49.54a3.51,3.51,0,0,1,3.33,3.66V42.62a3.51,3.51,0,0,1-3.33,3.66H48.39"/>
                  </svg>

                  <span>
                    Salin
                  </span>

                </button>

                {/* Active/Inactive Button */}
                <button
                  onClick={() => handleDelete(item.id)}
                  className={`rounded-xl px-4 py-2 text-sm font-medium text-white transition-all duration-200 ${
                    item.isActive
                      ? 'bg-red-500 hover:bg-red-600'
                      : 'bg-green-500 hover:bg-green-600'
                  }`}
                >
                  {item.isActive
                    ? 'Nonaktifkan'
                    : 'Aktifkan'}
                </button>

              </div>

            </td>

          </tr>

        ))}

      </tbody>

    </table>

  </div>
      ) : (
        <div>
          Data tidak ditemukan
        </div>
      )}

      {/* Pagination */}
            <div className="mt-6 flex flex-col gap-4 rounded-3xl border border-gray-200 bg-white px-6 py-4 shadow-sm md:flex-row md:items-center md:justify-between">

                {/* Info */}
                <div className="text-sm text-gray-500">
                    Menampilkan
                    <span className="mx-1 font-semibold text-gray-700">
                    {currentPage}
                    </span>
                    -
                    <span className="mx-1 font-semibold text-gray-700">
                    {totalPages}
                    </span>
                    dari
                    <span className="mx-1 font-semibold text-gray-700">
                    {totalData}
                    </span>
                    total
                </div>

                {/* Pagination */}
                <div className="flex items-center gap-3">

                    {/* Prev */}
                    <button
                        // onClick={()=> setCurrentPages(prev => prev - 1)}
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage <= 1}
                        className={`
                            rounded-2xl
                            border 
                            px-4
                            py-2
                            text-sm
                            font-medium
                            
                            transition-all
                            duration-200
                            ${currentPage <= 1 
                            ? "cursor-not-allowed bg-gray-200 text-gray-400 border-gray-300"
                            : "bg-white hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 text-gray-700 border-gray-200"
                        }`}
                    >
                    Sebelumnya
                    </button>

                    {/* Current Page */}
                    <div
                    className="
                        flex
                        items-center
                        gap-2
                        rounded-2xl
                        bg-blue-50
                        px-4
                        py-2
                        text-sm
                        font-semibold
                        text-blue-700
                    "
                    >

                    <span
                        className="
                        flex
                        h-8
                        w-8
                        items-center
                        justify-center
                        rounded-xl
                        bg-blue-600
                        text-white
                        shadow-sm
                        "
                    >
                        {currentPage}
                    </span>

                    <span>dari {totalPages}</span>
                    </div>

                    {/* Next */}
                    <button
                        // onClick={()=> setCurrentPages(prev => prev + 1)}
                        onClick={() => goToPage(currentPage + 1)}
                        disabled={currentPage >= Math.ceil(totalData / limit) }
                        className={`
                            rounded-2xl
                            border 
                            px-4
                            py-2
                            text-sm
                            font-medium
                            transition-all
                            duration-200
                            ${currentPage >= Math.ceil(totalData / limit)
                            ? "cursor-not-allowed bg-gray-200 text-gray-400 border-gray-300"
                            : "bg-white hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 text-gray-700 border-gray-200"
                        }`}
                    >
                    Selanjutnya
                    </button>
                </div>
            </div>

</div>
    )
}