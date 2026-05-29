import { div } from "framer-motion/client";
import BarChartComponent from "./BarChartComponent";



export default function Mbti() {

    return(
        <div className="pb-5 border-gray-300">
            <div className="mb-4">
                <p className="font-bold text-2xl">Hasil Tes MBTI</p>
            </div>
            <div className="flex flex-col gap-y-1 text-lg">
                <p className="font-semibold">Hasil akhir: </p>
                <div className="flex">
                    <p className="bg-blue-700 px-4 py-1 text-white rounded-lg">ENTP</p>
                </div>
            </div>
            <div className="flex flex-col gap-y-1 my-6">
                <p className="font-semibold text-lg">Uraian Karakter: </p>
                <div className="flex">
                    <p className="rounded-lg border px-3 py-2">Orang-orang ENTP pada umumnya dikenal sebagai orang yang selalu mencari hal-hal baru dan rumit. Mereka percaya pada kemampuan diri untuk berimprovisasi dan mengatasi semua masalah yang muncul. Mereka sangat mandiri dan menjunjung tinggi nilai-nilai adaptasi dan inovasi. Mereka beberapa langkah di depan orang lain dalam menghargai dan mendorong perubahan. ORang-orang ENTP tidak terinspirasi oleh hal-hal yang rutin. Mereka menolak stuktur hirarki dan birokrasi yang tidak fungsional. Mereka membutuhkan kebebasan dalam bertindak. Dengan kecenderungan seorang entrepreneur dan pemahaman yang luas, mereka akan menyingkirkan segala sesuatu yang menghalangi mereka menyelesaikan proyek-proyeknya. Mereka menampilkan yang terbaik jika berada dalam situasi yang berubah dimana mereka bisa membuat model konseptual dan strategi-strategi yang secara afektif mengarahkan perubahan.</p>
                </div>
            </div>
        </div>
    )
}