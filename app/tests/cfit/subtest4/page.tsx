'use client';
import Link from 'next/link';
import { ArrowLeft, Brain, Clock, ListChecks } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Modal from '@/app/components/Modal';
import { getContohCfit4Service } from '@/services/questions.service';
import TestHeader from '@/app/components/TestHeader';

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

export default function CFITSubtest4() {
    const router = useRouter()
    const [resultText, setResultText] = useState<string>('')
    const [answers, setAnswers] = useState<string[]>([])
    const [currentQuestion, setCurrentQuestion] = useState(0)
    const [isChecked, setIsChecked] = useState<boolean | null>(false)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [question, setQuestion] = useState<Questionz[]>([])

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
        correctAnswer: "E",
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

  const handleAnswer = (answerIndex: string) =>{
      if (isChecked === true)
        return
      console.log(answers)
  
      const newAnswers = [...answers];
      newAnswers[currentQuestion] = answerIndex;
      setAnswers(newAnswers);
  
      console.log(answers)
   }

   const checkAnswer = (questionIndex: number) => {
      const answer = answers[questionIndex]
  
      if(answer !== undefined) {
        setIsChecked(true)
      }
  
      if (answer === questions[questionIndex].correctAnswer) {
        setResultText(questions[questionIndex].explanationRight)
    } else {
        setResultText(questions[questionIndex].explanationFalse)
    }
   }

    const handleTestComplete = () => {
        router.push('/tests/cfit/subtest4/test')
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

    return(
        <div className='font-sans min-h-screen bg-gradient-to-br from-red-50 to-indigo-100 flex flex-col'>
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
                        Pada subtes ini, Anda akan dihadapkan dengan rangkaian gambar yang membentuk suatu pola.
                        Tugas Anda adalah:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                        <li>Mengamati rangkaian gambar yang disajikan</li>
                        <li>Menemukan pola atau hubungan antara gambar-gambar tersebut</li>
                        <li>Memilih gambar yang tepat untuk melengkapi rangkaian tersebut</li>
                        <li>
                        <Clock className="inline-block text-blue-500 mr-1" size={16} />
                        Waktu pengerjaan: <span className="font-semibold">3 menit</span>
                        </li>
                        <li>Jumlah soal: <span className="font-semibold">13 butir</span></li>
                    </ul>
                    </div>
                </section>

                {/* Section: Contoh Soal */}
                <section className="mb-10">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6">Contoh Soal</h2>
                    <div className="border border-gray-200 rounded-xl p-6 bg-gray-50">
                    <p className="text-sm text-gray-600 mb-4">
                        Perhatikan rangkaian gambar berikut dan tentukan gambar yang tepat untuk mengisi kotak terakhir:
                    </p>
                    {/* (perubahan) penambahan contoh soal @rezky */}
                    <div className="flex justify-center items-center bg-white rounded-lg p-5 sm:p-8 border">
                        <div className='w-full flex flex-col gap-3 text-gray-400 italic'>
                        <div>
                            <p>Jawab soal berikut dengan teliti dan cepat.</p>
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
                                key={option.label}
                                onClick={() => handleAnswer(option.label)}
                                    className={`aspect-square text-lg font-semibold rounded-xl flex items-center  justify-center transition-all border-2 ${
                                    isChecked === true && option.label === questions[currentQuestion].correctAnswer
                                    ? 'bg-green-600  text-white border-green-600 scale-105 shadow'
                                    : isChecked === true && !(option.label === questions[currentQuestion].correctAnswer) && answers[currentQuestion] === option.label
                                    ? 'bg-red-600 text-white border-red-600 scale-105 shadow'
                                    : answers[currentQuestion] === option.label
                                    ? 'bg-blue-600 text-white border-blue-600 scale-105 shadow'
                                    : isChecked === false || answers[currentQuestion] === option.label
                                    ? ' hover:border-blue-400 hover:scale-[1.02] border-slate-200 bg-slate-50'
                                    : !(isChecked === true && option.label === questions[currentQuestion].correctAnswer)
                                    ? 'border-slate-200 bg-slate-50'
                                    : ''
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
                                <button onClick={() => checkAnswer(currentQuestion)} disabled = {isChecked === true} className={`px-4 sm:px-5 py-2 text-xs sm:text-sm rounded-lg font-semibold  ${
                                    isChecked === true
                                    ? 'bg-blue-400 text-gray-200'
                                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                                    }`} >Cek Jawaban
                                </button>
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
    )
}