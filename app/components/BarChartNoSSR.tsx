import dynamic from "next/dynamic";

const BarChartNoSSR = dynamic(
  () => import("@/app/components/BarChartComponent"),
  { ssr: false },
);
