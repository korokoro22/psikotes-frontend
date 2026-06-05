"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

type DiscType = "D" | "I" | "S" | "C";
type DiscCount = Record<DiscType, number>;

type DiscAnswer = {
  groupId: number;
  type: DiscType;
};

type DiscAnswers = {
  most: DiscAnswer[];
  least: DiscAnswer[];
};

type DiscChartProps = {
  answers: DiscAnswers;
};

export default function DiscChart({ answers }: DiscChartProps) {
  const labels = ["D", "I", "S", "C"];

  const data = {
    labels: labels,
    datasets: [
      {
        label: "Peserta",
        data: [2, 5, 8, 1, 9, 4, 7, 4, 2, 8, 5, 7],
        backgroundColor: "rgba(59, 130, 246, 0.7)", // biru
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      tooltip: {
        enabled: true,
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
        title: {
          display: true,
          text: "Frekuensi",
        },
        beginAtZero: true,
      },
    },
  };

  const initCount = (): DiscCount => ({
    D: 0,
    I: 0,
    S: 0,
    C: 0,
  });

  const mostCount: DiscCount = initCount();
  const leastCount: DiscCount = initCount();

  answers.most.forEach((item) => {
    mostCount[item.type] += 1;
  });

  answers.least.forEach((item) => {
    leastCount[item.type] += 1;
  });

  const mostD = mostCount.D;
  const mostI = mostCount.I;
  const mostS = mostCount.S;
  const mostC = mostCount.C;

  const leastD = leastCount.D;
  const leastI = leastCount.I;
  const leastS = leastCount.S;
  const leastC = leastCount.C;

  return <div></div>;
}
