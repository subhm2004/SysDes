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
            <p className="text-center text-sm font-semibold uppercase tracking-[0.14em] text-landing-accent">
              Rubric
            </p>
            <h2 className="mt-3 text-center font-sans text-4xl font-bold tracking-tight text-[var(--landing-fg)] max-md:text-3xl sm:text-5xl">
              Structured feedback,{" "}
              <span className="bg-gradient-to-r from-indigo-500 to-violet-400 bg-clip-text text-transparent">
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
