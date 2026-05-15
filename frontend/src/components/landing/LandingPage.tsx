"use client";

import { useEffect } from "react";
import { smoothScrollToId } from "@/lib/smoothScroll";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { LandingHero } from "@/components/landing/LandingHero";
import { LandingBrandCarousel } from "@/components/landing/LandingBrandCarousel";
import { LandingEvidenceSection } from "@/components/landing/LandingEvidenceSection";
import { LandingFeaturesSection } from "@/components/landing/LandingFeaturesSection";
import { LandingScoreShowcase } from "@/components/landing/LandingScoreShowcase";
import { LandingPricing } from "@/components/landing/LandingPricing";
import { LandingProblemsSection } from "@/components/landing/LandingProblemsSection";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { LandingFinalCta } from "@/components/landing/LandingFinalCta";
import { LandingFaqSection } from "@/components/landing/LandingFaqSection";

export function LandingPage() {
  useEffect(() => {
    const id = window.location.hash.replace(/^#/, "");
    if (!id) return;
    const timer = window.setTimeout(() => smoothScrollToId(id), 150);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className="landing-page relative flex min-h-screen flex-col overflow-x-hidden" suppressHydrationWarning>
      {/* ── Premium background system ─────────────────────────────── */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
        {/* Animated grid */}
        <div className="landing-page-grid-bg landing-page-grid-bg--motion absolute inset-0 opacity-[0.22] dark:opacity-[0.18]" />
        {/* Aurora orbs */}
        <div className="landing-aurora-blob-a absolute -top-40 left-[10%] h-[700px] w-[700px] rounded-full bg-violet-500/10 blur-[140px] dark:bg-violet-500/8" />
        <div className="landing-aurora-blob-b absolute top-[35%] right-[0%] h-[550px] w-[550px] rounded-full bg-indigo-500/8 blur-[160px] dark:bg-indigo-500/6" />
        <div className="landing-aurora-blob-c absolute bottom-[10%] left-[5%] h-[450px] w-[450px] rounded-full bg-cyan-500/6 blur-[130px] dark:bg-cyan-500/5" />
        {/* Conic aurora */}
        <div className="landing-conic-aurora absolute inset-0 dark:opacity-100 opacity-60">
          <div className="landing-conic-aurora-layer absolute inset-0 opacity-[0.08] dark:opacity-[0.11]" />
        </div>
        {/* Film grain */}
        <div className="landing-bg-grain absolute inset-0 opacity-[0.018] dark:opacity-[0.025] mix-blend-overlay" />
      </div>

      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-card focus:px-4 focus:py-2 focus:font-semibold focus:ring-2 focus:ring-ring"
      >
        Skip to main content
      </a>

      <LandingNavbar />

      <main id="main-content" className="relative z-10 flex flex-1 flex-col">
        <LandingHero />
        <LandingBrandCarousel />
        <LandingEvidenceSection />
        <LandingFeaturesSection />
        <LandingProblemsSection />

        <section id="scoring" className="relative scroll-mt-28 overflow-hidden px-[5%] py-16 max-lg:px-4 sm:py-28">
          <div
            className="landing-pixa-purple-blob pointer-events-none absolute left-[10%] top-[20%] h-[220px] w-[220px] opacity-40"
            aria-hidden
          />
          <div className="relative mx-auto max-w-6xl">
            <p className="text-center text-xs font-bold uppercase tracking-[0.18em] text-landing-accent">
              Rubric
            </p>
            <h2 className="mt-3 text-center font-sans text-4xl font-bold tracking-tight text-(--landing-fg) max-md:text-3xl sm:text-5xl">
              Structured feedback,{" "}
              <span className="bg-linear-to-r from-indigo-500 to-violet-400 bg-clip-text text-transparent">
                not vibes
              </span>
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-center text-base leading-relaxed text-landing-muted">
              Five dimensions, numeric scores, and verdict bands — the same report you get after Evaluate in the studio.
            </p>
            <LandingScoreShowcase />
          </div>
        </section>

        <LandingPricing />
        <LandingFaqSection />
        <LandingFinalCta />
        <LandingFooter />
      </main>
    </div>
  );
}
