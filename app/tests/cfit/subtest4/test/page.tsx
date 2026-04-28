'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Modal from '@/app/components/Modal';
import { storeAnswersCfit, triggerN8n } from '@/services/answers.service';
import { getSoalCfit4Service } from '@/services/questions.service';
import { updateStatusTest } from "@/services/answers.service"
import TestHeader from '@/app/components/TestHeader';
import { useAntiCheat } from '@/lib/useAntiCheat';
import BackGuardModal from '@/app/components/BackGuardModal';
import { useBackGuard } from '@/lib/useBackGuard';

interface Question {
    id: number;
    images: string[];
}

type CfitAnswer = {
  questionId: number
  answers: string[]
  subtest: number
}

interface Option {
  questionId: number;
  label: string;
  imagePath: string;
}

interface Questionz {
  imagePath: string;
  options : Option[]
}

export default function CFITSubtest4Test() {
    const { modalProps } = useBackGuard();
    const router = useRouter();
    const [timeLeft, setTimeLeft] = useState(150); // 3 menit
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [question, setQuestion] = useState<Questionz[]>([])
    const [answers, setAnswers] = useState<CfitAnswer[]>(
        Array.from({ length: question.length}, (_, index) => ({
            questionId: index + 1,
            answers: [],
            subtest: 4
      }))
    );
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const [isPassed, setIsPassed] = useState<number[]>(() => {
                if (typeof window === "undefined") return [];
                const saved = localStorage.getItem("isPassed");
                return saved ? JSON.parse(saved) : [];
            });
        
    const [aktif, setAktif] = useState(1);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
          const getCfit4Soal = async () => {
            try {
              const getQuestion = await getSoalCfit4Service()
              setQuestion(getQuestion.data.data)
            } catch (error) {
                console.log('gagal')
            }
        }
          getCfit4Soal()
    }, [])

    

    useEffect(() => {
      if (question.length > 0 && answers.length === 0) {
        setAnswers(
          Array.from({ length: question.length }, (_, index) => ({
            questionId: index + 1,
            answers: [],
            subtest: 4
          }))
        );
      }
    }, [question]);

    useEffect(() => {
        if (timeLeft <= 0) {
        handleTestComplete();
        return;
        }
        const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
        return () => clearInterval(timer);
    }, [timeLeft]);

    // const handleAnswer = (answers: string) => {
    //     setAnswers(prev => {
    //         const updated = [...prev];
    //         if (prev[currentQuestion].answers[0] === answers) {
    //           updated[currentQuestion] = {
    //             questionId: currentQuestion + 1,
    //             answers: [],
    //             subtest: 1
    //           }
    //           return updated
    //         }

    //         updated[currentQuestion] = {
    //         questionId: currentQuestion + 1,
    //         answers: [answers],
    //         subtest: 1
    //         };

    //         return updated; 
    //     })
    // };

    const handleAnswer = async (answer: string) => {

    const updated = [...answers];
    
    if (answers[currentQuestion]?.answers?.[0] === answer) {
        updated[currentQuestion] = {
            questionId: currentQuestion + 1,
            answers: [],
            subtest: 4
        };
    } else {
        updated[currentQuestion] = {
            questionId: currentQuestion + 1,
            answers: [answer],
            subtest: 4
        };
    }

    setAnswers(updated);
    localStorage.setItem('tempAnswers', JSON.stringify(updated));
};

    
    // const handleTestComplete = async () => {
    //         const testSession = sessionStorage.getItem('testSession')
                      
    //         if(!testSession) {
    //             return (console.log('gagal'))
    //         }            
    //         const testSessionParsed = JSON.parse(testSession)
    //         const tests = testSessionParsed.tests[testSessionParsed.currentIndex]
    //         const sessionId = testSessionParsed.sessionId
    //         console.log('ini test4:', tests)
    //         const res = await storeAnswersCfit(sessionId, answers)

    //         const statusTest = await updateStatusTest(sessionId)

    //         const pesertaId = testSessionParsed.pesertaId
    //         const trigger = await triggerN8n(pesertaId, tests)

    //         const indexIncrement = testSessionParsed.currentIndex + 1
    //         testSessionParsed.currentIndex = indexIncrement
    //         const updatedTestString = JSON.stringify(testSessionParsed)
    //         sessionStorage.setItem('testSession', updatedTestString)
    //         const newTests:string = testSessionParsed.tests[testSessionParsed.currentIndex] 
            
    //         if (!(newTests === undefined)) {
    //             router.push(`/tests/${tests.toLowerCase()}`)  
    //         } else { 
    //             sessionStorage.removeItem('testSession')
    //             router.push('/result')
    //         }           
    // };

    
    
    const handleTestComplete = async () => {
        try {
            const setLoading = setIsLoading(true)
            const testSession = sessionStorage.getItem('testSession');
            localStorage.removeItem('tempAnswers')
            localStorage.removeItem('isPassed')
            if (!testSession) {
                return console.log('gagal');
            }

            const testSessionParsed = JSON.parse(testSession);
            const tests = testSessionParsed.tests[testSessionParsed.currentIndex];
            const sessionId = testSessionParsed.sessionId;

            const res = await storeAnswersCfit(sessionId, answers);
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
        } catch (error) {
            const setLoading = setIsLoading(false)
        }
        
    };

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remaining = seconds % 60;
        return `${minutes}:${remaining.toString().padStart(2, '0')}`;
    };

    useEffect(() => {
            console.log('answers berubah:', answers);
            }, [answers]);
    
    useEffect(() => {
          const getCfit4Soal = async () => {
            try {
              const getQuestion = await getSoalCfit4Service()
              setQuestion(getQuestion.data.data)
            } catch (error) {
                console.log('gagal')
            }
          }
          getCfit4Soal()
        }, [])

    useEffect(()=> {
    const temp = localStorage.getItem('tempAnswers')
    if(temp !== null) {
      const answer = JSON.parse(temp)
      setAnswers(answer)
    }
  }, [])

    const handleModal = () => {
      setIsModalOpen(true)
    }
    const progressPercent = ((currentQuestion + 1) / question.length) * 100;

    useAntiCheat({ mode: "silent" });

    useEffect(() => {
        document.title = "Test - Psychological Tests";
    }, [])

    const handleBefore = () => {
        setCurrentQuestion(prev => Math.max(0, prev - 1))
        setAktif((i) => Math.min(i - 1, question.length));
    }

    const handleNext = () => {
        setCurrentQuestion(prev => prev + 1)
        setAktif((i) => Math.min(i + 1, question.length));
    }

    const checkScroll = () => {
        const el = scrollRef.current;
        if (!el) return;
        setCanScrollLeft(el.scrollLeft > 0);
        setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth);
    };

    const scroll = (dir: "left" | "right") => {
        const el = scrollRef.current;
        if (!el) return;
        el.scrollBy({ left: dir === "left" ? -120 : 120, behavior: "smooth" });
        setTimeout(checkScroll, 300);
    };

    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;

        const observer = new ResizeObserver(() => checkScroll());
        observer.observe(el);

        return () => observer.disconnect();
    }, [question]);


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

    return(
        <div className='font-sans min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 select-none'>
            <header
                className='bg-white shadow-sm py-4 sticky top-0 z-10'
            >
                <TestHeader />
            </header>
            <main className="container mx-auto px-4 py-8">
                <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-2xl p-6 md:p-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800 text-center md:text-left">SUBTES 4</h1>
                        <p className="text-sm text-slate-500 text-center md:text-left">Jawab soal berikut dengan teliti dan cepat.</p>
                    </div>
                    <div className='flex gap-x-3'>
                        <div className="mt-4 md:mt-0 bg-slate-100 text-slate-800 px-3 py-1 rounded-xl font-mono text-base tracking-wider border border-slate-200">
                            ⏱ {question.length > 0 ? (<span>{formatTime(timeLeft)}</span>):(<span>--:--</span>)}
                        </div>
                        <div className="mt-4 md:mt-0 bg-slate-100 text-slate-800 px-3 py-1 rounded-xl font-mono text-base tracking-wider border border-slate-200">
                            {question.length > 0 ? (<span>Soal: {currentQuestion + 1} / {question.length}</span>):(<span>Soal: --/--</span>)}
                        </div>
                    </div>
                </div>

                {/* Progress */}
                {/* <div className="mb-8">
                    <div className="flex justify-between text-sm mb-2 text-slate-600">
                    <span>Soal {currentQuestion + 1} / {question.length}</span>
                    <span>{Math.round(progressPercent)}%</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${progressPercent}%` }}
                    />
                    </div>
                </div> */}

                <style>{`
                    div::-webkit-scrollbar { display: none; }
                `}</style>

                {/* Soal */}
                {question.length > 0 ?(
                <div className='flex flex-col gap-y-4'>
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
                        {Array.from({ length: question.length }, (_, i) => i + 1).map((nomor) => (
                            <button
                            key={nomor}
                            data-nomor={nomor}
                            onClick={() => {
                                setAktif(nomor)
                                setCurrentQuestion(nomor-1)
                            }}
                            className={`flex-shrink-0 p-8 border border-gray-300 rounded-lg text-sm font-medium transition-all
                                ${aktif === nomor 
                                ? "bg-blue-600 border-blue-600 text-white border-2"
                                : answers.some((a) => a.questionId === nomor && a.answers.length > 0)
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
                    <div className="flex flex-col gap-y-3 border border-gray-200 rounded-2xl bg-white shadow-sm p-6 mb-8">
                    <p className='text-center text-gray-600 italic'>Amati posisi titik di antara bangunan berikut dan cari gambar dengan letak titik yang serupa dengan soal:</p>
                    <div className="flex justify-center items-center gap-3 mb-3 m-auto">
                        <div
                        className="aspect-square bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 border border-slate-200"
                        >
                            <img 
                                src={`${process.env.NEXT_PUBLIC_CDN_BASE_URL}${question[currentQuestion]?.imagePath}`} 
                                alt=""
                                className='w-27 rounded-lg' />
                        </div>
                    </div>

                    <div className="text-center text-slate-700 mb-2">
                    Pilih gambar yang paling tepat untuk melengkapi pola:
                    </div>

                    {/* Pilihan Jawaban */}
                    <div className="m-auto grid w-10/12 grid-cols-2 sm:grid-cols-5 gap-x-8">
                        {question[currentQuestion]?.options?.map((option) => {
                            return(
                            <button
                            key={option.label}
                            onClick={() => handleAnswer(option.label)}
                            className={`aspect-square text-lg font-semibold rounded-xl flex items-center justify-center transition-all border-2 ${
                                answers[currentQuestion]?.answers?.includes(option.label)
                                ? 'bg-blue-600 text-white border-blue-600 scale-105 shadow'
                                : 'border-slate-200 bg-slate-50 hover:border-blue-400 hover:scale-[1.02]'
                            }`}
                            >
                                <div className='pl-3 pt-2 h-full'>
                                    {option.label}
                                </div>
                                <img 
                                    src={`${process.env.NEXT_PUBLIC_CDN_BASE_URL}${option.imagePath}`} 
                                    alt={`Option ${option.label}`}
                                    className="w-full h-full object-contain p-2 rounded-xl"
                                />
                            </button>
                            )
                        })}
                    </div>
                </div>

                {/* Navigasi Soal */}
                <div className="flex justify-between items-center">
                    <button
                    onClick={handleBefore}
                    disabled={currentQuestion === 0}
                    className={`px-4 py-2 rounded-lg border text-sm font-medium transition ${
                        currentQuestion === 0
                        ? 'opacity-50 cursor-not-allowed bg-slate-50 text-slate-400 border-slate-200'
                        : 'bg-white border-slate-300 hover:bg-slate-50 text-slate-700'
                    }`}
                    >
                    ← Sebelumnya
                    </button>

                    <button
                    onClick={
                        currentQuestion === question.length - 1
                        ? handleModal
                        : handleNext
                    }
                    className="px-5 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium shadow hover:scale-[1.02] active:scale-95 transition"
                    >
                    {currentQuestion === question.length - 1 ? 'Selesai Tes' : 'Soal Berikutnya →'}
                    </button>
                </div>
                </div>
                ):(
                <div className='flex justify-center items-center px-8 py-10'>
                    <p className='bg-blue-50 border border-blue-200 rounded-xl p-6 text-gray-700 font-semibold'>SEDANG MEMUAT SOAL...</p>
                </div>
                )}
                
                </div>

                {/* Footer */}
                {/* <div className="mt-8 text-center text-xs text-slate-400">
                Waktu berjalan otomatis. Tes akan selesai saat waktu habis.
                </div> */}
            </main>

            <Modal isOpen={isModalOpen} onClose={()=> setIsModalOpen(false)}>
                <p className='text-gray-800'>Tes telah selesai. Silakan lanjut ke tahap berikutnya.</p>
                <p className='text-gray-600 text-sm mt-3'>(Pastikan koneksi internet stabil dan Anda berada di lingkungan yang kondusif.)</p>
                <div className='flex gap-x-3 justify-evenly mt-4'>
                <button 
                    className={`px-5 py-2 rounded-lg bg-gradient-to-r  text-white font-medium shadow hover:scale-[1.02] active:scale-95 transition ${
                        isLoading
                        ? 'bg-slate-400'
                        : 'from-blue-600 to-indigo-600' }`}
                    onClick={()=> setIsModalOpen(false)}
                    disabled={isLoading}
                >
                    Kembali
                </button>
                {isLoading ? (
                <button
                    className='disabled:pointer-events-none px-5 py-2 rounded-lg bg-gradient-to-r bg-slate-400 text-white font-medium shadow hover:scale-[1.02] active:scale-95 transition'
                    aria-label="Mulai CFIT Subtes 1"
                    onClick={handleTestComplete}
                    disabled={isLoading}
                    >
                    Mohon Tunggu...
                </button>
                ):(
                    <button 
                        className='px-5 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium shadow hover:scale-[1.02] active:scale-95 transition'
                        onClick={handleTestComplete}
                    >
                        Selesai
                    </button>
                )}
                
                </div>
            </Modal>
            <BackGuardModal {...modalProps} />
        </div>
    )
}