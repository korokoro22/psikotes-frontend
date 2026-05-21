'use client'

import { div } from "framer-motion/client"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from 'framer-motion';
import DashboardChart from "@/app/components/DashboardChart";
import DashboardBarChart from "@/app/components/DashboardBarChart";
import { useEffect } from "react";
import { getCountAllPeserta } from "@/services/peserta.service";

export default function AdminDashboard() {

    const router = useRouter()

    const handleLogOut = () => {
        router.push('login')
    }

    useEffect(()=> {
        const dashboard = async () => {
            try{
            const res = await getCountAllPeserta()
            } catch (err:any) {
                router.push('/login')
            }
        }
        dashboard()
    }, [])

    useEffect(() => {
    document.title = "Dashboard - Psychological Tests";
  }, [])

    return(
        <div>

  {/* Header */}
  <div className="mb-10">
    <h1 className="text-4xl font-bold tracking-tight text-gray-800">
      Dashboard
    </h1>

    <p className="mt-2 text-sm text-gray-500">
      Ringkasan statistik dan aktivitas psikotes
    </p>
  </div>

  {/* Stats Card */}
  <div className="grid grid-cols-1 gap-5 md:grid-cols-3">

    {/* Card */}
    <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md">
      <div className="text-sm font-medium text-gray-500">
        Total Token Aktif
      </div>

      <div className="mt-5 text-5xl font-bold text-gray-800">
        4
      </div>
    </div>

    {/* Card */}
    <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md">
      <div className="text-sm font-medium text-gray-500">
        Total Peserta
      </div>

      <div className="mt-5 text-5xl font-bold text-gray-800">
        6
      </div>
    </div>

    {/* Card */}
    <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md">
      <div className="text-sm font-medium text-gray-500">
        Hasil Tes
      </div>

      <div className="mt-5 text-5xl font-bold text-gray-800">
        8
      </div>
    </div>

  </div>

  {/* Chart Section */}
  <div className="mt-10 space-y-8">

    {/* Chart 1 */}
    <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">

      <div className="mb-5">
        <h2 className="text-lg font-semibold text-gray-800">
          Jumlah Tes Tiap Bulan
        </h2>

        <p className="text-sm text-gray-500">
          Statistik jumlah tes yang dilakukan peserta
        </p>
      </div>

      <DashboardChart />

    </div>

    {/* Chart 2 */}
    <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">

      <div className="mb-5">
        <h2 className="text-lg font-semibold text-gray-800">
          Jumlah Peserta Tiap Bulan
        </h2>

        <p className="text-sm text-gray-500">
          Statistik jumlah peserta yang mengikuti tes
        </p>
      </div>

      <DashboardBarChart />

    </div>

  </div>

</div>
    )
}