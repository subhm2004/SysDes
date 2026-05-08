"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Gauge,
  Layers,
  Shield,
  Timer,
  TrendingDown,
  Wallet,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useHydrationSafeReducedMotion } from "@/hooks/useHydrationSafeReducedMotion";
import { cn } from "@/lib/utils";

const OVERALL = 82;

const VERDICT_BANDS = [
  { label: "Needs work", min: 0, active: false },
  { label: "Developing", min: 31, active: false },
  { label: "Good", min: 51, active: true },
  { label: "Strong", min: 71, active: false },
  { label: "Architect", min: 86, active: false },
] as const;

const AXES: {
  name: string;
  pct: number;
  Icon: LucideIcon;
  hint: string;
}[] = [
  { name: "Scalability", pct: 88, Icon: Layers, hint: "Horizontal scale & bottlenecks" },
  { name: "Availability", pct: 74, Icon: Shield, hint: "Fault tolerance & replication" },
  { name: "Latency", pct: 91, Icon: Timer, hint: "P99 paths & caching" },
  { name: "Cost", pct: 65, Icon: Wallet, hint: "Infra spend vs requirements" },
  { name: "Trade-offs", pct: 82, Icon: TrendingDown, hint: "CAP, consistency, patterns" },
];

function barTone(pct: number) {
  if (pct >= 80) return "from-emerald-500 to-emerald-400";
  if (pct >= 65) return "from-indigo-500 to-violet-400";
  if (pct >= 50) return "from-amber-500 to-amber-400";
  return "from-rose-500 to-rose-400";
}

function ScoreRing({ score, animate }: { score: number; animate: boolean }) {
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;
  const strokeColor = score >= 71 ? "#10b981" : score >= 51 ? "#6366f1" : score >= 31 ? "#f59e0b" : "#ef4444";

  return (
    <div className="relative flex h-[148px] w-[148px] items-center justify-center sm:h-[168px] sm:w-[168px]">
      <div
        className="pointer-events-none absolute inset-2 rounded-full opacity-60 blur-2xl"
        style={{ background: `radial-gradient(circle, ${strokeColor}55 0%, transparent 70%)` }}
        aria-hidden
      />
      <svg width="168" height="168" className="-rotate-90" aria-hidden>
        <circle cx="84" cy="84" r={radius} fill="none" stroke="var(--landing-border)" strokeWidth="8" />
        <motion.circle
          cx="84"
          cy="84"
          r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={animate ? { strokeDashoffset: circumference } : false}
          whileInView={animate ? { strokeDashoffset: circumference - progress } : undefined}
          viewport={{ once: true }}
          transition={{ duration: 1.1, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center font-sans">
        <span className="text-5xl font-bold tabular-nums tracking-tight text-(--landing-fg) sm:text-6xl">
          {score}
        </span>
        <span className="text-sm text-landing-muted">/ 100</span>
      </div>
    </div>
  );
}

export function LandingScoreShowcase() {
  const reduceMotion = useHydrationSafeReducedMotion();
  const animate = !reduceMotion;

  return (
    <motion.div
      className="landing-score-panel mt-12 overflow-hidden rounded-2xl border border-landing"
      initial={animate ? { opacity: 0, y: 20 } : false}
      whileInView={animate ? { opacity: 1, y: 0 } : undefined}
      viewport={{ once: true, margin: "-60px" }}
    >
      <div className="grid lg:grid-cols-[minmax(260px,320px)_1fr]">
        {/* Overall */}
        <div className="flex flex-col items-center border-b border-landing px-6 py-10 text-center lg:border-b-0 lg:border-r">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-landing-muted">Overall score</p>
          <div className="mt-6">
            <ScoreRing score={OVERALL} animate={animate} />
          </div>
          <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5">
            <Gauge className="h-4 w-4 text-emerald-500" aria-hidden />
            <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
              Good — approaching Architect
            </span>
          </div>
          <p className="mt-4 max-w-[240px] text-sm leading-relaxed text-landing-muted">
            Same rubric engine as the studio — run simulation, then evaluate your diagram.
          </p>

          <div className="mt-8 w-full">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-landing-muted">Verdict bands</p>
            <div className="flex flex-wrap justify-center gap-1.5">
              {VERDICT_BANDS.map((b) => (
                <span
                  key={b.label}
                  className={cn(
                    "rounded-md px-2 py-1 text-[10px] font-medium sm:text-xs",
                    b.active
                      ? "bg-indigo-500/15 text-indigo-600 ring-1 ring-indigo-500/40 dark:text-indigo-300"
                      : "bg-landing-accent-muted text-landing-muted",
                  )}
                >
                  {b.label}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Axes */}
        <div className="flex flex-col p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-sans text-lg font-semibold tracking-tight text-(--landing-fg) sm:text-xl">
                Five-axis breakdown
              </h3>
              <p className="mt-1 text-sm text-landing-muted">What Staff+ panels actually grade on.</p>
            </div>
            <span className="hidden rounded-lg border border-landing bg-landing-accent-muted px-2.5 py-1 font-mono text-xs text-landing-muted sm:inline">
              /studio
            </span>
          </div>

          <ul className="mt-8 flex flex-1 flex-col gap-5">
            {AXES.map((a, i) => (
              <li key={a.name}>
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-landing bg-landing-accent-muted text-landing-accent">
                    <a.Icon className="h-4 w-4" strokeWidth={2} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="text-sm font-semibold text-(--landing-fg)">{a.name}</span>
                      <span className="font-mono text-sm font-bold tabular-nums text-(--landing-fg)">{a.pct}</span>
                    </div>
                    <p className="mt-0.5 text-xs text-landing-muted">{a.hint}</p>
                    <div className="mt-2.5 h-2 overflow-hidden rounded-full bg-landing-accent-muted">
                      <motion.div
                        className={cn("h-full rounded-full bg-linear-to-r", barTone(a.pct))}
                        initial={animate ? { width: 0 } : false}
                        whileInView={animate ? { width: `${a.pct}%` } : undefined}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, ease: "easeOut", delay: i * 0.06 }}
                      />
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-col gap-3 border-t border-landing pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-landing-muted">
              <span className="font-medium text-(--landing-fg)">86+</span> hits Architect band in the studio.
            </p>
            <Link
              href="/studio"
              className="landing-btn-primary inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold"
            >
              Run simulation
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
