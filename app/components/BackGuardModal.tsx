"use client";

interface BackGuardModalProps {
  isOpen: boolean;
//   message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function BackGuardModal({
  isOpen,
//   message,
  onConfirm,
  onCancel,
}: BackGuardModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/50">
      <div className="w-[420px] max-w-[92vw] overflow-hidden rounded-lg border border-gray-300 bg-gray-100 shadow-2xl">
        {/* Titlebar */}
        <div className="flex items-center gap-2 border-b border-gray-300 bg-gray-200 px-4 py-2">
          <span className="text-base">⚠️</span>
          <span className="text-sm font-semibold text-gray-700">Konfirmasi</span>
        </div>

        {/* Body */}
        <div className="px-5 pb-4 pt-5 text-center">
          <p className="text-sm leading-relaxed text-gray-800">Apakah Anda yakin ingin kembali?</p>
          <p className="text-sm leading-relaxed text-red-700">(TES YANG SEDANG BERLANGSUNG AKAN DIBATALKAN DAN TIDAK DAPAT DILANJUTKAN)</p>
        </div>

        {/* Footer */}
        <div className="flex justify-center gap-x-6 px-4 pb-4">
          <button
            onClick={onCancel}
            className="min-w-[80px] rounded border border-gray-400 bg-gray-100 px-5 py-1.5 text-sm text-gray-700 hover:bg-gray-200 active:bg-gray-300"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            className="min-w-[80px] rounded border border-blue-700 bg-blue-600 px-5 py-1.5 text-sm font-semibold text-white hover:bg-blue-700 active:bg-blue-800"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}