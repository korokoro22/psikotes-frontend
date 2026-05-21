'use client'

import { div, tr } from "framer-motion/client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { getAllHasilPosition, getHasilPeserta } from "@/services/peserta.service";
import { Listbox } from "@headlessui/react";
import { useRouter, useSearchParams } from "next/navigation";

interface peserta {
    id: number
    nama: string
    createdAt: Date
    tanggal: Date
    posisi: string
}

type OpsiPosisi = {
    label: string
    count: number
}   

export default function AdminManajemenTes() {
    const searchParams = useSearchParams()
    const [hasilPeserta, setHasilPeserta] = useState<peserta[]>([])
    const router = useRouter()
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [totalData, setTotalData] = useState(0)
    const [totalPages, setTotalPages] = useState(0)
    const currentPage = parseInt(searchParams.get('page') || '1');
    const limit = 10; // Jumlah item per halaman
    // const [currentPages, setCurrentPages] = useState(1) // pagination
    const [position, setPosition] = useState<OpsiPosisi[]>([])
    const [selectedPosition, setSelectedPosition] = useState<OpsiPosisi | null>(null)
    const prevSelectedPosition = useRef(selectedPosition)
    const prevStartDate = useRef(startDate)
    const prevEndDate = useRef(endDate)
    const [selectedName, setSelectedName] = useState('')
    const [search, setSearch] = useState('')

    useEffect(()=> {
        const getPosisi = async () => {
            try {
                // const posisi = await getAllPosition()
                const posisi = await getAllHasilPosition(search || undefined, startDate, endDate)
                setPosition(posisi.data.data)
            } catch (error:any) {
                console.error('error: ', error)
                router.push('/login')
            }
        }
        getPosisi()
    }, [search, startDate, endDate])

    const goToPage = (page: number) => {
        router.push(`?page=${page}`)
    }

    useEffect(()=> {
        const hasilPeserta = async () => {
            try {
                 if (selectedPosition != prevSelectedPosition.current || startDate != prevStartDate.current || endDate != prevEndDate.current) {
                    prevSelectedPosition.current = selectedPosition
                    prevStartDate.current = startDate
                    prevEndDate.current = endDate
                    goToPage(1)
                    const hasil = await getHasilPeserta(currentPage, limit, selectedPosition?.label, search || undefined, startDate || undefined, endDate || undefined)
                    setHasilPeserta(hasil.data.data)
                    setTotalData(hasil.data.pagination.allData)
                    setTotalPages(hasil.data.pagination.totalPages)
                    return //PERBAIKI SERVICE UNTUK HASIL PESERTA
                    } else {
                        const hasil = await getHasilPeserta(currentPage, limit, selectedPosition?.label, search || undefined, startDate || undefined, endDate || undefined)
                        // const filter = await getFilteredTime(startDate, endDate)
                        if(hasil?.data?.data) {
                            setHasilPeserta(hasil.data.data)
                            setTotalData(hasil.data.pagination.allData)
                            setTotalPages(hasil.data.pagination.totalPages)
                            // setStartDate(hasil.data.data)
                            // setEndDate(hasil.data.data)
                        }
                    }
                } catch(error) {
                    console.log(error)
            }
        }
        hasilPeserta()
    }, [currentPage, selectedPosition, search, startDate, endDate])

    // const filteredData = hasilPeserta.filter((item) => {
    //     // FILTER POSISI
    //     const matchPosisi =
    //         selected === null ||
    //         selected.label === 'Semua'
    //         ? true
    //         : item.posisi === selected.label

    //     // FILTER SEARCH NAMA
    //     const matchSearch =
    //         item.nama
    //         .toLowerCase()
    //         .includes(search.toLowerCase())

    //     // FILTER RANGE TANGGAL
    //     const itemDate = new Date(item.createdAt)

    //     let matchDate = true

    //     if (startDate) {
    //         matchDate =
    //         itemDate >= new Date(startDate)
    //     }

    //     if (endDate) {

    //         // supaya full sampai jam 23:59
    //         const end = new Date(endDate)
    //         end.setHours(23, 59, 59, 999)

    //         matchDate =
    //         matchDate && itemDate <= end
    //     }

    //     return (
    //         matchPosisi &&
    //         matchSearch &&
    //         matchDate
    //     )
    //     })

    useEffect(()=>{
        console.log('ini hasil:', hasilPeserta)
    }, [hasilPeserta])

    useEffect(() => {
    document.title = "Hasil Tes - Psychological Tests";
  }, [])

    return (
        <div className="">
            <div className="mb-10">

    <h1 className="text-4xl font-bold tracking-tight text-gray-800">
      Hasil Tes
    </h1>

    <p className="mt-2 text-sm text-gray-500">
      Data dan hasil psikotes seluruh peserta
    </p>

  </div>
            <div className="py-2 w-full flex flex-col gap-y-3 mb-6">
                <div className="w-full">
                    <div className=" flex  gap-x-2">
                        <input
                        type="text"
                        placeholder="Cari nama peserta..."
                        value={selectedName}
                        onChange={(e) => setSelectedName(e.target.value)}
                        className="
                            w-full
                            rounded-xl
                            border border-gray-200
                            bg-white
                            px-4
                            py-3
                            text-sm
                            shadow-sm
                            outline-none
                            transition-all
                            duration-200
                            placeholder:text-gray-400
                            focus:border-blue-500
                            focus:ring-4
                            focus:ring-blue-100
                        "
                        />
                        <button 
                        className="flex gap-x-2 items-center rounded-xl bg-blue-600 px-3 text-white hover:bg-blue-800 hover:text-gray-200"
                        onClick={()=> setSearch(selectedName)}
                        >
                            <p className="text-sm">Search</p>
                            <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="
                            h-5
                            w-5
                            hover:text-gray-200
                            text-white 
                        "
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                        >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M21 21l-4.35-4.35m1.85-5.15a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                        </svg>
                        </button>
                        
                    </div>
                </div>
                            
                            <div>
                                <p className="font-medium mt-3 text-gray-800">Filter Pencarian:</p>
                                <div className="flex gap-x-10 items-center">
                                <div className="w-44">
                                    <Listbox value={selectedPosition} onChange={setSelectedPosition}>
                                        <div className=" relative text-sm flex items-center gap-1">
                                            <p className="text-sm font-medium text-gray-600">Posisi:</p>
                                            {/* Button */}
                                            <Listbox.Button className="w-full rounded-lg text-center border border-gray-300 bg-white px-2 py-1 shadow-sm focus:outline-none">
                                                {selectedPosition
                                                ? `${selectedPosition.label} (${selectedPosition.count})`
                                                : 'Pilih posisi  ⏷'}
                                            </Listbox.Button>
                
                                            {/* Dropdown */}
                                            <Listbox.Options className="absolute z-10 mt-2 max-h-60 w-full overflow-auto rounded-lg border border-gray-200 bg-white shadow-lg focus:outline-none">
                                                {position.map((item) => (
                                                <Listbox.Option
                                                    key={item.label}
                                                    value={item}
                                                    className={({ active }) =>
                                                    `cursor-pointer px-4 py-2 ${
                                                        active ? 'bg-gray-100' : ''
                                                    }`
                                                    }
                                                >
                                                    {item.label} ({item.count})
                                                </Listbox.Option>
                                                ))}
                                            </Listbox.Options>
                                        </div>
                                    </Listbox>
                                </div>
                                <div className="flex flex-wrap gap-4">
            
                                    {/* Start Date */}
                                    <div className="flex gap-1 items-center">
                                        <label className="text-sm font-medium text-gray-600">
                                        Dari Tanggal:
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
                                        Sampai Tanggal:
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
                            </div> 
                            
                            
                            
                        </div>
            {hasilPeserta?.length > 0 ?(
                <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
                <table className="w-full border-collapse">

                    {/* Header */}
                    <thead className="bg-gray-200">
                    <tr className="text-left text-sm font-semibold text-gray-700">
                        <th className="px-6 py-4">Tanggal Tes</th>
                        <th className="px-6 py-4">Nama</th>
                        <th className="px-6 py-4">Posisi</th>
                        <th className="px-6 py-4">Aksi</th>
                    </tr>
                    </thead>

                    {/* Body */}
                    <tbody>
                    {hasilPeserta.map((item) => {
                        return (
                        <tr
                        key={item.id}
                        className="border-t border-gray-100 text-sm transition-colors duration-150 hover:bg-gray-50"
                        >
                        <td className="px-6 py-4 text-gray-600">
                            {item.tanggal.toString()}
                        </td>

                        <td className="px-6 py-4 font-medium text-gray-800">
                            {item.nama}
                        </td>

                        <td className="px-6 py-4">
                            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                            {item.posisi}
                            </span>
                        </td>

                        <td className="px-6 py-4">
                            <div className="flex items-center gap-3">

                            <Link
                                href={`/admin/hasiltes/hasil/${item.id}`}
                                className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-blue-700"
                            >
                                Hasil
                            </Link>

                            <button className="rounded-xl bg-red-500 px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-red-600">
                                Hapus
                            </button>

                            </div>
                        </td>

                        </tr>
                    )})}
                    </tbody>

                </table>
</div>
            ):(
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