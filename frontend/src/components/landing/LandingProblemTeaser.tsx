"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUpRight,
  Flame,
  Layers,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import { PROBLEMS } from "@/data/problems";
import { PROBLEM_COMPANIES, TOP_COMPANIES } from "@/data/problemCompanies";
import { cn } from "@/lib/utils";
import { useHydrationSafeReducedMotion } from "@/hooks/useHydrationSafeReducedMotion";

type Difficulty = "all" | "easy" | "medium" | "hard";

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

const DIFFICULTY_FILTERS: { id: Difficulty; label: string }[] = [
  { id: "all", label: "All" },
  { id: "easy", label: "Easy" },
  { id: "medium", label: "Medium" },
  { id: "hard", label: "Hard" },
];

export function LandingProblemTeaser() {
  const [difficulty, setDifficulty] = useState<Difficulty>("all");
  const [company, setCompany] = useState<string | null>(null);
  const [query, setQuery] = useState("");
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
    let result = PROBLEMS;
    if (difficulty !== "all")
      result = result.filter((p) => p.difficulty.toLowerCase() === difficulty);
    if (company)
      result = result.filter((p) => (PROBLEM_COMPANIES[p.id] ?? []).includes(company));
    if (query.trim())
      result = result.filter((p) =>
        p.title.toLowerCase().includes(query.trim().toLowerCase()) ||
        p.tags.some((t) => t.toLowerCase().includes(query.trim().toLowerCase()))
      );
    return result;
  }, [difficulty, company, query]);

  const hasFilters = difficulty !== "all" || company !== null || query.trim() !== "";

  return (
    <div className="w-full min-w-0">
      {/* ── Filter bar ─────────────────────────────────────────── */}
      <div className="mx-auto mb-8 flex max-w-4xl flex-col gap-4">
        {/* Search input */}
        <div className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-landing-muted" />
          <input
            type="text"
            placeholder="Search problems or tags…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-xl border border-landing bg-(--landing-surface) py-2.5 pl-10 pr-10 text-sm text-(--landing-fg) placeholder:text-landing-muted focus:border-indigo-500/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-0.5 text-landing-muted hover:text-(--landing-fg)"
              aria-label="Clear search"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Difficulty + Company pills */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Difficulty */}
          <div className="flex items-center gap-1.5 rounded-xl border border-landing bg-(--landing-surface) p-1">
            {DIFFICULTY_FILTERS.map((f) => (
              <button
                key={f.id}
                onClick={() => setDifficulty(f.id)}
                className={cn(
                  "rounded-lg px-3 py-1 text-xs font-semibold transition-all",
                  difficulty === f.id
                    ? "bg-(--landing-fg) text-(--landing-bg) shadow-sm"
                    : "text-landing-muted hover:text-(--landing-fg)",
                )}
              >
                {f.label}
                {f.id !== "all" && (
                  <span className="ml-1 opacity-60">
                    {counts[f.id]}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Separator */}
          <div className="h-6 w-px bg-landing/80" />

          {/* Company pills */}
          {TOP_COMPANIES.map((c) => (
            <button
              key={c}
              onClick={() => setCompany(company === c ? null : c)}
              className={cn(
                "rounded-full border px-3 py-1 text-xs font-semibold transition-all",
                company === c
                  ? "border-indigo-500/50 bg-indigo-500/15 text-indigo-600 dark:text-indigo-300"
                  : "border-landing bg-(--landing-surface) text-landing-muted hover:border-indigo-500/30 hover:text-(--landing-fg)",
              )}
            >
              {c}
            </button>
          ))}

          {/* Clear all */}
          {hasFilters && (
            <button
              onClick={() => { setDifficulty("all"); setCompany(null); setQuery(""); }}
              className="ml-auto flex items-center gap-1 text-xs text-landing-muted hover:text-(--landing-fg) transition-colors"
            >
              <X className="h-3 w-3" /> Clear
            </button>
          )}
        </div>

        {/* Result count */}
        <p className="text-xs text-landing-muted">
          <span className="font-semibold text-(--landing-fg)">{list.length}</span>{" "}
          {list.length === 1 ? "problem" : "problems"} in view
          {company && <span> · <span className="text-indigo-500 dark:text-indigo-300">{company}</span></span>}
          {difficulty !== "all" && (
            <span> · <span className="capitalize">{difficulty}</span></span>
          )}
        </p>
      </div>

      {/* ── Cards strip ─────────────────────────────────────────── */}
      <div className="landing-problems-panel relative overflow-hidden rounded-2xl border border-landing">
        <div className="overflow-x-auto">
          <div className="landing-problems-strip flex min-h-[300px] gap-4 p-5 pb-4">
            <AnimatePresence mode="popLayout" initial={false}>
              {list.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex w-full flex-col items-center justify-center gap-3 py-16 text-center"
                >
                  <Search className="h-8 w-8 text-landing-muted opacity-50" />
                  <p className="text-sm text-landing-muted">No problems match these filters.</p>
                  <button
                    onClick={() => { setDifficulty("all"); setCompany(null); setQuery(""); }}
                    className="text-xs font-semibold text-indigo-500 hover:underline dark:text-indigo-300"
                  >
                    Clear filters
                  </button>
                </motion.div>
              ) : (
                list.map((p, i) => {
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
                        className="landing-problem-card group relative flex h-full w-[min(19rem,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-xl border border-landing bg-(--landing-surface) transition-all hover:-translate-y-1 hover:border-indigo-500/40 hover:shadow-lg hover:shadow-indigo-500/10"
                      >
                        <div className={cn("h-1 w-full bg-linear-to-r", style.bar)} aria-hidden />
                        <div className="flex flex-1 flex-col p-5">
                          <div className="flex items-start justify-between gap-3">
                            <span className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", style.iconBg)}>
                              <Icon className="h-5 w-5" strokeWidth={2} />
                            </span>
                            <span className={cn("rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider", style.badge)}>
                              {p.difficulty}
                            </span>
                          </div>

                          <h3 className="mt-4 text-lg font-semibold leading-snug tracking-tight text-(--landing-fg) transition-colors group-hover:text-indigo-500 dark:group-hover:text-indigo-300">
                            {p.title}
                          </h3>
                          <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-landing-muted">
                            {p.description}
                          </p>

                          {/* Tags */}
                          {p.tags.length > 0 && (
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
                          )}

                          {/* Companies */}
                          {(PROBLEM_COMPANIES[p.id]?.length ?? 0) > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1">
                              {(PROBLEM_COMPANIES[p.id] ?? []).slice(0, 3).map((c) => (
                                <span key={c} className="text-[10px] text-landing-muted opacity-60">
                                  {c}
                                  {PROBLEM_COMPANIES[p.id].indexOf(c) < Math.min(2, PROBLEM_COMPANIES[p.id].length - 1) ? " ·" : ""}
                                </span>
                              ))}
                            </div>
                          )}

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
                })
              )}
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
