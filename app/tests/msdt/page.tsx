'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Brain, Info, Clock, ListChecks } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import Modal from '@/app/components/Modal';
import TestHeader from '@/app/components/TestHeader';
import { useAntiCheat } from '@/lib/useAntiCheat';
import { useClipboardPermissionGuard } from '@/lib/useClipboardPermissionGuard';
import PermissionModal from '@/app/components/PermissionModal';
import Image from 'next/image';

interface MsdtQuestion {
    id: number,
    sentences: {
        text: string
        type: 
         'G' | 'L' | 'I' | 'T' | 'V' | 'S' | 'R' | 'D' | 'C' | 'E' | 
         'N' | 'A' | 'P' | 'X' | 'B' | 'O' | 'Z' | 'K' | 'F' | 'W'

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


export default function MsdtInstructionPage() {
    const router = useRouter()
    const [currentGroup, setCurrentGroup] = useState(0)
    const [answers, setAnswers] = useState<
        { groupId: number; type: string }[]
        >([]);
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    
    const msdt: MsdtQuestion[]  = [
        {
            id: 1,
            sentences: [
                {text: 'Saya datang kek kantor lebih awal bila sedang banyak pekerjaan', type: 'R'},
                {text: 'Saya bersedia bekerja lembur bila tugas saya belum selesai', type: 'F'}
            ]
        },
        {
            id: 2,
            sentences: [
                {text: 'Saya akan menolak dengan sopan jika atasan meminta saya melakukan sesuatu yang bertentangan dengan prosedur baku perusahaan', type: 'I'},
                {text: 'Saya bersedia sedikit menyimpang dari prosedur asalkan hal tersebut membantu atasan mencapai target dengan cepat', type: 'A'}
            ]
        },
        {
            id: 3,
            sentences: [
                {text: 'Saya lebih suka menyelesaikan tugas-tugas sulit sendirian untuk membuktikan kemampuan saya kepada atasan', type: 'I'},
                {text: 'Saya merasa lebih nyaman berkolaborasi dengan rekan kerja lain meskipun hasil akhirnya diakui sebagai kesuksesan bersama', type: 'G'}
            ]
        }
    ]

    const handleStart = () => {
    router.push('/tests/msdt/test');
    };

    const handleNext = () => {
        // resetState()
        setCurrentGroup(prev => prev + 1)
    }

    const handleTestComplete = () => {
        try {
            const setLoading = setIsLoading(true)
            resetState()
            router.push('/tests/msdt/test');
        } catch(error) {
            const setLoading = setIsLoading(false)
        }
        
    };

    const handleSelection = (newType: string) => {
        setAnswers(prev => {
            const updated = [...prev];

            updated[currentGroup] = {
            groupId: currentGroup,
            type: newType,
            };

            return updated;
  });

       
    }

    useEffect(()=> {
        console.log('isi new answers: ', answers)
    }, [answers])

    const resetState = () => {
        setAnswers([]);
    }

    const handleModal = () => {
        setIsModalOpen(true)
    }

    useAntiCheat({ mode: "silent" });

    useEffect(() => {
    document.title = "Instructions - Psychological Tests";
  }, [])

    const { showModal } = useClipboardPermissionGuard()

    return(
        <div className="font-sans min-h-screen bg-gradient-to-br from-red-50 to-indigo-100 select-none">
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
            className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-6 md:p-8"
            >
            {/* Card utama */}
            <section>
                <div className="md:p-8">
                {/* Breadcrumb */}
                <div className="mb-4">
                    <nav className="text-xs text-slate-500 mb-2" aria-label="Breadcrumb">
                    
                    </nav>
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-800">
                    Tes Psikotes
                    </h2>
                    {/* <p className="mt-2 text-sm text-slate-600">
                        Tes untuk mengidentifikasi kebutuhan, motivasi, dan gaya perilaku individu dalam lingkungan kerja.
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
                        <div className="text-slate-600">15 menit</div>
                    </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-100 rounded-lg">
                    <div className="text-amber-600">
                        <Info className="w-5 h-5" />
                    </div>
                    <div className="text-sm">
                        <div className="text-slate-800 font-medium">Jumlah Soal</div>
                        <div className="text-slate-600">90 Soal</div>
                    </div>
                    </div>

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
                        Pada tes ini, Anda akan diberikan sejumlah pernyataan. Setiap kelompok berisi dua pernyataan.
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                        <li>Pilih satu kata yang paling menggambarkan diri Anda.</li>
                        <li>
                        <Clock className="inline-block text-blue-500 mr-1" size={16} />
                        Waktu pengerjaan: <span className="font-semibold">15 menit</span>
                        </li>
                    </ul>
                    </div>
                </section>

                {/* Section: Contoh Soal */}
                <section className="mb-10">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6">Contoh Soal</h2>
                    <div className="border border-gray-200 rounded-xl p-6 bg-gray-50">
                    <p className="text-sm text-gray-600 mb-4">
                        Berikut contoh tampilan soal. Pilih satu kata yang paling menggambarkan diri Anda.
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
                            <div className="grid grid-cols-1 gap-4 w-full">
                                {msdt[currentGroup].sentences.map((sentence, index) => {

                                const selected = answers[currentGroup]?.type === sentence.type;

                                return (
                                    <div
                                    className="flex gap-3 "
                                    key={index}
                                    >
                                        <button
                                        // disabled={(!isMost && mostTaken) || isLeast}
                                        onClick={() => handleSelection(sentence.type)}
                                        className={`px-4 md:px-5 py-2 rounded-md text-xs sm:text-sm font-medium border text-left text-gray-700 flex items-center justify-between p-4 transition-all  w-full  ${
                                            selected
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-gray-50 hover:bg-gray-300 border-gray-300'
                                            }`}
                                        >
                                        {sentence.text}
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
                                        className={`px-3 sm:px-5 py-2 text-xs sm:text-sm rounded-lg border font-medium transition ${
                                        currentGroup === 0
                                            ? 'opacity-50 cursor-not-allowed bg-slate-50 text-slate-400 border-slate-200'
                                            : 'bg-white border-slate-300 hover:bg-slate-50 text-slate-700'
                                        }`}
                                    >
                                        ← Sebelumnya
                                    </button>

                                    <button
                                        onClick={
                                        currentGroup === msdt.length - 1
                                            ? handleModal
                                            : handleNext
                                        }
                                        className="px-4 sm:px-5 py-2 text-xs sm:text-sm rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium shadow hover:scale-[1.02] active:scale-95 transition"
                                    >
                                        {currentGroup === msdt.length - 1 ? 'Selesai' : 'Soal Berikutnya →'}
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
        </div>
    )
}