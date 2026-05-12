"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Github, Layers, Play, Star, Zap } from "lucide-react";
import { BRAND } from "@/lib/brand";
import { useHydrationSafeReducedMotion } from "@/hooks/useHydrationSafeReducedMotion";

const PERKS = [
  { Icon: Layers, label: "30+ components" },
  { Icon: Play, label: "Live simulation" },
  { Icon: Zap, label: "Instant AI scoring" },
  { Icon: Star, label: "Free forever" },
] as const;

export function LandingFinalCta() {
  const reduceMotion = useHydrationSafeReducedMotion();

  return (
    <section className="relative px-[5%] py-16 max-lg:px-4 sm:py-24">
      <motion.div
        className="relative mx-auto max-w-4xl overflow-hidden"
        initial={reduceMotion ? false : { opacity: 0, y: 24 }}
        whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
      >
        <div className="landing-pixa-animated-border">
          <div className="landing-final-cta relative overflow-hidden rounded-[calc(1rem-2px)] px-6 py-16 text-center sm:px-12 sm:py-20">
            {/* Background blobs */}
            <div className="landing-pixa-purple-blob pointer-events-none absolute -left-16 top-0 h-[200px] w-[200px] opacity-60" aria-hidden />
            <div className="landing-pixa-purple-blob pointer-events-none absolute -right-12 bottom-0 h-[180px] w-[180px] opacity-50" aria-hidden />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgb(99_102_241/0.18),transparent_65%)]" aria-hidden />

            <div className="relative z-10">
              <span className="landing-badge-live text-sm text-(--landing-fg)">
                Start for free — sign in with Google
              </span>

              <h2 className="mt-6 font-sans text-3xl font-bold leading-tight tracking-tight text-(--landing-fg) max-md:text-2xl sm:text-4xl lg:text-5xl">
                Your next system design loop{" "}
                <br className="hidden sm:block" />
                <span className="bg-linear-to-r from-indigo-500 via-violet-400 to-emerald-400 bg-clip-text text-transparent">
                  starts right here.
                </span>
              </h2>

              <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-landing-muted sm:text-lg">
                Open the studio, pick a problem, wire your architecture, run load, and get scored — all in one place.
              </p>

              {/* Perks */}
              <div className="mt-8 flex flex-wrap items-center justify-center gap-2.5">
                {PERKS.map(({ Icon, label }) => (
                  <span
                    key={label}
                    className="inline-flex items-center gap-1.5 rounded-full border border-landing bg-black/[0.04] px-3.5 py-1.5 text-xs font-medium text-landing-muted dark:bg-white/[0.04]"
                  >
                    <Icon className="h-3.5 w-3.5 text-indigo-500 dark:text-indigo-300" aria-hidden />
                    {label}
                  </span>
                ))}
              </div>

              {/* CTAs */}
              <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
                <Link
                  href="/studio"
                  className="landing-hero-cta-shine landing-btn-primary group inline-flex w-full max-w-xs items-center justify-center gap-2 rounded-2xl px-8 py-4 text-base font-semibold sm:w-auto"
                >
                  Launch {BRAND.name}
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
                <a
                  href={BRAND.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full max-w-xs items-center justify-center gap-2 rounded-2xl border border-landing px-8 py-4 text-base font-semibold text-(--landing-fg) transition-colors hover:bg-landing-accent-muted sm:w-auto"
                >
                  <Github className="h-4 w-4" />
                  Star on GitHub
                </a>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
