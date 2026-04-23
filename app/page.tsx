'use client'

import { useAntiCheat } from "@/lib/useAntiCheat";
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useEffect } from "react";

export default function psychologicaltests() {
    const router = useRouter()
    
    useEffect(() => {
        navigator.clipboard.readText().catch(() => {});
    }, []);

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
                        className="px-20 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
                        onClick={()=> {
                            router.push('/registrations')
                        }}
                    >
                        MULAI
                    </button>
                </div>
            </div>
        </div>
    )
}