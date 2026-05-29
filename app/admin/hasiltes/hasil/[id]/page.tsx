'use client'

import React, { JSX, useEffect, useState } from "react"
import Link from "next/link"
import Cfit from "@/app/components/Cfit"
import Mbti from "@/app/components/Mbti"
import Disc from "@/app/components/Disc"
import Papikostick from "@/app/components/Papikostick"
import Msdt from "@/app/components/Msdt"
import Kraepelin from "@/app/components/Kraepelin"
import { getDetailHasilPeserta } from "@/services/peserta.service"
import { useRouter } from "next/navigation"

const peserta = {
    nama: 'Rezky',
    umur: 20,
    jeniskelamin: 'laki-laki',
    pendidikan: 'S1',
    jurusan: 'Teknik Informatika',
    tes: ['cfit', 'msdt', 'mbti', 'kraepelin', 'papikostick', 'disc']
}

export default function AdminHasilTesHasil({ params }: { params: Promise<{ id: string }> }) {
    const [data, setData] = useState<any>(null)
    const router = useRouter()

    const daftarTes = ['CFIT', 'MBTI', 'DISC', 'PAPIKOSTICK', 'KRAEPELIN', 'MSDT']
    
    const componentMap: Record<string, JSX.Element> = {
        CFIT:         <Cfit data={data?.skorCfit} />,
        MBTI:         <Mbti data={data?.skorMbti} />,
        DISC:         <Disc data={data?.skorDisc} />,
        PAPIKOSTICK:  <Papikostick data={data?.skorPapikostik} />,
        MSDT:         <Msdt data={data?.skorMsdt} />,
        KRAEPELIN:    <Kraepelin data={data?.skorKraepelin} />
    };

    useEffect(()=> {
            const detailPeserta = async () => {
                try{
                const {id} = await params
                const peserta = await getDetailHasilPeserta(Number(id))
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
    document.title = "Hasil Peserta - Psychological Tests";
  }, [])

    return (
        <div>

  {/* Header */}
  <div className="mb-8 flex items-center justify-between border-b border-gray-200 pb-5">

    <div>
      <h1 className="text-4xl font-bold text-gray-800">
        Hasil Tes Peserta
      </h1>

      <p className="mt-1 text-sm text-gray-500">
        Detail hasil psikotes peserta
      </p>
    </div>

    <Link
      href="/admin/hasiltes"
      className="rounded-xl bg-gray-100 px-5 py-2 text-sm font-medium text-gray-700 transition-all duration-200 hover:bg-gray-200"
    >
      Kembali
    </Link>

  </div>

  {/* Content */}
  {data ? (

    <div className="space-y-6">

      {/* Info Card */}
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
                Umur
              </p>

              <p className="mt-1 text-lg font-semibold text-gray-800">
                {data.umur} Tahun
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
                Posisi yang Dilamar
              </p>

              <p className="mt-1 text-lg font-semibold text-gray-800">
                {data.posisiYangDilamar}
              </p>
            </li>

            <li>
              <p className="text-sm text-gray-500">
                Tanggal Tes
              </p>

              <p className="mt-1 text-lg font-semibold text-gray-800">
                {data.tanggalTes}
              </p>
            </li>

          </ul>

        </div>

      </div>

      {/* Result Section */}
      <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">

        {daftarTes
          .filter(item => data.tests.includes(item))
          .map(item => (

            <React.Fragment key={item}>

              <div className="border-b border-gray-100 p-6 last:border-b-0">
                {componentMap[item]}
              </div>

            </React.Fragment>

          ))}

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