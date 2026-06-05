"use client";

import { useEffect, useRef, useState } from "react";

export function useClipboardPermissionGuard(checkCamera = false) {
  const [showModal, setShowModal] = useState(false);
  const streamRef = useRef<MediaStream | null>(null);
  const camStateRef = useRef<string>("granted");
  const micStateRef = useRef<string>("granted");

  useEffect(() => {
    const results: PermissionStatus[] = [];

    const checkAll = () => {
      const clipboardDenied = results.some((p) => p.state !== "granted");
      const cameraDenied = checkCamera
        ? camStateRef.current !== "granted"
        : false;
      const micDenied = checkCamera ? micStateRef.current !== "granted" : false;
      setShowModal(clipboardDenied || cameraDenied || micDenied);
    };

    const initCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        streamRef.current = stream;

        const [camPerm, micPerm] = await Promise.all([
          navigator.permissions.query({ name: "camera" as PermissionName }),
          navigator.permissions.query({ name: "microphone" as PermissionName }),
        ]);

        // Simpan state awal ke ref
        camStateRef.current = camPerm.state;
        micStateRef.current = micPerm.state;
        checkAll();

        camPerm.onchange = () => {
          camStateRef.current = camPerm.state;
          checkAll();
        };

        micPerm.onchange = () => {
          micStateRef.current = micPerm.state;
          checkAll();
        };
      } catch {
        camStateRef.current = "denied";
        micStateRef.current = "denied";
        setShowModal(true);
      }
    };

    const init = async () => {
      try {
        const clipboard = await navigator.permissions.query({
          name: "clipboard-read" as PermissionName,
        });
        results.push(clipboard);
        clipboard.onchange = () => checkAll(); // sekarang baca camStateRef & micStateRef
      } catch {
        // skip
      }

      checkAll();

      if (checkCamera) {
        await initCamera();
      }
    };

    init();

    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
      results.forEach((p) => (p.onchange = null));
    };
  }, [checkCamera]);

  return { showModal };
}
