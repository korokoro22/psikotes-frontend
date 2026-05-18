'use client'

import Link from "next/link"
import { useEffect, useState } from "react"
import { getDetailPeserta } from "@/services/peserta.service"
import { useRouter } from "next/navigation"

export default function AdminPesertaDetail({ params }: { params: Promise<{ id: string }> }) {
    const [data, setData] = useState<any>(null)
    const router = useRouter()

    useEffect(()=> {
        const detailPeserta = async () => {
            try{
            const {id} = await params
            const peserta = await getDetailPeserta(Number(id))
            setData(peserta.data.data)
            } catch(err:any) {
                router.push('/login')
            }
        }
        detailPeserta()
    }, [])

    useEffect(()=>{
        console.log('ini data', data)
    }, [data])

    useEffect(() => {
    document.title = "Detail Peserta - Psychological Tests";
  }, [])
    
    return(
        <div>

  {/* Header */}
  <div className="mb-8 flex items-center justify-between border-b border-gray-200 pb-5">
    <div>
      <h1 className="text-3xl font-bold text-gray-800">
        Info Peserta
      </h1>

      <p className="mt-1 text-sm text-gray-500">
        Detail informasi peserta psikotes
      </p>
    </div>

    <Link
      href="/admin/peserta"
      className="rounded-xl bg-gray-100 px-5 py-2 text-sm font-medium text-gray-700 transition-all duration-200 hover:bg-gray-200"
    >
      Kembali
    </Link>
  </div>

  {/* Content */}
  {data ? (

    <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">

      <div className="grid grid-cols-1 gap-10 md:grid-cols-2">

        {/* Left */}
        <ul className="flex flex-col gap-7">

          <li>
            <p className="text-sm text-gray-500">
              Nama
            </p>

            <p className="mt-1 text-lg font-semibold text-gray-800">
              {data.nama}
            </p>
          </li>

          <li>
            <p className="text-sm text-gray-500">
              Usia
            </p>

            <p className="mt-1 text-lg font-semibold text-gray-800">
              {data.usia}
            </p>
          </li>

          <li>
            <p className="text-sm text-gray-500">
              Jenis Kelamin
            </p>

            <p className="mt-1 text-lg font-semibold text-gray-800">
              {data.jenisKelamin}
            </p>
          </li>

        </ul>

        {/* Right */}
        <ul className="flex flex-col gap-7">

          <li>
            <p className="text-sm text-gray-500">
              Pendidikan Terakhir
            </p>

            <p className="mt-1 text-lg font-semibold text-gray-800">
              {data.pendidikanTerakhir}
            </p>
          </li>

          <li>
            <p className="text-sm text-gray-500">
              Jurusan
            </p>

            <p className="mt-1 text-lg font-semibold text-gray-800">
              {data.jurusan}
            </p>
          </li>

          <li>
            <p className="text-sm text-gray-500">
              Status Tes
            </p>

            <div className="mt-2 flex">
              <p
                className={`rounded-full px-4 py-2 text-sm font-semibold text-white ${
                  data.testSession[0].statusTest === 2
                    ? 'bg-green-600'
                    : data.testSession[0].statusTest === 1
                    ? 'bg-yellow-400'
                    : 'bg-red-500'
                }`}
              >
                {data.testSession[0].statusTest === 2
                  ? 'Selesai mengerjakan'
                  : data.testSession[0].statusTest === 1
                  ? 'Sedang mengerjakan'
                  : 'Belum mengerjakan'}
              </p>
            </div>
          </li>

        </ul>

      </div>

    </div>

  ) : (

    <div className="rounded-3xl border border-gray-200 bg-white p-10 text-center text-gray-500 shadow-sm">
      Data tidak ada
    </div>

  )}
</div>
    )
}