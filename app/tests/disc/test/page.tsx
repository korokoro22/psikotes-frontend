'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, ArrowLeft } from 'lucide-react';
import Modal from '@/app/components/Modal';
import { storeAnswersDisc } from '@/services/answers.service';
import TestHeader from '@/app/components/TestHeader';

interface WordGroup {
  id: number;
  words: {
    text: string;
    type: 'D' | 'I' | 'S' | 'C';
  }[];
}

export default function DISCTestPage() {

  const wordGroups: WordGroup[] = [
    {
      id: 1,
      words: [
        { text: 'Tegas', type: 'D' },
        { text: 'Menyenangkan', type: 'I' },
        { text: 'Setia', type: 'S' },
        { text: 'Teliti', type: 'C' },
      ],
    },
    {
      id: 2,
      words: [
        { text: 'Ambisius', type: 'D' },
        { text: 'Optimis', type: 'I' },
        { text: 'Sabar', type: 'S' },
        { text: 'Perfeksionis', type: 'C' },
      ],
    },
  ];

  const router = useRouter();
  const [currentGroup, setCurrentGroup] = useState(0);
//   const [answers, setAnswers] = useState<{
//     most: { groupId: number; type: string }[];
//     least: { groupId: number; type: string }[];
//   }>({
//     least: Array.from({length: wordGroups.length}, (_, index) => ({
//       groupId: index, type: ''
//     })),
//     most: Array.from({length: wordGroups.length}, (_, index) => ({
//       groupId: index, type: ''
//     }))
// });
  const [answers, setAnswers] = useState<{
    most: { groupId: number;  type: string }[];
    least: { groupId: number; type: string }[];
  }>({ most: [], least: [] });
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [timeLeft, setTimeLeft] = useState(1200); // 5 menit

  useEffect(() => {
    console.log('current group:', answers);
    }, [answers]);  

  useEffect(() => {
    if (timeLeft <= 0) {
      handleTestComplete();
      return;
    }
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handleSelection = (type: 'most' | 'least', wordType: string) => {
    setAnswers(prev => {
      const updated = {
        most: [...prev.most],
        least: [...prev.least],
      };

      const currentMost = updated.most[currentGroup];
      const currentLeast = updated.least[currentGroup];

      // 🔁 TOGGLE OFF (klik ulang)
      if (
        (type === 'most' && currentMost?.type === wordType) ||
        (type === 'least' && currentLeast?.type === wordType)
      ) {
        if (type === 'most') delete updated.most[currentGroup];
        else delete updated.least[currentGroup];
        return updated;
      }

      // 🚫 TIDAK BOLEH MOST & LEAST DI WORD YANG SAMA
      if (
        (type === 'most' && currentLeast?.type === wordType) ||
        (type === 'least' && currentMost?.type === wordType)
      ) {
        return prev;
      }

      // 🚫 HANYA SATU MOST & SATU LEAST
      if (type === 'most' && currentMost) return prev;
      if (type === 'least' && currentLeast) return prev;

      // ✅ SIMPAN PILIHAN
      if (type === 'most') {
        updated.most[currentGroup] = {
          groupId: currentGroup,
          type: wordType,
        };
      } else {
        updated.least[currentGroup] = {
          groupId: currentGroup,
          type: wordType,
        };
      }

      return updated;
    });
  };

  const handleTestComplete = async () => {
    // const testSession = sessionStorage.getItem('testSession')
    //     if(!testSession)
    //         return alert('gagal')

    //     const testSessionParsed = JSON.parse(testSession)
    //     const tests = testSessionParsed.tests[testSessionParsed.currentIndex]
    //     if(tests) {
    //         router.push(`/tests/${tests.toLowerCase()}`)
    //         const indexIncrement = testSessionParsed.currentIndex + 1
    //         testSessionParsed.currentIndex = indexIncrement

    //         const updatedTestString = JSON.stringify(testSessionParsed)
    //         sessionStorage.setItem('testSession', updatedTestString)        
    //     } else {
    //         sessionStorage.clear()
    //         router.push('/result')
    //     }
    const testSession = sessionStorage.getItem('testSession')

    if(!testSession) {
      return (console.log('gagal'))
    }            
    const testSessionParsed = JSON.parse(testSession)
    const tests = testSessionParsed.tests[testSessionParsed.currentIndex]
    const sessionId = testSessionParsed.sessionId
    console.log('ini test4:', tests)
    console.log('ini sessionId:', sessionId)

    const res = await storeAnswersDisc(sessionId, answers)

  };

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
                Pilih kalimat yang <span className="text-green-600 font-semibold">PALING (P)</span> dan{' '}
                <span className="text-red-600 font-semibold">PALING TIDAK (K)</span> menggambarkan diri Anda.
              </p>
            </div>
            <div className="bg-gray-100 text-xl font-mono px-4 py-2 rounded-lg shadow-sm">
              ⏱ {formatTime(timeLeft)}
            </div>
          </div>

          {/* Progress */}
          <div className="mb-8">
            <div className="text-sm text-gray-600 mb-2 text-center">
              Kelompok {currentGroup + 1} dari {wordGroups.length}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${((currentGroup + 1) / wordGroups.length) * 100}%` }}
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
                {wordGroups[currentGroup].words.map((word, index) => {
                  
                  const isMost = answers.most[currentGroup]?.type === word.type;
                  const isLeast = answers.least[currentGroup]?.type === word.type;
                  const mostTaken = !!answers.most[currentGroup];
                  const leastTaken = !!answers.least[currentGroup];
                  // console.log(isMost)

                  return (
                    <div
                      key={index}
                      className={`flex items-center justify-between p-4 border rounded-lg transition-all ${
                        isMost
                          ? 'border-green-500 bg-green-50'
                          : isLeast
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <span className="text-lg font-medium text-gray-800">{word.text}</span>
                      <div className="flex gap-3">
                        {/* <button
                          onClick={() => handleSelection('most', word.type)}
                          className={`px-4 py-2 text-sm rounded-md font-semibold transition-all ${
                            isMost
                              ? 'bg-green-600 text-white shadow-md'
                              : 'bg-gray-100 hover:bg-green-100 text-green-700'
                          }`}
                        >
                          PALING (P)
                        </button> */}
                        
                        <button
                          disabled={(!isMost && mostTaken) || isLeast}
                          onClick={() => handleSelection('most', word.type)}
                          className={`px-4 py-2 rounded-md text-sm font-semibold ${
                            isMost
                              ? 'bg-green-600 text-white'
                              : (!isMost && mostTaken) || isLeast
                              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                              : 'bg-gray-100 hover:bg-green-100 text-green-700'
                              }`}
                          >
                          PALING (P)
                          </button>
                          
                          <button
                            disabled={(!isLeast && leastTaken) || isMost}
                            onClick={() => handleSelection('least', word.type)}
                            className={`px-4 py-2 rounded-md text-sm font-semibold ${
                              isLeast
                                ? 'bg-red-600 text-white'
                                : (!isLeast && leastTaken) || isMost
                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                : 'bg-gray-100 hover:bg-red-100 text-red-700'
                              }`}
                          >
                                      PALING TIDAK (K)
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
              onClick={
                currentGroup === wordGroups.length - 1
                  ? handleModal
                  : () => setCurrentGroup(prev => prev + 1)
                }
              className="px-5 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium shadow hover:scale-[1.02] active:scale-95 transition"
            >
              {currentGroup === wordGroups.length - 1 ? 'Selesai Tes' : 'Soal Berikutnya →'}
            </button>
          </div>

        </div>
      </main>

      <Modal isOpen={isModalOpen} onClose={()=> setIsModalOpen(false)}>
        <p className='text-gray-800'>Anda akan memasuki sesi tes. Setelah tes dimulai, waktu akan berjalan dan sesi tidak dapat diulang.</p>
        <p className='text-gray-600 text-sm mt-3'>(Pastikan koneksi internet stabil dan Anda berada di lingkungan yang kondusif.)</p>
        <div className='flex gap-x-3 justify-evenly mt-4'>
          <button 
            className='px-5 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium shadow hover:scale-[1.02] active:scale-95 transition'
            onClick={()=> setIsModalOpen(false)}
          >
            Kembali
          </button>
          <button 
            className='px-5 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium shadow hover:scale-[1.02] active:scale-95 transition'
            onClick={handleTestComplete}
          >
            Mulai Tes
          </button>
        </div>
      </Modal>

    </div>
  );
}
