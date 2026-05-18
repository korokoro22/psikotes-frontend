'use client'
import { div, tr } from "framer-motion/client";
import Link from "next/link";
import { getAllPeserta } from "@/services/peserta.service";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Listbox } from "@headlessui/react";

interface TestSession {
    statusTest: number
}

interface Data {
    id: number
    nama: string
    testSession: TestSession[]
    posisi: string
    tanggal: Date
    createdAt: Date
}

type OpsiPosisi = {
    label: string
    count: number
}



export default function AdminPeserta() {
    const [data, setData] = useState<Data[]>([])
    const router = useRouter()
    const [opsiPosisi, setOpsiPosisi] = useState<OpsiPosisi[]>([])
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')

    

    useEffect(()=> {
        const getPeserta = async () => {
            try {
                const peserta = await getAllPeserta()
                setData(peserta.data.data)
                // Olah jadi opsi posisi
                const fetchedData = peserta.data.data  // simpan dulu di variabel lokal

                // gunakan variabel lokal, bukan `data`
                const grouped = fetchedData.reduce((acc: Record<string, number>, obj: { posisi: string }) => {
                    const posisi = obj.posisi
                    acc[posisi] = (acc[posisi] || 0) + 1
                    return acc
                }, {} as Record<string, number>)

                const opsi = Object.entries(grouped).map(([label, count]) => ({ label, count: count as number}))

                 const opsiSemua = {
                    label: 'Semua',
                    count: fetchedData.length,
                }
                setOpsiPosisi([opsiSemua, ...opsi])

                // setSelected(opsiSemua)
            } catch (err:any){
                router.push('/login')
            }   
        }
        getPeserta()
    }, [])

    

    const [selected, setSelected] = useState<OpsiPosisi | null>(null)
    const [search, setSearch] = useState('')
    

    useEffect(()=> {
        console.log('ini data',data)
    }, [data])

//     useEffect(()=> {
//         console.log('ini opsi posisi',opsiPosisi)
//     }, [opsiPosisi])

//     useEffect(() => {
//     document.title = "Peserta - Psychological Tests";
//   }, [])

    const filteredData = data.filter((item) => {
        // FILTER POSISI
        const matchPosisi =
            selected === null ||
            selected.label === 'Semua'
            ? true
            : item.posisi === selected.label

        // FILTER SEARCH NAMA
        const matchSearch =
            item.nama
            .toLowerCase()
            .includes(search.toLowerCase())

        // FILTER RANGE TANGGAL
        const itemDate = new Date(item.createdAt)

        let matchDate = true

        if (startDate) {
            matchDate =
            itemDate >= new Date(startDate)
        }

        if (endDate) {

            // supaya full sampai jam 23:59
            const end = new Date(endDate)
            end.setHours(23, 59, 59, 999)

            matchDate =
            matchDate && itemDate <= end
        }

        return (
            matchPosisi &&
            matchSearch &&
            matchDate
        )
        })

    return (
        <div>
            <div className="mb-10">

    <h1 className="text-4xl font-bold tracking-tight text-gray-800">
      Peserta
    </h1>

    <p className="mt-2 text-sm text-gray-500">
      Kelola data peserta psikotes dan progres pengerjaan tes
    </p>

  </div>
            <div className="py-2 w-full flex flex-col gap-y-3 mb-6">
                <div className="w-full">
                    <div className="relative">
                        <input
                        type="text"
                        placeholder="Cari nama peserta..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
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

                        <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="
                            absolute
                            right-4
                            top-1/2
                            h-5
                            w-5
                            -translate-y-1/2
                            text-gray-400
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
                    </div>
                </div>
                
                    
                <div className="flex gap-x-10 items-center">
                    <div className="w-44">
                        <Listbox value={selected} onChange={setSelected}>
                            <div className=" relative text-sm ">
                            {/* Button */}
                            <Listbox.Button className="w-full rounded-lg text-center border border-gray-300 bg-white px-2 py-1 shadow-sm focus:outline-none">
                                {selected
                                ? `${selected.label} (${selected.count})`
                                : 'Pilih posisi  ⏷'}
                            </Listbox.Button>

                            {/* Dropdown */}
                            <Listbox.Options className="absolute z-10 mt-2 max-h-60 w-full overflow-auto rounded-lg border border-gray-200 bg-white shadow-lg focus:outline-none">
                                {opsiPosisi.map((item) => (
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
                
                
            </div>
            <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
  <table className="w-full border-collapse">

    {/* Header */}
    <thead className="bg-gray-200">
      <tr className="text-left text-sm font-semibold text-gray-700">
        <th className="px-6 py-4">Tanggal Tes</th>
        <th className="px-6 py-4">Nama</th>
        <th className="px-6 py-4">Progres</th>
        <th className="px-6 py-4">Posisi</th>
        <th className="px-6 py-4">Aksi</th>
      </tr>
    </thead>

    {/* Body */}
    <tbody>
      {filteredData.map((item) => {

        const status = item.testSession[0].statusTest

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
              <div className="flex">
                <p
                  className={`rounded-full px-3 py-1 text-xs font-semibold text-white ${
                    status === 0
                      ? 'bg-gray-400'
                      : status === 1
                      ? 'bg-yellow-400'
                      : 'bg-green-600'
                  }`}
                >
                  {status === 0
                    ? 'Belum mengerjakan'
                    : status === 1
                    ? 'Sedang mengerjakan'
                    : 'Selesai mengerjakan'}
                </p>
              </div>
            </td>

            <td className="px-6 py-4">
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                {item.posisi}
              </span>
            </td>

            <td className="px-6 py-4">
              <Link
                href={`/admin/peserta/detail/${item.id}`}
                className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-blue-700"
              >
                Detail
              </Link>
            </td>

          </tr>
        )
      })}
    </tbody>

  </table>
</div>
        </div>
    )
}