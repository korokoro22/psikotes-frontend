"use client";

import { useEffect, useState } from "react";
import KraepelinLineChart from "./KraepelinLineChartComponent";

interface KraepelinScoring {
  id: number;
  keajeganVariabel: number;
  kecepatanVariabel: number;
  ketahananVariabel: number;
  ketelitianVariabel: number;
  skorKeajegan: number;
  skorKecepatan: number;
  skorKetahanan: number;
  skorKetelitian: number;
  totalPerLajur: string;
}

export default function Kraepelin({ data }: any) {
  const [score, setScore] = useState<KraepelinScoring>();

  const [total, setTotal] = useState([0]);

  useEffect(() => {
    setScore(data);
  }, [score]);

  useEffect(() => {
    if (score && score.totalPerLajur) {
      const totalLajur = score?.totalPerLajur.split(",");
      const convertedTotalLajur = totalLajur.map(Number);
      setTotal(convertedTotalLajur);
    }
  }, [score]);

  const formatDesimal = (nilai: any) => {
    if (!nilai) return "";
    return nilai.toString().replace(".", ",");
  };

  return (
    <div className="pb-5 border-gray-300 html2pdf__page-break">
      <div className="mb-4">
        <p className="font-bold text-2xl">Hasil Tes Kraepelin</p>
      </div>
      <div className="p-8">
        <h1 className="text-lg font-bold mb-6">
          Grafik (jawaban benar dan salah) tiap kolom
        </h1>
        <KraepelinLineChart jawaban={total} />
      </div>
      <div>
        <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
          <table className="w-full border-collapse">
            <tbody>
              <tr className="text-center text-sm font-semibold text-gray-700  ">
                <td className="px-4 py-2 border border-gray-300">Kompetensi</td>
                <td className="px-4 py-2 border border-gray-300">Pengertian</td>
                <td className="px-4 py-2 border border-gray-300">Skor</td>
                <td className="px-4 py-2 border border-gray-300">Indikator</td>
              </tr>
              <tr className="text-center text-sm font-semibold text-gray-700  ">
                <td className="px-4 py-2 border border-gray-300">
                  Kecepatan kerja
                </td>
                <td className="px-4 py-2 border border-gray-300">
                  Kuantitas pekerjaan dalam satu waktu
                </td>
                <td className="px-4 py-2 border border-gray-300 font-normal">
                  {formatDesimal(score?.skorKecepatan.toFixed(3))}
                </td>
                <td className="px-4 py-2 border border-gray-300 font-normal">
                  {score?.kecepatanVariabel}
                </td>
              </tr>
              <tr className="text-center text-sm font-semibold text-gray-700  ">
                <td className="px-4 py-2 border border-gray-300">
                  Ketelitian Kerja
                </td>
                <td className="px-4 py-2 border border-gray-300">
                  Jumlah kesalahan saat bekerja
                </td>
                <td className="px-4 py-2 border border-gray-300 font-normal">
                  {formatDesimal(score?.skorKetelitian.toFixed(3))}
                </td>
                <td className="px-4 py-2 border border-gray-300 font-normal">
                  {score?.ketelitianVariabel}
                </td>
              </tr>
              <tr className="text-center text-sm font-semibold text-gray-700  ">
                <td className="px-4 py-2 border border-gray-300">
                  Keajegan Kerja
                </td>
                <td className="px-4 py-2 border border-gray-300">
                  Kestabilan kerja saat menghadapi tekanan
                </td>
                <td className="px-4 py-2 border border-gray-300 font-normal">
                  {formatDesimal(score?.skorKeajegan.toFixed(3))}
                </td>
                <td className="px-4 py-2 border border-gray-300 font-normal">
                  {score?.keajeganVariabel}
                </td>
              </tr>
              <tr className="text-center text-sm font-semibold text-gray-700  ">
                <td className="px-4 py-2 border border-gray-300">
                  Ketahanan Kerja
                </td>
                <td className="px-4 py-2 border border-gray-300">
                  Kemampuan bertahan dalam pekerjaan monoton
                </td>
                <td className="px-4 py-2 border border-gray-300 font-normal">
                  {formatDesimal(score?.skorKetahanan.toFixed(3))}
                </td>
                <td className="px-4 py-2 border border-gray-300 font-normal">
                  {score?.ketahananVariabel}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
