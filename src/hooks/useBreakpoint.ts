"use client";

import { useEffect, useState } from "react";

const MOBILE_MAX = 767; // matches Tailwind's `md` breakpoint

/**
 * Returns `true` when the viewport is narrower than the `md` breakpoint (768px).
 * SSR-safe: returns `false` on the server; updates after mount.
 */
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${MOBILE_MAX}px)`);
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return isMobile;
}
