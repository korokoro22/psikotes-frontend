'use client'

import { useAntiCheat } from "@/lib/useAntiCheat";
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react";

export default function psychologicaltests() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    
    useEffect(() => {
        navigator.clipboard.readText().catch(() => {});
    }, []);

    const handleNext = () => {
        try{
            setIsLoading(true)
            router.push('/registrations')
        } catch (error) {
            setIsLoading(false)
        }
        
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 px-4 py-8">
            <div className="relative w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden border border-indigo-100">
                <div className="flex flex-col items-center gap-y-5 px-5 py-3 my-5">
                    <Image
                        className="" 
                        src='/assets/logoKurniawanCropped.jpg'
                        alt=""
                        width={150}
                        height={150}
                    />
                    <button 
                        className={`px-20 py-2  text-white rounded-lg  ${
                            isLoading
                            ? 'bg-gray-500'
                            : 'hover:bg-blue-700 bg-blue-500'
                            }`}
                        disabled={isLoading}
                        onClick={handleNext}
                    >
                        {isLoading? 'Mohon tunggu':'Masuk'}
                    </button>
                </div>
            </div>
        </div>
    )
}