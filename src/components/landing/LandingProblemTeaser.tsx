"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUpRight,
  BookOpen,
  ChevronRight,
  Flame,
  Layers,
  Sparkles,
} from "lucide-react";
import { PROBLEMS } from "@/data/problems";
import { cn } from "@/lib/utils";
import { useHydrationSafeReducedMotion } from "@/hooks/useHydrationSafeReducedMotion";

type Filter = "all" | "easy" | "medium" | "hard";

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "easy", label: "Easy" },
  { id: "medium", label: "Medium" },
  { id: "hard", label: "Hard" },
];

function formatRate(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1)}M`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}K`;
  return String(n);
}

function diffStyles(d: string) {
  const x = d.toLowerCase();
  if (x === "easy")
    return {
      badge: "border-emerald-500/35 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
      bar: "from-emerald-500 to-emerald-400",
      icon: Sparkles,
      iconBg: "bg-emerald-500/15 text-emerald-500 dark:text-emerald-400",
    };
  if (x === "medium")
    return {
      badge: "border-amber-500/35 bg-amber-500/10 text-amber-700 dark:text-amber-400",
      bar: "from-amber-500 to-amber-400",
      icon: Layers,
      iconBg: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
    };
  return {
    badge: "border-rose-500/35 bg-rose-500/10 text-rose-600 dark:text-rose-400",
    bar: "from-rose-500 to-rose-400",
    icon: Flame,
    iconBg: "bg-rose-500/15 text-rose-500 dark:text-rose-400",
  };
}

export function LandingProblemTeaser() {
  const [filter, setFilter] = useState<Filter>("all");
  const reduceMotion = useHydrationSafeReducedMotion();

  const counts = useMemo(() => {
    const c = { all: PROBLEMS.length, easy: 0, medium: 0, hard: 0 };
    for (const p of PROBLEMS) {
      const d = p.difficulty.toLowerCase() as "easy" | "medium" | "hard";
      c[d]++;
    }
    return c;
  }, []);

  const list = useMemo(() => {
    if (filter === "all") return PROBLEMS;
    return PROBLEMS.filter((p) => p.difficulty.toLowerCase() === filter);
  }, [filter]);

  return (
    <div className="w-full min-w-0">
      <div className="mx-auto mb-8 flex max-w-2xl flex-wrap items-center justify-center gap-3">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilter(f.id)}
            className={cn(
              "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-all",
              filter === f.id
                ? "border-indigo-500/50 bg-indigo-500/15 text-indigo-600 shadow-sm dark:text-indigo-300"
                : "border-landing text-landing-muted hover:border-indigo-500/30 hover:bg-landing-accent-muted hover:text-[var(--landing-fg)]",
            )}
          >
            {f.label}
            <span
              className={cn(
                "rounded-full px-1.5 py-0.5 font-mono text-[10px]",
                filter === f.id ? "bg-indigo-500/20" : "bg-landing-accent-muted",
              )}
            >
              {counts[f.id]}
            </span>
          </button>
        ))}
      </div>

      <div className="landing-problems-panel overflow-hidden rounded-2xl border border-landing">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-landing px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2 text-sm text-landing-muted">
            <BookOpen className="h-4 w-4 text-landing-accent" aria-hidden />
            <span>
              <span className="font-semibold text-[var(--landing-fg)]">{list.length}</span> problems in view
            </span>
          </div>
          <p className="flex items-center gap-1 text-xs text-landing-muted sm:text-sm">
            <span className="hidden sm:inline">Scroll to explore</span>
            <span className="sm:hidden">Swipe</span>
            <ChevronRight className="h-3.5 w-3.5" aria-hidden />
          </p>
        </div>

        <div className="relative">
          <div
            className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-[var(--landing-surface-2)] to-transparent sm:w-20"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-[var(--landing-surface-2)] to-transparent sm:w-20"
            aria-hidden
          />

          <div
            className="landing-problems-strip flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 py-5 sm:px-6 sm:py-6 [-webkit-overflow-scrolling:touch]"
            tabIndex={0}
            role="region"
            aria-label="Design problems — scroll horizontally"
          >
            <AnimatePresence mode="popLayout">
              {list.map((p, i) => {
                const style = diffStyles(p.difficulty);
                const Icon = style.icon;
                return (
                  <motion.div
                    key={p.id}
                    layout
                    initial={reduceMotion ? false : { opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={reduceMotion ? undefined : { opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.25, delay: reduceMotion ? 0 : Math.min(i * 0.03, 0.2) }}
                    className="shrink-0 snap-start"
                  >
                    <Link
                      href="/studio"
                      className="landing-problem-card group relative flex h-full w-[min(19rem,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-xl border border-landing bg-[var(--landing-surface)] transition-all hover:-translate-y-1 hover:border-indigo-500/40 hover:shadow-lg hover:shadow-indigo-500/10"
                    >
                      <div
                        className={cn("h-1 w-full bg-gradient-to-r", style.bar)}
                        aria-hidden
                      />
                      <div className="flex flex-1 flex-col p-5">
                        <div className="flex items-start justify-between gap-3">
                          <span
                            className={cn(
                              "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                              style.iconBg,
                            )}
                          >
                            <Icon className="h-5 w-5" strokeWidth={2} />
                          </span>
                          <span
                            className={cn(
                              "rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                              style.badge,
                            )}
                          >
                            {p.difficulty}
                          </span>
                        </div>

                        <h3 className="mt-4 text-lg font-semibold leading-snug tracking-tight text-[var(--landing-fg)] transition-colors group-hover:text-indigo-500 dark:group-hover:text-indigo-300">
                          {p.title}
                        </h3>
                        <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-landing-muted">
                          {p.description}
                        </p>

                        {p.tags.length > 0 ? (
                          <div className="mt-3 flex flex-wrap gap-1.5">
                            {p.tags.slice(0, 3).map((tag) => (
                              <span
                                key={tag}
                                className="rounded-md border border-landing bg-landing-accent-muted px-2 py-0.5 text-[10px] font-medium text-landing-muted"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        ) : null}

                        <div className="mt-4 flex items-center justify-between gap-2 border-t border-landing pt-3">
                          <div className="flex flex-wrap gap-x-3 gap-y-1 font-mono text-[10px] text-landing-muted sm:text-xs">
                            <span>{formatRate(p.requirements.readsPerSec)} reads/s</span>
                            <span>{p.requirements.latencyMs}ms p99</span>
                          </div>
                          <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-indigo-500 opacity-80 transition-all group-hover:gap-1 group-hover:opacity-100 dark:text-indigo-300">
                            Open
                            <ArrowUpRight className="h-3.5 w-3.5" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <p className="mt-6 text-center text-sm text-landing-muted">
        Each problem loads requirements, hints, and constraints directly in the studio.
      </p>
    </div>
  );
}
