// hooks/useClipboardPermissionGuard.ts
"use client";

import { useEffect, useState } from "react";

export function useClipboardPermissionGuard() {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    let permStatus: PermissionStatus;

    const init = async () => {
      try {
        permStatus = await navigator.permissions.query({
          name: "clipboard-read" as PermissionName,
        });

        // Cek saat pertama load
        if (permStatus.state !== "granted") {
          setShowModal(true);
        }

        // Listen perubahan real-time
        permStatus.onchange = () => {
          setShowModal(permStatus.state !== "granted");
        };
      } catch {
        // browser tidak support, abaikan
      }
    };

    init();

    return () => {
      if (permStatus) permStatus.onchange = null;
    };
  }, []);

  return { showModal };
}