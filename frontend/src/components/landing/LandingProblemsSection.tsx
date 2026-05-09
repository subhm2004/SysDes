"use client";

import { motion } from "framer-motion";
import { LandingProblemTeaser } from "@/components/landing/LandingProblemTeaser";
import { useHydrationSafeReducedMotion } from "@/hooks/useHydrationSafeReducedMotion";
import { PROBLEMS } from "@/data/problems";

export function LandingProblemsSection() {
  const reduceMotion = useHydrationSafeReducedMotion();

  return (
    <section id="problems" className="relative scroll-mt-28 overflow-hidden px-[5%] py-16 max-lg:px-4 sm:py-28">
      <div
        className="landing-pixa-purple-blob pointer-events-none absolute left-[12%] top-[25%] h-[200px] w-[200px] opacity-40"
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl">
        <motion.div
          className="text-center"
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-landing-accent">
            Practice bank
          </p>
          <h2 className="mt-3 font-sans text-4xl font-bold tracking-tight text-(--landing-fg) max-md:text-3xl sm:text-5xl">
            <span className="tabular-nums">{PROBLEMS.length}</span> system design{" "}
            <span className="bg-linear-to-r from-indigo-500 to-violet-400 bg-clip-text text-transparent">
              problems
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-landing-muted">
            Easy to Hard — open any card and land in the studio with the full prompt, requirements, and hints loaded.
          </p>
        </motion.div>

        <div className="mt-12">
          <LandingProblemTeaser />
        </div>
      </div>
    </section>
  );
}
