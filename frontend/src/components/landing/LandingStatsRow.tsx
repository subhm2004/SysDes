"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const ITEMS = [
  { target: 30, suffix: "", label: "Components" },
  { target: 35, suffix: "", label: "Problems" },
  { target: 5, suffix: "", label: "Score axes" },
  { target: 500, suffix: "K", label: "Max QPS" },
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

export function LandingStatsRow({ className, floating }: { className?: string; floating?: boolean }) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    const t = window.setTimeout(() => setActive(true), 500);
    return () => clearTimeout(t);
  }, []);

  const d0 = useCountUp(active, ITEMS[0].target, ITEMS[0].suffix, 1200);
  const d1 = useCountUp(active, ITEMS[1].target, ITEMS[1].suffix, 1200);
  const d2 = useCountUp(active, ITEMS[2].target, ITEMS[2].suffix, 1200);
  const d3 = useCountUp(active, ITEMS[3].target, ITEMS[3].suffix, 1200);
  const vals = [d0, d1, d2, d3];

  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-landing bg-landing-accent-soft sm:grid-cols-4",
        floating && "bg-landing-surface shadow-xl shadow-[var(--landing-accent-glow)] backdrop-blur-xl",
        className,
      )}
    >
      {ITEMS.map((item, i) => (
        <div key={item.label} className="bg-landing-surface px-4 py-5 text-center sm:py-6">
          <span className="landing-gradient-text text-3xl font-bold tracking-tight sm:text-4xl">{vals[i]}</span>
          <div className="mt-1 text-xs font-medium uppercase tracking-wide text-landing-muted sm:text-sm">
            {item.label}
          </div>
        </div>
      ))}
    </div>
  );
}
