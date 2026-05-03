"use client";

import { useEffect, useRef, useState } from "react";

const ITEMS = [
  { target: 30, suffix: "", label: "Components" },
  { target: 35, suffix: "", label: "Design problems" },
  { target: 5, suffix: "", label: "Score categories" },
  { target: 500, suffix: "K", label: "Max QPS (CDN tier)" },
] as const;

function useCountUp(active: boolean, target: number, suffix: string, durationMs: number) {
  const [v, setV] = useState(0);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    if (!active) return;
    startRef.current = null;
    let raf = 0;
    const tick = (now: number) => {
      if (startRef.current === null) startRef.current = now;
      const p = Math.min((now - startRef.current) / durationMs, 1);
      const ease = 1 - (1 - p) ** 3;
      setV(Math.round(ease * target));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, target, durationMs]);

  return `${v}${suffix}`;
}

export function LandingStatsRow() {
  const [active, setActive] = useState(false);

  useEffect(() => {
    const t = window.setTimeout(() => setActive(true), 400);
    return () => clearTimeout(t);
  }, []);

  const d0 = useCountUp(active, ITEMS[0].target, ITEMS[0].suffix, 1200);
  const d1 = useCountUp(active, ITEMS[1].target, ITEMS[1].suffix, 1200);
  const d2 = useCountUp(active, ITEMS[2].target, ITEMS[2].suffix, 1200);
  const d3 = useCountUp(active, ITEMS[3].target, ITEMS[3].suffix, 1200);
  const vals = [d0, d1, d2, d3];

  return (
    <div className="mx-auto mt-16 grid max-w-3xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-violet-500/20 bg-violet-500/15 dark:border-violet-400/20 dark:bg-violet-500/10 sm:grid-cols-4">
      {ITEMS.map((item, i) => (
        <div
          key={item.label}
          className="bg-background/95 px-4 py-6 text-center dark:bg-[#0a0a0f]/95"
        >
          <span className="text-3xl font-medium tracking-tight text-violet-600 dark:text-[#b8a8ff] sm:text-4xl">
            {vals[i]}
          </span>
          <div className="mt-1 text-sm text-muted-foreground">{item.label}</div>
        </div>
      ))}
    </div>
  );
}
