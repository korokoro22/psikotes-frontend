'use client';
import Link from 'next/link';
import { ArrowLeft, Brain, Clock, ListChecks } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Modal from '@/app/components/Modal';
import { getContohCfit2Service } from '@/services/questions.service';
import TestHeader from '@/app/components/TestHeader';
import { useAntiCheat } from '@/lib/useAntiCheat';
import { useClipboardPermissionGuard } from '@/lib/useClipboardPermissionGuard';
import PermissionModal from '@/app/components/PermissionModal';
import Image from 'next/image';
import BackGuardModal from '@/app/components/BackGuardModal';
import { useBackGuard } from '@/lib/useBackGuard';

interface Question {
  id: number;
  images: string[];
  correctAnswer: string[];
  explanationRight: string,
  explanationFalse: string
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

export default function CFITSubtest2() {
  const { modalProps } = useBackGuard();
  const router = useRouter()
  const [resultText, setResultText] = useState<string>('')
  const [answers, setAnswers] = useState<string[][]>([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [isChecked, setIsChecked] = useState<boolean>(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const [question, setQuestion] = useState<Questionz[]>([])
  const answered = answers[currentQuestion]?.length

  const [isLoading, setIsLoading] = useState(false)

  const questions: Question[] = [
    {
      id: 1,
      images: ['q1-1.png', 'q1-2.png', 'q1-3.png', 'q1-4.png'],
      correctAnswer: ["B", "D"],
      explanationRight: 'Benar karena opsi yang dipilih benar',
      explanationFalse: 'Salah karena opsi yang dipilih tidak tepat'
    },
    {
      id: 2,
      images: ['q1-1.png', 'q1-2.png', 'q1-3.png', 'q1-4.png'],
      correctAnswer: ["C", "E"],
      explanationRight: 'Benar karena opsi yang dipilih benar',
      explanationFalse: 'Salah karena opsi yang dipilih tidak tepat'
    },
    {
      id: 3,
      images: ['q1-1.png', 'q1-2.png', 'q1-3.png', 'q1-4.png'],
      correctAnswer: ["A", "B"],
      explanationRight: 'Benar karena opsi yang dipilih benar',
      explanationFalse: 'Salah karena opsi yang dipilih tidak tepat'
    }
  ]

//   const handleAnswer = (option: number) => {
//   if (isChecked) return;

//   setAnswers(prev => {
//     const current = prev[currentQuestion] || [];

//     if (current.includes(option)) {
//       const updated = current.filter(o => o !== option);
//       const copy = [...prev];
//       copy[currentQuestion] = updated;
//       return copy;
//     }

//     if (current.length === 2) return prev;

//     const copy = [...prev];
//     copy[currentQuestion] = [...current, option];
//     return copy;
//   });
// };


const handleAnswer = (option: string) => {
  if (isChecked) return;

  setAnswers(prev => {
    const current = prev[currentQuestion] || [];

    if (current.includes(option)) {
      const updated = current.filter(o => o !== option);
      const copy = [...prev];
      copy[currentQuestion] = updated;
      return copy;
    }

    if (current.length === 2) return prev;

    const copy = [...prev];
    copy[currentQuestion] = [...current, option];
    return copy;
  });
};
  const checkAnswer = (questionIndex: number) => {
  const selected = answers[questionIndex];
  if (!selected || selected.length !== 2) return;

  setIsChecked(true);

  const correct = questions[questionIndex].correctAnswer;
  const isCorrect =
    selected.length === correct.length &&
    selected.every(v => correct.includes(v));

  setResultText(
    isCorrect
      ? questions[questionIndex].explanationRight
      : questions[questionIndex].explanationFalse
  );
};


  const handleTestComplete = () => {
    try {
      const setLoading = setIsLoading(true)
      router.push('/tests/cfit/subtest2/test')
    } catch (error) {
      const setLoading = setIsLoading(false)
    }
  }

  const resetState = () => {
    setResultText('')
    setIsChecked(false)
    setAnswers([])
  }

  const handleNext = () => {
    resetState()
    setCurrentQuestion(prev => prev + 1)
  }

  const handleModal = () => {
    setIsModalOpen(true)
  }

  useEffect(() => {
          console.log('current question:', currentQuestion);
          }, [currentQuestion]);

  useEffect(() => {
        const getCfit2Contoh = async () => {
          try {
            const getQuestion = await getContohCfit2Service()
            setQuestion(getQuestion.data.data)
          } catch (error) {
            console.log('gagal')
          }
        }
        getCfit2Contoh()
      }, [])

  useAntiCheat({ mode: "silent" });

  useEffect(() => {
    document.title = "Instructions - Psychological Tests";
  }, [])

  const { showModal } = useClipboardPermissionGuard();

  return (
    <div className="font-sans min-h-screen bg-gradient-to-br from-red-50 to-indigo-100 flex flex-col select-none">
      {/* Header */}
      <header className="bg-white shadow-sm py-4 sticky top-0 z-10">
        <TestHeader />
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-8"
        >
          {/* Section: Petunjuk */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <ListChecks className="text-blue-600" size={22} />
              Petunjuk Subtes 2
            </h2>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <p className="text-gray-700 mb-4">
                Pada subtes ini, tugas utama Anda adalah menemukan tepat 2 gambar yang memiliki hubungan yang sama dari sekumpulan gambar yang disajikan. Baca dengan saksama petunjuk di bawah ini:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Setiap soal menampilkan 5 buah kotak.</li>
                <li>Temukan dan pilih 2 kotak yang memiliki hubungan yang sama.</li>
                <li>Klik gambar untuk memilih jawaban.</li>
                <li>Jika ingin mengubah, cukup klik pada gambar pilihan yang lain.</li>
                <li>
                  Waktu pengerjaan: <span className="font-semibold">4 menit</span>
                </li>
                <li>Jumlah soal: <span className="font-semibold">14 butir</span></li>
              </ul>
            </div>
          </section>

          {/* Section: Contoh Soal */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Contoh Soal</h2>
            <div className="border border-gray-200 rounded-xl p-6 bg-gray-50">
              <p className="text-sm text-gray-600 mb-4">
                Jawab soal berikut dengan teliti dan cepat.
              </p>
              <div className="flex justify-center items-center bg-white rounded-lg p-5 sm:p-8 border">
                
                  <div className='w-full flex flex-col gap-3 text-gray-400 italic'>
                    <div className="text-center text-slate-700 mb-6">
                        Pilih dua gambar yang paling tepat yang memiliki kesamaan hubungan.
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 w-full">
                      {/* {[1, 2, 3, 4, 5, 6].map(option => { */}
                      { question[currentQuestion]?.options?.map((option) => {
                        const selected = answers[currentQuestion]?.includes(option.label);
                        const correct = questions[currentQuestion].correctAnswer.includes(option.label);

                        return (
                          <button
                            key={option.label}
                            onClick={() => handleAnswer(option.label)}
                            disabled={isChecked}
                            className={`aspect-square text-lg font-semibold rounded-xl flex items-center justify-center transition-all border-2
                              ${
                                isChecked && correct
                                  ? 'bg-green-600 text-white border-green-600'
                                  : isChecked && selected && !correct
                                  ? 'bg-red-600 text-white border-red-600'
                                  : selected
                                  ? 'bg-blue-600 text-white border-blue-600'
                                  : 'border-slate-200 bg-slate-50 hover:border-blue-400'
                              }
                            `}
                          >
                            <img 
                            src={`${process.env.NEXT_PUBLIC_CDN_BASE_URL}${option.imagePath}`} 
                            // src={option.imagePath} 
                            alt={`Option ${option.label}`}
                            className="w-full h-full object-contain p-2 rounded-xl"
                          />
                          </button>
                        );
})}

                    </div>
                    <div 
                      className={`  
                        ${
                          answered <= 1 && answered >=1
                          ? 'mb-3 bg-red-100 border border-red-300 rounded-xl text-xs sm:text-lg text-red-500 py-1 px-2 not-italic'
                          : ''
                        }
                        `}>
                      {answered <= 1 && answered >=1 ? 'Pastikan untuk memilih dua opsi.' : ''}
                    </div>
                    <div className='flex justify-center sm:justify-start'>
                      <button onClick={() => checkAnswer(currentQuestion)} disabled = {isChecked === true} className={` px-3 py-2 sm:px-5 sm:py-2 rounded-md sm:rounded-lg text-xs sm:text-sm font-semibold  ${
                          isChecked === true
                          ? 'bg-blue-400 text-gray-200'
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                        }`} >Cek Jawaban</button>
                    </div>
                    <div>
                      <p>{resultText}</p>
                    </div>

                    <div className="flex justify-between items-center">
            <button
              onClick={() => 
                {
                  setCurrentQuestion(prev => Math.max(0, prev - 1))
                  resetState()
                }}
              disabled={currentQuestion === 0}
              className={`px-4 sm:px-5 py-2 text-xs sm:text-sm rounded-lg border font-medium transition ${
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
              className="px-4 sm:px-5 py-2 text-xs sm:text-sm rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium shadow hover:scale-[1.02] active:scale-95 transition"
            >
              {currentQuestion === question.length - 1 ? 'Selesai' : 'Berikutnya →'}
            </button>
          </div>
                  </div>
              </div>
            </div>
          </section>

          {/* Section: Tombol Aksi */}
          <div className="text-center space-x-4">
              <button 
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 shadow-md hover:shadow-lg transition-all"
                onClick={handleModal}
              >
                Mulai Subtes 2
              </button>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="text-center text-gray-500 text-sm py-6">
        © {new Date().getFullYear()} Psikotes Online • Kurniawan Group
      </footer>

      <Modal isOpen={isModalOpen} onClose={()=> setIsModalOpen(false)}>
        <p className='text-gray-800'>Anda akan memasuki sesi tes. Setelah tes dimulai, waktu akan berjalan dan sesi tidak dapat diulang.</p>
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
              Mulai Tes
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
          <BackGuardModal {...modalProps} />
    </div>
  );
}
