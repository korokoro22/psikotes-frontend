'use client'
import Image from "next/image"

export default function testHeader() {
    return (
        <div className="container mx-auto px-6 flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    {/* <Brain className="text-blue-600" size={28} /> */}
                    <Image
                      src='/assets/logoKurniawan2.webp'
                      width={50}
                      height={50}
                      alt=''
                    >
                    </Image>
                    <h1 className="text-xl font-bold text-gray-800">Kurniawan Group</h1>
                  </div>
                </div>
    )
}