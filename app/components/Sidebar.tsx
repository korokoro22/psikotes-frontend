'use client'

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import Image from "next/image"
import { logout } from "@/services/auth.service"
import Modal from "./Modal"
import { useState } from "react"

const menu = [
    { label: 'Dashboard', href: '/admin/dashboard', icon: '/assets/dashboardsvg.svg'},
    { label: 'Token Tes', href: '/admin/tokentes', icon: '/assets/tokensvg.svg'},
    { label: 'Peserta', href: '/admin/peserta', icon: '/assets/teamsvg.svg'},
    { label: 'Hasil Tes', href: '/admin/hasiltes', icon: '/assets/assignmentsvg.svg'},
]

interface SidebarProps {
  isOpen: boolean;
  toggle: () => void;
}

export default function Sidebar({isOpen, toggle}: SidebarProps) {
    const pathname = usePathname()
    const router = useRouter()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const handleClick = async () => {
        // console.log("hai")
        const res = await logout()
        router.push('/login')
    }

    const handleModal = () => {
        setIsModalOpen(true)
    }

    return(
        <>

        {/* Overlay for mobile view when menu is open */}

        <div 
            className={
                
                `bg-white font-sans min-h-screen ${
                isOpen === true
                ?`block`
                :`hidden md:block`
                }`
                
            }
        >

            <div className="border-b-2 border-gray-200 mb-10 py-5 mx-4">
                <p className=" px-8 text-2xl font-bold ">TES PSIKOTES</p>
            </div>
            <ul className="flex flex-col px-6">
                {menu.map(item => (
                        <Link 
                        key={item.href}
                        href={item.href}
                        className="mb-4 py-4 px-4 text-lg hover:bg-gray-200 rounded-lg font-semibold flex flex-row gap-x-3"
                        >
                            <div>
                                <Image 
                                    src={item.icon}
                                    width={30}
                                    height={30}
                                    alt="dashboard"
                                />
                            </div>
                            <div>
                                {item.label}
                            </div>
                        </Link>
                    
                ))}
                <button className="text-left px-4 flex gap-x-3 text-lg font-semibold hover:bg-gray-200 mb-4 py-4 rounded-lg"
                    onClick={handleModal}
                >
                    <Image 
                        src="/assets/logoutsvg.svg"
                        width={25}
                        height={25}
                        alt=""
                    />
                    Logout
                </button>
            </ul>
        </div>
        <Modal isOpen={isModalOpen} onClose={()=> setIsModalOpen(false)}>
            <p className='text-gray-800'>Apakah anda ingin keluar dari akun ini?</p>
            <div className='flex gap-x-3 justify-evenly mt-4'>
                <button
                    className={`px-5 py-2 rounded-lg bg-gradient-to-r  text-white font-medium shadow hover:scale-[1.02] active:scale-95 transition ${
                    isLoading
                    ? 'bg-slate-300'
                    : 'bg-slate-500 hover:bg-slate-700' }`}
                    onClick={()=> setIsModalOpen(false)}
                    disabled={isLoading}
                >
                    Kembali
                </button>
                {isLoading ? (
                    <button
                        className='disabled:pointer-events-none px-5 py-2 rounded-lg bg-gradient-to-r bg-slate-400 text-white font-medium shadow hover:scale-[1.02] active:scale-95 transition'
                        aria-label="Mulai CFIT Subtes 1"
                        onClick={handleClick}
                        disabled={isLoading}
                    >
                        Mohon Tunggu...
                    </button>
                ):(
                    <button 
                    className='px-5 py-2 rounded-lg bg-gradient-to-r bg-red-500 hover:bg-red-600 text-white font-medium shadow hover:scale-[1.02] active:scale-95 transition'
                    onClick={handleClick}
                >
                    Logout
                </button>
                )}        
            </div>
        </Modal>
    </>
    )
}