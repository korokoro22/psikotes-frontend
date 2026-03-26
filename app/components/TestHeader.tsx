'use client'
import Image from "next/image"

export default function testHeader() {
    return (
        <div className="container mx-auto px-6 flex justify-center md:justify-between md:items-center">
                  <div className="flex justify-center items-center gap-4">
                    {/* <Brain className="text-blue-600" size={28} /> */}
                    <Image
                      src='/assets/logoKurniawan2.webp'
                      width={50}
                      height={50}
                      alt=''
                      className=""
                    >
                    </Image>
                    <h1 className="text-xl font-bold text-gray-800 hidden md:block">Kurniawan Group</h1>
                  </div>
                </div>
    )
}