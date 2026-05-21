'use client'

import Peserta from "./Peserta"
import { Suspense } from "react"

export default function AdminPeserta() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Peserta />
        </Suspense>
    )
    
}