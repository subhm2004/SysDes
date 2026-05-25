"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BarChart3, GitBranch, Zap } from "lucide-react";
import { smoothScrollToId } from "@/lib/smoothScroll";
import { useHydrationSafeReducedMotion } from "@/hooks/useHydrationSafeReducedMotion";

const STATS = [
  { value: "500K", label: "Max QPS" },
  { value: "5", label: "Score axes" },
  { value: "35", label: "Problems" },
] as const;

export function LandingEvidenceSection() {
  const reduceMotion = useHydrationSafeReducedMotion();

  return (
    <section className="relative w-full overflow-hidden px-[5%] py-20 sm:py-28">
      <div className="landing-pixa-purple-blob pointer-events-none absolute right-[10%] top-[10%] h-[220px] w-[220px] opacity-50" aria-hidden />
      <div className="landing-pixa-purple-blob pointer-events-none absolute left-[5%] bottom-[5%] h-[160px] w-[160px] opacity-35" aria-hidden />

      <motion.div
        className="landing-evidence-panel relative mx-auto max-w-4xl overflow-hidden rounded-2xl border border-landing px-6 py-14 text-center sm:px-12 sm:py-16"
        initial={reduceMotion ? false : { opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5 }}
      >
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_80%_at_50%_0%,rgb(99_102_241/0.2),transparent_70%)]"
          aria-hidden
        />

        <div className="relative z-10">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-indigo-500 dark:text-indigo-300">
            Why SysDes
          </p>
          <h2 className="mt-4 font-sans text-3xl font-bold uppercase leading-tight tracking-tight text-[var(--landing-fg)] max-md:text-2xl sm:text-4xl lg:text-5xl">
            Ship interview-ready designs
            <br />
            <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-emerald-400 bg-clip-text font-bold normal-case text-transparent">
              with evidence, not arrows
            </span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-landing-muted sm:text-lg">
            Production-style load through your topology, real bottlenecks on the canvas, and scoring on the same five
            axes Staff+ panels use.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-8 sm:gap-12">
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <p className="font-sans text-3xl font-bold tabular-nums tracking-tight text-[var(--landing-fg)] sm:text-4xl">
                  {s.value}
                </p>
                <p className="mt-1 text-xs font-medium uppercase tracking-wider text-landing-muted">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/studio"
              className="landing-btn-primary group inline-flex items-center gap-2 rounded-xl px-7 py-3.5 text-base font-semibold"
            >
              Open the studio
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <a
              href="#scoring"
              className="inline-flex items-center gap-2 rounded-xl border border-landing px-6 py-3.5 text-sm font-semibold text-[var(--landing-fg)] transition-colors hover:bg-landing-accent-muted"
              onClick={(e) => {
                e.preventDefault();
                smoothScrollToId("scoring");
                window.history.pushState(null, "", "#scoring");
              }}
            >
              <BarChart3 className="h-4 w-4 text-landing-accent" />
              See the rubric
            </a>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-landing-muted sm:text-sm">
            <span className="inline-flex items-center gap-1.5">
              <GitBranch className="h-3.5 w-3.5 text-indigo-500" />
              Live topological flow
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5 text-emerald-500" />
              Instant bottleneck feedback
            </span>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
