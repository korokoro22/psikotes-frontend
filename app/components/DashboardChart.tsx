"use client";

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
} from "chart.js";
import { Line } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  ChartDataLabels,
);

export default function dashboardChart() {
  const labels = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  const data = {
    labels: labels,
    datasets: [
      {
        label: "DISC",
        data: [2, 3, 6, 1, 5, 7, 8, 3, 4, 1, 9, 3],
        borderColor: "rgba(59,130,246,1)",
        tension: 0.1,
      },
      {
        label: "CFIT",
        data: [4, 6, 7, 2, 1, 4, 2, 3, 4, 2, 7, 9],
        borderColor: "rgba(239,68,68,1)",
        tension: 0.1,
      },
      {
        label: "MBTI",
        data: [2, 3, 4, 8, 6, 9, 3, 2, 1, 3, 8, 2],
        borderColor: "rgb(87, 89, 91)",
        tension: 0.1,
      },
    ],
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        mode: "index",
        intersect: false,
      },
      datalabels: {
        display: true,
        clamp: true,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Kolom",
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Frekuensi",
        },
        ticks: {
          precision: 0,
        },
      },
    },
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <Line data={data} options={options} />
    </div>
  );
}
