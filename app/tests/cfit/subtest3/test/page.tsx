'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Modal from '@/app/components/Modal';
import { storeAnswersCfit } from '@/services/answers.service';
import { getSoalCfit3Service } from '@/services/questions.service';
import TestHeader from '@/app/components/TestHeader';
import { useAntiCheat } from '@/lib/useAntiCheat';
import { useClipboardPermissionGuard } from '@/lib/useClipboardPermissionGuard';
import PermissionModal from '@/app/components/PermissionModal';
import Image from 'next/image';

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


export default function CFITSubtest3Test() {
    const router = useRouter();
    const [timeLeft, setTimeLeft] = useState(180); // satuan detik (60 detik)
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [question, setQuestion] = useState<Questionz[]>([])
    const [answers, setAnswers] = useState<CfitAnswer[]>(
      Array.from({ length: question.length}, (_, index) => ({
            questionId: index + 1,
            answers: [],
            subtest: 3
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
      const getCfit3Soal = async () => {
        try {
          const getQuestion = await getSoalCfit3Service()
          setQuestion(getQuestion.data.data)
        } catch (error) {
            console.log('gagal')
        }
      }
      getCfit3Soal()
    }, [])

    useEffect(() => {
      if (question.length > 0 && answers.length === 0) {
        setAnswers(
          Array.from({ length: question.length }, (_, index) => ({
            questionId: index + 1,
            answers: [],
            subtest: 3
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
    //             subtest: 3
    //           }
    //           return updated
    //         }

    //         updated[currentQuestion] = {
    //         questionId: currentQuestion + 1,
    //         answers: [answers],
    //         subtest: 3
    //         };

    //         return updated; 
    //     })
    // }
    const handleAnswer = async (answer: string) => {
    const updated = [...answers];
    
    if (answers[currentQuestion]?.answers?.[0] === answer) {
        updated[currentQuestion] = {
            questionId: currentQuestion + 1,
            answers: [],
            subtest: 3
        };
    } else {
        updated[currentQuestion] = {
            questionId: currentQuestion + 1,
            answers: [answer],
            subtest: 3
        };
    }

    setAnswers(updated);
    localStorage.setItem('tempAnswers', JSON.stringify(updated));
};

    const handleTestComplete = async () => {
        try {
            const setLoading = setIsLoading(true) 
              const testSession = sessionStorage.getItem('testSession')
              localStorage.removeItem('tempAnswers')
              localStorage.removeItem('isPassed')
              if(!testSession) {
                return (console.log('gagal'))
              }
        
              const testSessionParsed = JSON.parse(testSession)
              const sessionId = testSessionParsed.sessionId
              const res = await storeAnswersCfit(sessionId, answers)
              console.log('ini jawaban subtest3: ', res)
              router.push('/tests/cfit/subtest4');
            } catch(err:any) {
              const setLoading = setIsLoading(false)
              console.log('error: ', err)
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

    // const progressPercent = ((currentQuestion + 1) / question.length) * 100;

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

    const { showModal } = useClipboardPermissionGuard();

    return (
        <div className="font-sans min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 select-none">
          <header
            className='bg-white shadow-sm py-4 sticky top-0 z-10'
          >
            <TestHeader />
          </header>
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-2xl p-2 md:p-4">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-4">
            <div className='text-center md:text-left'>
              <h1 className="text-2xl font-bold text-slate-800">SUBTES 3</h1>
              <p className="text-sm text-slate-500">Jawab soal berikut dengan teliti dan cepat.</p>
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

          <style>{`
            div::-webkit-scrollbar { display: none; }
          `}</style>

          {/* Soal */}
          {question.length > 0 ? (
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
            <div className="border border-gray-200 rounded-2xl bg-white shadow-sm p-3 mb-4 flex flex-col gap-y-3">
            <p className='text-center text-gray-600 italic '>Amati posisi titik di antara bangunan berikut dan cari gambar dengan letak titik yang serupa dengan soal:</p>
            <div className="flex justify-center items-center gap-3 mb-3 m-auto">
              <div
                className="aspect-square bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 border border-slate-200"
              >
                <img 
                  src={`${process.env.NEXT_PUBLIC_CDN_BASE_URL}${question[currentQuestion]?.imagePath}`} 
                  alt=""
                  className='w-30 rounded-lg' />
                  
              </div>
            </div>

            <div className="text-center text-slate-700 mb-">
              Pilih gambar yang paling tepat untuk melengkapi pola:
            </div>

            {/* Pilihan Jawaban */}
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-4">
              {question[currentQuestion]?.options?.map((option) => {
                return(
                  <button
                  key={option.label}
                  onClick={() => handleAnswer(option.label)}
                  className={`w-30 aspect-square text-lg font-semibold rounded-xl flex items-center justify-center transition-all border-2 p-3 ${
                    answers[currentQuestion]?.answers?.includes(option.label)
                      ? 'bg-blue-600 text-white border-blue-600 scale-105 shadow'
                      : 'border-slate-200 bg-slate-50 hover:border-blue-400 hover:scale-[1.02]'
                  }`}
                >
                  <div className=' h-full'>
                    {option.label}
                  </div>
                  <img 
                      src={`${process.env.NEXT_PUBLIC_CDN_BASE_URL}${option.imagePath}`} 
                      // src={option.imagePath} 
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
            Subtes berikutnya
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