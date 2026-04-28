'use client'

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import Image from "next/image"
import { logout } from "@/services/auth.service"
import Modal from "./Modal"
import { useState } from "react"
import { icons } from "lucide-react"

const Icons = {
    dashboard: ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg 
        className={className} 
        viewBox="0 0 24 24" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        >
        <path 
            fillRule="evenodd" 
            clipRule="evenodd" 
            d="M3 2C2.44772 2 2 2.44772 2 3V6C2 6.55228 2.44772 7 3 7H6C6.55228 7 7 6.55228 7 6V3C7 2.44772 6.55228 2 6 2H3ZM3 0H6C7.65685 0 9 1.34315 9 3V6C9 7.65685 7.65685 9 6 9H3C1.34315 9 0 7.65685 0 6V3C0 1.34315 1.34315 0 3 0ZM14 16H21C22.6569 16 24 17.3431 24 19V21C24 22.6569 22.6569 24 21 24H14C12.3431 24 11 22.6569 11 21V19C11 17.3431 12.3431 16 14 16ZM14 18C13.4477 18 13 18.4477 13 19V21C13 21.5523 13.4477 22 14 22H21C21.5523 22 22 21.5523 22 21V19C22 18.4477 21.5523 18 21 18H14ZM3 11H6C7.65685 11 9 12.3431 9 14V21C9 22.6569 7.65685 24 6 24H3C1.34315 24 0 22.6569 0 21V14C0 12.3431 1.34315 11 3 11ZM3 13C2.44772 13 2 13.4477 2 14V21C2 21.5523 2.44772 22 3 22H6C6.55228 22 7 21.5523 7 21V14C7 13.4477 6.55228 13 6 13H3ZM21 0C22.6569 0 24 1.34315 24 3V11C24 12.6569 22.6569 14 21 14H14C12.3431 14 11 12.6569 11 11V3C11 1.34315 12.3431 0 14 0H21ZM13 3V11C13 11.5523 13.4477 12 14 12H21C21.5523 12 22 11.5523 22 11V3C22 2.44772 21.5523 2 21 2H14C13.4477 2 13 2.44772 13 3Z" 
            fill="currentColor"
        />
    </svg>
    ),
    token: ({ className = "w-6 h-6" }: { className?: string }) => (
        <svg 
            className={className} 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            >
            <path 
                d="M15.6807 14.5869C19.1708 14.5869 22 11.7692 22 8.29344C22 4.81767 19.1708 2 15.6807 2C12.1907 2 9.3615 4.81767 9.3615 8.29344C9.3615 9.90338 10.0963 11.0743 10.0963 11.0743L2.45441 18.6849C2.1115 19.0264 1.63143 19.9143 2.45441 20.7339L3.33616 21.6121C3.67905 21.9048 4.54119 22.3146 5.2466 21.6121L6.27531 20.5876C7.30403 21.6121 8.4797 21.0267 8.92058 20.4412C9.65538 19.4167 8.77362 18.3922 8.77362 18.3922L9.06754 18.0995C10.4783 19.5045 11.7128 18.6849 12.1537 18.0995C12.8885 17.075 12.1537 16.0505 12.1537 16.0505C11.8598 15.465 11.272 15.465 12.0067 14.7333L12.8885 13.8551C13.5939 14.4405 15.0439 14.5869 15.6807 14.5869Z" 
                stroke="currentColor" 
                strokeWidth="1.5" 
                strokeLinejoin="round"
            />
            <path 
                d="M17.8853 8.29353C17.8853 9.50601 16.8984 10.4889 15.681 10.4889C14.4635 10.4889 13.4766 9.50601 13.4766 8.29353C13.4766 7.08105 14.4635 6.09814 15.681 6.09814C16.8984 6.09814 17.8853 7.08105 17.8853 8.29353Z" 
                stroke="currentColor" 
                strokeWidth="1.5"
            />
        </svg>
    ),
    peserta: ({ className = "w-6 h-6" }: { className?: string }) => (
        <svg 
            className={className} 
            viewBox="0 0 32 32" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="currentColor"
            >
            <path d="M23.313 26.102l-6.296-3.488c2.34-1.841 2.976-5.459 2.976-7.488v-4.223c0-2.796-3.715-5.91-7.447-5.91-3.73 0-7.544 3.114-7.544 5.91v4.223c0 1.845 0.78 5.576 3.144 7.472l-6.458 3.503s-1.688 0.752-1.688 1.689v2.534c0 0.933 0.757 1.689 1.688 1.689h21.625c0.931 0 1.688-0.757 1.688-1.689v-2.534c0-0.994-1.689-1.689-1.689-1.689zM23.001 30.015h-21.001v-1.788c0.143-0.105 0.344-0.226 0.502-0.298 0.047-0.021 0.094-0.044 0.139-0.070l6.459-3.503c0.589-0.32 0.979-0.912 1.039-1.579s-0.219-1.32-0.741-1.739c-1.677-1.345-2.396-4.322-2.396-5.911v-4.223c0-1.437 2.708-3.91 5.544-3.91 2.889 0 5.447 2.44 5.447 3.91v4.223c0 1.566-0.486 4.557-2.212 5.915-0.528 0.416-0.813 1.070-0.757 1.739s0.446 1.267 1.035 1.589l6.296 3.488c0.055 0.030 0.126 0.063 0.184 0.089 0.148 0.063 0.329 0.167 0.462 0.259v1.809zM30.312 21.123l-6.39-3.488c2.34-1.841 3.070-5.459 3.070-7.488v-4.223c0-2.796-3.808-5.941-7.54-5.941-2.425 0-4.904 1.319-6.347 3.007 0.823 0.051 1.73 0.052 2.514 0.302 1.054-0.821 2.386-1.308 3.833-1.308 2.889 0 5.54 2.47 5.54 3.941v4.223c0 1.566-0.58 4.557-2.305 5.915-0.529 0.416-0.813 1.070-0.757 1.739 0.056 0.67 0.445 1.267 1.035 1.589l6.39 3.488c0.055 0.030 0.126 0.063 0.184 0.089 0.148 0.063 0.329 0.167 0.462 0.259v1.779h-4.037c0.61 0.46 0.794 1.118 1.031 2h3.319c0.931 0 1.688-0.757 1.688-1.689v-2.503c-0.001-0.995-1.689-1.691-1.689-1.691z"/>
        </svg>
    ),
    hasiltes: ({ className = "w-6 h-6" }: { className?: string }) => (
        <svg className={className} viewBox="0 0 1920 1920" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
            <g id="SVGRepo_bgCarrier" strokeWidth="0"/>
            <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"/>
            <g id="SVGRepo_iconCarrier"> <path d="M1468.214 0v564.698h-112.94V112.94H112.94v1694.092h1242.334v-225.879h112.94v338.819H0V0h1468.214Zm129.428 581.311c22.137-22.136 57.825-22.136 79.962 0l225.879 225.879c22.023 22.023 22.023 57.712 0 79.848l-677.638 677.637c-10.616 10.504-24.96 16.49-39.98 16.49h-225.88c-31.17 0-56.469-25.299-56.469-56.47v-225.88c0-15.02 5.986-29.364 16.49-39.867Zm-155.291 314.988-425.895 425.895v146.031h146.03l425.895-425.895-146.03-146.03Zm-764.714 346.047v112.94H338.82v-112.94h338.818Zm225.88-225.88v112.94H338.818v-112.94h564.697Zm734.106-315.44-115.424 115.425 146.03 146.03 115.425-115.423-146.031-146.031ZM1129.395 338.83v451.758H338.82V338.83h790.576Zm-112.94 112.94H451.759v225.878h564.698V451.77Z" fillRule="evenodd"/> </g>
        </svg>
    ),
}

const menu: { label: string; href: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: Icons.dashboard },
  { label: 'Token Tes', href: '/admin/tokentes', icon: Icons.token },
  { label: 'Peserta', href: '/admin/peserta', icon: Icons.peserta },
  { label: 'Hasil Tes', href: '/admin/hasiltes', icon: Icons.hasiltes },
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
                `bg-[#DFDFDE] font-sans min-h-screen flex  ${
                isOpen === true
                ?`block`
                :`hidden md:block`
                }`
            }
        >
            <div className="flex flex-col min-h-screen justify-between ">
            <div>
            <div className=" border-gray-200 mb-10 py-5 mx-4">
                <p className=" px-8 text-2xl font-bold ">TES PSIKOTES</p>
            </div>
            {/* <ul className="flex flex-col px-6 text-[#6c6e70]">
                {menu.map(item => (
                        <Link 
                        key={item.href}
                        href={item.href}
                        className="mb-4 py-4 px-4 text-lg hover:bg-gray-200 rounded-lg font-semibold flex flex-row gap-x-3"
                        >
                            <div>{item.icon}</div>
                            <div>{item.label}</div>
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
            </ul> */}
            <ul className="flex flex-col px-3 text-[#8a8a8a] gap-y-2">
                {menu.map(item => {
                    const Icon = item.icon  // ← huruf kapital penting!
                    return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={` py-3 hover:text-[] px-4 text-lg hover:bg-gray-200 rounded-lg font-base flex flex-row gap-x-3${
                            pathname === item.href
                            ? '  bg-[#FFFDF1] text-[#2C2C2C] font-semibold'
                            : ''   
                        }`}
                    >
                        <Icon className="w-7 h-7" />  {/* ← passing className di sini */}
                        <div className="">{item.label}</div>
                    </Link>
                    )
                })}
                
            </ul>
            </div>
            
            <button className="text-left px-3 ml-5 flex gap-x-3 text-lg font-semibold hover:bg-gray-400 mb-4 py-3 rounded-lg"
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
            </div>
            
        </div>
        <Modal isOpen={isModalOpen} onClose={()=> setIsModalOpen(false)}>
            <p className='text-gray-800'>Apakah anda ingin log out?</p>
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