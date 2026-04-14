'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Brain, Info, Clock, ListChecks } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import Modal from '@/app/components/Modal';
import TestHeader from '@/app/components/TestHeader';

interface Question {
  id: number
  num1: number
  num2: number
  answer: number
  explanationRight: string
  explanationFalse: string
}

function IconMath() {
  return (
    <svg
      className="w-6 h-6 text-blue-600"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <path
        d="M4 12h16M12 4v16"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

type Answer = 0 | 1

const KraepelinInstructionPage: React.FC = () => {
  const TOTAL_QUESTIONS = 10;
  const TOTAL_EXAMPLES = 5

  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0);
  const [numbers, setNumbers] = useState<[number, number]>([0, 0]);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false)

  // generate soal baru
  const generateNumbers = () => {
    const a = Math.floor(Math.random() * 9) + 1;
    const b = Math.floor(Math.random() * 9) + 1;
    setNumbers([a, b]);
  };

  useEffect(() => {
    generateNumbers();
  }, []);

  useEffect(() => {
    console.log('number: ', numbers)
  })

  useEffect(() => {
    console.log('Currentindex: ', currentIndex)
  })

   useEffect(()=> {
        const testSession = sessionStorage.getItem('testSession')
        if(!testSession)
            return console.log('gagal')
        
        const testSessionParsed = JSON.parse(testSession)
        const tests = testSessionParsed.tests[testSessionParsed.currentIndex]
        console.log('ini tests:', testSessionParsed.currentIndex)
    })

  const handleInput = (value: string) => {
  if (!/^\d$/.test(value) || showResult) return

  const [a, b] = numbers
  const correctAnswer = (a + b) % 10
  const correct = Number(value) === correctAnswer

  setIsCorrect(correct)
  setShowResult(true)

  setAnswers(prev => [...prev, correct ? 1 : 0])
}


  const router = useRouter();
  const handleTestComplete = () => {
    router.push('/tests/kraepelin/example');
  };

  const handleNext = () => {
  if (currentIndex < TOTAL_EXAMPLES - 1) {
    setCurrentIndex(prev => prev + 1)
    setShowResult(false)
    setIsCorrect(null)
    generateNumbers()
  }
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
          className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-8"
        >
          {/* Card utama */}
          <section>
            <div className="p-6 md:p-8">
              {/* Breadcrumb */}
              <div className="mb-4">
                <nav className="text-xs text-slate-500 mb-2" aria-label="Breadcrumb">
                  {/* <ol className="inline-flex items-center space-x-2">
                    <li>
                      <Link href="/tests" className="hover:underline">
                        Tes
                      </Link>
                    </li>
                    <li>
                      <span className="text-slate-400">/</span>
                    </li>
                    <li className="font-medium text-slate-700">Kraepelin</li>
                  </ol> */}
                </nav>
                <h2 className="text-2xl md:text-3xl font-bold text-slate-800">
                  Tes Psikotes
                </h2>
                {/* <p className="mt-2 text-sm text-slate-600">
                  Tes ini digunakan untuk mengukur kecepatan, ketelitian, dan ketahanan
                  konsentrasi dengan melakukan penjumlahan angka secara berurutan dalam
                  batas waktu tertentu.
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
                    <div className="text-slate-600">30 menit</div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-100 rounded-lg">
                  <div className="text-amber-600">
                    <ListChecks className="w-5 h-5" />
                  </div>
                  <div className="text-sm">
                    <div className="text-slate-800 font-medium">Jumlah Lajur</div>
                    <div className="text-slate-600">Beberapa kolom angka vertikal</div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-emerald-50 border border-emerald-100 rounded-lg">
                  <div className="text-emerald-600">
                    <IconMath />
                  </div>
                  <div className="text-sm">
                    <div className="text-slate-800 font-medium">Perhatian</div>
                    <div className="text-slate-600">
                      Pastikan jaringan anda dalam keadaan yang bagus.
                    </div>
                  </div>
                </div>
              </div>

              {/* Section: Petunjuk Pengerjaan */}
              <section className="mt-10 mb-10">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                  <ListChecks className="text-blue-600" size={22} />
                  Petunjuk Tes
                </h2>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-5 text-sm text-slate-700 list-disc marker:text-slate-400 pl-3">
                    <li className="marker:text-2xl">
                      Anda akan melihat kolom berisi angka-angka vertikal.
                    </li>
                    <li className="marker:text-2xl">
                      Jumlahkan dua angka yang berdekatan secara vertikal.
                    </li>
                    <li className="marker:text-2xl">
                      Tuliskan <strong className="text-blue-600">digit terakhir</strong> hasil penjumlahan.
                    </li>
                    <li className="marker:text-2xl">
                      Setiap lajur memiliki batas waktu.
                    </li>
                    <li className="marker:text-2xl">
                      Setelah waktu habis, sistem akan berpindah otomatis ke lajur berikutnya.
                    </li>
                    <li className="marker:text-2xl">
                      Kerjakan secepat dan seakurat mungkin.
                    </li>
                  </ul>
                </div>
              </section>

              {/* Section: Contoh Soal */}
              <section className="mb-10">

                <h2 className="text-2xl font-semibold text-gray-800 mb-6">Petunjuk Teknis Soal</h2>
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                  <ul className='grid grid-cols-1 gap-y-2 gap-x-5 text-sm text-slate-700 list-disc marker:text-slate-400 pl-3'>
                    <li className="marker:text-2xl">
                      Soal terbagi ke dalam beberapa lajur.
                    </li>
                    <li className="marker:text-2xl ">
                      Pengerjaan dimulai dari bagian bawah lajur.
                    </li>
                    <li className="marker:text-2xl ">
                      Peserta cukup langsung mengisi jawaban pada kotak yang tersedia tanpa melakukan aktivitas tambahan, seperti memindahkan soal atau berpindah lajur secara mandiri.
                    </li>
                    <li className="marker:text-2xl ">
                      Pengisian jawaban dapat dilakukan menggunakan keyboard maupun numpad yang tersedia di samping soal.
                    </li>
                    <li className="marker:text-2xl ">
                      Jawaban diisi berdasarkan hasil penjumlahan dua angka yang berdekatan dengan ketentuan sebagai berikut:
                    </li>
                      <ul className='ml-7 list-disc marker:text-slate-400 pl-3'>
                        <li className="marker:text-2xl">
                          Jika hasil penjumlahan berupa satu digit (misalnya <span className='bg-green-300 px-1 rounded-lg border border-green-500'>3 + 4 = 7</span> ), maka yang diinput adalah angka tersebut, yaitu <span className='bg-green-300 px-1 rounded-lg border border-green-500'>7</span>.
                        </li>
                        <li className="marker:text-2xl">
                          Jika hasil penjumlahan berupa dua digit (misalnya <span className='bg-green-300 px-1 rounded-lg border border-green-500'>7 + 5 = 12</span> ), maka yang diinput adalah digit satuan atau angka terakhir, yaitu <span className='bg-green-300 px-1 rounded-lg border border-green-500'>2</span>.
                        </li>
                        <li className="marker:text-2xl">
                          Jika hasil penjumlahan berupa dua digit (misalnya <span className='bg-green-300 px-1 rounded-lg border border-green-500'>4 + 6 = 10</span> ), maka yang diinput adalah digit satuan atau angka terakhir, yaitu <span className='bg-green-300 px-1 rounded-lg border border-green-500'>0</span>.
                        </li>
                      </ul>
                    <li className="marker:text-2xl ">
                      
                      Peserta <span className='text-red-600 font-bold'>dilarang</span> berpindah kotak jawaban.
                    </li>
                    <li className="marker:text-2xl ">
                      
                      Peserta <span className='text-red-600 font-bold'>dilarang</span> berpindah lajur.
                    </li>
                  </ul>
                </div>
                {/*  
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">Contoh Soal</h2>
                <div className="border border-gray-200 rounded-xl p-6 bg-gray-50">
                  <p className="text-sm text-gray-600 mb-4">
                    Berikut contoh tampilan soal DISC. Pilih satu kata yang paling dan paling tidak menggambarkan diri Anda.
                  </p>
                  <div className="flex flex-col justify-center items-center bg-white rounded-lg p-8 border text-2xl italic">
                    <div className=" font-bold text-gray-800 text-center flex flex-col justify-center gap-y-2 mb-4">
                      <div className="text-lg">
                        Kolom <span className='text-green-600'>2</span> dari <span className='text-green-600'>50</span>
                      </div>
                      <div className="text-xl">
                        Sisa waktu: <span className='text-green-600'>120</span> detik
                      </div>
                    </div>
                    <div className='flex justify-center items-center gap-x-4  '>
                      <div className='flex flex-col justify-center items-center gap-x-4  '>
                        
                        <div className="flex justify-center items-center mb-10">
                          
                            <div className="flex flex-col gap-y-6 text-5xl font-bold text-center">
                              <div>{numbers[0]}</div>
                              <div>{numbers[1]}</div>
                            </div>
                          
                        </div>

                        {showResult && (
                          <div
                            className={`mb-3 text-lg font-semibold text-center ${
                              isCorrect ? 'text-green-600' : 'text-red-600'
                            }`}
                          >
                            <div>{isCorrect ? `Jawaban Benar.` : 'Jawaban Salah'}</div>
                            <div>{isCorrect 
                            ? `Hasil dari ${numbers[0]} + ${numbers[1]} adalah ${numbers[0] + numbers[1]}. Oleh karena itu, jawaban yang tepat adalah ${(numbers[0] + numbers[1]) % 10}` 
                            : `Hasil dari ${numbers[0]} + ${numbers[1]} adalah ${numbers[0] + numbers[1]}. Sehingga, jawaban yang tepat adalah ${(numbers[0] + numbers[1]) % 10}`}</div>
                          </div>
                        )}

                        {showResult && currentIndex < TOTAL_EXAMPLES - 1 && (
                          <button
                            onClick={handleNext}
                            className="mb-3 px-3 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition text-lg"
                          >
                            Next
                          </button>
                        )}


                        
                        
                          <div className="grid grid-cols-3 gap-4 max-w-xs mx-auto">
                            {[1,2,3,4,5,6,7,8,9,0].map((num) => (
                              <button
                                key={num}
                                disabled={showResult}
                                onClick={() => handleInput(String(num))}
                                className={`h-14 text-xl font-bold rounded-xl p-5 transition
                                  ${showResult
                                    ? 'bg-gray-300 cursor-not-allowed'
                                    : 'bg-gray-200 hover:bg-blue-500 hover:text-white'}
                                `}
                              >
                                {num}
                              </button>

                            ))}
                          </div>
                      </div>
                    </div>
                  </div>
                </div>
                */}
              </section>

              {/* Tombol aksi */}
              <div className="mt-8 border-t pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="text-sm text-slate-600">
                  <strong className="text-slate-800">Sebelum mulai:</strong> pastikan Anda
                  fokus dan siap mengerjakan tanpa gangguan.
                </div>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleModal}
                  className="px-5 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium shadow hover:shadow-lg transition-all"
                >
                  Mulai Latihan
                </motion.button>
              </div>
            </div>
          </section>

          {/* Footer kecil */}
          <div className="mt-6 text-center text-xs text-slate-400">
            Sistem akan otomatis memulai timer saat tes dimulai.
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
            Mulai Latihan
          </button>
        </div>
      </Modal>

    </div>
  );
}

export default KraepelinInstructionPage;