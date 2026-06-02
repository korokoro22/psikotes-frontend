'use client'

import TokenTes from "./TokenTes"
import { Suspense } from "react"

export default function AdminManajemenTes() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <TokenTes />
        </Suspense>
    )
}