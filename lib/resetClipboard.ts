"use client";

import { useEffect, useCallback } from "react";

type ViolationType = "PrintScreen" | "Snipping Tool" | "Mac Screenshot";

interface UseAntiCheatWithLogOptions {
  mode: "log";
  onViolation: (type: ViolationType, timestamp: Date) => void;
  onClipboardCleared?: () => void;
}

interface UseAntiCheatSilentOptions {
  mode: "silent";
  onClipboardCleared?: () => void;
}

type UseAntiCheatOptions =
  | UseAntiCheatWithLogOptions
  | UseAntiCheatSilentOptions;

export function resetClipboard(options: UseAntiCheatOptions) {
  const clearClipboard = useCallback(
    async (attempt: number) => {
      await navigator.clipboard.writeText("");
      // console.log(`🧹 Clipboard dikosongkan — percobaan ke-${attempt}`);
      options.onClipboardCleared?.();
    },
    [options],
  );

  const handleViolation = useCallback(
    async (type: ViolationType) => {
      // console.log(`🚨 Pelanggaran terdeteksi: ${type}`);

      await clearClipboard(1);

      setTimeout(async () => {
        await clearClipboard(2);
      }, 300);

      setTimeout(async () => {
        await clearClipboard(3);
      }, 600);

      if (options.mode === "log") {
        options.onViolation(type, new Date());
      }
    },
    [clearClipboard, options],
  );

  useEffect(() => {
    const handleKeyDown = async (e: KeyboardEvent) => {
      if (e.key === "PrintScreen") {
        await handleViolation("PrintScreen");
        return;
      }

      if (
        e.shiftKey &&
        e.key === "S" &&
        (e.metaKey || e.getModifierState("OS"))
      ) {
        await handleViolation("Snipping Tool");
        return;
      }

      if (e.metaKey && e.shiftKey && ["3", "4", "5"].includes(e.key)) {
        await handleViolation("Mac Screenshot");
        return;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleViolation]);
}

export default resetClipboard;
