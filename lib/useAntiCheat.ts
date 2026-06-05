"use client";

import { useEffect, useCallback, useRef } from "react";

type ViolationType = "PrintScreen" | "Snipping Tool";

interface UseAntiCheatWithLogOptions {
  mode: "log";
  onViolation: (type: ViolationType, timestamp: Date) => void;
}

interface UseAntiCheatSilentOptions {
  mode: "silent";
}

type UseAntiCheatOptions =
  | UseAntiCheatWithLogOptions
  | UseAntiCheatSilentOptions;

export function useAntiCheat(options: UseAntiCheatOptions) {
  const pendingClear = useRef(false); // ada screenshot yang perlu dihapus?

  const clearClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText("");
      // console.log(" Clipboard cleared");
      pendingClear.current = false;
    } catch (err) {
      // console.warn(" Clear gagal (mungkin tidak focused), akan retry saat focus:", err);
      pendingClear.current = true; // tandai untuk diclear saat focus kembali
    }
  }, []);

  const handleViolation = useCallback(
    (type: ViolationType) => {
      // console.log(` ${type} terdeteksi!`);
      pendingClear.current = true; // tandai ada yang perlu dihapus

      if (options.mode === "log") {
        options.onViolation(type, new Date());
      }
    },
    [options],
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "PrintScreen") {
        handleViolation("PrintScreen");
        // Langsung coba clear juga (mungkin masih focused)
        navigator.clipboard.writeText("").catch(() => {
          pendingClear.current = true;
        });
      }
    };

    const handleFocus = async () => {
      // Delay sedikit agar clipboard sudah terisi screenshot
      await new Promise((res) => setTimeout(res, 300));

      try {
        // Cek apakah clipboard berisi image
        const items = await navigator.clipboard.read();
        const hasImage = items.some((item) =>
          item.types.some((type) => type.startsWith("image/")),
        );

        if (hasImage) {
          handleViolation("Snipping Tool");
        }
      } catch {
        // Permission denied — skip deteksi image
      }

      // Selalu clear saat focus kembali, baik ada violation atau tidak
      await clearClipboard();
    };

    const handleVisibilityChange = () => {
      // Tab kembali visible = kesempatan clear juga
      if (!document.hidden && pendingClear.current) {
        clearClipboard();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [handleViolation, clearClipboard]);
}
