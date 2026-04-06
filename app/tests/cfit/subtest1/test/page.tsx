'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Modal from '@/app/components/Modal';
import { storeAnswersCfit } from '@/services/answers.service';
import { getSoalCfit1Service } from '@/services/questions.service';
import TestHeader from '@/app/components/TestHeader';

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

export default function CFITSubtest1Test() {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState(180); // satuan detik, 3 menit
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [question, setQuestion] = useState<Questionz[]>([])

  const [answers, setAnswers] = useState<CfitAnswer[]>(
    Array.from({ length: question.length}, (_, index) => ({
      questionId: index + 1,
      answers: [],
      subtest: 1
    }))
  );
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(()=> {
    const getCfit1Soal = async () => {
      try{
        const getQuestion = await getSoalCfit1Service()
        setQuestion(getQuestion.data.data)
      } catch(error) {
        console.log('gagal')
      }
    }
    getCfit1Soal()
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

  useEffect(() => {
    if (timeLeft <= 0) {
      handleTestComplete();
      return;
    }
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleAnswer = (answers: string) => {
        setAnswers(prev => {
            const updated = [...prev];

            updated[currentQuestion] = {
            questionId: currentQuestion + 1,
            answers: [answers],
            subtest: 1
            };

            return updated; 
        })
    }

  const handleTestComplete = async () => {
    try {
      const testSession = sessionStorage.getItem('testSession')
      
      if(!testSession) {
        return (console.log('gagal'))
      }

      const testSessionParsed = JSON.parse(testSession)
      const sessionId = testSessionParsed.sessionId
      const res = await storeAnswersCfit(sessionId, answers)
      console.log('ini jawaban subtest1: ', res)
      router.push('/tests/cfit/subtest2');
    } catch(err:any) {
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

  

  useEffect(()=> {
    console.log('isi data: ', question.length)
  }, [question])

  const progressPercent = ((currentQuestion + 1) / question.length) * 100;

  const handleModal = () => {
    setIsModalOpen(true)
  }

  return (
    <div className="font-sans min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <header
        className='bg-white shadow-sm py-4 sticky top-0 z-10'
      >
        <TestHeader />
      </header>
      <main className="container mx-auto px-2 py-4">
        <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-2xl p-2 md:p-4">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-3">
            <div>
              <h1 className="text-2xl font-bold text-slate-800 text-center sm:text-left">SUBTES 1</h1>
              <p className="text-sm text-slate-500">Temukan pola urutan pada rangkaian gambar berikut.</p>
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

          {/* Soal */}
          <div className="border rounded-2xl bg-white shadow-sm p-3 mb-4 flex flex-col gap-y-4">
            <p className='text-center text-gray-600 italic '>Perhatikan rangkaian gambar berikut dan tentukan gambar yang tepat untuk gambar selanjutnya.</p>
            <div className="flex justify-center md:grid-cols-1 gap-3 mb-2">
                <div
                  className=" bg-slate-100 w-100 rounded-xl flex items-center justify-center text-slate-400 border border-slate-200"
                >
                  <img 
                        src={`${process.env.NEXT_PUBLIC_CDN_BASE_URL}${question[currentQuestion]?.imagePath}`} 
                        alt=""
                        className='w-full h-full rounded-lg' />
                </div>
            </div>

            <div className="text-center text-slate-700 mb-2">
              Pilih gambar yang paling tepat untuk melengkapi pola:
            </div>

            {/* Pilihan Jawaban */}
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-4 place-items-center">
               
              {question[currentQuestion]?.options?.map((option) => (
                <button
                    key={option.label}
                    onClick={() => handleAnswer(option.label)}
                    className={`aspect-square w-30 text-lg font-semibold rounded-xl flex items-center justify-center transition-all border-2 ${
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
              ))}
            </div>
          </div>

          {/* Navigasi Soal */}
          <div className="flex justify-between items-center">
            <button
              onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
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
                  : () => setCurrentQuestion(prev => prev + 1)
              }
              className="px-5 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium shadow hover:scale-[1.02] active:scale-95 transition"
            > 
            {/* lanjut untuk cfit subtes 2 dst */}
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
