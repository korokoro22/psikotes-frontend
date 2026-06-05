import { useEffect, useRef } from "react";

interface UseAudioKraepelinProps {
  timeLeftMs: number | undefined;
  currentColIndex: number;
  warningTimeMs?: number; // default 10 detik
  audioSrc?: string;
}

export default function useAudioKraepelin({
  timeLeftMs,
  currentColIndex,
  warningTimeMs = 10000,
  audioSrc = "/audio/warning.mp3",
}: UseAudioKraepelinProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const warningPlayedRef = useRef(false);

  // init audio
  useEffect(() => {
    const audio = new Audio(audioSrc);
    audio.preload = "auto";
    audioRef.current = audio;
  }, [audioSrc]);

  // 🔁 reset saat pindah kolom
  useEffect(() => {
    warningPlayedRef.current = false;
  }, [currentColIndex]);

  // 🎯 trigger audio
  useEffect(() => {
    if (!timeLeftMs || !audioRef.current) return;

    // range biar aman dari skip interval
    const isInRange =
      timeLeftMs <= warningTimeMs && timeLeftMs > warningTimeMs - 2000;

    if (isInRange && !warningPlayedRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {
        // handle autoplay restriction (optional)
        console.warn("Audio play blocked by browser");
      });

      warningPlayedRef.current = true;
    }
  }, [timeLeftMs, warningTimeMs]);
}
