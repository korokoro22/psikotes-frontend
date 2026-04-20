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
        CFIT: <Cfit data={data?.skorCfit} />,
        MBTI: <Mbti />,
        DISC: <Disc />,
        PAPIKOSTICK: <Papikostick />,
        MSDT: <Msdt />,
        KRAEPELIN: <Kraepelin />
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

    return (
        <div>
            <div className="">
            <div className="mb-8 border-b pb-5 border-gray-300 flex justify-between items-center">
                <p className="font-bold text-4xl">Hasil Tes Peserta</p>
                <Link 
                    href='/admin/hasiltes'
                    className="bg-gray-300 px-5 py-1 rounded-lg hover:bg-gray-400"
                >
                    Kembali
                </Link>
            </div>
            <div className="flex gap-x-20">
                {data
                ? <div>
                    <div className="flex gap-x-20">
                        <ul className="flex flex-col gap-y-6">
                            <li>    
                                <p className="text-gray-600">Nama</p>
                                <p className="font-semibold text-lg">{data.nama}</p>
                            </li>
                            <li>    
                                <p className="text-gray-600">Umur</p>
                                <p className="font-semibold text-lg">{data.umur} Tahun</p>
                            </li>
                            <li>    
                                <p className="text-gray-600">Jenis Kelamin</p>
                                <p className="font-semibold text-lg">{data.jenisKelamin}</p>
                            </li>
                        </ul>                        
                                
                        <ul className="flex flex-col gap-y-6">
                            <li>    
                                <p className="text-gray-600">Pendidikan Terakhir</p>
                                <p className="font-semibold text-lg">{data.pendidikanTerakhir}</p>
                            </li>
                            <li>    
                                <p className="text-gray-600">Posisi yang dilamar</p>
                                <p className="font-semibold text-lg">{data.posisiYangDilamar}</p>
                            </li>
                            <li>    
                                <p className="text-gray-600">Tanggal tes</p>
                                <p className="font-semibold text-lg">{data.tanggalTes}</p>
                            </li>
                            
                        </ul>
                    </div>
                     

                    <div className="w-full border-t-2 mt-5 border-gray-300">
                        {daftarTes
                        .filter(item => data.tests.includes(item))
                        .map(item => (
                            <React.Fragment key={item}>
                            <div className="py-5 border-b-2 border-gray-300">
                                {componentMap[item]}
                            </div>
                            </React.Fragment>
                        ))}
                    </div>
                </div>
                : <div>
                    Data tidak ada
                </div>}
                   
            </div>

            
            
        </div>
        </div>
    )
}