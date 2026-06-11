"use client";

import React, { JSX, useEffect, useState } from "react";
import Link from "next/link";
import Cfit from "@/app/components/Cfit";
import Mbti from "@/app/components/Mbti";
import Disc from "@/app/components/Disc";
import Papikostick from "@/app/components/Papikostick";
import Msdt from "@/app/components/Msdt";
import Kraepelin from "@/app/components/Kraepelin";
import { getDetailHasilPeserta } from "@/services/peserta.service";
import { useRouter } from "next/navigation";
import { div } from "framer-motion/client";
import { useHtml2Pdf } from "@/lib/useHtml2Pdf";

export default function AdminHasilTesHasil({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [data, setData] = useState<any>(null);
  const router = useRouter();

  const { exportPdf } = useHtml2Pdf();

  const daftarTes = [
    "CFIT",
    "MBTI",
    "DISC",
    "PAPIKOSTICK",
    "KRAEPELIN",
    "MSDT",
  ];

  const componentMap: Record<string, JSX.Element> = {
    CFIT: <Cfit data={data?.skorCfit} />,
    MBTI: <Mbti data={data?.skorMbti[0]} />,
    DISC: <Disc data={data?.skorDisc[0]} />,
    PAPIKOSTICK: <Papikostick data={data?.skorPapikostik[0]} />,
    MSDT: <Msdt data={data?.skorMsdt[0]} />,
    KRAEPELIN: <Kraepelin data={data?.skorKraepelin[0]} />,
  };

  useEffect(() => {
    const detailPeserta = async () => {
      try {
        const { id } = await params;
        const peserta = await getDetailHasilPeserta(Number(id));
        setData(peserta.data.data);
      } catch (err: any) {}
    };
    detailPeserta();
  }, []);

  useEffect(() => {
    document.title = "Hasil Peserta - Psychological Tests";
  }, []);

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between border-b border-gray-200 pb-5">
        <div>
          <h1 className="text-lg md:text-4xl font-bold text-gray-800">
            Hasil Tes Peserta
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Detail hasil psikotes peserta
          </p>
        </div>

        <div className="flex items-center md:gap-x-5">
          <button
            type="button"
            onClick={() => exportPdf("pdf-content", "invoice.pdf")}
            className="no-print rounded-lg bg-blue-600 px-4 md:px-5 py-2 md:py-2.5 text-xs md:text-sm md:font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {/* {isExporting ? "Mengekspor..." : "Export PDF"} */} Export PDF
          </button>

          <Link
            href="/admin/hasiltes"
            className=" rounded-lg bg-gray-300 px-4 md:px-5 py-2 md:py-2.5 text-xs md:text-sm md:font-medium text-gray-700 transition-all duration-200 hover:bg-gray-200"
          >
            Kembali
          </Link>
        </div>
      </div>

      {/* Content */}
      {data ? (
        <div className="pdf-safe space-y-6" id="pdf-content">
          {/* Info Card */}
          <div className="rounded-3xl border border-indigo-100 bg-indigo-50/40 p-8 shadow-sm">
            <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
              {/* Left */}
              <ul className="flex flex-col gap-7">
                <li className="border-l-4 border-indigo-200 pl-4">
                  <p className="text-sm text-gray-600">Nama</p>
                  <p className="mt-1 text-lg font-semibold text-gray-900">
                    {data.nama}
                  </p>
                </li>

                <li className="border-l-4 border-indigo-200 pl-4">
                  <p className="text-sm text-gray-600">Umur</p>
                  <p className="mt-1 text-lg font-semibold text-gray-900">
                    {data.usia} Tahun
                  </p>
                </li>

                <li className="border-l-4 border-indigo-200 pl-4">
                  <p className="text-sm text-gray-600">Jenis Kelamin</p>
                  <p className="mt-1 text-lg font-semibold text-gray-900">
                    {data.jenisKelamin}
                  </p>
                </li>
              </ul>

              {/* Right */}
              <ul className="flex flex-col gap-7">
                <li className="border-l-4 border-indigo-200 pl-4">
                  <p className="text-sm text-gray-600">Pendidikan Terakhir</p>
                  <p className="mt-1 text-lg font-semibold text-gray-900">
                    {data.pendidikanTerakhir}
                  </p>
                </li>

                <li className="border-l-4 border-indigo-200 pl-4">
                  <p className="text-sm text-gray-600">Posisi yang Dilamar</p>
                  <p className="mt-1 text-lg font-semibold text-gray-900">
                    {data.posisiYangDilamar}
                  </p>
                </li>

                <li className="border-l-4 border-indigo-200 pl-4">
                  <p className="text-sm text-gray-600">Tanggal Tes</p>
                  <p className="mt-1 text-lg font-semibold text-gray-900">
                    {data.tanggalTes}
                  </p>
                </li>
              </ul>
            </div>
          </div>

          {/* Result Section */}
          <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
            {daftarTes
              .filter((item) => data.tests.includes(item))
              .map((item) => (
                <React.Fragment key={item}>
                  <div className="border-b border-gray-100 p-6 last:border-b-0">
                    {componentMap[item]}
                  </div>
                </React.Fragment>
              ))}
          </div>
        </div>
      ) : (
        <div className="rounded-3xl border border-gray-200 bg-white p-10 text-center text-gray-500 shadow-sm">
          Data tidak ada
        </div>
      )}
    </div>
  );
}
