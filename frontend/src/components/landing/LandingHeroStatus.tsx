"use client";

import { useEffect, useState } from "react";

const MESSAGES = [
  "Client → CDN → Load Balancer → API",
  "Cache hit · instant response",
  "Bottleneck detected at database layer",
  "AI evaluation complete · score 78/100",
] as const;

export function LandingHeroStatus() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => setIdx((i) => (i + 1) % MESSAGES.length), 3500);
    return () => clearInterval(id);
  }, []);

  return (
    <p className="mt-3 flex items-center justify-center gap-2 text-xs text-landing-muted sm:text-sm">
      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-landing-accent" aria-hidden />
      <span className="font-mono tabular-nums">{MESSAGES[idx]}</span>
    </p>
  );
}
