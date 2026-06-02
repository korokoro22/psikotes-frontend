import { useEffect, useState } from "react"

    interface MsdtScoring {
        id: number
        hasilTest: number
        status:number
        mainExplanation1: number
        mainExplanation2: number
        description: string
    }

export default function Msdt({data}:any) {
    const [score, setScore] = useState<MsdtScoring>()

    useEffect(()=> {
        setScore(data)
        console.log("ini data scoring msdt: ", data)
    }, [score])
    return(
        <div className="pb-5 border-gray-300">
            <div className="mb-4">
                <p className="font-bold text-2xl">Hasil Tes MSDT</p>
            </div>
            <div>
                <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
                    <table className="w-full border-collapse">
                        <tbody>
                            <tr className="text-center text-sm font-semibold text-gray-700  ">
                                <td className="px-4 py-2 border border-gray-300">
                                    Hasil Test
                                </td>
                                <td className="text-left px-4 py-2 border border-gray-300">
                                    {score?.hasilTest}
                                </td>
                            </tr>
                            <tr className="text-center text-sm font-semibold text-gray-700  ">
                                <td className="px-4 py-2 border border-gray-300">
                                    Status
                                </td>
                                <td className="text-left px-4 py-2 border border-gray-300">
                                    {score?.status}
                                </td>
                            </tr>
                            <tr className="text-center text-sm font-semibold text-gray-700  ">
                                <td className="px-4 py-2 border border-gray-300">
                                    Deskripsi
                                </td>
                                <td className="text-left px-4 py-2 border border-gray-300 flex flex-col gap-y-2">
                                    <p>{score?.mainExplanation1}</p>
                                    <p>{score?.mainExplanation2}</p>
                                    <p>{score?.description}</p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}