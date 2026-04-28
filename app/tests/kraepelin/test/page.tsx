"use client";

import { useState, useEffect, useCallback, useRef, memo, useMemo } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { storeAnswersKraepelin, triggerN8n } from "@/services/answers.service";
import { updateStatusTest } from "@/services/answers.service";
import { useAntiCheat } from "@/lib/useAntiCheat";
import BackGuardModal from "@/app/components/BackGuardModal";
import { useBackGuard } from "@/lib/useBackGuard";

/* ═══════════════════════════════════════════════════════════
   CONSTANTS & TYPES
   ═══════════════════════════════════════════════════════════ */
// const ROWS = 40;
// const COLS = 40;
// const PAIRS = ROWS - 1; // 39 pasangan per kolom
// const COL_TIME_MS = 15_000; // 15 detik per kolom

type Status = "idle" | "playing" | "finished";

// Audit log — mencatat hanya anomali/pelanggaran
interface AuditEntry {
  timestamp: string;
  event: "Mengisi jawaban mundur dalam lajur yang sama" | "Mengisi jawaban maju dalam lajur yang sama" | "Mengisi jawaban di lajur yang berbeda" | "Mengisi ulang kotak yang sudah dijawab" | "Mengisi jawaban setelah waktu habis" | "Terlambat pindah lajur" | "Melangkahi kotak jawaban";
  fromCol: number;   // lajur seharusnya (legitimateCol) saat pelanggaran terjadi
  toCol: number;     // lajur yang diisi user
  fromPair: number;  // pair seharusnya (expectedPair) saat pelanggaran terjadi
  toPair: number;    // pair yang diisi user
}

// State per kolom
interface ColState {
  hasStarted: boolean; // apakah kolom ini sudah pernah dikunjungi
  timeLeftMs: number;
  timedOut: boolean;
}

// State jawaban per lajur
interface ColumnResult {
  columnIndex: number;
  answers: (1 | 0 | null)[];
  correctAnswers: number;
  wrongAnswers: number;
  totalAnswered: number;
}

/* ═══════════════════════════════════════════════════════════
   SOAL MANUAL — 40 lajur × 40 angka (1–9)
   Setiap sub-array = satu LAJUR (kolom). KRAEPELIN_DATA[col][row].
   ═══════════════════════════════════════════════════════════ */
// prettier-ignore
const KRAEPELIN_DATA: number[][] = [
  // Setiap sub-array = satu LAJUR. Ada 40 lajur, setiap lajur 40 angka (atas ke bawah).
  [5,3,8,2,7,4,9,1,6,3,8,5,2,7,4,9,1,6,3,8,5,2,7,4,9,1,6,3,8,5,2,7,4,9,1,6,3,8,5,2],
  [2,7,1,9,3,6,5,8,4,2,7,1,9,3,6,5,8,4,2,7,1,9,3,6,5,8,4,2,7,1,9,3,6,5,8,4,2,7,1,9],
  [9,4,6,5,1,8,3,7,2,9,4,6,5,1,8,3,7,2,9,4,6,5,1,8,3,7,2,9,4,6,5,1,8,3,7,2,9,4,6,5],
  [6,1,3,8,4,2,7,5,9,6,1,3,8,4,2,7,5,9,6,1,3,8,4,2,7,5,9,6,1,3,8,4,2,7,5,9,6,1,3,8],
  [3,8,5,1,9,7,4,2,6,3,8,5,1,9,7,4,2,6,3,8,5,1,9,7,4,2,6,3,8,5,1,9,7,4,2,6,3,8,5,1],
  [7,2,9,4,6,1,8,3,5,7,2,9,4,6,1,8,3,5,7,2,9,4,6,1,8,3,5,7,2,9,4,6,1,8,3,5,7,2,9,4],
  [1,6,4,7,2,5,9,8,3,1,6,4,7,2,5,9,8,3,1,6,4,7,2,5,9,8,3,1,6,4,7,2,5,9,8,3,1,6,4,7],
  [8,5,2,3,7,9,6,1,4,8,5,2,3,7,9,6,1,4,8,5,2,3,7,9,6,1,4,8,5,2,3,7,9,6,1,4,8,5,2,3],
  [4,9,7,6,5,3,2,4,8,4,9,7,6,5,3,2,4,8,4,9,7,6,5,3,2,4,8,4,9,7,6,5,3,2,4,8,4,9,7,6],
  [5,1,3,8,9,4,7,6,2,5,1,3,8,9,4,7,6,2,5,1,3,8,9,4,7,6,2,5,1,3,8,9,4,7,6,2,5,1,3,8],
  [2,8,6,4,1,7,3,9,5,2,8,6,4,1,7,3,9,5,2,8,6,4,1,7,3,9,5,2,8,6,4,1,7,3,9,5,2,8,6,4],
  [7,3,9,1,6,5,8,2,4,7,3,9,1,6,5,8,2,4,7,3,9,1,6,5,8,2,4,7,3,9,1,6,5,8,2,4,7,3,9,1],
  [9,6,2,5,3,8,1,7,4,9,6,2,5,3,8,1,7,4,9,6,2,5,3,8,1,7,4,9,6,2,5,3,8,1,7,4,9,6,2,5],
  [4,2,7,9,8,1,6,3,5,4,2,7,9,8,1,6,3,5,4,2,7,9,8,1,6,3,5,4,2,7,9,8,1,6,3,5,4,2,7,9],
  [1,5,4,3,7,9,2,8,6,1,5,4,3,7,9,2,8,6,1,5,4,3,7,9,2,8,6,1,5,4,3,7,9,2,8,6,1,5,4,3],
  [6,8,1,7,2,4,5,9,3,6,8,1,7,2,4,5,9,3,6,8,1,7,2,4,5,9,3,6,8,1,7,2,4,5,9,3,6,8,1,7],
  [3,4,8,2,5,6,9,1,7,3,4,8,2,5,6,9,1,7,3,4,8,2,5,6,9,1,7,3,4,8,2,5,6,9,1,7,3,4,8,2],
  [8,7,5,6,4,2,3,4,9,8,7,5,6,4,2,3,4,9,8,7,5,6,4,2,3,4,9,8,7,5,6,4,2,3,4,9,8,7,5,6],
  [2,1,9,4,8,7,6,5,3,2,1,9,4,8,7,6,5,3,2,1,9,4,8,7,6,5,3,2,1,9,4,8,7,6,5,3,2,1,9,4],
  [5,9,3,8,1,3,4,7,2,5,9,3,8,1,3,4,7,2,5,9,3,8,1,3,4,7,2,5,9,3,8,1,3,4,7,2,5,9,3,8],
  [7,6,4,1,9,8,2,3,5,7,6,4,1,9,8,2,3,5,7,6,4,1,9,8,2,3,5,7,6,4,1,9,8,2,3,5,7,6,4,1],
  [1,3,8,7,6,5,9,4,2,1,3,8,7,6,5,9,4,2,1,3,8,7,6,5,9,4,2,1,3,8,7,6,5,9,4,2,1,3,8,7],
  [4,8,2,3,5,1,7,6,9,4,8,2,3,5,1,7,6,9,4,8,2,3,5,1,7,6,9,4,8,2,3,5,1,7,6,9,4,8,2,3],
  [9,2,6,5,4,7,3,8,1,9,2,6,5,4,7,3,8,1,9,2,6,5,4,7,3,8,1,9,2,6,5,4,7,3,8,1,9,2,6,5],
  [6,5,1,9,3,2,8,4,7,6,5,1,9,3,2,8,4,7,6,5,1,9,3,2,8,4,7,6,5,1,9,3,2,8,4,7,6,5,1,9],
  [3,7,9,2,8,6,1,5,4,3,7,9,2,8,6,1,5,4,3,7,9,2,8,6,1,5,4,3,7,9,2,8,6,1,5,4,3,7,9,2],
  [8,1,5,4,7,9,4,2,6,8,1,5,4,7,9,4,2,6,8,1,5,4,7,9,4,2,6,8,1,5,4,7,9,4,2,6,8,1,5,4],
  [2,4,7,8,1,3,6,9,5,2,4,7,8,1,3,6,9,5,2,4,7,8,1,3,6,9,5,2,4,7,8,1,3,6,9,5,2,4,7,8],
  [5,6,3,1,9,8,2,7,4,5,6,3,1,9,8,2,7,4,5,6,3,1,9,8,2,7,4,5,6,3,1,9,8,2,7,4,5,6,3,1],
  [1,9,8,6,2,4,5,3,7,1,9,8,6,2,4,5,3,7,1,9,8,6,2,4,5,3,7,1,9,8,6,2,4,5,3,7,1,9,8,6],
  [4,3,2,7,5,1,9,6,8,4,3,2,7,5,1,9,6,8,4,3,2,7,5,1,9,6,8,4,3,2,7,5,1,9,6,8,4,3,2,7],
  [7,8,6,3,4,5,2,1,9,7,8,6,3,4,5,2,1,9,7,8,6,3,4,5,2,1,9,7,8,6,3,4,5,2,1,9,7,8,6,3],
  [9,5,4,2,6,7,8,3,1,9,5,4,2,6,7,8,3,1,9,5,4,2,6,7,8,3,1,9,5,4,2,6,7,8,3,1,9,5,4,2],
  [6,2,1,4,3,9,7,5,8,6,2,1,4,3,9,7,5,8,6,2,1,4,3,9,7,5,8,6,2,1,4,3,9,7,5,8,6,2,1,4],
  [3,7,5,9,8,2,4,6,1,3,7,5,9,8,2,4,6,1,3,7,5,9,8,2,4,6,1,3,7,5,9,8,2,4,6,1,3,7,5,9],
  [8,4,9,5,1,6,3,2,7,8,4,9,5,1,6,3,2,7,8,4,9,5,1,6,3,2,7,8,4,9,5,1,6,3,2,7,8,4,9,5],
  [1,6,7,8,4,3,5,9,2,1,6,7,8,4,3,5,9,2,1,6,7,8,4,3,5,9,2,1,6,7,8,4,3,5,9,2,1,6,7,8],
  [5,2,3,6,7,8,1,4,9,5,2,3,6,7,8,1,4,9,5,2,3,6,7,8,1,4,9,5,2,3,6,7,8,1,4,9,5,2,3,6],
  [2,9,4,1,5,7,6,8,3,2,9,4,1,5,7,6,8,3,2,9,4,1,5,7,6,8,3,2,9,4,1,5,7,6,8,3,2,9,4,1],
  [7,1,6,3,9,4,8,2,5,7,1,6,3,9,4,8,2,5,7,1,6,3,9,4,8,2,5,7,1,6,3,9,4,8,2,5,7,1,6,3],
  [3,7,9,2,8,6,1,5,4,3,7,9,2,8,6,1,5,4,3,7,9,2,8,6,1,5,4,3,7,9,2,8,6,1,5,4,3,7,9,2],
  [5,9,3,8,1,3,4,7,2,5,9,3,8,1,3,4,7,2,5,9,3,8,1,3,4,7,2,5,9,3,8,1,3,4,7,2,5,9,3,8],
  [6,1,3,8,4,2,7,5,9,6,1,3,8,4,2,7,5,9,6,1,3,8,4,2,7,5,9,6,1,3,8,4,2,7,5,9,6,1,3,8],
  [7,6,4,1,9,8,2,3,5,7,6,4,1,9,8,2,3,5,7,6,4,1,9,8,2,3,5,7,6,4,1,9,8,2,3,5,7,6,4,1],
  [3,7,9,2,8,6,1,5,4,3,7,9,2,8,6,1,5,4,3,7,9,2,8,6,1,5,4,3,7,9,2,8,6,1,5,4,3,7,9,2]
];

const ROWS = KRAEPELIN_DATA[0].length;
const COLS = KRAEPELIN_DATA.length;
const PAIRS = ROWS - 1; // 39 pasangan per kolom
const COL_TIME_MS = 30_000; // detik per kolom

// Mengembalikan data soal Kraepelin sebagai grid[col][row]
function genGrid(): number[][] {
  return KRAEPELIN_DATA;
}

// Membuat state awal untuk setiap lajur: belum dimulai, waktu penuh, belum timeout
function initColStates(): ColState[] {
  return Array.from({ length: COLS }, () => ({
    hasStarted: false,
    timeLeftMs: COL_TIME_MS,
    timedOut: false,
  }));
}

/* ═══════════════════════════════════════════════════════════
   KRAEPELIN COLUMN
   Komponen satu lajur soal. Dibungkus memo() agar hanya re-render
   jika props yang diterima benar-benar berubah (optimasi performa).
   ═══════════════════════════════════════════════════════════ */
interface KraepelinColumnProps {
  cIdx: number;
  colData: number[];           // array angka 1 kolom
  answers: (1 | 0 | null)[];  // jawaban 1 kolom
  inputValues: (number | null)[]; // nilai input 1 kolom
  focusedPair: number | null;  // pair yang fokus di kolom ini (null jika kolom lain)
  isActiveCol: boolean;
  isSystemActiveCol: boolean;
  isTimedOut: boolean;
  timeLeftMs: number;
  status: string;
  isAccessible: boolean; // hanya true jika ini lajur yang sedang dipilih user
  inputRefs: React.MutableRefObject<{ [key: string]: HTMLInputElement | null }>;
  focusHandledRef: React.MutableRefObject<boolean>;
  onInputClick: (col: number, pairIdx: number) => void;
  onInput: (digit: number, col: number, pairIdx: number) => void;
}

const KraepelinColumn = memo(function KraepelinColumn({
  cIdx,
  colData,
  answers,
  inputValues,
  focusedPair,
  isActiveCol,
  isSystemActiveCol,
  isTimedOut,
  timeLeftMs,
  status,
  isAccessible,
  inputRefs,
  focusHandledRef,
  onInputClick,
  onInput,
}: KraepelinColumnProps) {
  return (
    <div
      className={[
        "rounded-lg p-3 transition-all",
        isSystemActiveCol
          ? "bg-blue-50 ring-2 ring-blue-400 shadow-lg"
          : isActiveCol && !isSystemActiveCol
            ? "bg-yellow-50 ring-2 ring-yellow-400 shadow-lg"
            : isTimedOut
              ? "bg-stone-100 opacity-60"
              : "bg-white",
      ].join(" ")}
    >
      {/* Header lajur */}
      <div className="text-center mb-2 pb-2 border-b border-stone-200">
        <div className="text-[10px] text-stone-400 font-medium">LAJUR</div>
        <div className="text-sm font-bold text-stone-600">{cIdx + 1}</div>
        {!isTimedOut && (
          <div className="text-[10px] text-stone-400 font-mono mt-0.5">
            {/* {Math.ceil(timeLeftMs / 1000)}s */}
          </div>
        )}
        {isTimedOut && (
          <div className="text-[10px] text-red-500 font-semibold mt-0.5">
            SELESAI
          </div>
        )}
      </div>

      {/*
        Layout 2 kolom:
        Kiri  = semua ROWS angka, masing-masing tinggi h-6
        Kanan = PAIRS kotak, masing-masing tinggi h-6,
                digeser ke bawah setengah baris (mt-3) agar
                setiap kotak berada di antara dua angka di sebelahnya.
      */}
      <div className="flex gap-0.5">
        {/* Kolom angka */}
        <div className="flex flex-col">
          {colData.map((num, rIdx) => (
            <div
              key={rIdx}
              className="w-6 h-6 flex items-center justify-center text-xs font-medium text-stone-700 bg-stone-50 border-b border-stone-200"
            >
              {num}
            </div>
          ))}
        </div>

        {/* Kolom kotak jawaban — digeser ke bawah setengah baris */}
        <div className="flex flex-col mt-3">
          {Array.from({ length: PAIRS }).map((_, rIdx) => {
            // rIdx 0 = kotak paling atas (antara grid baris 0 dan 1)
            // pairIdx: 0 = paling bawah, PAIRS-1 = paling atas
            const pairIdx = PAIRS - 1 - rIdx;
            const answer = answers[pairIdx];
            const isFocused = focusedPair === pairIdx;
            const typedValue = inputValues[pairIdx];

            return (
              <div key={rIdx} className="h-6 flex items-center justify-center">
                <input
                  ref={el => { inputRefs.current[`${cIdx}-${pairIdx}`] = el; }}
                  type="text"
                  maxLength={1}
                  readOnly
                  value={typedValue !== null ? String(typedValue) : ""}
                  onFocus={() => {
                    focusHandledRef.current = true;
                    onInputClick(cIdx, pairIdx);
                  }}
                  onClick={() => {
                    if (focusHandledRef.current) {
                      focusHandledRef.current = false;
                    } else {
                      onInputClick(cIdx, pairIdx);
                    }
                  }}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val >= "0" && val <= "9") {
                      onInput(Number(val), cIdx, pairIdx);
                    }
                  }}
                  className={[
                    "w-5 h-5 text-center text-[10px] font-bold rounded border transition-all outline-none",
                    answer !== null
                      ? answer === 1
                        ? isFocused
                          ? "border-blue-500 bg-blue-50 text-blue-700 ring-1 ring-blue-300"
                          : "border-stone-500 bg-stone-50 text-stone-500"
                        : isFocused
                          ? "border-blue-500 bg-blue-50 text-blue-700 ring-1 ring-blue-300"
                          : "border-stone-500 bg-stone-50 text-stone-500"
                      : isFocused
                        ? "border-blue-500 bg-blue-50 ring-1 ring-blue-300"
                        : "border-stone-300 bg-white hover:border-blue-400",
                  ].join(" ")}
                  placeholder={answer === null ? "?" : ""}
                  disabled={status !== "playing" || !isAccessible}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
});

/* ═══════════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════════ */
export default function KraeplinTest() {
  const router = useRouter();
  
  /* ── STATE ──
   * grid          : data soal (angka per lajur)
   * systemActiveCol: lajur yang timer-nya sedang berjalan (patokan sistem)
   * activeCol      : lajur yang sedang ditampilkan/dikerjakan user
   */
  const [grid, setGrid] = useState<number[][]>([]);
  const [systemActiveCol, setSystemActiveCol] = useState<number>(0);
  const [activeCol, setActiveCol] = useState<number>(0);
  
  // answers[col][pair]: null = belum dijawab, 1 = benar, 0 = salah
  const [answers, setAnswers] = useState<(1 | 0 | null)[][]>(
    () => Array.from({ length: COLS }, () => Array(PAIRS).fill(null))
  );
  // inputValues[col][pair]: angka yang diketik user, ditampilkan di kotak
  const [inputValues, setInputValues] = useState<(number | null)[][]>(
    () => Array.from({ length: COLS }, () => Array(PAIRS).fill(null))
  );
  const [colStates, setColStates] = useState<ColState[]>(initColStates);
  const [status, setStatus] = useState<Status>("idle");
  const [auditLog, setAuditLog] = useState<AuditEntry[]>([]);
  
  // Kotak jawaban yang sedang difokus
  const [focusedInput, setFocusedInput] = useState<{col: number, pair: number} | null>(null);

  // legitimateCol: lajur yang sah dikerjakan tanpa pelanggaran.
  // Hanya naik saat user tekan Next SETELAH waktu lajur habis.
  const [legitimateCol, setLegitimateCol] = useState<number>(0);

  // expectedPair: posisi pair berurutan yang seharusnya diisi dalam legitimateCol.
  // Naik satu tiap kali jawaban diisi di posisi yang tepat (tidak melangkahi).
  const [expectedPair, setExpectedPair] = useState<number>(0);

  // graceTimeLeftMs: sisa waktu grace period setelah lajur timeout (null = belum/tidak aktif).
  // Jika habis sebelum user tekan Next, dicatat sebagai pelanggaran.
  const [graceTimeLeftMs, setGraceTimeLeftMs] = useState<number | null>(null);
  const gracePenalizedRef = useRef(false); // agar pelanggaran grace hanya dicatat sekali
  
  const [isClient, setIsClient] = useState(false);

  useAntiCheat({ mode: "silent" });

  useEffect(() => {
    document.title = "Test - Psychological Tests";
  }, [])
  
  useEffect(() => {
    setIsClient(true);
    setGrid(genGrid());
  }, []);

  /* ── REFS ── */
  const inputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
  // Mencegah double-call onFocus + onClick pada event yang sama
  const focusHandledRef = useRef(false);

  // Waktu tersisa lajur aktif sistem (untuk ditampilkan di UI)
  const timeLeftMs = colStates[systemActiveCol]?.timeLeftMs ?? COL_TIME_MS;

  /* ═══ CALCULATE RESULTS PER COLUMN ═══
   * Menghitung jumlah jawaban benar, salah, dan total per lajur.
   * Dipanggil saat tes selesai sebelum submit ke backend.
   */
  const calculateColumnResults = useCallback((): ColumnResult[] => {
    const results: ColumnResult[] = [];
    
    for (let c = 0; c < COLS; c++) {
      let correctAnswers = 0;
      let wrongAnswers = 0;
      let totalAnswered = 0;
      
      for (let r = 0; r < PAIRS; r++) {
        if (answers[c][r] !== null) {
          totalAnswered++;
          if (answers[c][r] === 1) {
            correctAnswers++;
          } else {
            wrongAnswers++;
          }
        }
      }
      
      results.push({
        columnIndex: c,
        answers: [...answers[c]],
        correctAnswers,
        wrongAnswers,
        totalAnswered,
      });
    }
    
    return results;
  }, [answers]);

  /* ═══ SUBMIT RESULTS TO BACKEND ═══
   * Mengemas hasil tes (jawaban per lajur + auditLog pelanggaran) lalu
   * mengirimnya ke backend menggunakan sessionId dari sessionStorage.
   */
  const handleSubmit = useCallback(async () => {
    
      const columnResults = calculateColumnResults();
      
      const payload = {
        testType: "kraepelin",
        columnResults,
        auditLog,
        completedAt: new Date().toISOString(),
      };
      const payloadConverted = JSON.stringify(payload)

      const testSession = sessionStorage.getItem('testSession')
      
      if(!testSession) {
        return (console.log('gagal'))
      }

      const testSessionParsed = JSON.parse(testSession)
      
      const tests:string = testSessionParsed.tests[testSessionParsed.currentIndex]
      console.log('ini test:', typeof(tests))
      const sessionId = testSessionParsed.sessionId
      const res = await storeAnswersKraepelin(sessionId, payloadConverted)

      const statusTest = await updateStatusTest(sessionId);

        const pesertaId = testSessionParsed.pesertaId;
        const trigger = await triggerN8n(pesertaId, tests);

        const nextIndex = testSessionParsed.currentIndex + 1;
        const newTests = testSessionParsed.tests[nextIndex]; 

        testSessionParsed.currentIndex = nextIndex;
        sessionStorage.setItem('testSession', JSON.stringify(testSessionParsed));

        if (newTests !== undefined) {
            router.push(`/tests/${newTests.toLowerCase()}`); 
        } else {
            sessionStorage.removeItem('testSession');
            router.push('/result');
        }  
      
  }, [calculateColumnResults, auditLog, router]);

  // useEffect(()=> {
  //         const testSession = sessionStorage.getItem('testSession')
  //         if(!testSession)
  //             return console.log('gagal')
  
  //         const testSessionParsed = JSON.parse(testSession)
  //         const tests = testSessionParsed.tests[testSessionParsed.currentIndex]
  //         console.log('ini tests:', tests.toLowerCase())
  //     })

  /* ═══ TIMER PER LAJUR ═══
   * Countdown 100ms sekali untuk lajur yang sedang aktif (systemActiveCol).
   * Saat timeLeftMs ≤ 0, lajur ditandai timedOut dan timer berhenti.
   * Effect ini berjalan ulang setiap kali systemActiveCol berubah (pindah lajur).
   */
  useEffect(() => {
    if (status !== "playing") return;

    setColStates((prev) => {
      const next = prev.map((cs) => ({ ...cs }));
      if (!next[systemActiveCol].hasStarted) {
        next[systemActiveCol].hasStarted = true;
      }
      return next;
    });

    const timerInterval = setInterval(() => {
      setColStates((prev) => {
        const next = prev.map((cs) => ({ ...cs }));
        const cur = next[systemActiveCol];
        if (!cur.timedOut) {
          cur.timeLeftMs -= 100;
          if (cur.timeLeftMs <= 0) {
            cur.timeLeftMs = 0;
            cur.timedOut = true;
          }
        }
        return next;
      });
    }, 100);

    return () => clearInterval(timerInterval);
  }, [status, systemActiveCol]);

  /* ═══ CEK SELESAI SAAT LAJUR TERAKHIR TIMEOUT ═══
   * Tes dinyatakan selesai jika lajur terakhir sudah timeout.
   * Tidak ada auto-pindah lajur — user harus menekan tombol Next.
   */
  useEffect(() => {
    if (status !== "playing") return;
    if (!colStates[systemActiveCol]?.timedOut) return;
    if (systemActiveCol >= COLS - 1) {
      setStatus("finished");
    }
  }, [colStates, systemActiveCol, status]);

  /* ═══ GRACE PERIOD — INISIALISASI ═══
   * Saat lajur timeout, mulai countdown grace period 5 detik.
   * Hanya berjalan jika grace belum aktif (graceTimeLeftMs === null).
   * Lajur terakhir tidak memerlukan grace period.
   */
  useEffect(() => {
    if (status !== "playing") return;
    if (!colStates[systemActiveCol]?.timedOut) return;
    if (systemActiveCol >= COLS - 1) return;
    if (graceTimeLeftMs !== null) return;

    setGraceTimeLeftMs(5000);
    gracePenalizedRef.current = false;
  }, [status, colStates, systemActiveCol, graceTimeLeftMs]);

  /* ═══ GRACE PERIOD — COUNTDOWN ═══
   * Mengurangi graceTimeLeftMs sebesar 100ms setiap interval.
   * Berhenti saat mencapai 0 atau grace period tidak aktif.
   */
  useEffect(() => {
    if (status !== "playing") return;
    if (graceTimeLeftMs === null || graceTimeLeftMs <= 0) return;

    const interval = setInterval(() => {
      setGraceTimeLeftMs(prev => {
        if (prev === null || prev <= 100) return 0;
        return prev - 100;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [status, graceTimeLeftMs]);

  /* ═══ GRACE PERIOD — CATAT PELANGGARAN ═══
   * Jika grace period habis (graceTimeLeftMs === 0) dan user belum pindah lajur,
   * catat pelanggaran "Terlambat pindah lajur" ke auditLog.
   * gracePenalizedRef memastikan pelanggaran hanya dicatat satu kali per lajur.
   */
  useEffect(() => {
    if (status !== "playing") return;
    if (graceTimeLeftMs !== 0) return;
    if (gracePenalizedRef.current) return;
    if (systemActiveCol >= COLS - 1) return;

    gracePenalizedRef.current = true;
    setAuditLog(prev => [...prev, {
      timestamp: new Date().toISOString(),
      event: "Terlambat pindah lajur",
      fromCol: systemActiveCol,
      toCol: systemActiveCol,
      fromPair: -1,
      toPair: -1,
    }]);
  }, [graceTimeLeftMs, status, systemActiveCol]);

  // Trigger submit otomatis saat status berubah menjadi "finished"
  useEffect(() => {
    if (status === "finished") {
      handleSubmit();
    }
  }, [status, handleSubmit]);

  /* ═══ HANDLE INPUT ═══
   * Dipanggil setiap kali user mengetikkan digit (via numpad atau keyboard).
   * Menangani:
   *   1. Deteksi pelanggaran (lajur salah, waktu habis, skip kotak, overwrite)
   *   2. Update jawaban dan nilai input
   *   3. Majukan expectedPair jika jawaban di posisi yang benar
   *   4. Auto-focus ke kotak kosong berikutnya
   */
  const handleInput = useCallback((digit: number, col: number, pairIdx: number) => {
    if (status !== "playing") return;

    /*
      ATURAN PELANGGARAN — patokan = legitimateCol + expectedPair:
      - col !== legitimateCol             → isi jawaban di lajur yang bukan seharusnya
      - col === legitimateCol && timedOut → isi jawaban setelah waktu habis
      - col === legitimateCol && skip     → melangkahi kotak (pairIdx !== expectedPair)
      - overwrite                         → isi ulang kotak yang sudah dijawab
    */
    const isOverwrite  = answers[col][pairIdx] !== null;
    const isWrongCol   = col !== legitimateCol;
    const isTimedOut   = colStates[legitimateCol]?.timedOut === true;
    // Melangkahi kotak: di lajur benar, waktu belum habis, tapi bukan kotak yang seharusnya
    const isSkipped    = !isWrongCol && !isTimedOut && !isOverwrite && pairIdx !== expectedPair;

    if (isOverwrite || isWrongCol || isTimedOut || isSkipped) {
      let eventType: AuditEntry["event"];
      if (isOverwrite) {
        eventType = "Mengisi ulang kotak yang sudah dijawab";
      } else if (isWrongCol) {
        eventType = "Mengisi jawaban di lajur yang berbeda";
      } else if (isTimedOut) {
        eventType = "Mengisi jawaban setelah waktu habis";
      } else {
        eventType = "Melangkahi kotak jawaban";
      }
      setAuditLog(prev => [...prev, {
        timestamp: new Date().toISOString(),
        event: eventType,
        fromCol: legitimateCol,
        toCol: col,
        fromPair: expectedPair,
        toPair: pairIdx,
      }]);
    }

    // pairIdx 0 = pasangan paling bawah = grid row (ROWS-1-1) dan (ROWS-1)
    const topRowIdx    = ROWS - 2 - pairIdx;
    const bottomRowIdx = ROWS - 1 - pairIdx;
    const top    = grid[col][topRowIdx];
    const bottom = grid[col][bottomRowIdx];
    const isCorrect = digit === (top + bottom) % 10;

    // Update answers
    setAnswers(prev => {
      const next = prev.map(c => [...c]);
      next[col][pairIdx] = isCorrect ? 1 : 0;
      return next;
    });

    // Simpan angka yang diinput user
    setInputValues(prev => {
      const next = prev.map(c => [...c]);
      next[col][pairIdx] = digit;
      return next;
    });

    // Simulasi answers setelah update untuk navigasi (state belum terupdate saat ini)
    const updatedAnswers = answers.map(c => [...c]);
    updatedAnswers[col][pairIdx] = (digit === (grid[col][ROWS - 2 - pairIdx] + grid[col][ROWS - 1 - pairIdx]) % 10) ? 1 : 0;

    // Majukan expectedPair ke kotak kosong berikutnya jika diisi di posisi yang benar
    if (!isWrongCol && !isTimedOut && pairIdx === expectedPair) {
      let nextExpected = expectedPair + 1;
      while (nextExpected < PAIRS && updatedAnswers[col][nextExpected] !== null) {
        nextExpected++;
      }
      setExpectedPair(Math.min(nextExpected, PAIRS - 1));
    }

    // Auto-focus ke kotak kosong pertama di atas pairIdx (skip yang sudah terisi)
    let nextFocus = pairIdx + 1;
    while (nextFocus < PAIRS && updatedAnswers[col][nextFocus] !== null) {
      nextFocus++;
    }
    if (nextFocus < PAIRS) {
      setFocusedInput({ col, pair: nextFocus });
      setTimeout(() => {
        inputRefs.current[`${col}-${nextFocus}`]?.focus();
      }, 50);
    }
  }, [status, grid, answers, colStates, legitimateCol, expectedPair]);



  //-------------------------------------------jika ingin tempAnswers
  // const handleInput = useCallback((digit: number, col: number, pairIdx: number) => {
  //   if (status !== "playing") return;

  //   const isOverwrite  = answers[col][pairIdx] !== null;
  //   const isWrongCol   = col !== legitimateCol;
  //   const isTimedOut   = colStates[legitimateCol]?.timedOut === true;
  //   const isSkipped    = !isWrongCol && !isTimedOut && !isOverwrite && pairIdx !== expectedPair;

  //   if (isOverwrite || isWrongCol || isTimedOut || isSkipped) {
  //     let eventType: AuditEntry["event"];
  //     if (isOverwrite) eventType = "Mengisi ulang kotak yang sudah dijawab";
  //     else if (isWrongCol) eventType = "Mengisi jawaban di lajur yang berbeda";
  //     else if (isTimedOut) eventType = "Mengisi jawaban setelah waktu habis";
  //     else eventType = "Melangkahi kotak jawaban";

  //     setAuditLog(prev => {
  //       const nextLog = [...prev, {
  //           timestamp: new Date().toISOString(),
  //           event: eventType,
  //           fromCol: legitimateCol,
  //           toCol: col,
  //           fromPair: expectedPair,
  //           toPair: pairIdx,
  //       }];
  //       localStorage.setItem('tempAuditLog', JSON.stringify(nextLog));
  //       return nextLog;
  //     });
  //   }

  //   const topRowIdx    = ROWS - 2 - pairIdx;
  //   const bottomRowIdx = ROWS - 1 - pairIdx;
  //   const top    = grid[col][topRowIdx];
  //   const bottom = grid[col][bottomRowIdx];
  //   const isCorrect = digit === (top + bottom) % 10;

  //   // 1. Hitung & Update Answers
  //   const updatedAnswers = answers.map(c => [...c]);
  //   updatedAnswers[col][pairIdx] = isCorrect ? 1 : 0;
  //   setAnswers(updatedAnswers);
  //   localStorage.setItem('tempAnswers', JSON.stringify(updatedAnswers));

  //   // 2. Hitung & Update Input Values
  //   const updatedInputValues = inputValues.map(c => [...c]);
  //   updatedInputValues[col][pairIdx] = digit;
  //   setInputValues(updatedInputValues);
  //   localStorage.setItem('tempInputValues', JSON.stringify(updatedInputValues));

  //   if (!isWrongCol && !isTimedOut && pairIdx === expectedPair) {
  //     let nextExpected = expectedPair + 1;
  //     while (nextExpected < PAIRS && updatedAnswers[col][nextExpected] !== null) {
  //       nextExpected++;
  //     }
  //     const finalExpected = Math.min(nextExpected, PAIRS - 1);
  //     setExpectedPair(finalExpected);
  //     localStorage.setItem('tempExpectedPair', JSON.stringify(finalExpected));
  //   }

  //   let nextFocus = pairIdx + 1;
  //   while (nextFocus < PAIRS && updatedAnswers[col][nextFocus] !== null) {
  //     nextFocus++;
  //   }
  //   if (nextFocus < PAIRS) {
  //     setFocusedInput({ col, pair: nextFocus });
  //     setTimeout(() => {
  //       inputRefs.current[`${col}-${nextFocus}`]?.focus();
  //     }, 50);
  //   }
  // }, [status, grid, answers, inputValues, colStates, legitimateCol, expectedPair]); 
// Pastikan menambahkan `inputValues` ke dalam array dependency jika menggunakan Opsi 2

  /* ═══ HANDLE CLICK KOTAK JAWABAN ═══
   * Dipanggil saat user mengklik kotak input.
   * Hanya memindahkan fokus — pelanggaran TIDAK dicatat di sini,
   * melainkan saat user benar-benar mengisi jawaban (handleInput).
   */
  const handleInputClick = useCallback((col: number, pairIdx: number) => {
    if (status !== "playing") return;
    if (col !== activeCol) {
      setActiveCol(col);
    }
    setFocusedInput({ col, pair: pairIdx });
  }, [status, activeCol]);

  /* ═══ KEYBOARD LISTENER ═══
   * Menangkap input angka 0-9 dari keyboard fisik sebagai alternatif numpad.
   * Hanya aktif saat tes berjalan dan ada kotak yang difokus.
   */
  useEffect(() => {
    if (status !== "playing" || !focusedInput) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key >= "0" && e.key <= "9") {
        e.preventDefault();
        handleInput(Number(e.key), focusedInput.col, focusedInput.pair);
      }
    };
    

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [status, focusedInput, handleInput]);

  /* ═══ HANDLE PINDAH LAJUR ═══
   * Dipanggil saat user menekan tombol Prev atau Next.
   *
   * Prev : hanya memindahkan tampilan (activeCol turun).
   *        legitimateCol TIDAK berubah → mengisi jawaban di lajur prev = pelanggaran.
   *
   * Next : memindahkan systemActiveCol maju.
   *        legitimateCol hanya naik jika waktu lajur saat ini sudah habis.
   *        Jika waktu belum habis → legitimateCol tetap → isi jawaban di lajur baru = pelanggaran.
   *
   * Selalu auto-fokus ke kotak kosong pertama di lajur tujuan.
   */

  useEffect(()=> {
    console.log('ini answers: ', answers)
  }, [answers])

  useEffect(()=> {
    console.log('ini auditLog: ', auditLog)
  }, [auditLog])
  const handleMoveColumn = useCallback((direction: "prev" | "next") => {
    const isTimedOut = colStates[systemActiveCol]?.timedOut;

    if (direction === "next") {
      // Jika user sedang di lajur lebih kecil dari system, kembalikan ke systemActiveCol dulu
      if (activeCol < systemActiveCol) {
        const firstEmpty = answers[systemActiveCol].findIndex(a => a === null);
        const targetPair = firstEmpty !== -1 ? firstEmpty : 0;
        setActiveCol(systemActiveCol);
        setFocusedInput({ col: systemActiveCol, pair: targetPair });
        setTimeout(() => {
          inputRefs.current[`${systemActiveCol}-${targetPair}`]?.focus();
        }, 50);
        return;
      }

      const targetCol = systemActiveCol + 1;
      if (targetCol >= COLS) return;

      if (isTimedOut) {
        // Pindah sah: waktu habis, advance systemActiveCol
        setActiveCol(targetCol);
        setSystemActiveCol(targetCol);
        setLegitimateCol(targetCol);
        setGraceTimeLeftMs(null);
        gracePenalizedRef.current = false;
        const firstEmpty = answers[targetCol].findIndex(a => a === null);
        const targetPair = firstEmpty !== -1 ? firstEmpty : 0;
        setExpectedPair(targetPair);
        setFocusedInput({ col: targetCol, pair: targetPair });
        setTimeout(() => {
          inputRefs.current[`${targetCol}-${targetPair}`]?.focus();
        }, 50);
      } else {
        // Pindah pelanggaran: waktu belum habis, hanya activeCol berubah
        setActiveCol(targetCol);
        const firstEmpty = answers[targetCol].findIndex(a => a === null);
        const targetPair = firstEmpty !== -1 ? firstEmpty : 0;
        setFocusedInput({ col: targetCol, pair: targetPair });
        setTimeout(() => {
          inputRefs.current[`${targetCol}-${targetPair}`]?.focus();
        }, 50);
      }
    } else {
      // Prev: hanya activeCol mundur, systemActiveCol tidak berubah
      const targetCol = activeCol - 1;
      if (targetCol < 0) return;
      setActiveCol(targetCol);
      const firstEmpty = answers[targetCol].findIndex(a => a === null);
      const targetPair = firstEmpty !== -1 ? firstEmpty : 0;
      setFocusedInput({ col: targetCol, pair: targetPair });
      setTimeout(() => {
        inputRefs.current[`${targetCol}-${targetPair}`]?.focus();
      }, 50);
    }
  }, [systemActiveCol, activeCol, colStates, answers]);

  /* ═══ START TEST ═══
   * Mereset semua state ke kondisi awal dan memulai tes dari lajur pertama.
   */
  const startTest = () => {
    setGrid(genGrid());
    setAnswers(Array.from({ length: COLS }, () => Array(PAIRS).fill(null)));
    setInputValues(Array.from({ length: COLS }, () => Array(PAIRS).fill(null)));
    setColStates(initColStates());
    setActiveCol(0);
    setSystemActiveCol(0);
    setAuditLog([]);
    setFocusedInput({ col: 0, pair: 0 });
    setLegitimateCol(0);
    setExpectedPair(0);
    setGraceTimeLeftMs(null);
    gracePenalizedRef.current = false;
    setStatus("playing");
    setTimeout(() => {
      inputRefs.current[`0-0`]?.focus();
    }, 100);
  };

  /* ═══════════════════════════════════════════════════════════
     RENDER
     ═══════════════════════════════════════════════════════════ */
  
  // Tunggu hingga komponen ter-mount di client dan data soal siap
  if (!isClient || grid.length === 0) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-stone-100">
        <div className="text-stone-400 text-sm">Memuat tes...</div>
      </div>
    );
  }

  const { modalProps } = useBackGuard();
  
  return (
    <div className="w-screen h-screen flex flex-col bg-stone-100 select-none overflow-hidden select-none">

      {/* ── TOP BAR ── */}
      <div className="h-13 shrink-0 flex items-center justify-between px-4 border-b border-stone-200 bg-white">
        <h1 className="text-xs font-semibold tracking-widest text-stone-400 uppercase">
          Tes Psikotes
        </h1>
        <div className="flex items-center gap-x-3">
        {/* {status === "playing" && (
          <div className="hidden md:block text-sm text-stone-500">
            Waktu: <span className="font-mono font-bold text-blue-600">{Math.ceil(timeLeftMs / 1000)} detik</span>
          </div>
        )} */}
        

        {activeCol === systemActiveCol && (colStates[systemActiveCol].timedOut || timeLeftMs <= 5000) && (
          <div className={`hidden md:block rounded-lg p-2 text-center text-xs font-semibold ${
            colStates[systemActiveCol].timedOut && graceTimeLeftMs === 0
              ? "bg-red-200 border border-red-400 text-red-800"
              : colStates[systemActiveCol].timedOut
              ? "bg-red-100 border border-red-300 text-red-700 animate-pulse"
              : "bg-yellow-100 border border-yellow-300 text-yellow-700 animate-pulse"
            }`}>
            {colStates[systemActiveCol].timedOut && graceTimeLeftMs === 0
              ? "🚨 Terlambat pindah lajur! Pindah lajur sekarang!"
              : colStates[systemActiveCol].timedOut && graceTimeLeftMs !== null
              ? `⏰ Diharapkan pindah ke lajur berikutnya! ${Math.ceil(graceTimeLeftMs / 1000)}d tersisa`
              : "⚠ Waktu hampir selesai, Bersiap pindah ke lajur berikutnya!"}
          </div>
        )}
        </div>
        

        {/* Pesan pindah lajur saat 5 detik terakhir, timeout, atau grace period */}
              

        {status === 'playing' && (
          <div className="text-xs text-stone-500">
            Lajur Sistem: <span className="font-bold text-blue-600">{systemActiveCol + 1}</span>/{COLS} 
            {/* {activeCol !== systemActiveCol && (
              <span className="text-red-500 font-semibold ml-2">
                (Anda di Lajur {activeCol + 1})
              </span>
            )} */}
          </div>
        )}
      </div>

      {/* ── MAIN AREA ── */}
      <div className="flex-1 flex overflow-hidden min-h-0">

        {/* ─── GRID AREA ─── */}
        <div className="flex-1 overflow-auto p-3">
          <div className="flex gap-3 w-max">
            {grid.map((colData, cIdx) => (
              <KraepelinColumn
                key={cIdx}
                cIdx={cIdx}
                colData={colData}
                answers={answers[cIdx]}
                inputValues={inputValues[cIdx]}
                focusedPair={focusedInput?.col === cIdx ? focusedInput.pair : null}
                isActiveCol={cIdx === activeCol}
                isSystemActiveCol={cIdx === systemActiveCol}
                isTimedOut={colStates[cIdx].timedOut}
                timeLeftMs={colStates[cIdx].timeLeftMs}
                status={status}
                isAccessible={cIdx === activeCol}
                inputRefs={inputRefs}
                focusHandledRef={focusHandledRef}
                onInputClick={handleInputClick}
                onInput={handleInput}
              />
            ))}
          </div>
        </div>

        {/* ─── RIGHT PANEL ─── */}
        <div className="w-52 shrink-0 border-l border-stone-200 bg-white flex flex-col items-center justify-center gap-5 px-4">
          
          {status === "playing" && (
            <div className=" md:hidden text-sm text-stone-500 border border-stone-300 p-2 rounded-lg">
              {/* REVISI 2: Tampilkan systemActiveCol sebagai lajur sistem */}
              {/* {" · "} */}
              Waktu: <span className="font-mono font-bold text-blue-600">{Math.ceil(timeLeftMs / 1000)} detik</span>
            </div>
          )}

          {(colStates[systemActiveCol].timedOut || timeLeftMs <= 5000) && (
            <div className={`md:hidden rounded-lg p-2 text-center text-xs font-semibold ${
              colStates[systemActiveCol].timedOut && graceTimeLeftMs === 0
                ? "bg-red-200 border border-red-400 text-red-800"
                : colStates[systemActiveCol].timedOut
                ? "bg-red-100 border border-red-300 text-red-700 animate-pulse"
                : "bg-yellow-100 border border-yellow-300 text-yellow-700 animate-pulse"
            }`}>
              {colStates[systemActiveCol].timedOut && graceTimeLeftMs === 0
                ? "🚨 Terlambat pindah lajur! Pindah lajur sekarang!"
                : colStates[systemActiveCol].timedOut && graceTimeLeftMs !== null
                ? `⏰ Diharapkan pindah ke lajur berikutnya! ${Math.ceil(graceTimeLeftMs / 1000)}d tersisa`
                : "⚠ Waktu hampir selesai, Bersiap pindah ke lajur berikutnya!"}
            </div>
          )}

          {/* ── IDLE: Start ── */}
          {status === "idle" && (
            <div className="flex flex-col items-center gap-4 w-full">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 w-full">
                <p className="text-stone-600 text-xs leading-relaxed">
                  • Klik kotak jawaban untuk mulai<br />
                  • Gunakan angka <span className="font-semibold">0–9</span><br />
                  • Waktu: <span className="font-semibold">15 detik</span> per lajur<br />
                  • Otomatis pindah saat waktu habis<br />
                  • Kotak yang sudah diisi tidak bisa diubah
                </p>
              </div>
              <button
                onClick={startTest}
                className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm py-3 rounded-lg shadow-lg transition-all duration-150 hover:shadow-xl"
              >
                Mulai Tes
              </button>
            </div>
          )}

          {/* ── PLAYING: Numpad ── */}
          {status === "playing" && (
            <>
              {/* Info */}
              <div className="bg-stone-50 border border-stone-200 rounded-lg p-3 w-full">
                <div className="text-[10px] text-stone-400 font-medium mb-1 text-center">FOKUS SAAT INI</div>
                <div className="text-sm text-stone-700 flex flex-col items-center justify-center gap-y-1">
                  <span>Lajur <span className="font-bold text-blue-600">{(focusedInput?.col ?? 0) + 1}</span></span>
                  {/* {focusedInput && (
                    <span className="text-stone-400 text-xs ml-1">
                      · Soal {PAIRS - focusedInput.pair}
                    </span>
                  )} */}
                  {/* <div className="text-xs">
                    Waktu: <span className="font-mono font-bold text-blue-600">{Math.ceil(timeLeftMs / 1000)} detik</span>
                  </div> */}
                </div>
                

                {/* Tampilkan soal yang sedang di-highlight */}
                {focusedInput && grid.length > 0 && (() => {
                  const col = focusedInput.col;
                  const pairIdx = focusedInput.pair;
                  const topRowIdx = ROWS - 2 - pairIdx;
                  const bottomRowIdx = ROWS - 1 - pairIdx;
                  const topNum = grid[col][topRowIdx];
                  const bottomNum = grid[col][bottomRowIdx];
                  const correctAnswer = (topNum + bottomNum) % 10;
                  return (
                    <div className="mt-2 flex items-center justify-center gap-2">
                      <div className="flex flex-col items-center gap-1">
                        <div className="w-9 h-9 flex items-center justify-center text-lg font-bold bg-blue-600 text-white rounded-lg shadow">
                          {topNum}
                        </div>
                        <div className="w-9 h-9 flex items-center justify-center text-lg font-bold bg-blue-600 text-white rounded-lg shadow">
                          {bottomNum}
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>

              

              {/* Tombol pindah lajur */}
              <div className="flex gap-2 w-full">
                <button
                  onClick={() => handleMoveColumn("prev")}
                  disabled={activeCol <= 0}
                  className="flex-1 bg-stone-100 hover:bg-stone-200 active:bg-stone-300 text-stone-700 font-bold text-sm py-2 rounded-lg border border-stone-300 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  ← Prev
                </button>
                <button
                  onClick={() => handleMoveColumn("next")}
                  disabled={systemActiveCol >= COLS - 1}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-sm py-2 rounded-lg shadow transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Next →
                </button>
              </div>

              {/* Numpad */}
              <div className="grid grid-cols-3 gap-1.5 w-full">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((n) => (
                  <button
                    key={n}
                    onClick={() => {
                      if (focusedInput) {
                        handleInput(n, focusedInput.col, focusedInput.pair);
                      }
                    }}
                    disabled={!focusedInput}
                    className="bg-white border-2 border-stone-200 hover:bg-blue-600 hover:text-white hover:border-blue-600 active:scale-95 text-stone-700 font-bold text-lg rounded-lg shadow-sm transition-all duration-100 flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed"
                    style={{ height: "3.25rem" }}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </>
          )}

          {/* ── FINISHED ── */}
          {status === "finished" && (
            <div className="flex flex-col items-center gap-4 w-full">
              <div className="bg-stone-50 border border-stone-200 rounded-xl p-5 w-full text-center">
                <p className="text-sm text-stone-500">Mengirim hasil tes...</p>
                <div className="mt-3 flex justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <BackGuardModal {...modalProps} />
    </div>
  );
}





