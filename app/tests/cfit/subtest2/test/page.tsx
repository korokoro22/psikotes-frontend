'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Modal from '@/app/components/Modal';
import { storeAnswersCfit } from '@/services/answers.service';
import { getSoalCfit2Service } from '@/services/questions.service';
import TestHeader from '@/app/components/TestHeader';

interface Question {
    id: number;
    images: string[];
    correctAnswer: string[];
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

export default function CFITsubtest2Test() {
    const router = useRouter();
    const [timeLeft, setTimeLeft] = useState(180); // 3 menit
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [question, setQuestion] = useState<Questionz[]>([])
    const [answers, setAnswers] = useState<CfitAnswer[]>(
        Array.from({ length: question.length}, (_, index) => ({
            questionId: index + 1,
            answers: [],
            subtest: 2
    }))
)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const answered = answers[currentQuestion]?.answers?.length

    useEffect(()=> {
        const getCfit2Soal = async () => {
          try{
            const getQuestion = await getSoalCfit2Service()
            setQuestion(getQuestion.data.data)
          } catch(error) {
            console.log('gagal')
          }
        }
        getCfit2Soal()
      }, [])

    useEffect(() => {
        if (question.length > 0 && answers.length === 0) {
            setAnswers(
                Array.from({ length: question.length }, (_, index) => ({
                    questionId: index + 1,
                    answers: [],
                    subtest: 2
                }))
            )
        }
    }, [question])

    useEffect(() => {
        if (timeLeft <= 0) {
            handleTestComplete();
            return;
        }
        const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
        return () => clearInterval(timer);
    }, [timeLeft]);

    useEffect(() => {
        console.log('answers berubah:', answers);
        }, [answers]);

    useEffect(()=> {
        console.log('currentQuestion: ', currentQuestion)
    }, [currentQuestion]) 

    // const handleAnswer = (answerLabel: string) => {
    //     setAnswers(prev => {
    //         // Buat copy dari array
    //         const newAnswers = [...prev]
            
    //         // Pastikan index ada, jika belum ada buat entry baru
    //         if (!newAnswers[currentQuestion]) {
    //             newAnswers[currentQuestion] = {
    //                 questionId: currentQuestion + 1,
    //                 answers: [],
    //                 subtest: 2
    //             }
    //         }
    //         const currentAnswers = newAnswers[currentQuestion].answers || []
    //         // UNSELECT - jika sudah dipilih, hapus
    //         if (currentAnswers.includes(answerLabel)) {
    //             newAnswers[currentQuestion] = {
    //                 ...newAnswers[currentQuestion],
    //                 answers: currentAnswers.filter(x => x !== answerLabel)
    //             }
    //             return newAnswers
    //         }
            
    //         // TOLAK PILIHAN KE-3 - maksimal 2 jawaban
    //         if (currentAnswers.length === 2) {
    //             return prev
    //         }

    //         // TAMBAH JAWABAN
    //         newAnswers[currentQuestion] = {
    //             ...newAnswers[currentQuestion],
    //             answers: [...currentAnswers, answerLabel]
    //         }
    //         return newAnswers
    //     })
    // } 
    const handleAnswer = (answerLabel: string) => {
    const newAnswers = [...answers];
    
    if (!newAnswers[currentQuestion]) {
        newAnswers[currentQuestion] = {
            questionId: currentQuestion + 1,
            answers: [],
            subtest: 2
        };
    }
    
    const currentAnswers = newAnswers[currentQuestion].answers || [];
    
    if (currentAnswers.includes(answerLabel)) {
        newAnswers[currentQuestion] = {
            ...newAnswers[currentQuestion],
            answers: currentAnswers.filter(x => x !== answerLabel)
        };
    } else if (currentAnswers.length < 2) {
        newAnswers[currentQuestion] = {
            ...newAnswers[currentQuestion],
            answers: [...currentAnswers, answerLabel]
        };
    }

    setAnswers(newAnswers);
    localStorage.setItem('tempAnswers', JSON.stringify(newAnswers));
};

    const handleTestComplete = async () => {
        try {
              const testSession = sessionStorage.getItem('testSession')
              localStorage.removeItem('tempAnswers')
              if(!testSession) {
                return (console.log('gagal'))
              }
        
              const testSessionParsed = JSON.parse(testSession)
              const sessionId = testSessionParsed.sessionId
              const res = await storeAnswersCfit(sessionId, answers)
              console.log('ini jawaban subtest2: ', res)
              router.push('/tests/cfit/subtest3');
            } catch(err:any) {
              console.log('error: ', err)
            }
    };

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remaining = seconds % 60;
        return `${minutes}:${remaining.toString().padStart(2, '0')}`;
    };

    const handleModal = () => {
        setIsModalOpen(true)
    }

    const handleNext = () => {
    setCurrentQuestion(prev => prev + 1)
  }
    const progressPercent = ((currentQuestion + 1) / question.length) * 100;

    useEffect(()=> {
    const temp = localStorage.getItem('tempAnswers')
    if(temp !== null) {
      const answer = JSON.parse(temp)
      setAnswers(answer)
    }
  }, [])

    return (
        <div className="font-sans min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
            <header className='bg-white shadow-sm py-4 sticky top-0 z-10'>
                <TestHeader />
            </header>
            <main className="container mx-auto px-2 py-4">
                <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-2xl p-2 md:p-4">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between items-center mb-8">
                        <div className='text-center md:text-left'>
                            <h1 className="text-2xl font-bold text-slate-800">SUBTES 2</h1>
                            <p className="text-sm text-slate-500">Jawab soal berikut dengan teliti dan cepat.</p>
                        </div>
                        <div className='flex gap-x-3'>
                            <div className="mt-4 md:mt-0 bg-slate-100 text-slate-800 px-3 py-1 rounded-xl font-mono text-base tracking-wider border border-slate-200">
                                ⏱ {formatTime(timeLeft)}
                            </div>
                            <div className="mt-4 md:mt-0 bg-slate-100 text-slate-800 px-3 py-1 rounded-xl font-mono text-base tracking-wider border border-slate-200">
                                <span>Soal: {currentQuestion + 1} / {question.length}</span>
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

                    {/* Soal */}
                    <div className="border rounded-2xl bg-white shadow-sm p-6 mb-8">
                        <div className="text-center text-slate-700 mb-6">
                            Pilih dua gambar yang paling tepat yang memiliki kesamaan hubungan:
                        </div>

                        {/* Pilihan Jawaban */}
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                            {/* {[1, 2, 3, 4, 5].map(option => { */}
                            {question[currentQuestion]?.options?.map((option) => {
                                const selected = answers[currentQuestion]?.answers?.includes(option.label);
                                return (
                                    <button
                                    key={option.label}
                                    onClick={() => handleAnswer(option.label)}
                                    className={`aspect-square w-35 md:w-full text-lg font-semibold rounded-xl flex items-center justify-center transition-all border-2 p-3 ${
                                        selected
                                            ? 'bg-blue-600 text-white border-blue-600 scale-105 shadow'
                                            : 'border-slate-200 bg-slate-50 hover:border-blue-400 hover:scale-[1.02]'
                                        }`}
                                >
                                    <div className='pt-2 h-full'>
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
                        <div 
                            className={`  
                                ${
                                answered <= 1 && answered >=1
                                ? 'mt-4 bg-red-100 border border-red-300 rounded-xl text-red-500 py-1 px-2 text-base not-italic'
                                : ''
                                }
                                `}>
                            {answered <= 1 && answered >=1 ? 'Pastikan untuk memilih dua opsi.' : ''}
                        </div>
                    </div>

                    {/* Navigasi Soal */}
                    <div className="flex justify-between items-center">
                        <button
                            onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
                            disabled={currentQuestion === 0}
                            className={`px-4 py-2 rounded-lg border text-sm font-medium transition ${currentQuestion === 0
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
            </main>

            <Modal isOpen={isModalOpen} onClose={()=> setIsModalOpen(false)}>
                <p className='text-gray-800'>Tes telah selesai. Silakan lanjut ke tahap berikutnya.</p>
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
                        Subtes berikutnya
                    </button>
                </div>
            </Modal>
        </div>
    );
}
