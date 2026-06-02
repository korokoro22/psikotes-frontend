'use client'

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData,
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  ChartDataLabels
)

interface KraepelinLineChartProps {
  jawaban: number[] // ✅ langsung terima array number
}

export default function KraepelinLineChart({ jawaban }: KraepelinLineChartProps) {
  const labels = jawaban.map((_, i) => `Kolom ${i + 1}`)

  const data: ChartData<'line', number[], string> = {
    labels,
    datasets: [
      {
        label: 'Jawaban',
        data: jawaban, // ✅ langsung pakai
        borderColor: 'rgba(59,130,246,1)',
        backgroundColor: 'rgba(59,130,246,0.2)',
        tension: 0,
        pointRadius: 0,
      },
    ],
  }

  const options: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
      datalabels: {
        display: false,
        clamp: true,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Kolom',
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Jumlah soal yang dikerjakan (per lajur)',
        },
        ticks: {
          precision: 0,
        },
      },
    },
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      <Line data={data} options={options} />
    </div>
  )
}