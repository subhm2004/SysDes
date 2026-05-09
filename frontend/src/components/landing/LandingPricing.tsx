"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Activity,
  ArrowRight,
  Check,
  Github,
  Infinity,
  LayoutGrid,
  Sparkles,
  Timer,
} from "lucide-react";
import { BRAND } from "@/lib/brand";
import { useHydrationSafeReducedMotion } from "@/hooks/useHydrationSafeReducedMotion";

const INCLUDED = [
  { Icon: LayoutGrid, label: "Full design canvas", detail: "30 production-grade components" },
  { Icon: Activity, label: "Load simulation", detail: "Up to 500K QPS on your topology" },
  { Icon: Timer, label: "Interview mode", detail: "45-min phased timers" },
  { Icon: Sparkles, label: "AI architect", detail: "Optional — your Gemini key" },
] as const;

const PERKS = [
  "35 system design problems",
  "5-axis scoring & verdict bands",
  "Fork, extend & self-host",
  "No signup for local use",
] as const;

export function LandingPricing() {
  const reduceMotion = useHydrationSafeReducedMotion();
  const animate = !reduceMotion;

  return (
    <section id="pricing" className="relative scroll-mt-28 overflow-hidden px-[5%] py-16 max-lg:px-4 sm:py-28">
      <div
        className="landing-pixa-purple-blob pointer-events-none absolute right-[8%] top-[15%] h-[240px] w-[240px] opacity-50"
        aria-hidden
      />
      <div
        className="landing-pixa-purple-blob pointer-events-none absolute left-[5%] bottom-[10%] h-[160px] w-[160px] opacity-35"
        aria-hidden
      />

      <div className="relative mx-auto max-w-4xl">
        <p className="text-center text-sm font-semibold uppercase tracking-[0.14em] text-landing-accent">
          Pricing
        </p>
        <h2 className="mt-3 text-center font-sans text-4xl font-bold tracking-tight text-(--landing-fg) max-md:text-3xl sm:text-5xl">
          Free &amp;{" "}
          <span className="bg-linear-to-r from-emerald-400 to-indigo-400 bg-clip-text text-transparent">
            open source
          </span>
        </h2>
        <p className="mx-auto mt-4 max-w-md text-center text-base text-landing-muted">
          No subscription. No credit card. Clone the repo and run the full studio locally.
        </p>

        <motion.div
          className="mt-12"
          initial={animate ? { opacity: 0, y: 24 } : false}
          whileInView={animate ? { opacity: 1, y: 0 } : undefined}
          viewport={{ once: true, margin: "-40px" }}
        >
          <div className="landing-pixa-animated-border mx-auto max-w-lg">
            <div className="landing-pricing-card relative overflow-hidden rounded-[calc(1rem-2px)] p-8 sm:p-10">
              <div
                className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-indigo-500/20 blur-3xl"
                aria-hidden
              />
              <div
                className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-emerald-500/15 blur-3xl"
                aria-hidden
              />

              <div className="relative flex flex-wrap items-center justify-between gap-3">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/35 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  <Infinity className="h-3.5 w-3.5" aria-hidden />
                  Forever free
                </span>
                <span className="rounded-full border border-landing bg-landing-accent-muted px-3 py-1 font-mono text-xs text-landing-muted">
                  Open source · self-host
                </span>
              </div>

              <div className="relative mt-8 text-center">
                <p className="text-sm font-medium text-landing-muted">Open Studio plan</p>
                <div className="mt-2 flex items-end justify-center gap-0.5">
                  <span
                    className="bg-linear-to-br from-(--landing-fg) to-landing-muted bg-clip-text pb-1 font-sans text-5xl font-bold leading-none text-transparent sm:text-6xl"
                    aria-hidden
                  >
                    ₹
                  </span>
                  <span className="bg-linear-to-br from-(--landing-fg) to-landing-muted bg-clip-text font-sans text-7xl font-bold tabular-nums leading-none tracking-tighter text-transparent sm:text-8xl">
                    0
                  </span>
                </div>
                <p className="mt-1 text-sm text-landing-muted">per month · per engineer · forever</p>
              </div>

              <div className="relative mt-8 grid gap-3 sm:grid-cols-2">
                {INCLUDED.map(({ Icon, label, detail }, i) => (
                  <motion.div
                    key={label}
                    className="flex gap-3 rounded-2xl border border-landing/80 bg-black/[0.03] p-3.5 dark:bg-white/[0.03]"
                    initial={animate ? { opacity: 0, y: 8 } : false}
                    whileInView={animate ? { opacity: 1, y: 0 } : undefined}
                    viewport={{ once: true }}
                    transition={{ delay: 0.05 + i * 0.05 }}
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-500/15 text-indigo-500 dark:text-indigo-300">
                      <Icon className="h-4 w-4" strokeWidth={2} />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-(--landing-fg)">{label}</p>
                      <p className="text-xs text-landing-muted">{detail}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <ul className="relative mt-6 space-y-2.5 border-t border-landing pt-6">
                {PERKS.map((p) => (
                  <li key={p} className="flex items-center gap-2.5 text-sm text-(--landing-fg)">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-500/15">
                      <Check className="h-3 w-3 text-indigo-500 dark:text-indigo-300" strokeWidth={3} />
                    </span>
                    {p}
                  </li>
                ))}
              </ul>

              <div className="relative mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/studio"
                  className="landing-btn-primary group flex flex-1 items-center justify-center gap-2 rounded-2xl py-3.5 text-base font-semibold"
                >
                  Open Studio
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
                <a
                  href={BRAND.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-landing py-3.5 text-base font-semibold text-(--landing-fg) transition-colors hover:bg-landing-accent-muted"
                >
                  <Github className="h-4 w-4" />
                  View on GitHub
                </a>
              </div>

              <p className="relative mt-5 text-center text-xs text-landing-muted">
                Paid interview prep tools often run ₹500–2,000/mo. SysDes is ₹0 because it&apos;s open source.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
