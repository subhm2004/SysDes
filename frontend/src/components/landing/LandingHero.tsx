"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ChevronRight } from "lucide-react";
import { LandingStudioMock } from "@/components/landing/LandingStudioMock";
import { LandingHeroStatus } from "@/components/landing/LandingHeroStatus";
import { LandingStatsRow } from "@/components/landing/LandingStatsRow";
import { useHydrationSafeReducedMotion } from "@/hooks/useHydrationSafeReducedMotion";

export function LandingHero() {
  const reduceMotion = useHydrationSafeReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const rotateX = useTransform(scrollYProgress, [0, 0.45], reduceMotion ? [0, 0] : [68, 0]);
  const scale   = useTransform(scrollYProgress, [0, 0.45], reduceMotion ? [1, 1] : [0.78, 1]);
  const translateY = useTransform(scrollYProgress, [0, 0.45], reduceMotion ? [0, 0] : [16, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], reduceMotion ? [1, 1] : [0.85, 1]);

  return (
    <section
      ref={sectionRef}
      id="product"
      className="relative mt-20 flex min-h-[100vh] w-full flex-col overflow-hidden scroll-mt-24 max-lg:mt-[88px]"
    >
      {/* Hero spotlight from top */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[600px] bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgb(99_102_241/0.22),transparent_68%)] dark:bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgb(139_92_246/0.18),transparent_68%)]"
        aria-hidden
      />
      {/* Hero dots pattern */}
      <div
        className="pointer-events-none absolute inset-0 landing-pixa-hero opacity-60 dark:opacity-40"
        aria-hidden
      />
      {/* Bottom fade */}
      <div
        className="pointer-events-none absolute bottom-0 inset-x-0 h-48 bg-linear-to-t from-(--landing-bg) to-transparent"
        aria-hidden
      />

      <div className="relative flex min-h-[100vh] w-full flex-col items-center justify-center gap-6 px-[5%] py-12 max-lg:px-4">

        <motion.div
          className="relative z-10 flex min-h-[50vh] flex-col items-center justify-center text-center"
          initial={reduceMotion ? false : { opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Badge */}
          <motion.a
            href="#features"
            initial={reduceMotion ? false : { opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="mb-7 inline-flex cursor-pointer items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/8 px-4 py-1.5 text-xs font-semibold text-indigo-600 transition-all hover:border-indigo-500/50 hover:bg-indigo-500/12 dark:text-indigo-300"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </span>
            Open source · Free forever · No credit card needed
            <ChevronRight className="h-3 w-3 opacity-60" />
          </motion.a>

          {/* Headline */}
          <motion.h1
            className="max-w-5xl text-balance font-sans font-bold leading-[1.04] tracking-[-0.045em]"
            style={{ fontSize: "clamp(3rem, 8vw, 5.5rem)" }}
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="block text-(--landing-fg)">Ace your next</span>
            <span
              className={`block bg-linear-to-r from-indigo-500 via-violet-400 to-cyan-400 bg-clip-text text-transparent ${reduceMotion ? "" : "landing-hero-headline-shine"}`}
              style={{ backgroundSize: "200% auto" }}
            >
              system design
            </span>
            <span className="block text-(--landing-fg)">interview.</span>
          </motion.h1>

          {/* Sub-copy */}
          <motion.p
            className="mx-auto mt-7 max-w-2xl text-balance text-base leading-relaxed text-landing-muted sm:text-lg sm:leading-relaxed"
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.6 }}
          >
            Draw your system on a canvas, watch traffic flow through it, and get instant
            AI feedback on exactly where your design{" "}
            <span className="font-semibold text-(--landing-fg)">breaks under pressure</span>.
            Practice like it's the real interview.
          </motion.p>

          {/* Live status */}
          <motion.div
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35, duration: 0.5 }}
          >
            <LandingHeroStatus />
          </motion.div>

          {/* CTAs */}
          <motion.div
            className="mt-9 flex flex-wrap items-center justify-center gap-3 max-md:flex-col"
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <Link
              href="/studio"
              className="landing-hero-cta-shine landing-btn-primary group relative flex items-center gap-2.5 rounded-2xl px-7 py-3.5 text-sm font-semibold shadow-lg shadow-indigo-500/20 transition-shadow hover:shadow-xl hover:shadow-indigo-500/30"
            >
              <span>Get started free</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <a
              href="#features"
              className="group flex items-center gap-2 rounded-2xl border border-(--landing-fg)/15 px-7 py-3.5 text-sm font-semibold text-(--landing-fg) backdrop-blur-sm transition-all hover:border-(--landing-fg)/30 hover:bg-(--landing-fg)/5"
            >
              <span>See features</span>
              <ChevronRight className="h-4 w-4 opacity-50 transition-all group-hover:translate-x-0.5 group-hover:opacity-80" />
            </a>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="mt-10 w-full max-w-xl"
            initial={reduceMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.6 }}
          >
            <LandingStatsRow floating />
          </motion.div>
        </motion.div>

        {/* ── Product screenshot ──────────────────────────────────── */}
        <div className="relative z-10 mt-8 flex w-full max-w-[1100px] flex-col items-center">
          {/* Glow behind screenshot */}
          <div
            className="pointer-events-none absolute -top-8 left-1/2 h-[300px] w-[80%] -translate-x-1/2 rounded-full bg-indigo-500/15 blur-[80px] dark:bg-violet-500/12"
            aria-hidden
          />

          <motion.div
            className="relative w-full"
            style={
              reduceMotion
                ? undefined
                : { rotateX, scale, y: translateY, opacity, transformPerspective: 1400 }
            }
          >
            {/* Animated gradient border */}
            <div className="landing-pixa-animated-border w-full">
              <div className="relative min-h-[450px] w-full overflow-hidden rounded-[calc(0.875rem-2px)] border border-landing bg-(--landing-surface) shadow-2xl shadow-black/30 dark:shadow-black/60 max-lg:min-h-90 lg:min-h-150">
                {/* Inner glow */}
                <div
                  className="pointer-events-none absolute inset-0 bg-linear-to-b from-indigo-500/5 via-transparent to-transparent"
                  aria-hidden
                />
                <LandingStudioMock />
              </div>
            </div>

            {/* Reflection */}
            <div
              className="pointer-events-none absolute inset-x-8 -bottom-6 h-12 rounded-full bg-indigo-500/20 blur-2xl dark:bg-violet-500/15"
              aria-hidden
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
