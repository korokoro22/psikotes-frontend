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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 px-4 py-10">
      <div className="relative w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden border border-indigo-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-center py-4">
          <h1 className="text-xl font-bold tracking-wide">DASHBOARD ADMIN</h1>
          <p className="text-xs opacity-90">tes psikotes</p>
        </div>

        {/* Form */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nama */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                type="text"
                name="username"
                id="username"
                required
                value={formData.username}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 bg-gray-50 py-2 px-3 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition text-sm"
                placeholder="Masukkan Username"
              />
            </div>

            <div>
              <label htmlFor="nama" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 bg-gray-50 py-2 px-3 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition text-sm"
                placeholder="Masukkan Password"
              />
            </div>

            {/* Tombol */}
            <div className='flex justify-center'>
              {isLoading ? (
                <button
                className={` disabled:pointer-events-nonew-1/2 w-1/2 bg-slate-400  py-2 text-sm font-semibold text-white rounded-md shadow-md transition-all duration-200 bg-gradient-to-r `}
                disabled={isLoading}

              >
                Mohon Tunggu...
              </button>
              ):(
                <button
                className={`w-1/2  py-2 text-sm font-semibold text-white rounded-md shadow-md transition-all duration-200 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700
                `}
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
