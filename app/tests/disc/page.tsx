'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Brain, Info, Clock, ListChecks } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import Modal from '@/app/components/Modal';
import TestHeader from '@/app/components/TestHeader';

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
  questions: {
    sentences: string
    optionIndex: number
  }[]
}

interface DiscAnswers {
  
  most: {
    questionIndex: number
    p1: number
    p2: number
    p3: number
    p4: number
  }[]
  least: {
    questionIndex: number
    k1: number
    k2: number
    k3: number
    k4: number
  }[]
}

function IconSeries() {
  return (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="2" y="4" width="6" height="6" rx="1.2" stroke="currentColor" strokeWidth="1.5" />
      <rect x="9" y="8" width="6" height="6" rx="1.2" stroke="currentColor" strokeWidth="1.5" />
      <rect x="16" y="12" width="6" height="6" rx="1.2" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function IconPersonality() {
  return (
    <svg
      className="w-6 h-6 text-blue-600"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M4 20c0-4 4-6 8-6s8 2 8 6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function DISCInstructionPage() {
  const router = useRouter();
  const [currentGroup, setCurrentGroup] = useState(0);
  const [answers, setAnswers] = useState<{
    most: { groupId: number; questionIndex:number}[];
    least: { groupId: number; questionIndex:number}[];
  }>({ most: [], least: [] });

  // const [answers, setAnswers] = useState<DiscAnswers>({
  //   most: [],
  //   least: []
  // })

  const [isModalOpen, setIsModalOpen] = useState(false)

  const discQuestion:DiscQuestion[] = [
    {
      id: 0,
      questionIndex: 1,
      questions: [
        { sentences: 'Mudah bergaul', optionIndex: 1 },
        { sentences: 'Suka menyendiri', optionIndex: 2 },
        { sentences: 'Kurang nyaman di kerumunan', optionIndex: 3 },
        { sentences: 'Nyaman di keramaian asalkan dengan teman', optionIndex: 4 }
      ],
    },
    {
      id: 1,
      questionIndex: 2,
      questions: [
        { sentences: 'Rendah hati, Sederhana', optionIndex: 1 },
        { sentences: 'Ingin Kemajuan', optionIndex: 2 },
        { sentences: 'Terbuka memperlihatkan perasaan', optionIndex: 3 },
        { sentences: 'Puas dengan segalanya', optionIndex: 4 }
      ],
    }
  ]
  
  // const wordGroups: WordGroup[] = [
  //   {
  //     id: 1,
  //     words: [
  //       { text: 'Tegas', type: 'D' },
  //       { text: 'Menyenangkan', type: 'I' },
  //       { text: 'Setia', type: 'S' },
  //       { text: 'Teliti', type: 'C' },
  //     ],
  //   },
  //   {
  //     id: 2,
  //     words: [
  //       { text: 'Ambisius', type: 'D' },
  //       { text: 'Optimis', type: 'I' },
  //       { text: 'Sabar', type: 'S' },
  //       { text: 'Perfeksionis', type: 'C' },
  //     ],
  //   },
  //   {
  //     id: 3,
  //     words: [
  //       { text: 'Tegas', type: 'D' },
  //       { text: 'Menyenangkan', type: 'I' },
  //       { text: 'Setia', type: 'S' },
  //       { text: 'Teliti', type: 'C' },
  //     ],
  //   },
  // ];

  useEffect(() => {
          console.log('current group:', currentGroup);
          }, [currentGroup]);

  useEffect(() => {
          console.log('current group:', answers);
          }, [answers]);

  const handleTestComplete = () => {
    router.push('/tests/disc/test');
  };

  // const handleSelection = (type: 'most' | 'least', optionIndex: number) => {
  //   setAnswers(prev => {
  //     const updated = {}
  //   })
  // }

  // const handleSelection = (type: 'most' | 'least', wordType: string) => {
  //   setAnswers(prev => {
  //     const updated = {
  //       most: [...prev.most],
  //       least: [...prev.least],
  //     };

  //     const currentMost = updated.most[currentGroup];
  //     const currentLeast = updated.least[currentGroup];

  //     // TOGGLE OFF (klik ulang)
  //     if (
  //       (type === 'most' && currentMost?.type === wordType) ||
  //       (type === 'least' && currentLeast?.type === wordType)
  //     ) {
  //       if (type === 'most') delete updated.most[currentGroup];
  //       else delete updated.least[currentGroup];
  //       return updated;
  //     }

  //     // TIDAK BOLEH MOST & LEAST DI WORD YANG SAMA
  //     if (
  //       (type === 'most' && currentLeast?.type === wordType) ||
  //       (type === 'least' && currentMost?.type === wordType)
  //     ) {
  //       return prev;
  //     }

  //     // HANYA SATU MOST & SATU LEAST
  //     if (type === 'most' && currentMost) return prev;
  //     if (type === 'least' && currentLeast) return prev;

  //     // SIMPAN PILIHAN
  //     if (type === 'most') {
  //       updated.most[currentGroup] = {
  //         groupId: currentGroup,
  //         type: wordType,
  //       };
  //     } else {
  //       updated.least[currentGroup] = {
  //         groupId: currentGroup,
  //         type: wordType,
  //       };
  //     }

  //     return updated;
  //   });
  // };

  const handleSelection = (type: 'most' | 'least', questionIndex: number) => {
    setAnswers(prev => {
      const updated = {
        most: [...prev.most],
        least: [...prev.least],
      };

      const currentMost = updated.most[currentGroup];
      const currentLeast = updated.least[currentGroup];

      // TOGGLE OFF (klik ulang)
      if (
        (type === 'most' && currentMost?.questionIndex === questionIndex) ||
        (type === 'least' && currentLeast?.questionIndex === questionIndex)
      ) {
        if (type === 'most') delete updated.most[currentGroup];
        else delete updated.least[currentGroup];
        return updated;
      }

      // TIDAK BOLEH MOST & LEAST DI WORD YANG SAMA
      if (
        (type === 'most' && currentLeast?.questionIndex === questionIndex) ||
        (type === 'least' && currentMost?.questionIndex === questionIndex)
      ) {
        return prev;
      }

      // HANYA SATU MOST & SATU LEAST
      if (type === 'most' && currentMost) return prev;
      if (type === 'least' && currentLeast) return prev;

      // SIMPAN PILIHAN
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

      return updated;
    });
  };

  const resetState = () => {
      setAnswers({most: [], least: []})
    }

  const handleNext = () => {
    resetState()
    setCurrentGroup(prev => prev + 1)
  }

  const handleModal = () => {
    setIsModalOpen(true)
  }

  return (
    <div className="font-sans min-h-screen bg-gradient-to-br from-red-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm py-4 sticky top-0 z-10">
        <TestHeader />
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-10">
      <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-4 md:p-8"
        >
          {/* Card utama */}
          <section>
            <div className="">
              {/* Breadcrumb */}
              <div className="mb-4">
                <nav className="text-xs text-slate-500 mb-2" aria-label="Breadcrumb">
                  
                </nav>
                <h2 className="text-2xl md:text-3xl font-bold text-slate-800">
                  Tes Psikotes
                </h2>
                {/* <p className="mt-2 text-sm text-slate-600">
                  Tes untuk mengenali kecenderungan kepribadian berdasarkan empat tipe utama:
                  <strong> Dominance (D)</strong>, <strong> Influence (I)</strong>,{' '}
                  <strong> Steadiness (S)</strong>, dan <strong> Compliance (C)</strong>.
                </p> */}
              </div>

              {/* Info box */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-100 rounded-lg">
                  <div className="text-blue-600">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div className="text-sm">
                    <div className="text-slate-800 font-medium">Durasi</div>
                    <div className="text-slate-600">± 10–15 menit</div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-100 rounded-lg">
                  <div className="text-amber-600">
                    <Info className="w-5 h-5" />
                  </div>
                  <div className="text-sm">
                    <div className="text-slate-800 font-medium">Jumlah Kelompok</div>
                    <div className="text-slate-600">Sekitar 24 kelompok kata</div>
                  </div>
                </div>

                {/* <div className="flex items-start gap-3 p-4 bg-emerald-50 border border-emerald-100 rounded-lg">
                  <div className="text-emerald-600">
                    <IconPersonality />
                  </div>
                  <div className="text-sm">
                    <div className="text-slate-800 font-medium">Tujuan</div>
                    <div className="text-slate-600">Mengukur tipe kepribadian Anda</div>
                  </div>
                </div> */}
                <div className="flex items-start gap-3 p-4 bg-emerald-50 border border-emerald-100 rounded-lg">
                  <div className="text-emerald-600">
                    <IconSeries />
                  </div>
                  <div className="text-sm">
                    <div className="text-slate-800 font-medium">Format</div>
                    <div className="text-slate-600">Verbal • Teks & Pernyataan </div>
                  </div>
                </div>
              </div>

              {/* Section: Petunjuk */}
              <section className="mt-10 mb-10">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                  <ListChecks className="text-blue-600" size={22} />
                  Petunjuk Tes
                </h2>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                  <p className="text-gray-700 mb-4">
                    Pada tes ini, Anda akan diberikan sejumlah kelompok kata yang menggambarkan sifat
                    atau perilaku tertentu. Setiap kelompok berisi empat kata.
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li>Pilih satu kata yang paling menggambarkan diri Anda (Paling Sesuai).</li>
                    <li>Pilih satu kata yang paling tidak menggambarkan diri Anda (Paling Tidak Sesuai).</li>
                    {/* <li>
                      Setiap pilihan akan membantu menentukan kecenderungan kepribadian Anda
                      berdasarkan empat dimensi utama: D, I, S, dan C.
                    </li> */}
                    <li>
                      <Clock className="inline-block text-blue-500 mr-1" size={16} />
                      Waktu pengerjaan: <span className="font-semibold">± 10–15 menit</span>
                    </li>
                  </ul>
                </div>
              </section>

              {/* Section: Contoh Soal */}
              <section className="mb-10">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">Contoh Soal</h2>
                <div className="border border-gray-200 rounded-xl p-4 md:p-6 bg-gray-50">
                  <p className="text-sm text-gray-600 mb-4">
                    Berikut contoh tampilan soal. Pilih satu kata yang paling dan paling tidak menggambarkan diri Anda.
                  </p>
                  <div className="flex justify-center items-center flex-col bg-white rounded-lg p-5 md:p-8 border text-gray-400 italic">
                    <div className='w-full'>
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={currentGroup}
                          initial={{ opacity: 0, y: 40 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -40 }}
                          transition={{ duration: 0.4 }}
                        >
                          <div className="grid grid-cols-1 gap-4">

                            {discQuestion[currentGroup].questions.map((question, index) => {

                              const isMost = answers.most[currentGroup]?.questionIndex === question.optionIndex;
                              const isLeast = answers.least[currentGroup]?.questionIndex === question.optionIndex;
                              const mostTaken = !!answers.most[currentGroup];
                              const leastTaken = !!answers.least[currentGroup];

                              return (
                                <div
                                  key={index}
                                  className={`flex items-center text-sm md:text-base  justify-between p-4 border rounded-lg transition-all ${
                                    isMost
                                      ? 'border-green-500 bg-green-50'
                                      : isLeast
                                      ? 'border-red-500 bg-red-50'
                                      : 'border-gray-200 hover:bg-gray-50'
                                  }`}
                                >
                                  <span className="font-medium text-gray-800">{question.sentences}</span>
                                  <div className="flex gap-3">
                                    <button
                                      disabled={(!isMost && mostTaken) || isLeast}
                                      onClick={() => handleSelection('most', question.optionIndex)}
                                      className={`px-3 md:px-4 py-1 md:py-2 rounded-md font-semibold ${
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
                                      onClick={() => handleSelection('least', question.optionIndex)}
                                      className={`px-2 md:px-4 py-1 md:py-2 rounded-md  font-semibold ${
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

                      <div className="flex justify-between items-center mt-7">
                                <button
                                    onClick={() => 
                                    {
                                        setCurrentGroup(prev => Math.max(0, prev - 1))
                                        resetState()
                                    }}
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
                                    currentGroup === discQuestion.length - 1
                                        ? handleModal
                                        : handleNext
                                    }
                                    className={`px-4 sm:px-5 py-2  rounded-lg bg-gradient-to-r text-xs sm:text-sm from-blue-600 to-indigo-600 text-white font-medium shadow hover:scale-[1.02] active:scale-95 transition ${
                                      !(answers.most[currentGroup] && answers.least[currentGroup])
                                        ? 'cursor-not-allowed bg-gray-400'
                                        : 'from-blue-600 to-indigo-600'
                                      }`}
                                >
                                    {currentGroup !== discQuestion.length - 1 
                                      ? 'Soal Berikutnya →' 
                                      : 'Selesai Tes'}
                                </button>
                            </div>
                    </div>
                    
                  </div>
                </div>
              </section>

              {/* Tombol aksi */}
              <div className="mt-8 border-t pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="text-sm text-slate-600">
                  <strong className="text-slate-800">Sebelum mulai:</strong> pastikan
                  Anda berada di tempat yang tenang dan siap fokus.
                </div>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleModal}
                  className="px-5 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium shadow hover:shadow-lg transition-all"
                >
                  Mulai Tes
                </motion.button>
              </div>
            </div>
          </section>

          {/* Footer kecil */}
          <div className="mt-6 text-center text-xs text-slate-400">
            Sistem ini menampilkan instruksi — waktu akan mulai otomatis saat tes dimulai.
          </div>
        </motion.div>
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
