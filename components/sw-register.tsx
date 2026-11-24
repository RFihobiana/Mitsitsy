"use client";

import { useEffect } from "react";

export function SwRegister() {
  useEffect(() => {
    if (
      process.env.NODE_ENV !== "production" ||
      !("serviceWorker" in navigator)
    )
      return;

    const register = async () => {
      try {
        await navigator.serviceWorker.register("/sw.js");
        const reg = await navigator.serviceWorker.ready;
        const urls = [
          location.href,
          ...performance.getEntriesByType("resource").map((r) => r.name),
        ];
        reg.active?.postMessage({ type: "CACHE_URLS", urls });
      } catch {
        /* offline support is optional: ignore failures */
      }
    };

    if (document.readyState === "complete") register();
    else window.addEventListener("load", register, { once: true });
  }, []);

  return null;
}
