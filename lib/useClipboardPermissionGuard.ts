"use client";

import { useEffect, useState } from "react";

export function useClipboardPermissionGuard(checkCamera = false) {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const permissionStatuses: PermissionStatus[] = [];

    const updateModal = () => {
      const hasInvalidPermission = permissionStatuses.some(
        (p) => p.state !== "granted"
      );
      setShowModal(hasInvalidPermission);
    };

    const init = async () => {
      // Clipboard selalu dicek
      const permissionsToCheck: PermissionName[] = [
        "clipboard-read" as PermissionName,
      ];

      // Camera & mic hanya dicek kalau halaman memang pakai kamera
      if (checkCamera) {
        permissionsToCheck.push(
          "camera" as PermissionName,
          "microphone" as PermissionName
        );
      }

      for (const permissionName of permissionsToCheck) {
        try {
          const permission = await navigator.permissions.query({
            name: permissionName,
          });
          permissionStatuses.push(permission);
          permission.onchange = () => updateModal();
        } catch {
          // skip
        }
      }

      updateModal();
    };

    init();

    return () => {
      permissionStatuses.forEach((p) => (p.onchange = null));
    };
  }, []);

  return { showModal };
}