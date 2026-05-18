'use client'

import React, { FormEvent, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { login } from '@/services/auth.service'

export default function AdminLoginForm() {
    
    const router = useRouter()  
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData(prev=> ({...prev, [name]: value}))
    }
    
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true)

      try {
        setIsSubmitting(true);
        const res = await login(formData);
        setIsLoading(false)
        // console.log(res.data);
        router.push('/admin/dashboard')
      } catch (err: any) {
        alert(err.response?.data?.message || 'Login gagal');
      } finally {
        setIsSubmitting(false);
        setIsLoading(false)
      }
    };

    useEffect( ()=>{
      console.log('ini answers: ', formData)
    }, [])


    const isFormValid = Object.values(formData).every(v => v.trim() !== '') && !isSubmitting

    useEffect(() => {
    document.title = "Login - Psychological Tests";
  }, [])

    return(
          <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 px-4 py-10">

  <div className="w-full max-w-md overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-2xl">

    {/* Header */}
    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-8 text-center text-white">

      <h1 className="text-3xl font-bold tracking-wide">
        KURNIAWAN GROUP
      </h1>

      <p className="mt-2 text-sm text-blue-100">
        Sistem Tes dan Assessment Peserta
      </p>

    </div>

    {/* Form */}
    <div className="p-8">

      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >

        {/* Username */}
        <div>

          <label
            htmlFor="username"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Username
          </label>

          <input
            type="text"
            name="username"
            id="username"
            required
            value={formData.username}
            onChange={handleChange}
            placeholder="Masukkan username"
            className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 shadow-sm outline-none transition-all duration-200 placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
          />

        </div>

        {/* Password */}
        <div>

          <label
            htmlFor="password"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Password
          </label>

          <input
            type="password"
            name="password"
            id="password"
            required
            value={formData.password}
            onChange={handleChange}
            placeholder="Masukkan password"
            className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 shadow-sm outline-none transition-all duration-200 placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
          />

        </div>

        {/* Button */}
        <div className="pt-2">

          {isLoading ? (

            <button
              disabled
              className="w-full rounded-2xl bg-gray-400 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200"
            >
              Mohon Tunggu...
            </button>

          ) : (

            <button
              className="w-full rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:scale-[1.01] hover:from-blue-700 hover:to-indigo-700"
            >
              Login
            </button>

          )}

        </div>

      </form>

    </div>

  </div>

</div>
    )
}
