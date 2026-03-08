'use client'

import { div, tr } from "framer-motion/client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getHasilPeserta } from "@/services/peserta.service";

const peserta = [
    {
        nama: 'Rezky',
        tanggal: '17/06/2025'
    },
    {
        nama: 'Steve',
        tanggal: '20/12/2025'
    }
]

interface peserta {
    name: string
    date: string
}

export default function AdminManajemenTes() {

    const [isClicked, setIsClicked] = useState<boolean>(false)
    const [hasilPeserta, setHasilPeserta] = useState<peserta[]>([])

    useEffect(()=> {
        const hasilPeserta = async () => {
            try {
                const hasil = await getHasilPeserta()
                setHasilPeserta(hasil.data.data)
            } catch(error) {
                console.log(error)
            }
        }
        hasilPeserta()
    }, [])

    useEffect(()=>{
        console.log('ini hasil:', hasilPeserta)
    }, [hasilPeserta])

    return (
        <div className="">
            {/* <div className="flex w-full border border-gray-200 rounded-lg">
                <button className="w-2/12 py-2 flex gap-x-3 justify-center hover:bg-gray-300">
                    <p>Filter</p>
                    <Image
                        src='/assets/downarrowsvg.svg'
                        width={15}
                        height={15}
                        alt=""
                    />
                </button>
                <input type="search" placeholder="Search" className="w-10/12 focus:outline-0 border-l border-gray-200 pl-2"/>
            </div> */}
            <div className="rounded-lg overflow-hidden">
                <table className="border-collapse w-full">
                    <thead className="border-b border-gray-300 bg-gray-300 p-4 text-left text-base">
                        <tr>
                            <th className="py-2 px-4">Tanggal Tes</th>
                            <th className="py-2 px-4">Nama</th>
                            <th className="py-2 px-4">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                    {peserta.map(item => (
                        <tr
                            key={item.nama}
                            className="border-b border-gray-300 text-base"
                        >
                            <td className="py-2 px-4">{item.tanggal}</td>
                            <td className="py-2 px-4">{item.nama}</td>
                            <td className="py-2 px-4 flex gap-x-3">
                                <Link
                                    href={`/admin/hasiltes/hasil`}
                                    className="px-3 py-1 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                                >
                                    Hasil
                                </Link>
                                <button className="py-1 px-3 bg-red-600 text-white rounded-lg hover:bg-red-700">
                                    Hapus
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}