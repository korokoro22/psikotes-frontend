"use client";

import { useState, useEffect, useCallback, useRef, memo, useMemo } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { storeAnswersKraepelin } from "@/services/answers.service";
import { div } from "framer-motion/client";
import Modal from "@/app/components/Modal";
import { useAntiCheat } from "@/lib/useAntiCheat";
import { useBackGuard } from "@/lib/useBackGuard";
import BackGuardModal from "@/app/components/BackGuardModal";
import { checkMoveTab } from "@/lib/checkMoveTab";

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
  event:
    | "Mengisi jawaban mundur dalam lajur yang sama"
    | "Mengisi jawaban maju dalam lajur yang sama"
    | "Mengisi jawaban di lajur yang berbeda"
    | "Mengisi ulang kotak yang sudah dijawab"
    | "Mengisi jawaban setelah waktu habis"
    | "Terlambat pindah lajur"
    | "Melangkahi kotak jawaban";
  // remainingTimeMs: number;
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
];

const ROWS = KRAEPELIN_DATA[0].length;
const COLS = KRAEPELIN_DATA.length;
const PAIRS = ROWS - 1; // 39 pasangan per kolom
const COL_TIME_MS = 15_000; // detik per kolom

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
  colData: number[]; // array angka 1 kolom
  answers: (1 | 0 | null)[]; // jawaban 1 kolom
  inputValues: (number | null)[]; // nilai input 1 kolom
  focusedPair: number | null; // pair yang fokus di kolom ini (null jika kolom lain)
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
        {/* {!isTimedOut && (
          <div className="text-[10px] text-stone-400 font-mono mt-0.5">
            {Math.ceil(timeLeftMs / 1000)}s
          </div>
        )} */}
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
                  ref={(el) => {
                    inputRefs.current[`${cIdx}-${pairIdx}`] = el;
                  }}
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
  const [answers, setAnswers] = useState<(1 | 0 | null)[][]>(() =>
    Array.from({ length: COLS }, () => Array(PAIRS).fill(null)),
  );
  // inputValues[col][pair]: angka yang diketik user, ditampilkan di kotak
  const [inputValues, setInputValues] = useState<(number | null)[][]>(() =>
    Array.from({ length: COLS }, () => Array(PAIRS).fill(null)),
  );
  const [colStates, setColStates] = useState<ColState[]>(initColStates);
  const [status, setStatus] = useState<Status>("idle");
  const [auditLog, setAuditLog] = useState<AuditEntry[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Kotak jawaban yang sedang difokus
  const [focusedInput, setFocusedInput] = useState<{
    col: number;
    pair: number;
  } | null>(null);

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
  const [countdown, setCountdown] = useState<number>(5);
  const [showCountdown, setShowCountdown] = useState(true);

  useAntiCheat({ mode: "silent" });
  const { modalProps } = useBackGuard();

  checkMoveTab();

  useEffect(() => {
    document.title = "Example - Psychological Tests";
  }, []);

  const [testsCount, setTestsCount] = useState<number | null>(null);

  useEffect(() => {
    const testSession = sessionStorage.getItem("testSession");
    if (!testSession) {
      return;
    }

    const testSessionParsed = JSON.parse(testSession);
    setTestsCount(testSessionParsed.currentIndex + 1);
  }, []);

  useEffect(() => {
    setIsClient(true);
    setGrid(genGrid());
  }, []);

  /* ── REFS ── */
  const inputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
  // Mencegah double-call onFocus + onClick pada event yang sama
  const focusHandledRef = useRef(false);
  // Ref audio peringatan — load sekali, diputar ulang tiap lajur
  const warningAudioRef = useRef<HTMLAudioElement | null>(null);
  // Pastikan bunyi peringatan hanya diputar sekali per lajur
  const warningPlayedRef = useRef(false);

  // Waktu tersisa lajur aktif sistem (untuk ditampilkan di UI)
  const timeLeftMs = colStates[systemActiveCol]?.timeLeftMs ?? COL_TIME_MS;

  /* ═══ INISIALISASI AUDIO ═══
   * Load file audio satu kali saat komponen mount.
   * preload="auto" agar file sudah siap di memori sebelum diputar.
   */
  useEffect(() => {
    const audio = new Audio("/sounds/alert.mp3");
    audio.preload = "auto";
    warningAudioRef.current = audio;
    return () => {
      warningAudioRef.current = null;
    };
  }, []);

  /* ═══ SUARA PERINGATAN 5 DETIK TERAKHIR ═══
   * Berbunyi satu kali saat timeLeftMs pertama kali menyentuh ≤ 5000ms.
   * warningPlayedRef direset setiap kali systemActiveCol berganti kolom.
   */
  useEffect(() => {
    warningPlayedRef.current = false;
  }, [systemActiveCol]);

  useEffect(() => {
    if (status !== "playing") return;
    if (timeLeftMs > 5000) return;
    if (timeLeftMs <= 0) return;
    if (warningPlayedRef.current) return;

    warningPlayedRef.current = true;

    try {
      if (warningAudioRef.current) {
        warningAudioRef.current.currentTime = 0;
        warningAudioRef.current.play();
      }
    } catch {
      // Abaikan jika browser memblokir autoplay
    }
  }, [status, timeLeftMs]);

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

  const handleModal = () => {
    setIsModalOpen(true);
  };

  const handleRestart = async () => {
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
    setStatus("idle");
    setTimeout(() => {
      inputRefs.current[`0-0`]?.focus();
    }, 100);
    setIsModalOpen(false);
  };

  /* ═══ SUBMIT RESULTS TO BACKEND ═══
   * Mengemas hasil tes (jawaban per lajur + auditLog pelanggaran) lalu
   * mengirimnya ke backend menggunakan sessionId dari sessionStorage.
   */
  const handleSubmit = async () => {
    router.push("/tests/kraepelin/test");
  };

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

  /* ═══ AUTO-ADVANCE LAJUR SAAT TIMEOUT ═══
   * Saat lajur aktif sistem timeout, otomatis pindah ke lajur berikutnya.
   * Jika ini lajur terakhir → tes selesai (setStatus "finished").
   */
  useEffect(() => {
    if (status !== "playing") return;
    if (!colStates[systemActiveCol]?.timedOut) return;

    if (systemActiveCol >= COLS - 1) {
      setStatus("finished");
      return;
    }

    const targetCol = systemActiveCol + 1;
    setSystemActiveCol(targetCol);
    setActiveCol(targetCol);
    setLegitimateCol(targetCol);
    setGraceTimeLeftMs(null);
    gracePenalizedRef.current = false;
    setAnswers((prev) => {
      const firstEmpty = prev[targetCol].findIndex((a) => a === null);
      const targetPair = firstEmpty !== -1 ? firstEmpty : 0;
      setExpectedPair(targetPair);
      setFocusedInput({ col: targetCol, pair: targetPair });
      setTimeout(() => {
        inputRefs.current[`${targetCol}-${targetPair}`]?.focus();
      }, 50);
      return prev;
    });
  }, [colStates, systemActiveCol, status]);

  // Trigger submit otomatis saat status berubah menjadi "finished"

  useEffect(() => {
    if (status === "finished") {
      handleModal();
    }
  }, [status, handleModal]);

  /* ═══ HANDLE INPUT ═══
   * Dipanggil setiap kali user mengetikkan digit (via numpad atau keyboard).
   * Menangani:
   *   1. Deteksi pelanggaran (lajur salah, waktu habis, skip kotak, overwrite)
   *   2. Update jawaban dan nilai input
   *   3. Majukan expectedPair jika jawaban di posisi yang benar
   *   4. Auto-focus ke kotak kosong berikutnya
   */
  const handleInput = useCallback(
    (digit: number, col: number, pairIdx: number) => {
      if (status !== "playing") return;

      /*
      ATURAN PELANGGARAN — patokan = legitimateCol + expectedPair:
      - col !== legitimateCol             → isi jawaban di lajur yang bukan seharusnya
      - col === legitimateCol && timedOut → isi jawaban setelah waktu habis
      - col === legitimateCol && skip     → melangkahi kotak (pairIdx !== expectedPair)
      - overwrite                         → isi ulang kotak yang sudah dijawab
    */
      const isOverwrite = answers[col][pairIdx] !== null;
      const isWrongCol = col !== legitimateCol;
      const isTimedOut = colStates[legitimateCol]?.timedOut === true;
      // Melangkahi kotak: di lajur benar, waktu belum habis, tapi bukan kotak yang seharusnya
      const isSkipped =
        !isWrongCol && !isTimedOut && !isOverwrite && pairIdx !== expectedPair;

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
        setAuditLog((prev) => [
          ...prev,
          {
            timestamp: new Date().toISOString(),
            event: eventType,
          },
        ]);
      }

      // pairIdx 0 = pasangan paling bawah = grid row (ROWS-1-1) dan (ROWS-1)
      const topRowIdx = ROWS - 2 - pairIdx;
      const bottomRowIdx = ROWS - 1 - pairIdx;
      const top = grid[col][topRowIdx];
      const bottom = grid[col][bottomRowIdx];
      const isCorrect = digit === (top + bottom) % 10;

      // Update answers
      setAnswers((prev) => {
        const next = prev.map((c) => [...c]);
        next[col][pairIdx] = isCorrect ? 1 : 0;
        return next;
      });

      // Simpan angka yang diinput user
      setInputValues((prev) => {
        const next = prev.map((c) => [...c]);
        next[col][pairIdx] = digit;
        return next;
      });

      // Simulasi answers setelah update untuk navigasi (state belum terupdate saat ini)
      const updatedAnswers = answers.map((c) => [...c]);
      updatedAnswers[col][pairIdx] =
        digit ===
        (grid[col][ROWS - 2 - pairIdx] + grid[col][ROWS - 1 - pairIdx]) % 10
          ? 1
          : 0;

      // Majukan expectedPair ke kotak kosong berikutnya jika diisi di posisi yang benar
      if (!isWrongCol && !isTimedOut && pairIdx === expectedPair) {
        let nextExpected = expectedPair + 1;
        while (
          nextExpected < PAIRS &&
          updatedAnswers[col][nextExpected] !== null
        ) {
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
    },
    [status, grid, answers, colStates, legitimateCol, expectedPair],
  );

  /* ═══ HANDLE CLICK KOTAK JAWABAN ═══
   * Dipanggil saat user mengklik kotak input.
   * Hanya memindahkan fokus — pelanggaran TIDAK dicatat di sini,
   * melainkan saat user benar-benar mengisi jawaban (handleInput).
   */
  const handleInputClick = useCallback(
    (col: number, pairIdx: number) => {
      if (status !== "playing") return;
      if (col !== activeCol) {
        setActiveCol(col);
      }
      setFocusedInput({ col, pair: pairIdx });
    },
    [status, activeCol],
  );

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
  const handleMoveColumn = useCallback(
    (direction: "prev" | "next") => {
      if (direction === "next") {
        const targetCol = activeCol + 1;
        if (targetCol >= COLS) return;

        const isTimedOut = colStates[systemActiveCol]?.timedOut;

        // Klik Next sebelum waktu habis → catat pelanggaran, tetap pindah tampilan
        if (!isTimedOut && targetCol > systemActiveCol) {
          setAuditLog((prev) => [
            ...prev,
            {
              timestamp: new Date().toISOString(),
              event: "Terlambat pindah lajur" as AuditEntry["event"],
            },
          ]);
        }

        setActiveCol(targetCol);
        const firstEmpty = answers[targetCol].findIndex((a) => a === null);
        const targetPair = firstEmpty !== -1 ? firstEmpty : 0;
        setFocusedInput({ col: targetCol, pair: targetPair });
        setTimeout(() => {
          inputRefs.current[`${targetCol}-${targetPair}`]?.focus();
        }, 50);
      } else {
        const targetCol = activeCol - 1;
        if (targetCol < 0) return;
        setActiveCol(targetCol);
        const firstEmpty = answers[targetCol].findIndex((a) => a === null);
        const targetPair = firstEmpty !== -1 ? firstEmpty : 0;
        setFocusedInput({ col: targetCol, pair: targetPair });
        setTimeout(() => {
          inputRefs.current[`${targetCol}-${targetPair}`]?.focus();
        }, 50);
      }
    },
    [systemActiveCol, activeCol, colStates, answers],
  );

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

  /* ═══ COUNTDOWN AUTO-START ═══
   * Hitung mundur 5 detik sejak komponen mount.
   * Saat countdown mencapai 0, tes langsung dimulai otomatis.
   */
  useEffect(() => {
    if (!isClient) return;
    if (!showCountdown) return;
    if (countdown <= 0) {
      setShowCountdown(false);
      startTest();
      return;
    }
    const t = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
    return () => clearTimeout(t);
  }, [isClient, countdown, showCountdown]);

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

  return (
    <div className="w-screen h-screen flex flex-col bg-stone-100 select-none overflow-hidden select-none">
      {/* ── TOP BAR ── */}
      <div className="h-13 shrink-0 flex items-center justify-between px-4 border-b border-stone-200 bg-white">
        <h1 className="text-xs font-semibold tracking-widest text-stone-500 uppercase">
          Tes Psikotes{" "}
          <span className="text-xs text-stone-500 font-semibold ml-3">
            (TES KE-{testsCount ?? "..."})
          </span>
        </h1>

        <div className="flex items-center gap-x-3">
          {/* {status === "playing" && (
            <div className="text-sm text-stone-500">
              Waktu: <span className="font-mono font-bold text-blue-600">{Math.ceil(timeLeftMs / 1000)} detik</span>
            </div>
          )} */}

          {status === "playing" &&
            timeLeftMs <= 5000 &&
            !colStates[systemActiveCol].timedOut && (
              <div className="hidden md:block rounded-lg p-2 text-center text-xs font-semibold bg-yellow-100 border border-yellow-300 text-yellow-700">
                ⚠ Waktu hampir selesai, bersiap pindah otomatis!
              </div>
            )}
        </div>

        {/* Pesan pindah lajur saat 5 detik terakhir, timeout, atau grace period */}

        {status === "playing" && (
          <div className="text-xs text-stone-500">
            Lajur Sistem:{" "}
            <span className="font-bold text-blue-600">
              {systemActiveCol + 1}
            </span>
            /{COLS}
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
                focusedPair={
                  focusedInput?.col === cIdx ? focusedInput.pair : null
                }
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
          {/* {status === "playing" && (
            <div className=" md:hidden text-sm text-stone-500 border border-stone-300 p-2 rounded-lg">
              Waktu: <span className="font-mono font-bold text-blue-600">{Math.ceil(timeLeftMs / 1000)} detik</span>
            </div>
          )} */}

          {timeLeftMs <= 5000 &&
            status === "playing" &&
            !colStates[systemActiveCol].timedOut && (
              <div className="md:hidden rounded-lg p-2 text-center text-xs font-semibold bg-yellow-100 border border-yellow-300 text-yellow-700">
                ⚠ Waktu hampir selesai, bersiap pindah otomatis!
              </div>
            )}
          {/* ── IDLE: Start ── */}
          {status === "idle" && (
            <div className="flex flex-col items-center gap-4 w-full">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 w-full">
                <p className="text-stone-600 text-xs leading-relaxed">
                  • Klik kotak jawaban untuk mulai
                  <br />• Gunakan angka{" "}
                  <span className="font-semibold">0–9</span>
                  <br />
                  {/* • Waktu: <span className="font-semibold">15 detik</span> per lajur<br /> */}
                  • Otomatis pindah saat waktu habis
                  <br />• Kotak yang sudah diisi tidak bisa diubah
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
                <div className="text-[10px] text-stone-400 font-medium mb-1 text-center">
                  FOKUS SAAT INI
                </div>
                <div className="text-sm text-stone-700 flex flex-col items-center justify-center gap-y-1">
                  <span>
                    Lajur{" "}
                    <span className="font-bold text-blue-600">
                      {(focusedInput?.col ?? 0) + 1}
                    </span>
                  </span>
                  {/* {focusedInput && (
                    <span className="text-stone-400 text-xs  ml-1">
                      · Soal {PAIRS - focusedInput.pair}
                    </span>
                  )} */}
                  {/* <div className="text-xs">
                    Waktu: <span className="font-mono font-bold text-blue-600">{Math.ceil(timeLeftMs / 1000)} detik</span>
                  </div> */}
                </div>

                {/* Tampilkan soal yang sedang di-highlight */}
                {focusedInput &&
                  grid.length > 0 &&
                  (() => {
                    const col = focusedInput.col;
                    const pairIdx = focusedInput.pair;
                    const topRowIdx = ROWS - 2 - pairIdx;
                    const bottomRowIdx = ROWS - 1 - pairIdx;
                    const topNum = grid[col][topRowIdx];
                    const bottomNum = grid[col][bottomRowIdx];
                    const correctAnswer = (topNum + bottomNum) % 10;
                    return (
                      <div className="mt-2 flex flex-col items-center justify-center gap-2">
                        <div className="flex flex-col items-center gap-1">
                          <div className="w-9 h-9 flex items-center justify-center text-lg font-bold bg-blue-600 text-white rounded-lg shadow">
                            {topNum}
                          </div>
                          <div className="w-9 h-9 flex items-center justify-center text-lg font-bold bg-blue-600 text-white rounded-lg shadow">
                            {bottomNum}
                          </div>
                        </div>
                        <div className="flex flex-col items-center gap-0.5 text-stone-400 text-xs font-semibold">
                          {/* <span className="text-sm">+</span> */}
                          {/* <span className="text-stone-300 text-sm">──</span> */}
                          <span>Jawaban</span>
                          <span className="text-sm text-stone-400 border border-stone-200 rounded-lg p-2">
                            {topNum}+{bottomNum}={topNum + bottomNum} →{" "}
                            <span className="text-blue-600 font-bold">
                              {correctAnswer}
                            </span>
                          </span>
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

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <p className="text-gray-800">
          Anda akan memasuki sesi tes. Setelah tes dimulai, waktu akan berjalan
          dan sesi tidak dapat diulang.
        </p>
        <p className="text-gray-600 text-sm mt-3">
          (Pastikan koneksi internet stabil dan Anda berada di lingkungan yang
          kondusif.)
        </p>
        <div className="flex gap-x-3 justify-evenly mt-4">
          <button
            className="px-5 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium shadow hover:scale-[1.02] active:scale-95 transition"
            onClick={handleRestart}
          >
            Kembali
          </button>
          <button
            className="px-5 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium shadow hover:scale-[1.02] active:scale-95 transition"
            onClick={handleSubmit}
          >
            Mulai Tes
          </button>
        </div>
      </Modal>
      <BackGuardModal {...modalProps} />

      {/* ── COUNTDOWN OVERLAY ── */}
      {showCountdown && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl px-10 py-8 flex flex-col items-center gap-5 max-w-xs w-full mx-4">
            <div className="text-xs font-semibold tracking-widest text-stone-400 uppercase">
              Tes Psikotes — Contoh
            </div>
            <div className="text-stone-700 text-sm text-center leading-relaxed">
              Tes akan dimulai secara otomatis dalam
            </div>
            <div className="relative flex items-center justify-center">
              <svg width="96" height="96" viewBox="0 0 96 96">
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  fill="none"
                  stroke="#e7e5e4"
                  strokeWidth="6"
                />
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={`${Math.PI * 2 * 40}`}
                  strokeDashoffset={`${Math.PI * 2 * 40 * (1 - countdown / 5)}`}
                  transform="rotate(-90 48 48)"
                  style={{ transition: "stroke-dashoffset 0.8s linear" }}
                />
              </svg>
              <span className="absolute text-4xl font-bold text-blue-600">
                {countdown}
              </span>
            </div>
            <div className="text-stone-400 text-xs">detik lagi…</div>
            <button
              onClick={() => {
                setShowCountdown(false);
                startTest();
              }}
              className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm py-2.5 rounded-xl transition-all shadow"
            >
              Mulai Sekarang →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
