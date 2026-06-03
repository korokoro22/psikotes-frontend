// hooks/usePermissionGuard.ts
"use client";

import { useEffect, useState } from "react";

export function useClipboardPermissionGuard() {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const permissionStatuses: PermissionStatus[] = [];

    const updateModal = () => {
      const hasInvalidPermission = permissionStatuses.some(
        (permission) => permission.state !== "granted"
      );

      setShowModal(hasInvalidPermission);
    };

    const init = async () => {
      try {
        const permissionsToCheck: PermissionName[] = [
          "clipboard-read" as PermissionName,
          "camera" as PermissionName,
          "microphone" as PermissionName,
        ];

        for (const permissionName of permissionsToCheck) {
          try {
            const permission = await navigator.permissions.query({
              name: permissionName,
            });

            permissionStatuses.push(permission);

            permission.onchange = () => {
              updateModal();
            };
          } catch {
            // Browser tidak mendukung permission tertentu
          }
        }

        updateModal();
      } catch (error) {
        console.error("Permission check error:", error);
      }
    };

    init();

    return () => {
      permissionStatuses.forEach((permission) => {
        permission.onchange = null;
      });
    };
  }, []);

  return { showModal };
}