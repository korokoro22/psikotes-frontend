"use client";
import Link from "next/link";
import { ArrowLeft, Brain, Clock, ListChecks } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import TestHeader from "@/app/components/TestHeader";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useAntiCheat } from "@/lib/useAntiCheat";
import { Metadata } from "next";
import { useClipboardPermissionGuard } from "@/lib/useClipboardPermissionGuard";
import PermissionModal from "@/app/components/PermissionModal";
import { useBackGuard } from "@/lib/useBackGuard";
import BackGuardModal from "@/app/components/BackGuardModal";
import { checkMoveTab } from "@/lib/checkMoveTab";

function IconSeries() {
  return (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect
        x="2"
        y="4"
        width="6"
        height="6"
        rx="1.2"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <rect
        x="9"
        y="8"
        width="6"
        height="6"
        rx="1.2"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <rect
        x="16"
        y="12"
        width="6"
        height="6"
        rx="1.2"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}
function IconClock() {
  return (
    <svg
      className="w-5 h-5 inline-block mr-1 -mt-0.5"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M12 7v5l3 2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function IconList() {
  return (
    <svg
      className="w-5 h-5 inline-block mr-2 -mt-0.5"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <path
        d="M8 6h13M8 12h13M8 18h13"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3 6h.01M3 12h.01M3 18h.01"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function CFITTest() {
  const { modalProps } = useBackGuard();

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const getRemainingTime = (): number => {
    if (typeof window === "undefined") return EXAM_DURATION;
    const startTime = localStorage.getItem("examStartTime");
    if (!startTime) return EXAM_DURATION;
    const elapsed = Math.floor((Date.now() - parseInt(startTime)) / 1000);
    return EXAM_DURATION - elapsed;
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remaining = seconds % 60;
    return `${minutes}:${remaining.toString().padStart(2, "0")}`;
  };

  const EXAM_DURATION = 3 * 60;

  const [timeLeft, setTimeLeft] = useState(EXAM_DURATION);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const existing = localStorage.getItem("examStartTime");
    if (!existing) {
      localStorage.setItem("examStartTime", Date.now().toString());
    }

    const remaining = getRemainingTime();
    setTimeLeft(Math.max(0, remaining));
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (!isReady) return;
    if (timeLeft <= 0) {
      handleTest();
      return;
    }
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, isReady]);

  const handleTest = () => {
    try {
      const setLoading = setIsLoading(true);
      const startTime = Date.now();
      localStorage.setItem("examStartTime", startTime.toString());
      router.push("/tests/cfit/subtest1");
    } catch (error) {
      const setLoading = setIsLoading(false);
    }
  };

  useAntiCheat({ mode: "silent" });

  useEffect(() => {
    document.title = "Instructions - Psychological Tests";
  }, []);

  const { showModal } = useClipboardPermissionGuard();

  const [testsCount, setTestsCount] = useState<number | null>(null);

  useEffect(() => {
    const testSession = sessionStorage.getItem("testSession");
    if (!testSession) {
      return;
    }

    const testSessionParsed = JSON.parse(testSession);
    setTestsCount(testSessionParsed.currentIndex + 1);
  }, []);

  checkMoveTab();

  return (
    <div className="font-sans min-h-screen bg-gradient-to-br from-red-50 to-indigo-100 select-none">
      {/* Header */}
      <header className="bg-white shadow-sm py-4 sticky top-0 z-10">
        <TestHeader />
      </header>

      <main className="container mx-auto px-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-8"
        >
          {/* Card */}
          <section>
            <div className="p-6 md:p-8">
              {/* Breadcrumb / Title */}
              <div className="flex items-center mb-8 justify-between">
                <div className="">
                  <h2 className="text-2xl md:text-3xl font-bold text-slate-800 text-center md:text-left">
                    TES PSIKOTES{" "}
                    <span className="text-2xl text-slate-700 font-semibold ml-3">
                      (TES KE-{testsCount ?? "..."})
                    </span>
                  </h2>
                </div>
                <div className="mt-4 md:mt-0 bg-slate-100 text-slate-800 px-3 py-1 rounded-xl font-mono text-base tracking-wider border border-slate-200">
                  <span>{isReady ? formatTime(timeLeft) : "--:--"}</span>
                </div>
              </div>

              {/* Info box */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-100 rounded-lg">
                  <div className="text-amber-600">
                    <IconList />
                  </div>
                  <div className="text-sm">
                    <div className="text-slate-800 font-medium">
                      Jumlah Soal
                    </div>
                    <div className="text-slate-600">
                      Total 63 soal (4 subtes)
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-emerald-50 border border-emerald-100 rounded-lg">
                  <div className="text-emerald-600">
                    <IconSeries />
                  </div>
                  <div className="text-sm">
                    <div className="text-slate-800 font-medium">Format</div>
                    <div className="text-slate-600">
                      Non-verbal • Gambar & Matriks
                    </div>
                  </div>
                </div>
              </div>

              {/* Petunjuk */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-slate-800 mb-3">
                  Petunjuk Umum
                </h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-slate-700">
                  <li className="flex gap-3 items-start">
                    <span className="flex-none mt-1 w-2.5 h-2.5 bg-slate-400 rounded-full"></span>
                    Kerjakan setiap soal sesuai petunjuk; beberapa soal berupa
                    gambar berurutan.
                  </li>
                  <li className="flex gap-3 items-start">
                    <span className="flex-none mt-1 w-2.5 h-2.5 bg-slate-400 rounded-full"></span>
                    Untuk subtes bergambar, pilih opsi gambar yang paling
                    sesuai.
                  </li>
                  <li className="flex gap-3 items-start">
                    <span className="flex-none mt-1 w-2.5 h-2.5 bg-slate-400 rounded-full"></span>
                    Pastikan koneksi stabil; jangan reload saat tes berjalan.
                  </li>
                  <li className="flex gap-3 items-start">
                    <span className="flex-none mt-1 w-2.5 h-2.5 bg-slate-400 rounded-full"></span>
                    Baca dan kerjakan soal dengan teliti.
                  </li>
                </ul>
              </div>
              {/* Action area */}
              <div className="mt-8 border-t pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="text-sm text-slate-600">
                  <strong className="text-slate-800">Sebelum mulai:</strong>{" "}
                  pastikan data diri sudah lengkap dan Anda siap fokus.
                </div>
                <div className="flex items-center gap-3">
                  {isLoading ? (
                    <button
                      className="disabled:pointer-events-none px-5 py-2 rounded-lg bg-gradient-to-r bg-slate-400 text-white font-medium shadow hover:scale-[1.02] active:scale-95 transition"
                      aria-label="Mulai CFIT Subtes 1"
                      onClick={handleTest}
                      disabled={isLoading}
                    >
                      Mohon Tunggu...
                    </button>
                  ) : (
                    <button
                      className={`px-5 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium shadow hover:scale-[1.01] active:scale-95 transition-transform`}
                      aria-label="Mulai CFIT Subtes 1"
                      onClick={handleTest}
                      disabled={isLoading}
                    >
                      Selanjutnya
                    </button>
                  )}
                </div>
              </div>
            </div>
          </section>
          {/* Footer small */}
          <div className="mt-6 text-center text-xs text-slate-400">
            Sistem ini menampilkan format latihan — selama tes sungguhan, waktu
            akan diatur secara ketat.
          </div>
        </motion.div>
        <PermissionModal isOpen={showModal} onClose={() => {}}>
          <div className="text-gray-700">
            <p className="font-bold text-xl mb-3">PERHATIAN</p>
            <p className="text-sm">
              Harap berikan izin untuk akses clipboard untuk mengakses halaman
              tes
            </p>
            <div className="flex justify-center my-4">
              <Image
                src="/assets/blockedAcces.png"
                width={200}
                height={200}
                className="rounded-lg "
                alt=""
              />
            </div>
            <div className="text-left ml-8">
              <ol className=" list-decimal flex flex-col gap-y-1">
                <li>
                  Pastikan ketiga bagian yang ditunjukkan dalam keadaan
                  enable/on
                </li>
                <li>Reload Kembali halaman (F5)</li>
              </ol>
            </div>
          </div>
        </PermissionModal>
        <BackGuardModal {...modalProps} />
      </main>
    </div>
  );
}
