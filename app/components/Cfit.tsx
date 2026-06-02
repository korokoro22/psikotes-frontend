'use client'

import Link from "next/link"
import { useEffect, useState } from "react"

// type CfitProps = {
//     data: {

//     }
// }

    interface CfitScore {
        subtestScores: {
            subtest1: number
            subtest2: number
            subtest3: number
            subtest4: number
        }
        totalScore: number
    }

export default function Cfit({data}:any) {
    const [score, setScore] = useState<CfitScore>()

    useEffect(()=> {
        setScore(data)
        console.log("data", data)
    }, [score])
    
    return(
        <div className=" pb-5 border-gray-300">
            <div className="mb-4">
                <p className="font-bold text-2xl">Hasil Tes CFIT</p>
            </div>
            {data && score? (
                <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
                <table className="w-full border-collapse">

                    {/* Header */}
                    <thead className="bg-gray-200">
                        <tr className="text-left text-sm font-semibold text-gray-700">
                            <th className="px-6 py-4">Subtes 1</th>
                            <th className="px-6 py-4">Subtes 2</th>
                            <th className="px-6 py-4">Subtes 3</th>
                            <th className="px-6 py-4">Subtes 4</th>
                            <th className="px-6 py-4">Total</th>
                        </tr>
                    </thead>

                    {/* Body */}
                    <tbody>
                        <tr  
                            className="border-t border-gray-100 text-sm transition-colors duration-150 hover:bg-gray-50"
                        >

                            <td className="px-6 py-4 text-gray-600">
                                {score?.subtestScores?.subtest1}/13
                            </td>

                            <td className="px-6 py-4 font-medium text-gray-800">
                                {score?.subtestScores?.subtest2}/10
                            </td>

                            <td className="px-6 py-4 font-medium text-gray-800">
                                {score?.subtestScores?.subtest3}/13
                            </td>

                            <td className="px-6 py-4 font-medium text-gray-800">
                                {score?.subtestScores?.subtest4}/10
                            </td>

                            <td className="px-6 py-4 font-medium text-gray-800">
                                {score?.totalScore}/46
                            </td>
                        </tr>
                        
                    </tbody>
                </table>
            </div>
            ):(
                <div>Data kosong</div>
            )}
            

        </div>
    )
}