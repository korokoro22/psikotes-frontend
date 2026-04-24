'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { registerPeserta } from '@/services/peserta.service'
import { number } from 'framer-motion'
import { useAntiCheat } from '@/lib/useAntiCheat'
import PermissionModal from '../components/PermissionModal'
import { useClipboardPermissionGuard } from '@/lib/useClipboardPermissionGuard'

export default function TestForm() {

  const [data, setData] = useState<any>(null)
  const [errorMessage, setErrorMessage] = useState('')

  const imgUrl = data?.data[0]?.imageUrl
  const [showPermissionModal, setShowPermissionModal] = useState(false)
  const router = useRouter()
  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    tanggalLahir: '',
    jenisKelamin: '',
    unit: '',
    usia: '',
    pendidikanTerakhir: '',
    jurusan: '',
    posisi: '',
    tokenPeserta: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: name === 'usia' ? Number(value) : value }))
    console.log(formData)
  }

  const handleBlank = () => {
    // if (formData.)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setIsSubmitting(true)
      const form = {
        nama: formData.nama,
        email: formData.email,
        tanggalLahir: formData.tanggalLahir,
        jenisKelamin: formData.jenisKelamin,
        unit: formData.unit,
        usia: parseInt(formData.usia),
        pendidikanTerakhir: formData.pendidikanTerakhir,
        jurusan: formData.jurusan,
        posisi: formData.posisi,
        tokenPeserta: formData.tokenPeserta
      }
      const res = await registerPeserta(form)

      sessionStorage.setItem('testSession', 
        JSON.stringify({
          sessionId: res.data.data.sessionId,
          pesertaId: res.data.data.pesertaId,
          tests: res.data.data.tests,
          currentIndex: 0
        })
      )

      router.push('/tests/welcome')

    } catch (err:any) {
      // alert(err.response?.data?.message || 'Login gagal');
      setErrorMessage(err.response?.data?.message || 'Login gagal')
      } finally {
        setIsSubmitting(false);
      }
  }

  useEffect(() => {
    document.title = "Registration - Psychological Tests";
  }, []);

  useAntiCheat({ mode: "silent" });
  const { showModal } = useClipboardPermissionGuard();

  const checkClipboardPermission = async (): Promise<PermissionState> => {
    try {
      const permStatus = await navigator.permissions.query({
        name: "clipboard-read" as PermissionName,
      });
      return permStatus.state; // "granted" | "denied" | "prompt"
    } catch {
      return "prompt"; // browser tidak support
    }
  };

  useEffect(() => {
    const check = async () => {
      const state = await checkClipboardPermission();
      
      if (state !== "granted") {
        setShowPermissionModal(true); // tampilkan modal
      }
    };

    check();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 px-4 py-8">
      <div className="relative w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden border border-indigo-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-center py-4">
          <h1 className="text-xl font-bold tracking-wide">Data Diri Peserta</h1>
          <p className="text-xs opacity-90">Isi data sebelum memulai tes</p>
        </div>

        {/* Form */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMessage === '' ? '' :
            <div className='bg-red-200 py-2 text-sm text-red-800 font-medium rounded-md flex'>
              <p className='ml-2'>{errorMessage}.</p>
            </div>
            }
            
            {/* Nama */}
            <div>
              <label htmlFor="nama" className="block text-sm font-medium text-gray-700 mb-1">
                Nama Lengkap
              </label>
              <input
                type="text"
                name="nama"
                id="nama"
                required
                value={formData.nama}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 bg-gray-50 py-2 px-3 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition text-sm"
                placeholder="Masukkan nama lengkap"
                autoComplete='off'
              />
            </div>

            {/* email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 bg-gray-50 py-2 px-3 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition text-sm"
                placeholder="Masukkan email"
                autoComplete='off'
              />
            </div>

            {/* tanggal lahir */}
            <div>
              <label htmlFor="tanggalLahir" className="block text-sm font-medium text-gray-700 mb-1">
                tanggalLahir
              </label>
              <input 
                type="date" 
                name='tanggalLahir'
                id='tanggalLahir'
                required
                value={formData.tanggalLahir}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 bg-gray-50 py-2 px-3 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition text-sm"
                placeholder="Masukkan tanggal Lahir"
                />
            </div>

            {/* Jenis Kelamin */}
              <div>
                <label htmlFor="jenisKelamin" className="block text-sm font-medium text-gray-700 mb-1">
                  Jenis Kelamin
                </label>
                <select
                  name="jenisKelamin"
                  id="jenisKelamin"
                  required  
                  value={formData.jenisKelamin}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 bg-gray-50 py-2 px-3 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition text-sm"
                >
                  <option value="">Pilih Jenis Kelamin</option>
                  <option value="LAKI_LAKI">Laki-laki</option>
                  <option value="PEREMPUAN">Perempuan</option>
                </select>
              </div>

            {/* Unit */}
              <div>
                <label htmlFor="jenisKelamin" className="block text-sm font-medium text-gray-700 mb-1">
                  Perusahaan yang dilamar
                </label>
                <select
                  name="unit"
                  id="unit"
                  required  
                  value={formData.unit}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 bg-gray-50 py-2 px-3 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition text-sm"
                >
                  <option value="">Pilih Perusahaan</option>
                  <option value="SMP">PT. Samamaju Prima</option>
                  <option value="MPP">PT. Makassar Putra Prima</option>
                  <option value="MMPP">PT. Makassar Mega Putra Prima</option>
                  <option value="IMP">PT. Indo Mega Prima</option>
                  <option value="PPH">PT. Putra Prima Hotel</option>
                  <option value="ACS">PT. Aptana Citra Solusindo</option>
                </select>
              </div>

            {/* Usia */}
            <div>
              <label htmlFor="usia" className="block text-sm font-medium text-gray-700 mb-1">
                Usia
              </label>
              <input
                type="text"
                name="usia"
                id="usia"
                required
                value={formData.usia}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 bg-gray-50 py-2 px-3 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition text-sm"
                placeholder="Contoh: 20"
                autoComplete='off'
              />
            </div>

            

            {/* Pendidikan */}
            <div>
              <label htmlFor="pendidikanTerakhir" className="block text-sm font-medium text-gray-700 mb-1">
                Pendidikan Terakhir
              </label>
              <input
                type="text"
                name="pendidikanTerakhir"
                id="pendidikanTerakhir"
                required
                value={formData.pendidikanTerakhir}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 bg-gray-50 py-2 px-3 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition text-sm"
                placeholder="Contoh: SMA / S1"
                autoComplete='off'
              />
            </div>

            {/* Pekerjaan */}
            <div>
              <label htmlFor="jurusan" className="block text-sm font-medium text-gray-700 mb-1">
                Jurusan
              </label>
              <input
                type="text"
                name="jurusan"  // (perubahan) kesalahan penulisan name, sebelumnya jursan @rezky
                id="jurusan"
                required
                value={formData.jurusan}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 bg-gray-50 py-2 px-3 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition text-sm"
                placeholder="Contoh: Teknik Informatika"
                autoComplete='off'
              />
            </div>

            {/* Pendidikan */}
            <div>
              <label htmlFor="posisi" className="block text-sm font-medium text-gray-700 mb-1">
                Posisi yang dilamar
              </label>
              <input
                type="text"
                name="posisi"
                id="posisi"
                required
                value={formData.posisi}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 bg-gray-50 py-2 px-3 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition text-sm"
                placeholder="Contoh: Fullstack Developer"
                autoComplete='off'
              />
            </div>

            {/* Token */}
            <div>
              <label htmlFor="tokenPeserta" className="block text-sm font-medium text-gray-700 mb-1">
                Token Tes
              </label>
              <input
                type="text"
                name="tokenPeserta"
                id="tokenPeserta"
                required
                value={formData.tokenPeserta}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 bg-gray-50 py-2 px-3 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition text-sm"
                placeholder="Contoh: 123"
                autoComplete='off'
              />
            </div>

            {/* Tombol */}
            <button
              type="submit"
              disabled={isSubmitting}
              // disabled={!isFormValid}
              className={`w-full py-2 text-sm font-semibold text-white rounded-md shadow-md  
                ${
                  isSubmitting
                  ? 'bg-slate-500'
                  : 'transition-all duration-200 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
                }`}
            >
              {isSubmitting ? 'Memproses...' : 'Mulai Tes'}
            </button>
          </form>
        </div>
      </div>
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
