import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels,
);

const data = {
  labels: [
    "Extraversion (E) vs Intoversion (I)",
    "Sensing (S) vs Intuition (N)",
    "Thinking (T) vs Feeling (F)",
    "Judging (J) vs Perceiving (P)",
  ],
  datasets: [
    {
      label: "Left",
      data: [-6, -1, -2, -5], // E=6, S=1
      backgroundColor: "rgba(59,130,246,0.8)",
      borderRadius: 6,
      stack: "mbti",
    },
    {
      label: "Right",
      data: [4, 2, 8, 5], // I=4, N=2
      backgroundColor: "rgba(16,185,129,0.8)",
      borderRadius: 6,
      stack: "mbti",
    },
  ],
};

const options: ChartOptions<"bar"> = {
  indexAxis: "y",
  responsive: true,
  scales: {
    x: {
      min: -10,
      max: 10,
      grid: {},
      ticks: {
        display: false,
      },
    },
    y: {
      grid: {
        display: false,
      },
    },
  },
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      callbacks: {
        label: (ctx) => {
          const v = ctx.raw as number;
          return `Skor: ${Math.abs(v)}`;
        },
      },
    },

    datalabels: {
      color: "#fff",
      font: {
        weight: "bold",
        size: 12,
      },
      formatter: (value) => Math.abs(value as number),
      anchor: "center",
      align: "center",
    },
  },
};

const BarChartComponent = () => {
  return (
    <div className="w-3/4">
      <Bar data={data} options={options} />;
    </div>
  );
};

export default BarChartComponent;
