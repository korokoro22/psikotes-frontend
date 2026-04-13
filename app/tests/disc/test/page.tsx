'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, ArrowLeft } from 'lucide-react';
import Modal from '@/app/components/Modal';
import { storeAnswersDisc } from '@/services/answers.service';
import TestHeader from '@/app/components/TestHeader';
import { updateStatusTest, triggerN8n } from "@/services/answers.service"
import { getSoalDiscService } from '@/services/questions.service';

interface WordGroup {
  id: number;
  words: {
    text: string;
    type: 'D' | 'I' | 'S' | 'C';
  }[];
}

interface DiscQuestion {
  id: number
  questionIndex: number
  option: {
    sentences: string
    optionIndex: number
  }[]
}

export default function DISCTestPage() {

  const discQuestion:DiscQuestion[] = [
    {
      id: 0,
      questionIndex: 1,
      option: [
        { sentences: 'Mudah bergaul', optionIndex: 1 },
        { sentences: 'Suka menyendiri', optionIndex: 2 },
        { sentences: 'Kurang nyaman di kerumunan', optionIndex: 3 },
        { sentences: 'Nyaman di keramaian asalkan dengan teman', optionIndex: 4 }
      ],
    },
    {
      id: 1,
      questionIndex: 2,
      option: [
        { sentences: 'Rendah hati, Sederhana', optionIndex: 1 },
        { sentences: 'Ingin Kemajuan', optionIndex: 2 },
        { sentences: 'Terbuka memperlihatkan perasaan', optionIndex: 3 },
        { sentences: 'Puas dengan segalanya', optionIndex: 4 }
      ],
    }
  ]

  const router = useRouter();
  const [currentGroup, setCurrentGroup] = useState(0);
  const [question, setQuestion] = useState<DiscQuestion[]>([])
  const [answers, setAnswers] = useState<{
    most: { groupId: number; questionIndex:number}[];
    least: { groupId: number; questionIndex:number}[];
  }>({ most: [], least: [] });

//   const [answers, setAnswers] = useState<{
//     most: { groupId: number; questionIndex:number}[];
//     least: { groupId: number; questionIndex:number}[];
//   }>({
//     most: Array.from({ length: discQuestion.length}, (_, index)=>({
//       groupId: index+1, questionIndex: 0
//     })),
//     least: Array.from({ length: discQuestion.length}, (_, index)=>({
//       groupId: index, questionIndex: 0
//     }))
// });

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const [timeLeft, setTimeLeft] = useState(1200); // 5 menit
  const [isOvertime, setIsOvertime] = useState(false);
  const [overtime, setOvertime] = useState(0);

  useEffect(()=> {
    const getDiscQuestions = async () => {
      try {
      const getQuestion = await getSoalDiscService()
      setQuestion(getQuestion.data.data)
      } catch (error) {
        console.log('gagal')
      }
    }
      getDiscQuestions()
  }, [])

  useEffect(() => {
    console.log('soal disc: ', question)
  }, [question])

  useEffect(() => {
    console.log('answers:', answers);
    }, [answers]);  

  useEffect(() => {
    console.log('current group:', currentGroup);
    }, [currentGroup]);

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

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  // const handleSelection = (type: 'most' | 'least', questionIndex: number) => {
  //   setAnswers(prev => {
  //     const updated = {
  //       most: [...prev.most],
  //       least: [...prev.least],
  //     };

  //     const currentMost = updated.most[currentGroup];
  //     const currentLeast = updated.least[currentGroup];

  //     // TOGGLE OFF (klik ulang)
  //     if (
  //       (type === 'most' && currentMost?.questionIndex === questionIndex) ||
  //       (type === 'least' && currentLeast?.questionIndex === questionIndex)
  //     ) {
  //       if (type === 'most') delete updated.most[currentGroup];
  //       else delete updated.least[currentGroup];
  //       return updated;
  //     }

  //     // TIDAK BOLEH MOST & LEAST DI WORD YANG SAMA
  //     if (
  //       (type === 'most' && currentLeast?.questionIndex === questionIndex) ||
  //       (type === 'least' && currentMost?.questionIndex === questionIndex)
  //     ) {
  //       return prev;
  //     }

  //     // HANYA SATU MOST & SATU LEAST
  //     if (type === 'most' && currentMost) return prev;
  //     if (type === 'least' && currentLeast) return prev;

  //     // SIMPAN PILIHAN
  //     if (type === 'most') {
  //       updated.most[currentGroup] = {
  //         groupId: currentGroup+1,
  //         questionIndex: questionIndex,

  //       };
  //     } else {
  //       updated.least[currentGroup] = {
  //         groupId: currentGroup+1,
  //         questionIndex: questionIndex,
  //       };
  //     }

  //     return updated;
  //   });
  // };

  const handleSelection = (type: 'most' | 'least', questionIndex: number) => {
      let finalState = answers; // Asumsi state saat ini dibaca dari `answers`
  
      const updated = {
          most: [...answers.most],
          least: [...answers.least],
      };
  
      const currentMost = updated.most[currentGroup];
      const currentLeast = updated.least[currentGroup];
  
      if (
          (type === 'most' && currentMost?.questionIndex === questionIndex) ||
          (type === 'least' && currentLeast?.questionIndex === questionIndex)
      ) {
          if (type === 'most') delete updated.most[currentGroup];
          else delete updated.least[currentGroup];
          finalState = updated;
      } 
      else if (
          (type === 'most' && currentLeast?.questionIndex === questionIndex) ||
          (type === 'least' && currentMost?.questionIndex === questionIndex)
      ) {
          finalState = answers;
      } 
      else if ((type === 'most' && currentMost) || (type === 'least' && currentLeast)) {
          finalState = answers;
      } 
      else {
          if (type === 'most') {
              updated.most[currentGroup] = {
                  groupId: currentGroup,
                  questionIndex: questionIndex,
              };
          } else {
              updated.least[currentGroup] = {
                  groupId: currentGroup,
                  questionIndex: questionIndex,
              };
          }
          finalState = updated;
      }
  
      setAnswers(finalState);
      localStorage.setItem('tempAnswers', JSON.stringify(finalState));
  };

  const handleTestComplete = async () => {
    try {
      const setLoading = setIsLoading(true)
      const testSession = sessionStorage.getItem('testSession')
      localStorage.removeItem('tempAnswers')
      if(!testSession) {
        return (console.log('gagal'))
      }            
      const testSessionParsed = JSON.parse(testSession)
      const tests = testSessionParsed.tests[testSessionParsed.currentIndex]
      const sessionId = testSessionParsed.sessionId
      console.log('ini test4:', tests)
      const res = await storeAnswersDisc(sessionId, answers)

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
    if(temp !== null) {
      const answer = JSON.parse(temp)
      setAnswers(answer)
    }
  }, [])

  const handleModal = () => {
    setIsModalOpen(true)
  }

  return (
    <div className="font-sans min-h-screen bg-gray-50">
      {/* ✅ Sticky Header Navbar */}
      <header className="bg-white shadow-sm py-4 sticky top-0 z-10">
        <TestHeader />
      </header>

      <main className="container mx-auto px-6 py-10">
        <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg p-8">
          {/* Header Info */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <div className="text-center md:text-left">
              <h2 className="text-2xl font-bold text-gray-800">Instruksi</h2>
              <p className="text-gray-500 text-sm">
                Pilih pernyataan yang <span className="text-green-600 font-semibold">PALING SESUAI (P)</span> dan{' '}
                <span className="text-red-600 font-semibold">KURANG SESUAI (K)</span>dalam menggambarkan diri Anda.
              </p>
            </div>
            <div className="">
                    {/* ⏱ {formatTime(timeLeft)} */}
                        <div className={`text-xl font-mono px-4 py-2 rounded-lg shadow-sm ${
                            isOvertime ? 'bg-red-100 text-red-600' : 'bg-gray-100'
                        }`}>
                            {isOvertime 
                                ? `⚠️ +${formatTime(overtime)}` 
                                : `⏱ ${formatTime(timeLeft)}`
                            }
                        </div>
                    </div>
          </div>

          {/* Progress */}
          <div className="mb-8">
            <div className="text-sm text-gray-600 mb-2 text-center">
              Soal {currentGroup + 1} dari {question.length}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${((currentGroup + 1) / question.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Soal */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentGroup}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.4 }}
            >
              <div className="grid grid-cols-1 gap-4">
                {question[currentGroup]?.option.map((opt, index) => {
                              const mostState = answers.most[currentGroup]?.questionIndex
                              const isMost = answers.most[currentGroup]?.questionIndex === opt.optionIndex;
                              const isLeast = answers.least[currentGroup]?.questionIndex === opt.optionIndex;
                              const mostTaken = !!answers.most[currentGroup];
                              const leastTaken = !!answers.least[currentGroup];

                              return (
                                <div
                                  key={index}
                                  className={`flex items-center justify-between p-4 border rounded-lg transition-all text-xs md:text-base ${
                                    isMost
                                      ? 'border-green-500 bg-green-50'
                                      : isLeast
                                      ? 'border-red-500 bg-red-50'
                                      : 'border-gray-200 hover:bg-gray-50'
                                  }`}
                                >
                                  <span className=" font-medium text-gray-800">{opt.sentences}</span>
                                  <div className="flex gap-3">
                                    <button
                                      disabled={(!isMost && mostTaken) || isLeast}
                                      onClick={() => handleSelection('most', opt.optionIndex)}
                                      className={`px-4 py-2 rounded-md font-semibold ${
                                        isMost
                                          ? 'bg-green-600 text-white'
                                          : (!isMost && mostTaken) || isLeast
                                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                          : 'bg-gray-100 hover:bg-green-100 text-green-700'
                                        // isMost
                                        //   ? 'bg-green-600 text-white'
                                        //   : 'bg-gray-100 hover:bg-green-100 text-green-700'
                                      }`}
                                    >
                                      PALING SESUAI (P)
                                    </button>

                                    <button
                                      disabled={(!isLeast && leastTaken) || isMost}
                                      onClick={() => handleSelection('least', opt.optionIndex)}
                                      className={`px-4 py-2 rounded-md font-semibold ${
                                        isLeast
                                          ? 'bg-red-600 text-white'
                                          : (!isLeast && leastTaken) || isMost
                                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                          : 'bg-gray-100 hover:bg-red-100 text-red-700'
                                      }`}
                                    >
                                      KURANG SESUAI (K)
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
              </div>
            </motion.div>
          </AnimatePresence>
          
          <div className="flex justify-between items-center mt-8">
            <button
              onClick={() => setCurrentGroup(prev => Math.max(0, prev - 1))}
              disabled={currentGroup === 0}
              className={`px-4 py-2 rounded-lg border text-sm font-medium transition ${
                currentGroup === 0
                  ? 'opacity-50 cursor-not-allowed bg-slate-50 text-slate-400 border-slate-200'
                  : 'bg-white border-slate-300 hover:bg-slate-50 text-slate-700'
                }`}
            >
              ← Sebelumnya
            </button>

            <button
            disabled={!(answers.most[currentGroup] && answers.least[currentGroup])}
              onClick={
                currentGroup === question.length - 1
                  ? handleModal
                  : () => setCurrentGroup(prev => prev + 1)
                }
              className={`px-3 sm:px-5 py-2 rounded-lg bg-gradient-to-r  text-white font-medium shadow hover:scale-[1.02] active:scale-95 transition ${
                !(answers.most[currentGroup] && answers.least[currentGroup])
                ? 'cursor-not-allowed bg-gray-400'
                : 'from-blue-600 to-indigo-600'

                }`}
            >
              {currentGroup !== question.length - 1 
              ? 'Soal Berikutnya →' 
              : 'Selesai Tes'}
            </button>
          </div>

        </div>
      </main>

      <Modal isOpen={isModalOpen} onClose={()=> setIsModalOpen(false)}>
        <p className='text-gray-800'>Anda telah menyelesaikan sesi tes. Waktu pengerjaan telah berakhir dan sesi tidak dapat diulang.</p>
        <p className='text-gray-600 text-sm mt-3'>(Terima kasih telah mengikuti tes. Silakan menunggu instruksi selanjutnya.)</p>
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
          {isLoading? (
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

    </div>
  );
}