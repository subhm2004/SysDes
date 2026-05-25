"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import { LandingStudioMock } from "@/components/landing/LandingStudioMock";
import { useHydrationSafeReducedMotion } from "@/hooks/useHydrationSafeReducedMotion";

export function LandingHero() {
  const reduceMotion = useHydrationSafeReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const rotateX = useTransform(scrollYProgress, [0, 0.45], reduceMotion ? [0, 0] : [70, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.45], reduceMotion ? [1, 1] : [0.8, 1]);
  const translateY = useTransform(scrollYProgress, [0, 0.45], reduceMotion ? [0, 0] : [12, 0]);

  return (
    <section
      ref={sectionRef}
      id="product"
      className="landing-pixa-hero relative mt-20 flex min-h-[100vh] w-full flex-col overflow-hidden scroll-mt-24 max-lg:mt-[88px]"
    >
      <div className="landing-pixa-hero-gradient relative flex min-h-[100vh] w-full flex-col items-center justify-center gap-6 px-[5%] py-8 max-lg:px-4">
        <div
          className="landing-pixa-purple-blob pointer-events-none absolute left-1/2 top-[10%] h-[120px] w-[120px] -translate-x-1/2"
          aria-hidden
        />

        <motion.div
          className="relative z-10 flex min-h-[50vh] flex-col items-center justify-center text-center"
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-indigo-600 dark:text-indigo-300">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgb(52_211_153/0.8)]" aria-hidden />
            Open source · Live simulation
          </p>
          <h1 className="landing-hero-headline max-w-4xl text-balance">
            <span className="block text-[var(--landing-fg)]">Practice system design</span>
            <span
              className={`landing-hero-headline-accent mt-2 block ${reduceMotion ? "" : "landing-hero-headline-shine"}`}
            >
              with live traffic
            </span>
          </h1>
          <p className="mt-6 max-w-md text-balance font-sans text-base leading-snug text-landing-muted sm:text-lg sm:leading-relaxed">
            Drag production components, run load up to{" "}
            <span className="font-medium text-[var(--landing-fg)]">500K QPS</span>, and get a five-axis score — on
            one free, open-source canvas.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4 max-md:flex-col">
            <Link
              href="/studio"
              className="landing-btn-primary group flex w-[170px] items-center justify-center gap-2 rounded-xl px-4 py-4 text-sm font-semibold transition-transform duration-300 max-lg:w-[160px] max-lg:py-3 hover:scale-[1.03]"
            >
              <span>Get started</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <a
              href="#features"
              className="flex w-[170px] items-center justify-center gap-2 rounded-xl border border-[var(--landing-fg)] bg-transparent px-4 py-4 text-sm font-semibold text-[var(--landing-fg)] transition-transform duration-300 max-lg:w-[160px] max-lg:py-3 hover:translate-x-0.5"
            >
              <Play className="h-4 w-4" />
              <span>See features</span>
            </a>
          </div>
        </motion.div>

        <div className="relative z-10 mt-6 flex w-full max-w-[1024px] flex-col items-center">
          <div
            className="landing-pixa-purple-blob pointer-events-none absolute left-1/2 top-[5%] h-[200px] w-[200px] -translate-x-1/2"
            aria-hidden
          />

          <motion.div
            className="landing-pixa-dashboard relative w-full max-w-[90%] min-w-[320px] lg:max-w-full"
            style={
              reduceMotion
                ? undefined
                : {
                    rotateX,
                    scale,
                    y: translateY,
                    transformPerspective: 1200,
                  }
            }
          >
            <div className="landing-pixa-animated-border w-full shadow-xl">
              <div className="relative min-h-[450px] w-full overflow-hidden rounded-[calc(0.75rem-2px)] border border-landing bg-[var(--landing-surface)] shadow-xl max-lg:min-h-[380px] lg:min-h-[580px]">
                <div
                  className="landing-pixa-purple-blob pointer-events-none absolute inset-0 opacity-40"
                  aria-hidden
                />
                <LandingStudioMock />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
