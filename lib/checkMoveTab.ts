"use client";

import { useEffect, useRef } from "react";

type TabEvent = {
  type: "TAB_HIDDEN";
};

export const checkMoveTab = () => {
  // const tabEventsRef = useRef<TabEvent[]>([]);
  // const sendBeaconData = () => {
  //   if (tabEventsRef.current.length === 0) return;
  //   const testSession = sessionStorage.getItem("testSession");
  //   if (!testSession) return; // jangan pakai alert di sini
  //   const testSessionParsed = JSON.parse(testSession);
  //   const sessionId = testSessionParsed.sessionId;
  //   const payload = {
  //     sessionId: sessionId,
  //     events: tabEventsRef.current,
  //     timestamp: Date.now(),
  //   };
  //   const blob = new Blob([JSON.stringify(payload)], {
  //     type: "application/json",
  //   });
  //   const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/tab-switch`;
  //   if (navigator.sendBeacon) {
  //     navigator.sendBeacon(url, blob);
  //   }
  //   // reset buffer
  //   tabEventsRef.current = [];
  // };
  // useEffect(() => {
  //   const handleVisibilityChange = () => {
  //     if (document.hidden) {
  //       tabEventsRef.current.push({
  //         type: "TAB_HIDDEN",
  //       });
  //       sendBeaconData();
  //     }
  //   };
  //   document.addEventListener("visibilitychange", handleVisibilityChange);
  //   window.addEventListener("beforeunload", sendBeaconData);
  //   return () => {
  //     document.removeEventListener("visibilitychange", handleVisibilityChange);
  //     window.removeEventListener("beforeunload", sendBeaconData);
  //   };
  // }, []);
};
