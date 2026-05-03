"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * Framer's `useReducedMotion()` is `null` during SSR, then may become `true` on the client.
 * Using it directly for `initial` / first-paint props causes hydration mismatches for users
 * with "reduce motion" enabled. We only respect reduced motion after mount so server and
 * first client pass match.
 */
export function useHydrationSafeReducedMotion(): boolean {
  const [mounted, setMounted] = useState(false);
  const reduced = useReducedMotion();
  useEffect(() => setMounted(true), []);
  return mounted && reduced === true;
}
