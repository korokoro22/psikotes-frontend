'use client'

import { AnimatePresence, motion } from "framer-motion"
import { ArrowLeft, Brain } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import Modal from "@/app/components/Modal"
import TestHeader from "@/app/components/TestHeader"
import { getMsdtQuestionsService } from "@/services/questions.service"
import { storeAnswersMsdt, updateStatusTest, triggerN8n } from "@/services/answers.service"
import { useAntiCheat } from "@/lib/useAntiCheat"
import { useClipboardPermissionGuard } from "@/lib/useClipboardPermissionGuard"
import Image from "next/image"
import PermissionModal from "@/app/components/PermissionModal"


interface MsdtQuestion {
    id: number,
    sentences: {
        text: string
        type: 
         'G' | 'L' | 'I' | 'T' | 'V' | 'S' | 'R' | 'D' | 'C' | 'E' | 
         'N' | 'A' | 'P' | 'X' | 'B' | 'O' | 'Z' | 'K' | 'F' | 'W'

    }[]
}

interface MsdtQuestions {
    id: number
    questionIndex: number
    option: {
        sentences: string
        optionType: 1 | 2
    }[]
}

export default function MsdtTestPage() {
    const router = useRouter()
    const [currentGroup, setCurrentGroup] = useState(0)
    const [answers, setAnswers] = useState<
        { groupId: number; type: number }[]
        >([]);
    const [timeLeft, setTimeLeft] = useState(300);
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [questions, setQuestions] = useState<MsdtQuestions[]>([])
    const [isOvertime, setIsOvertime] = useState(false);
    const [overtime, setOvertime] = useState(0);

    const [isPassed, setIsPassed] = useState<number[]>(() => {
        if (typeof window === "undefined") return [];
        const saved = localStorage.getItem("isPassed");
        return saved ? JSON.parse(saved) : [];
    });
    
    const [aktif, setAktif] = useState(1);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    const msdt: MsdtQuestion[]  = [
        {
            id: 1,
            sentences: [
                {text: 'Saya suka menjadi pendengar', type: 'R'},
                {text: 'Saya mengerjakan semua pekerjaan sekaligus', type: 'F'}
            ]
        },
        {
            id: 2,
            sentences: [
                {text: 'Saya orangnya teliti', type: 'I'},
                {text: 'Saya ingin menjadi pemimpin', type: 'A'}
            ]
        },
        {
            id: 3,
            sentences: [
                {text: 'Saya ingin bebas', type: 'I'},
                {text: 'Saya suka hal yang baru', type: 'G'}
            ]
        }
    ]

    useEffect(() => {
        if (!isOvertime && timeLeft <= 0) {
            setIsOvertime(true);
            return;
        }

        if (isOvertime) {
            const timer = setInterval(() => setOvertime((prev) => prev + 1), 1000);
            return () => clearInterval(timer);
        }

        const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
        return () => clearInterval(timer);
    }, [timeLeft, isOvertime]);

    useEffect(()=> {
            console.log('isi new answers: ', answers)
        }, [answers])

    useEffect(() => {
            const getPapikostickQuestions = async () => {
                try {
                    const getQuestion = await getMsdtQuestionsService()
                    setQuestions(getQuestion.data.data)
                } catch (error) {
                    console.log('gagal')
                }
            }
            getPapikostickQuestions()
        }, [])

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    const handleSelection = (newType: 1 | 2) => {
        const updated = [...answers]
        updated[currentGroup] = {
            groupId: currentGroup + 1,
            type: newType
        }
        setAnswers(updated)
        localStorage.setItem('tempAnswers', JSON.stringify(updated))

        // setAnswers(prev => {
        //     const updated = [...prev];

        //     updated[currentGroup] = {
        //     groupId: currentGroup+1,
        //     type: newType,
        //     };

        //     return updated; 
        // })
    }

    // const handleStart = () => {
    // router.push('/tests/mbti/test');
    // };

    const handleModal = () => {
        setIsModalOpen(true)

    }
    
    const handleTestComplete = async() => {
        try {
            const setLoading = setIsLoading(true)
            const testSession = sessionStorage.getItem('testSession')
            localStorage.removeItem('tempAnswers')
            localStorage.removeItem('isPassed')
            
            if(!testSession)
                return alert('gagal')
            
            const testSessionParsed = JSON.parse(testSession)
            const tests = testSessionParsed.tests[testSessionParsed.currentIndex]
            const sessionId = testSessionParsed.sessionId
            console.log('ini test4:', tests)
            const res = await storeAnswersMsdt(sessionId, answers)

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
        } catch(error) {
            const setLoading = setIsLoading(false)
        }
        
    };

    useEffect(()=> {
        const temp = localStorage.getItem('tempAnswers')
        if (temp !== null) {
            const answer = JSON.parse(temp)
            setAnswers(answer)
        }
    }, [])

    useAntiCheat({ mode: "silent" });

    useEffect(() => {
        document.title = "Test - Psychological Tests";
    }, [])

    const checkScroll = () => {
        const el = scrollRef.current;
        if (!el) return;
        setCanScrollLeft(el.scrollLeft > 0);
        setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth);
    };

    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;

        const observer = new ResizeObserver(() => checkScroll());
        observer.observe(el);

        return () => observer.disconnect();
    }, [questions]);

    const scroll = (dir: "left" | "right") => {
        const el = scrollRef.current;
        if (!el) return;
        el.scrollBy({ left: dir === "left" ? -120 : 120, behavior: "smooth" });
        setTimeout(checkScroll, 300);
    };

    const handleBefore = () => {
        setCurrentGroup(prev => Math.max(0, prev - 1))
        setAktif((i) => Math.min(i - 1, questions.length));
    }

    const handleNext = () => {
        setCurrentGroup(prev => prev + 1)
        setAktif((i) => Math.min(i + 1, questions.length));
    }

    useEffect(() => {
        // cari elemen tombol nomor yang aktif lalu scroll ke sana
        scrollRef.current
        ?.querySelector(`[data-nomor="${aktif}"]`)
        ?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }, [aktif]);

    useEffect(() => {
        localStorage.setItem("isPassed", JSON.stringify(isPassed));
    }, [isPassed]);

    // setiap kali aktif berubah, simpan nomor sebelumnya ke sudahDilalui
    useEffect(() => {
        if (!isPassed.includes(aktif)) {
        setIsPassed((prev) => [...prev, aktif]);
        }
    }, [aktif]);

    const { showModal } = useClipboardPermissionGuard()

    return(
        <div className="font-sans min-h-screen bg-gray-50 select-none">
            <header className="bg-white shadow-sm py-4 sticky top-0 z-10">
                <TestHeader />
            </header>

            <main className="container mx-auto px-6 py-10">
                <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg p-6 md:p-8">
                {/* Header Info */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <div className="text-center md:text-left">
                    <h2 className="text-2xl font-bold text-gray-800">Instruksi</h2>
                    <p className="text-gray-500 text-sm">
                        Pilih kalimat yang paling menggambarkan diri Anda.
                    </p>
                    </div>
                    <div className="">
                        {questions.length > 0 ? (
                            <div className="flex items-center gap-x-4">
                                <div className={`text-base font-mono px-4 py-2 rounded-lg shadow-sm border text-gray-800 ${
                                    isOvertime ? 'bg-red-100 text-red-600 border-red-200' : 'bg-gray-100 border-gray-200'
                                }`}>
                                    {isOvertime 
                                        ? `⚠️ +${formatTime(overtime)}` 
                                        : `⏱ ${formatTime(timeLeft)}`
                                    }
                                </div>
                                <div className=" text-base text-gray-800 font-mono px-4 py-2 rounded-lg shadow-sm bg-gray-100 border border-gray-200">
                                    {questions.length > 0 ? (<span>Soal: {currentGroup + 1} / {questions.length}</span>):(<span>Soal: --/--</span>)}
                                </div>
                            </div>
                        ):(
                            <div className='text-xl font-mono px-4 py-2 rounded-lg shadow-sm bg-gray-100'>
                                <span>--:--</span>
                            </div>
                        )}
                    </div>
                </div>

                <style>{`
                    div::-webkit-scrollbar { display: none; }
                `}</style>

                {/* Soal */}
                {questions.length > 0 ?(
                <div className="flex flex-col gap-y-4">
                    {/* nomor soal */}
                    <div className='w-full h-full flex bg-gray-200 border border-gray-300 p-2 gap-x-4 rounded-xl items-center'>
                    
                        {/* Tombol Kiri */}
                        <button
                        onClick={() => scroll("left")}
                        disabled={!canScrollLeft}
                        className={`shrink-0 w-10 h-22 border rounded-lg bor flex items-center justify-center text-lg transition-all
                            ${canScrollLeft
                            ? "border-gray-400 text-gray-600 hover:bg-gray-400 cursor-pointer"
                            : "border-gray-100 text-gray-300 cursor-not-allowed"
                            }`}
                        >
                        ‹
                        </button>
                    
                        {/* List Nomor */}
                        <div
                        ref={scrollRef}
                        onScroll={checkScroll}
                        className="flex gap-2 overflow-x-scroll flex-1 py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                        >
                        {Array.from({ length: questions.length }, (_, i) => i + 1).map((nomor) => (
                            <button
                            key={nomor}
                            onClick={() => {
                                setAktif(nomor)
                                setCurrentGroup(nomor-1)
                            }}
                            className={`shrink-0 p-8 border border-gray-300 rounded-lg text-sm font-medium transition-all
                                ${aktif === nomor 
                                ? "bg-blue-600 border-blue-600 text-white border-2"
                                : answers.some((a) => a?.groupId === nomor && a.type)
                                ?" bg-green-500 text-white"
                                : isPassed.includes(nomor)
                                ? "bg-red-500 text-white"
                                : "bg-white text-gray-700 border border-gray-200 hover:border-indigo-300"
                                }`
                            }
                            >
                            {nomor}
                            </button>
                        ))}
                        </div>
                            
                        {/* Tombol Kanan */}
                        <button
                        onClick={() => scroll("right")}
                        disabled={!canScrollRight}
                        className={`shrink-0 w-10 h-22 border rounded-lg bor flex items-center justify-center text-lg transition-all
                            ${canScrollRight
                            ? "border-gray-400 text-gray-600 hover:bg-gray-400 cursor-pointer"
                            : "border-gray-100 text-gray-300 cursor-not-allowed"
                            }`}
                        >
                        ›
                        </button>
                    </div>

                    <section className="mb-10">
                    <div className="flex justify-center items-center flex-col bg-white rounded-lg text-gray-400 italic">
                        <div className='w-full'>
                        <AnimatePresence mode="wait">
                            <motion.div
                            key={currentGroup}
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -40 }}
                            transition={{ duration: 0.4 }}
                            >
                                <div>

                                </div>
                            <div className="grid grid-cols-1 gap-4 w-full">
                                {questions[currentGroup]?.option.map((opt, index) => {

                                const selected = answers[currentGroup]?.type === opt.optionType;

                                return (
                                    <div
                                    className="flex gap-3 "
                                    key={index}
                                    >
                                        <button
                                        // disabled={(!isMost && mostTaken) || isLeast}
                                        onClick={() => handleSelection(opt.optionType)}
                                        className={`p4 text-left rounded-md text-lg font-medium border border-gray-300 text-gray-700 flex items-center justify-between p-4 transition-all  w-full  ${
                                            selected
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-gray-50 hover:bg-gray-300'
                                            }`}
                                        >
                                        {opt.sentences}
                                        </button>

                                    </div>
                                );
                                })}
                            </div>
                            </motion.div>
                        </AnimatePresence>

                        <div className="flex justify-between items-center mt-7">
                                    <button
                                        onClick={handleBefore}
                                        disabled={currentGroup === 0}
                                        className={`px-4 py-2 rounded-lg border text-sm font-medium transition ${
                                        currentGroup === 0
                                            ? 'px-4 sm:px-5 py-2 text-xs sm:text-sm opacity-50 cursor-not-allowed bg-slate-50 text-slate-400 border-slate-200'
                                            : 'bg-white border-slate-300 hover:bg-slate-50 text-slate-700'
                                        }`}
                                    >
                                        ← Sebelumnya
                                    </button>

                                    <button
                                        // disabled= {!(answers[currentGroup])}
                                        onClick={
                                        currentGroup === questions.length - 1
                                            ? handleModal
                                            : handleNext
                                        }
                                        className={`px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow hover:scale-[1.02] active:scale-95 transition
                                            
                                            `}
                                    >
                                        {currentGroup === questions.length - 1 ? 'Selesai' : 'Soal Berikutnya →'}
                                    </button>
                                </div>
                        </div> 
                    </div>
                </section>
                </div>
                ):(
                <div className='flex justify-center items-center px-8 py-10'>
                    <p className='bg-blue-50 border border-blue-200 rounded-xl p-6 text-gray-700 font-semibold'>SEDANG MEMUAT SOAL...</p>
                </div>
                )}
                
                </div>
            </main>

        <Modal isOpen={isModalOpen} onClose={()=> setIsModalOpen(false)}>
            <p className='text-gray-800'>Tes telah selesai. Silakan lanjut ke tahap berikutnya.</p>
            <p className='text-gray-600 text-sm mt-3'>(Pastikan koneksi internet stabil dan Anda berada di lingkungan yang kondusif.)</p>
            <div className='flex gap-x-3 justify-evenly mt-4'>
                <button 
                    className={`px-5 py-2 rounded-lg bg-gradient-to-r  text-white font-medium shadow hover:scale-[1.02] active:scale-95 transition ${
                        isLoading
                        ? 'bg-slate-400'
                        : 'from-blue-600 to-indigo-600'
                        }`}
                    onClick={()=> setIsModalOpen(false)}
                    disabled={isLoading}
                >
                    Kembali
                </button>
                {isLoading?(
                    <button 
                        className='disabled:pointer-events-none px-5 py-2 rounded-lg bg-gradient-to-r bg-slate-400 text-white font-medium shadow hover:scale-[1.02] active:scale-95 transition'
                        onClick={handleTestComplete}
                        disabled={isLoading}
                    >
                        Mohon Tunggu...
                    </button>
                ):(
                    <button 
                        onClick={handleTestComplete}
                        disabled={answers.length !== questions.length}
                        className={`px-5 py-2 rounded-lg bg-gradient-to-r  text-white font-medium shadow hover:scale-[1.02] active:scale-95 ${
                            !(answers.length !== questions.length)
                            ? 'from-blue-600 to-indigo-600 transition'
                            : 'cursor-not-allowed bg-gray-300'
                            }`}
                    >
                        Selesai
                    </button>
                )}
                
            </div>
        </Modal>
        <PermissionModal isOpen={showModal} onClose={()=> {}}>
            <div
              className='text-gray-700'
            >
              <p className='font-bold text-2xl mb-3'>PERHATIAN</p>
              <p>Harap berikan izin untuk akses clipboard untuk mengakses halaman tes</p>
              <div className='flex justify-center my-4'>
                <Image 
                  src="/assets/blockedClipboardEditted.png"
                  width={250}
                  height={250}
                  className='rounded-lg '
                  alt=''
                />
              </div>
              <div className='text-left ml-8'>
                <ol className=' list-decimal flex flex-col gap-y-1'>
                  <li>Ikuti petunjuk sesuai gambar</li>
                  <li>Reload Kembali halaman (F5)</li>
                </ol>
              </div>
            </div>
          </PermissionModal>
        </div>
    )
}