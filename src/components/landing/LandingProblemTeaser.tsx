"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ChevronRight } from "lucide-react";
import { PROBLEMS } from "@/data/problems";
import { cn } from "@/lib/utils";

type Filter = "all" | "easy" | "medium" | "hard";

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "easy", label: "Easy" },
  { id: "medium", label: "Medium" },
  { id: "hard", label: "Hard" },
];

function diffClass(d: string) {
  const x = d.toLowerCase();
  if (x === "easy") return "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400";
  if (x === "medium") return "border-amber-500/30 bg-amber-500/10 text-amber-800 dark:text-amber-400";
  return "border-rose-500/30 bg-rose-500/10 text-rose-800 dark:text-rose-300";
}

export function LandingProblemTeaser() {
  const [filter, setFilter] = useState<Filter>("all");

  const list = useMemo(() => {
    const base = PROBLEMS;
    if (filter === "all") return base;
    return base.filter((p) => p.difficulty.toLowerCase() === filter);
  }, [filter]);

  return (
    <div className="w-full min-w-0">
      <div className="mb-3 flex flex-wrap items-center justify-center gap-2 sm:mb-4">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilter(f.id)}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors",
              filter === f.id
                ? "border-violet-500/50 bg-violet-500/15 text-violet-700 dark:text-[#b8a8ff]"
                : "border-border/80 bg-transparent text-muted-foreground hover:border-violet-500/30 hover:bg-violet-500/5",
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <p className="mb-4 flex items-center justify-center gap-1.5 text-center text-sm text-muted-foreground">
        <span className="hidden sm:inline">Scroll sideways</span>
        <span className="sm:hidden">Swipe</span>
        to explore — {list.length} problems
        <ChevronRight className="h-3.5 w-3.5 opacity-60" aria-hidden />
      </p>

      <div className="relative">
        <div
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-[#faf8ff] to-transparent dark:from-[#0a0a0f] sm:w-14"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-[#faf8ff] to-transparent dark:from-[#0a0a0f] sm:w-14"
          aria-hidden
        />

        <div
          className="landing-problems-strip flex snap-x snap-mandatory gap-3 overflow-x-auto overflow-y-hidden overscroll-x-contain px-1 pb-3 pt-1 [-webkit-overflow-scrolling:touch] scroll-smooth"
          tabIndex={0}
          role="region"
          aria-label="Design problems — scroll horizontally"
        >
          {list.map((p) => (
            <Link
              key={p.id}
              href="/studio"
              className="group w-[min(17.5rem,calc(100vw-3.5rem))] shrink-0 snap-start rounded-xl border border-border/80 bg-card/90 px-4 py-4 font-sans shadow-sm transition-all hover:-translate-y-0.5 hover:border-violet-500/40 hover:shadow-md hover:shadow-violet-500/10 dark:bg-[#100e1a]/90"
            >
              <div className="text-base font-semibold leading-snug tracking-tight text-foreground group-hover:text-violet-700 dark:group-hover:text-[#c8c0ff]">
                {p.title}
              </div>
              <div className="mt-3">
                <span
                  className={cn(
                    "inline-block rounded-full border px-2 py-0.5 text-xs font-bold uppercase tracking-wide",
                    diffClass(p.difficulty),
                  )}
                >
                  {p.difficulty}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
