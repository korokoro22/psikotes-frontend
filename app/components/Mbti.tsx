import { useEffect, useState } from "react";

interface MbtiScore {
  id: number;
  karakterTalent: string;
  uraianKarakterTalent: string;
}

export default function Mbti({ data }: any) {
  const [score, setScore] = useState<MbtiScore>();

  useEffect(() => {
    setScore(data);
  }, [score]);

  return (
    <div className="pb-5 border-gray-300 html2pdf__page-break">
      <div className="mb-4">
        <p className="font-bold text-2xl">Hasil Tes MBTI</p>
      </div>
      <div className="flex flex-col gap-y-1 text-lg">
        <p className="font-semibold">Hasil akhir: </p>
        <div className="flex">
          <p className="bg-blue-700 px-4 py-1 text-white rounded-lg">
            {score?.karakterTalent}
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-y-1 my-6">
        <p className="font-semibold text-lg">Uraian Karakter: </p>
        <div className="flex">
          <p className="rounded-lg border px-3 py-2">
            {score?.uraianKarakterTalent}
          </p>
        </div>
      </div>
    </div>
  );
}
