'use client'

import { div, ul } from "framer-motion/client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getAllToken, statusToken } from "@/services/token.service";
import { useRouter } from "next/navigation";

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

    const [isCopied, setIsCopied] = useState(false)
    const [data, setData] = useState<Data[]>([])

    const router = useRouter()

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

    useEffect(() => {
        const getTOken = async () => {
        try {
            const token = await getAllToken()
            setData(token.data.data)
        } catch( err:any) {
            router.push('/login')
        }
    }
    getTOken()
    }, [])

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

  {/* Table */}
  <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">

    <table className="w-full border-collapse">

      {/* Table Header */}
      <thead className="bg-gray-50">

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

</div>
    )
}