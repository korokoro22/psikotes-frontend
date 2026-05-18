'use client'

import { div } from "framer-motion/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { postToken } from "@/services/token.service";
import { getFormToken } from "@/services/token.service";

export default function AdminForm() {

    const router = useRouter()
    const [formData, setFormData] = useState<{
        tests: string[],
        kuota: number,
        activeDate: string,
        expiredDate: string

    }>({
        tests: [],
        kuota: 0,
        activeDate: '',
        expiredDate: ''
    })

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
    const { name, value, type } = e.target

    // checkbox (array tests)
    if (type === 'checkbox') {
        const checked = (e.target as HTMLInputElement).checked

        setFormData(prev => ({
        ...prev,
        tests: checked
            ? [...prev.tests, value]
            : prev.tests.filter(item => item !== value)
        }))
        return
    }

    // input number (kuota)
    if (type === 'number') {
        setFormData(prev => ({
        ...prev,
        [name]: Number(value) // 🔑 casting ke number
        }))
        return
    }



    // input biasa
    setFormData(prev => ({
        ...prev,
        [name]: value
    }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
        setIsSubmitting(true)

        const payload = {
            ...formData,
            activeDate: new Date(formData.activeDate).toISOString(),  // ✅
            expiredDate: new Date(formData.expiredDate).toISOString(), // ✅
        }

        const res = await postToken(payload) // ✅ kirim payload bukan formData
        setIsLoading(false)
        router.push('/admin/tokentes')

    } catch(err:any){

    } finally {
        setIsLoading(false)
        setIsSubmitting(false)
    }
}


    useEffect(()=> {
        console.log('Ini isi form data: ', formData)
    }, [formData])

    useEffect(()=> {
        const getForm = async () => {
                try {
                    const token = await getFormToken()
                } catch( err:any) {
                    router.push('/login')
                }
            }
            getForm() 
    } , [])

    useEffect(() => {
    document.title = "Form Token Tes - Psychological Tests";
  }, [])

    return (
        <div>

  {/* Header */}
  <div className="mb-10 border-b border-gray-200 pb-5">

    <h1 className="text-4xl font-bold tracking-tight text-gray-800">
      Buat Token
    </h1>

    <p className="mt-2 text-sm text-gray-500">
      Buat token baru untuk akses tes psikotes peserta
    </p>

  </div>

  {/* Form Container */}
  <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">

    <form
      onSubmit={handleSubmit}
      className="space-y-8"
    >

      {/* Jenis Tes */}
      <div>

        <div className="mb-4">
          <p className="text-lg font-semibold text-gray-800">
            Jenis Tes
          </p>

          <p className="text-sm text-gray-500">
            Pilih tes yang akan dimasukkan ke token
          </p>
        </div>

        {/* Checkbox */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">

          {/* Item */}
          <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 transition-all duration-200 hover:border-blue-300 hover:bg-blue-50">
            <input type="checkbox" id="cfit" value="CFIT" name="tes" onChange={handleChange} />
            <span className="font-medium text-gray-700">
              CFIT
            </span>
          </label>

          <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 transition-all duration-200 hover:border-blue-300 hover:bg-blue-50">
            <input type="checkbox" id="disc" value="DISC" name="tes" onChange={handleChange} />
            <span className="font-medium text-gray-700">
              DISC
            </span>
          </label>

          <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 transition-all duration-200 hover:border-blue-300 hover:bg-blue-50">
            <input type="checkbox" id="kraepelin" value="KRAEPELIN" name="tes" onChange={handleChange} />
            <span className="font-medium text-gray-700">
              Kraepelin
            </span>
          </label>

          <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 transition-all duration-200 hover:border-blue-300 hover:bg-blue-50">
            <input type="checkbox" id="mbti" value="MBTI" name="tes" onChange={handleChange} />
            <span className="font-medium text-gray-700">
              MBTI
            </span>
          </label>

          <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 transition-all duration-200 hover:border-blue-300 hover:bg-blue-50">
            <input type="checkbox" id="msdt" value="MSDT" name="tes" onChange={handleChange} />
            <span className="font-medium text-gray-700">
              MSDT
            </span>
          </label>

          <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 transition-all duration-200 hover:border-blue-300 hover:bg-blue-50">
            <input type="checkbox" id="papi" value="PAPIKOSTICK" name="tes" onChange={handleChange} />
            <span className="font-medium text-gray-700">
              PapiKostick
            </span>
          </label>

        </div>

        {/* Selected */}
        {formData.tests.length > 0 && (

          <div className="mt-5 flex flex-wrap gap-3 rounded-2xl border border-gray-200 bg-gray-50 p-4">

            {formData.tests.map((test, index) => (

              <div
                key={index}
                className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700"
              >
                ({index + 1}) {test}
              </div>

            ))}

          </div>

        )}

      </div>

      {/* Kuota */}
      <div>

        <label
          htmlFor="kuota"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Kuota Peserta
        </label>

        <input
          type="number"
          name="kuota"
          id="kuota"
          min="1"
          max="1000"
          onChange={handleChange}
          placeholder="Masukkan kuota"
          className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 outline-none transition-all duration-200 placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
        />

      </div>

      {/* Date */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

        {/* Active */}
        <div>

          <label
            htmlFor="activeDate"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Mulai Dari
          </label>

          <input
            type="datetime-local"
            name="activeDate"
            id="activeDate"
            onChange={handleChange}
            className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 outline-none transition-all duration-200 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
          />

        </div>

        {/* Expired */}
        <div>

          <label
            htmlFor="expiredDate"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Hingga
          </label>

          <input
            type="datetime-local"
            name="expiredDate"
            id="expiredDate"
            onChange={handleChange}
            className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 outline-none transition-all duration-200 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
          />

        </div>

      </div>

      {/* Button */}
      <div className="flex gap-4 pt-6">

        <Link
          href="/admin/tokentes"
          className={`rounded-2xl px-5 py-3 text-sm font-semibold transition-all duration-200 ${
            isLoading
              ? 'pointer-events-none bg-gray-300 text-gray-500'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {isLoading
            ? 'Mohon tunggu...'
            : 'Kembali'}
        </Link>

        <button
          type="submit"
          className={`rounded-2xl px-5 py-3 text-sm font-semibold text-white transition-all duration-200 ${
            isLoading
              ? 'pointer-events-none bg-gray-400'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isLoading
            ? 'Mohon tunggu...'
            : 'Buat Token'}
        </button>

      </div>

    </form>

  </div>

</div>
    )
}