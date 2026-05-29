'use client'

import { useState } from "react"
// import DiscChart from "./DiscChartComponent"


export default function Disc() {

//     type DiscType = 'D' | 'I' | 'S' | 'C'

//     type DiscAnswer = {
//         groupId: number
//         type: DiscType
//     }

//     type DiscAnswers = {
//         most: DiscAnswer[]
//         least: DiscAnswer[]
// }


//     const [answers] = useState<DiscAnswers>({
//         most: [
//             { groupId: 0, type: 'D'},
//             { groupId: 1, type: 'C'},
//             { groupId: 2, type: 'S'},
//         ],
//         least: [
//             {groupId: 0, type: 'I'},
//             {groupId: 1, type: 'D'},
//             {groupId: 2, type: 'S'},
//         ]
//     })

{/* <DiscChart answers = {answers}/> */}

    return(
        <div className="pb-5 border-gray-300">
             <div className="mb-4">
                <p className="font-bold text-2xl">Hasil Tes DISC</p>
            </div>
            <div className="flex w-full gap-x-5 justify-center">
                <div className="w-full rounded-3xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm font-medium tracking-wide text-gray-400 uppercase">
                                Mask Public Self
                            </p>

                            <h2 className="mt-2 text-xl font-bold text-gray-900">
                                ADVISOR
                            </h2>
                        </div>
                    </div>

                    <div className="mt-4 space-y-2">
                        {[
                            "Hangat",
                            "Simpati",
                            "Tenang dalam situasi sosial",
                        ].map((item) => (
                            <div
                                key={item}
                                className="flex items-start gap-2"
                            >
                                <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-gray-500" />

                                <p className="text-sm leading-relaxed text-gray-700">
                                    {item}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
                
                <div className="w-full rounded-3xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm font-medium tracking-wide text-gray-400 uppercase">
                                Core Private Self
                            </p>

                            <h2 className="mt-2 text-xl font-bold text-gray-900">
                                INQUIRER
                            </h2>
                        </div>
                    </div>

                    <div className="mt-4 space-y-2">
                        {[
                            "Hangat",
                            "Simpati",
                            "Tenang dalam situasi sosial",
                        ].map((item) => (
                            <div
                                key={item}
                                className="flex items-start gap-2"
                            >
                                <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-gray-500" />

                                <p className="text-sm leading-relaxed text-gray-700">
                                    {item}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="w-full rounded-3xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm font-medium tracking-wide text-gray-400 uppercase">
                                Mirror Perceived Self
                            </p>

                            <h2 className="mt-2 text-xl font-bold text-gray-900">
                                PEACEMAKER,RESPECTFUL & ACCURATE
                            </h2>
                        </div>
                    </div>

                    <div className="mt-4 space-y-2">
                        {[
                            "Hangat",
                            "Simpati",
                            "Tenang dalam situasi sosial",
                        ].map((item) => (
                            <div
                                key={item}
                                className="flex items-start gap-2"
                            >
                                <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-gray-500" />

                                <p className="text-sm leading-relaxed text-gray-700">
                                    {item}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="mt-10">
                <p className="mb-2 font-bold text-lg">Deskripsi Kepribadian</p>
                <div className="w-full rounded-3xl border border-gray-200 bg-white p-3 shadow-sm transition-all hover:shadow-md">
                    Ia adalah orang yang baik secara alamiah dan sangat berorientasi detil.  Ia peduli dengan orang-orang di sekitarnya dan mempunyai kualitas yang membuatnya sangat teliti dalam penyelesaian tugas.  Ia mempertimbangkan sekelilingnya dengan hati-hati sebelum membuat keputusan untuk melihat pengaruhnya pada mereka; saat tertentu ia terlalu hati-hati.  Jika ia merasa seseorang memanfaatkan situasi, ia akan memperlambat kerjanya sehingga dapat mengamati apa yang sedang berlangsung di sekitarnya.
                </div>
            </div>
            <div className="mt-10">
                <p className="mb-2 font-bold text-lg">Job Match</p>
                <div className="w-full rounded-3xl border border-gray-200 bg-white p-3 shadow-sm transition-all hover:shadow-md">
                    Office (Manager, Supervisor, Person), Chief Clerk, General Administrator, Production Supervisor, Planner, Accountant, Research and Development, Flight Attendant, Engineering (Project Manager, Supervisor, Technician), Computer Programmer, Draughtsman, Soft/Service Selling, Doctor, Cashier, Receptionist, Data Entry, Planner, Word Processing, Property Manager, Database Administrator, Health Care, Statistician, Nursing-Administration, Company Secretary, System Analyst, Programmer, Statistician, Accounting-General, Security Specialist.
                </div>
            </div>
            
        </div>
    )
}