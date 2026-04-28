'use client';
import Link from 'next/link';
import { ArrowLeft, Brain, Clock, ListChecks } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Modal from '@/app/components/Modal';
import { getContohCfit4Service } from '@/services/questions.service';
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
  correctAnswer: string;
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

type CfitAnswer = {
  questionId: number
  answers: string[]
  subtest: number
}

export default function CFITSubtest4() {
    const { modalProps } = useBackGuard();
    const router = useRouter()
    const [resultText, setResultText] = useState<string>('')
     const [question, setQuestion] = useState<Questionz[]>([])
    const [answers, setAnswers] = useState<CfitAnswer[]>(
            Array.from({ length: question.length}, (_, index) => ({
              questionId: index + 1,
              answers: [],
              subtest: 1
            }))
          );
    const [currentQuestion, setCurrentQuestion] = useState(0)
    const [isChecked, setIsChecked] = useState<boolean | null>(false)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    // Data dummy
  const questions: Question[] = [
    {
        id: 1,
        images: ['q1-1.png'],
        correctAnswer: "C",
        explanationRight: 'Benar karena opsi yang dipilih benar',
        explanationFalse: 'Salah karena opsi yang dipilih tidak tepat'
      },
      {
        id: 2,
        images: ['q1-1.png'],
        correctAnswer: "D",
        explanationRight: 'Benar karena opsi yang dipilih benar',
        explanationFalse: 'Salah karena opsi yang dipilih tidak tepat'
      },
      {
        id: 3,
        images: ['q1-1.png'],
        correctAnswer: "B",
        explanationRight: 'Benar karena opsi yang dipilih benar',
        explanationFalse: 'Salah karena opsi yang dipilih tidak tepat'
      }
  ];

   const handleAnswer = (answersIndex: string) =>{
      setAnswers(prev => {
        const updated = [...prev];
        
        // Toggle: jika klik jawaban yang sama, hapus. Jika beda, simpan yang baru.
        const currentAnswers = prev[currentQuestion]?.answers[0];
        
        updated[currentQuestion] = {
          questionId: currentQuestion + 1,
          answers: currentAnswers === answersIndex ? [] : [answersIndex], // ✅ bandingkan dengan answersIndex
          subtest: 1
        };

        return updated;
      });
   }

   const checkAnswer = (questionIndex: number) => {
      const answer = answers[questionIndex]
    
        if(answer !== undefined) {
          setIsChecked(true)
        }
    
        if (answer.answers[0] === questions[questionIndex]?.correctAnswer && answers[currentQuestion].answers.length > 0) {
          setResultText(questions[questionIndex].explanationRight)
      } else if (answer.answers[0] !== questions[questionIndex]?.correctAnswer && answers[currentQuestion].answers.length > 0) {
          setResultText(questions[questionIndex].explanationFalse)
      }

    }

    const handleTestComplete = () => {
        try {
            const setLoading = setIsLoading(true)
            router.push('/tests/cfit/subtest4/test')
        } catch (error) {}
            const setLoading = setIsLoading(true)
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
        const getCfit4Contoh = async () => {
          try {
            const getQuestion = await getContohCfit4Service()
            setQuestion(getQuestion.data.data)
          } catch (error) {
              console.log('gagal')
          }
        }
        getCfit4Contoh()
      }, [])

      useEffect(() => {
    if (question.length > 0 && answers.length === 0) {
      setAnswers(
        Array.from({ length: question.length }, (_, index) => ({
          questionId: index + 1,
          answers: [],
          subtest: 1
        }))
      );
    }
  }, [question]);

  useAntiCheat({ mode: "silent" });

  useEffect(() => {
    document.title = "Instructions - Psychological Tests";
  }, [])

  const { showModal } = useClipboardPermissionGuard();

    return(
        <div className='font-sans min-h-screen bg-gradient-to-br from-red-50 to-indigo-100 flex flex-col select-none'>
            {/* header */}
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
                    Petunjuk Subtes 4
                    </h2>

                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                    <p className="text-gray-700 mb-4">
                        Pada subtes ini, Anda akan mengamati posisi sebuah titik di antara susunan bangunan. Baca dengan saksama petunjuk di bawah ini:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                        <li>Setiap soal menyajikan susunan beberapa bangunan beserta sebuah titik.</li>
                        <li>Perhatikan dengan saksama posisi titik tersebut berada di area bangunan mana saja.</li>
                        <li>Pilih gambar dari opsi jawaban yang memiliki posisi titik yang sama persis dengan soal.</li>
                        <li>Klik gambar untuk memilih jawaban.</li>
                        <li>Jika ingin mengubah, cukup klik pada gambar pilihan yang lain.</li>
                        <li>
                        <Clock className="inline-block text-blue-500 mr-1" size={16} />
                        Waktu pengerjaan: <span className="font-semibold">2 menit 30 detik</span>
                        </li>
                        <li>Jumlah soal: <span className="font-semibold">10 butir</span></li>
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
                    {/* (perubahan) penambahan contoh soal @rezky */}
                    <div className="flex justify-center items-center bg-white rounded-lg p-5 sm:p-8 border">
                        <div className='w-full flex flex-col gap-3 text-gray-400 italic'>
                        <div>
                            <p className='text-center'>Amati posisi titik di antara bangunan berikut dan cari gambar dengan letak titik yang serupa dengan soal:</p>
                        </div>
                        <div className="w-full grid grid-cols-1 md:grid-cols-1 gap-4 mb-6 text-gray-400 italic m-auto">
                            <div
                                className="w-30 md:w-50 aspect-square bg-slate-100 rounded-xl mx-auto flex items-center justify-center text-slate-400 border border-slate-200"
                            >
                                <img 
                                    src={`${process.env.NEXT_PUBLIC_CDN_BASE_URL}${question[currentQuestion]?.imagePath}`} 
                                    alt=""
                                    className='w-full h-full rounded-lg' />
                            </div>
                        </div>
                            <div className="text-center text-slate-700 mb-6">
                            Pilih gambar yang paling tepat untuk melengkapi pola:
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 w-full">
                            {question[currentQuestion]?.options?.map((option) => (
                                <button
                                disabled= {isChecked === true}
                                key={option.label}
                                onClick={() => handleAnswer(option.label)}
                                    className={`aspect-square font-semibold rounded-xl flex items-center 
                                        justify-center transition-all border-2 border-slate-200 ${
                                        // 1. Sudah dicek & ini jawaban benar
                                        isChecked && option.label === questions[currentQuestion].correctAnswer
                                        ? 'bg-green-600 text-white border-green-600 scale-105 shadow'
                                        // 2. Sudah dicek & ini jawaban yang dipilih tapi salah
                                        : isChecked && answers[currentQuestion]?.answers[0] === option.label
                                        ? 'bg-red-600 text-white border-red-600 scale-105 shadow'
                                        // 3. Belum dicek & ini jawaban yang dipilih (biru) ✅
                                        : answers[currentQuestion]?.answers[0] === option.label
                                        ? 'bg-blue-600 text-white border-blue-600 scale-105 shadow'
                                        // 4. Default
                                        : 'hover:border-blue-400 hover:scale-[1.02] border-slate-200 bg-slate-50'
                                    }`}
                                >
                                    <img 
                                        src={`${process.env.NEXT_PUBLIC_CDN_BASE_URL}${option.imagePath}`} 
                                        // src={option.imagePath} 
                                        alt={`Option ${option.label}`}
                                        className="w-full h-full object-contain p-2 rounded-xl"
                                    />
                                </button>
                            ))}
                            </div>

                            <div className='flex justify-center sm:justify-start'>
                                <button 
                                    onClick={() => checkAnswer(currentQuestion)} 
                                    disabled = {isChecked === true || answers[currentQuestion]?.answers.length <= 0} 
                                    className={`px-3 py-2 sm:px-5 sm:py-2 rounded-md sm:rounded-lg text-xs sm:text-sm font-medium bg-blue-600 hover:bg-blue-700 shadow hover:scale-[1.02] active:scale-95 transition${
                                    isChecked === true || answers[currentQuestion]?.answers.length <= 0
                                    ? ' text-gray-400 hover:bg-blue-900 bg-blue-900 active:scale-100 hover:scale-none'
                                    : ' text-white'
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
                        Mulai Subtes 4
                    </button>
                </div>
                </motion.div>
            </main>

            <Modal isOpen={isModalOpen} onClose={()=> setIsModalOpen(false)}>
                <p className='text-gray-800'>Anda akan memasuki sesi tes. Setelah tes dimulai, waktu akan berjalan dan sesi tidak dapat diulang.</p>
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
    )
}