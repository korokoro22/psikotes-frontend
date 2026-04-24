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
        kuota: number
    }>({
        tests: [],
        kuota: 0
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
            const res = await postToken(formData)
            setIsLoading(false)
            router.push('/admin/tokentes')

        } catch(err:any){

        } finally {
            setIsLoading(false)
            setIsSubmitting(false)
        }
        // const {tests, kuota} = formData
        // if(tests.length === 0 || !kuota) {
        //     alert('Mohon Lengkapi semua data')
        //     return
        // }
        // setIsSubmitting(true)
        // localStorage.setItem('userdata', JSON.stringify(formData))
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
            <p className="mb-12 text-3xl font-bold border-b pb-5 border-gray-200">Buat Token</p>
            <form action="" onSubmit={handleSubmit} className="space-y-5">
                <div className="flex flex-col gap-y-3">
                    <div className="space-y-2 text-lg">
                        <p className="">Jenis tes: </p>
                        <div className="">
                            <div className="space-x-3">
                                <input type="checkbox" id="cfit" value="CFIT" name="tes" onChange={handleChange}/>
                                <label htmlFor="tes">CFIT</label>
                            </div>
                            <div className="space-x-3">
                                <input type="checkbox" id="disc" value="DISC" name="tes" onChange={handleChange}/>
                                <label htmlFor="tes">DISC</label>
                            </div>
                            <div className="space-x-3">
                                <input type="checkbox" id="kraepelin" value="KRAEPELIN" name="tes" onChange={handleChange}/>
                                <label htmlFor="tes">Kraepelin</label>
                            </div>
                            <div className="space-x-3">
                                <input type="checkbox" id="mbti" value="MBTI" name="tes" onChange={handleChange}/>
                                <label htmlFor="tes">MBTI</label>
                            </div>
                            <div className="space-x-3">
                                <input type="checkbox" id="msdt" value="MSDT" name="tes" onChange={handleChange}/>
                                <label htmlFor="tes">MSDT</label>
                            </div>
                            <div className="space-x-3">
                                <input type="checkbox" id="papi" value="PAPIKOSTICK" name="tes" onChange={handleChange}/>
                                <label htmlFor="tes">PapiKostick</label>
                            </div>
                        </div>
                    </div>
                    <div className=" border border-slate-200 rounded-2xl self-start flex text-base text-slate-600">
                        {formData.tests.map((test, index) => {
                            return (
                                <div
                                    key={index}
                                    className="p-2 flex flex-row"
                                >
                                    <p className="mr-1">({index + 1})</p>
                                    <p>{test}</p>
                                </div>
                            )
                        })}

                    </div>
                </div>
                

                <div className="space-x-2 text-lg">
                    <label htmlFor="kuota">Kuota: </label>
                    <input type="number" name="kuota" id="kuota" min="1" max="1000" className="border border-gray-400 rounded-lg px-3 py-2" onChange={handleChange}/>
                </div>

                <div className="flex gap-x-5 mt-16">
                    <Link
                        href='/admin/tokentes'
                        className={`px-3 py-2  rounded-lg hover:bg-gray-400 ${
                            isLoading 
                            ? 'bg-gray-500 disabled:pointer-events-none'
                            : 'bg-gray-300'
                            }`}
                    >
                        {isLoading? 'Mohon tunggu...':'Kembali'}
                    </Link>
                    <button 
                        type="submit"
                        className={`px-3 py-1 text-white ${
                            isLoading
                            ? 'bg-gray-500 disabled:pointer-events-none'
                            : 'bg-blue-600 rounded-lg hover:bg-blue-700'
                            }`}
                    >
                        {isLoading? 'Mohon tunggu...':'Buat Token'}
                    </button>
                </div>
            </form>
        </div>
    )
}