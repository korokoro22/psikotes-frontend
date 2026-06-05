"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import TestHeader from "../components/TestHeader";

export default function ResultPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const handleAnswer = async () => {
    try {
      const setLoading = setIsLoading(true);
      router.push("/");
    } catch (error) {
      const setLoading = setIsLoading(false);
    }
  };

  useEffect(() => {
    document.title = "Result - Psychological Tests";
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm py-4 sticky top-0 z-10">
        <TestHeader />
      </header>

      {/* Konten utama */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-lg p-10 text-center max-w-md w-full">
          <h2 className="text-2xl font-semibold text-slate-800 mb-3">
            Terima Kasih!
          </h2>
          <p className="text-slate-600 text-sm mb-6 leading-relaxed">
            Terima kasih telah menyelesaikan tes psikologi sebagai bagian dari
            proses rekrutmen. Hasil tes Anda akan dievaluasi oleh tim HR kami
            untuk mendukung proses seleksi. Mohon menunggu informasi selanjutnya
            dari pihak perusahaan.
          </p>

          <div className="mt-6">
            <button
              disabled={isLoading}
              onClick={() => handleAnswer()}
              className={`bg-gradient-to-r  text-white px-6 py-2.5 rounded-lg hover:shadow-md transition-all duration-200 ${
                isLoading ? "bg-slate-500" : "from-blue-600 to-indigo-600"
              }`}
            >
              {isLoading ? "Memproses..." : "Kembali ke halaman utama"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
