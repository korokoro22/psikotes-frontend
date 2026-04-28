"use client";

import { useEffect, useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation"; // ganti ke "next/router" jika Pages Router
import BackGuardModal from "@/app/components/BackGuardModal";

/**
 * useBackGuard
 *
 * Kembalikan { BackGuardModal, modalProps } lalu render modal di halaman.
 * Hook ini menangani logika back button Chrome + Next.js router.push.
 *
 * Cara pakai:
 *   const { modalProps } = useBackGuard("Yakin ingin keluar?");
 *   return (
 *     <>
 *       <BackGuardModal {...modalProps} />
 *       ... isi halaman ...
 *     </>
 *   );
 */
export function useBackGuard(
  message = "Apakah Anda yakin ingin keluar? (TES YANG SEDANG BERLANGSUNG AKAN DIBATALKAN DAN TIDAK DAPAT DILANJUTKAN)",
  enabled = true
) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const resolveRef = useRef<((confirmed: boolean) => void) | null>(null);
  const isHandlingRef = useRef(false);

  // ── Tampilkan modal → Promise<boolean> ───────────────────────────────────
  const showModal = useCallback((): Promise<boolean> => {
    return new Promise((resolve) => {
      setIsOpen(true);
      resolveRef.current = (confirmed: boolean) => {
        setIsOpen(false);
        resolveRef.current = null;
        resolve(confirmed);
      };
    });
  }, []);

  const handleConfirm = useCallback(() => {
    resolveRef.current?.(true);
  }, []);

  const handleCancel = useCallback(() => {
    resolveRef.current?.(false);
  }, []);

  // ── Pasang popstate listener ──────────────────────────────────────────────
  useEffect(() => {
    if (!enabled) return;

    // Delay 100ms agar Next.js selesai commit navigasi ke browser history
    const timer = setTimeout(() => {
      window.history.pushState(null, "", window.location.href);
      window.history.pushState(null, "", window.location.href);
    }, 100);

    const handlePopState = () => {
      if (isHandlingRef.current) return;
      isHandlingRef.current = true;

      setTimeout(() => {
        window.history.pushState(null, "", window.location.href);

        showModal().then((confirmed) => {
          isHandlingRef.current = false;

          if (confirmed) {
            sessionStorage.clear();
            localStorage.clear();
            router.push("/");
          }
        });
      }, 0);
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [enabled, showModal, router]);

  return {
    // Spread langsung ke <BackGuardModal {...modalProps} />
    modalProps: {
      isOpen,
    //   message,
      onConfirm: handleConfirm,
      onCancel: handleCancel,
    },
  };
}