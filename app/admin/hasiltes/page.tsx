'use client'

import HasilTes from "./HasilTes"
import { Suspense } from "react"

export default function AdminManajemenTes() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <HasilTes />
        </Suspense>
    )
}