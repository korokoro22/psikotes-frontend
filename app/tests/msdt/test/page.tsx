'use client'

import { AnimatePresence, motion } from "framer-motion"
import { ArrowLeft, Brain } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Modal from "@/app/components/Modal"
import TestHeader from "@/app/components/TestHeader"
import { getMsdtQuestionsService } from "@/services/questions.service"
import { storeAnswersMsdt, updateStatusTest, triggerN8n } from "@/services/answers.service"


interface MsdtQuestion {
    id: number,
    sentences: {
        text: string
        type: 
         'G' | 'L' | 'I' | 'T' | 'V' | 'S' | 'R' | 'D' | 'C' | 'E' | 
         'N' | 'A' | 'P' | 'X' | 'B' | 'O' | 'Z' | 'K' | 'F' | 'W'

    }[]
}

interface MsdtQuestions {
    id: number
    questionIndex: number
    option: {
        sentences: string
        optionType: 1 | 2
    }[]
}

export default function MsdtTestPage() {
    const router = useRouter()
    const [currentGroup, setCurrentGroup] = useState(0)
    const [answers, setAnswers] = useState<
        { groupId: number; type: number }[]
        >([]);
    const [timeLeft, setTimeLeft] = useState(300); // 5 menit
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [questions, setQuestions] = useState<MsdtQuestions[]>([])
    const [isOvertime, setIsOvertime] = useState(false);
    const [overtime, setOvertime] = useState(0);


    const msdt: MsdtQuestion[]  = [
        {
            id: 1,
            sentences: [
                {text: 'Saya suka menjadi pendengar', type: 'R'},
                {text: 'Saya mengerjakan semua pekerjaan sekaligus', type: 'F'}
            ]
        },
        {
            id: 2,
            sentences: [
                {text: 'Saya orangnya teliti', type: 'I'},
                {text: 'Saya ingin menjadi pemimpin', type: 'A'}
            ]
        },
        {
            id: 3,
            sentences: [
                {text: 'Saya ingin bebas', type: 'I'},
                {text: 'Saya suka hal yang baru', type: 'G'}
            ]
        }
    ]

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

    useEffect(()=> {
            console.log('isi new answers: ', answers)
        }, [answers])

    useEffect(() => {
            const getPapikostickQuestions = async () => {
                try {
                    const getQuestion = await getMsdtQuestionsService()
                    setQuestions(getQuestion.data.data)
                } catch (error) {
                    console.log('gagal')
                }
            }
            getPapikostickQuestions()
        }, [])

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    const handleSelection = (newType: 1 | 2) => {
        const updated = [...answers]
        updated[currentGroup] = {
            groupId: currentGroup + 1,
            type: newType
        }
        setAnswers(updated)
        localStorage.setItem('tempAnswers', JSON.stringify(updated))

        // setAnswers(prev => {
        //     const updated = [...prev];

        //     updated[currentGroup] = {
        //     groupId: currentGroup+1,
        //     type: newType,
        //     };

        //     return updated; 
        // })
    }

    // const handleStart = () => {
    // router.push('/tests/mbti/test');
    // };

    const handleModal = () => {
        setIsModalOpen(true)
    }

    const handleNext = () => {
        setCurrentGroup(prev => prev + 1)
    }
    
    const handleTestComplete = async() => {
        const testSession = sessionStorage.getItem('testSession')
        
        if(!testSession)
            return alert('gagal')
        
        const testSessionParsed = JSON.parse(testSession)
        const tests = testSessionParsed.tests[testSessionParsed.currentIndex]
        const sessionId = testSessionParsed.sessionId
        console.log('ini test4:', tests)
        const res = await storeAnswersMsdt(sessionId, answers)

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
    };

    useEffect(()=> {
        const temp = localStorage.getItem('tempAnswers')
        if (temp !== null) {
            const answer = JSON.parse(temp)
            setAnswers(answer)
        }
    }, [])

    return(
        <div className="font-sans min-h-screen bg-gray-50">
            <header className="bg-white shadow-sm py-4 sticky top-0 z-10">
                <TestHeader />
            </header>

            <main className="container mx-auto px-6 py-10">
                <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg p-6 md:p-8">
                {/* Header Info */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <div className="text-center md:text-left">
                    <h2 className="text-2xl font-bold text-gray-800">Instruksi</h2>
                    <p className="text-gray-500 text-sm">
                        Pilih kalimat yang paling menggambarkan diri Anda.
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
                    Kelompok {currentGroup + 1} dari {questions.length}
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${((currentGroup + 1) / questions.length) * 100}%` }}
                    />
                    </div>
                </div>

                {/* Soal */}
                <section className="mb-10">
                    <div className="flex justify-center items-center flex-col bg-white rounded-lg text-gray-400 italic">
                        <div className='w-full'>
                        <AnimatePresence mode="wait">
                            <motion.div
                            key={currentGroup}
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -40 }}
                            transition={{ duration: 0.4 }}
                            >
                                <div>

                                </div>
                            <div className="grid grid-cols-1 gap-4 w-full">
                                {questions[currentGroup]?.option.map((opt, index) => {

                                const selected = answers[currentGroup]?.type === opt.optionType;

                                return (
                                    <div
                                    className="flex gap-3 "
                                    key={index}
                                    >
                                        <button
                                        // disabled={(!isMost && mostTaken) || isLeast}
                                        onClick={() => handleSelection(opt.optionType)}
                                        className={`p4 text-left rounded-md text-lg font-medium border border-gray-300 text-gray-700 flex items-center justify-between p-4 transition-all  w-full  ${
                                            selected
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-gray-50 hover:bg-gray-300'
                                            }`}
                                        >
                                        {opt.sentences}
                                        </button>

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
                                            // resetState()
                                        }}
                                        disabled={currentGroup === 0}
                                        className={`px-4 py-2 rounded-lg border text-sm font-medium transition ${
                                        currentGroup === 0
                                            ? 'px-4 sm:px-5 py-2 text-xs sm:text-sm opacity-50 cursor-not-allowed bg-slate-50 text-slate-400 border-slate-200'
                                            : 'bg-white border-slate-300 hover:bg-slate-50 text-slate-700'
                                        }`}
                                    >
                                        ← Sebelumnya
                                    </button>

                                    <button
                                        disabled= {!(answers[currentGroup])}
                                        onClick={
                                        currentGroup === questions.length - 1
                                            ? handleModal
                                            : handleNext
                                        }
                                        className={`px-4 py-2 rounded-lg bg-gradient-to-r  text-white shadow hover:scale-[1.02] active:scale-95 transition
                                            ${
                                            !(answers[currentGroup])
                                                ? 'cursor-not-allowed bg-gray-400'
                                                : 'from-blue-600 to-indigo-600'
                                            }
                                            `}
                                    >
                                        {currentGroup === questions.length - 1 ? 'Selesai' : 'Soal Berikutnya →'}
                                    </button>
                                </div>
                        </div> 
                    </div>
                </section>
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
                    Selesai
                </button>
            </div>
        </Modal>

        </div>
    )
}