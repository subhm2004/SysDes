"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  Check,
  ChevronDown,
  Github,
  LayoutGrid,
  Quote,
  Scale,
  Sparkles,
  Star,
  Timer,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { BRAND } from "@/lib/brand";
import { SysDesLogoIcon } from "@/components/brand/SysDesLogoIcon";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { LandingNodeMesh } from "@/components/landing/LandingNodeMesh";
import { LandingFlowCanvas } from "@/components/landing/LandingFlowCanvas";
import { LandingStatsRow } from "@/components/landing/LandingStatsRow";
import { LandingProblemTeaser } from "@/components/landing/LandingProblemTeaser";
import { useHydrationSafeReducedMotion } from "@/hooks/useHydrationSafeReducedMotion";
import { cn } from "@/lib/utils";

type PricingPlan = {
  name: string;
  priceInr: number;
  period: string;
  desc: string;
  features: string[];
  cta: string;
  href: string;
  highlighted?: boolean;
  badge?: string;
  external?: boolean;
  compareAt?: string;
  promoLine?: string;
  priceHint?: string;
  ctaNote?: string;
};

const ABOUT_SYSDES =
  "SysDes is a visual system design and simulation platform for modeling distributed cloud architectures. It combines design mode, guided development workflows, production-style simulation, and AI-assisted optimization to help engineers test reliability, scalability, and cost trade-offs before deployment.";

const FEATURE_CARDS: {
  Icon: LucideIcon;
  title: string;
  desc: string;
  wide?: boolean;
  iconClass: string;
}[] = [
  {
    Icon: LayoutGrid,
    title: "30 infra components",
    desc: "DNS, CDN, load balancers, Kafka, Redis, SQL, NoSQL — interview-grade diagrams with benchmark-backed numbers.",
    iconClass: "bg-violet-500/15 text-violet-600 dark:text-[#9070ff]",
  },
  {
    Icon: Activity,
    title: "Traffic simulation",
    desc: "Topological QPS propagation, 1K→500K load dial, bottlenecks and cascade visualization in real time.",
    iconClass: "bg-teal-500/15 text-teal-600 dark:text-[#2dc89a]",
  },
  {
    Icon: Sparkles,
    title: "AI assistant (Gemini)",
    desc: "Chat about your canvas — suggestions, trade-offs, and optional automated diagram edits.",
    iconClass: "bg-amber-500/15 text-amber-700 dark:text-[#efb43a]",
  },
  {
    Icon: Timer,
    title: "45-min interview mode",
    desc: "Six timed phases from requirements to deep dive — timers nudge you when pace slips.",
    iconClass: "bg-sky-500/15 text-sky-600 dark:text-[#5aa8f0]",
  },
  {
    Icon: Scale,
    title: "Concept library + trade-off log",
    desc: "Per-component interview tips, patterns, and real systems. Log decisions with 14 built-in comparison cards.",
    wide: true,
    iconClass: "bg-violet-500/15 text-violet-600 dark:text-[#9070ff]",
  },
];

const SCORE_DEMO: { name: string; pct: number }[] = [
  { name: "Scalability", pct: 88 },
  { name: "Availability", pct: 74 },
  { name: "Latency", pct: 91 },
  { name: "Cost efficiency", pct: 65 },
  { name: "Trade-offs", pct: 82 },
];

const TESTIMONIALS: { quote: string; name: string; role: string }[] = [
  {
    quote: "Finally a canvas that feels like my interview whiteboard — but with real simulation behind it.",
    name: "Priya S.",
    role: "Senior backend engineer",
  },
  {
    quote: "Load and latency playback helped me explain bottlenecks in a way reviewers actually bought.",
    name: "Arjun M.",
    role: "Staff engineer",
  },
  {
    quote: "Interview mode + AI nudges cut my prep time without dumbing down the trade-offs.",
    name: "Neha K.",
    role: "Platform engineer",
  },
  {
    quote: "Sharing a diagram link beat exporting screenshots for every round.",
    name: "Rahul V.",
    role: "EM — growth team",
  },
  {
    quote: "The component library matches how I draw LB → API → DB in real interviews.",
    name: "Sara L.",
    role: "Full-stack, fintech",
  },
  {
    quote: "Local-first means I can iterate on flights without worrying about accounts.",
    name: "Dev N.",
    role: "Indie consultant",
  },
];

const PRICING: PricingPlan[] = [
  {
    name: "Open Studio",
    priceInr: 0,
    period: "month",
    priceHint: "Forever self-hosted · no card",
    desc: "SysDes is open source — clone, run locally, and use the full studio with no paywall.",
    features: [
      "Full studio — designs, simulation, scoring & interview mode",
      "Fork, extend, and self-host; all core features stay free",
    ],
    cta: "Open Studio",
    href: "/studio",
    highlighted: true,
    badge: "Open source",
  },
];

const FAQS = [
  {
    q: "Is SysDes actually free and open source?",
    a: "Yes. You can clone the repository, run it on your machine, and use the full studio—canvas, simulation, scoring, interview mode, and the component library—with no payment wall and no mandatory signup. There isn’t a hidden “Pro” tier in this codebase.",
  },
  {
    q: "Do I need an account?",
    a: "Not for typical local use. Your work stays in the browser (with persistence via local storage) unless you deploy or sync things yourself. If you add your own auth or backend later, that’s entirely up to you.",
  },
  {
    q: "How is this better than a blank whiteboard?",
    a: "You drag real building blocks—DNS, load balancers, caches, queues, databases—and wire them like in a real architecture discussion. Then you can stress the diagram with configurable load, see bottlenecks, and get structured feedback across scalability, availability, latency, cost, and trade-offs—the same dimensions interviewers care about.",
  },
  {
    q: "What about the AI assistant?",
    a: "Optional. Wire up your own Google Gemini API key in `.env` if you want AI help on the canvas; nothing is billed through SysDes itself. No key means no AI calls—everything else still works offline-first.",
  },
  {
    q: "Can I fork or self-host it?",
    a: "Absolutely—that’s the point. Fork the repo, adapt it for your team, or deploy it internally. Follow the license in the repository and the README for setup; contributions and issues are welcome if you want to improve the project for everyone.",
  },
];

function formatInr(n: number) {
  if (n === 0) return "₹0";
  return `₹${n.toLocaleString("en-IN")}`;
}

export function LandingPage() {
  const reduceMotion = useHydrationSafeReducedMotion();

  return (
    <div
      className="relative min-h-screen overflow-x-hidden bg-[#faf8ff] text-foreground dark:bg-[#0a0a0f]"
      suppressHydrationWarning
    >
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-card focus:px-4 focus:py-2 focus:text-base focus:font-semibold focus:text-foreground focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-ring"
      >
        Skip to main content
      </a>

      <LandingNodeMesh />
      <div
        className="pointer-events-none fixed inset-0 z-[1] bg-gradient-to-b from-[#faf8ff]/65 via-[#faf8ff]/40 to-[#faf8ff] dark:from-[#0a0a0f]/75 dark:via-[#0a0a0f]/50 dark:to-[#0a0a0f]"
        aria-hidden
      />
      <div
        className="landing-hero-grid pointer-events-none fixed inset-0 z-[1] opacity-[0.65] dark:opacity-50"
        aria-hidden
      />

      <header className="sticky top-0 z-50 border-b border-violet-500/15 bg-[#faf8ff]/80 backdrop-blur-xl dark:border-white/10 dark:bg-[#0a0a0f]/75">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:h-[4.25rem] sm:gap-4 sm:px-6">
          <Link
            href="/"
            className="flex min-w-0 items-center gap-3 outline-none ring-offset-background focus-visible:rounded-lg focus-visible:ring-2 focus-visible:ring-ring sm:gap-3.5"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/90 shadow-md shadow-violet-500/15 ring-1 ring-violet-500/20 dark:bg-[#14121c]/90 dark:ring-violet-400/25 sm:h-10 sm:w-10">
              <SysDesLogoIcon className="h-[1.65rem] w-[1.65rem] sm:h-[1.85rem] sm:w-[1.85rem]" title={BRAND.name} />
            </span>
            <span className="text-xl font-semibold tracking-tight text-violet-700 dark:text-[#b8a8ff] sm:text-2xl">
              {BRAND.name}
            </span>
          </Link>

          <nav className="hidden items-center gap-7 text-lg font-medium text-muted-foreground lg:flex">
            {(
              [
                ["#features", "Features"],
                ["#problems", "Problems"],
                ["#scoring", "Scoring"],
                ["#about", "About"],
                ["#faq", "FAQ"],
              ] as const
            ).map(([href, label]) => (
              <a
                key={href}
                href={href}
                className="transition-colors hover:text-violet-700 dark:hover:text-[#c8c0ff]"
              >
                {label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-2.5">
            <ThemeToggle size="md" />
            <motion.a
              href={BRAND.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-card/90 px-3 py-2 text-sm font-semibold shadow-sm backdrop-blur-sm transition-colors hover:border-violet-500/30 hover:bg-muted/50 sm:text-lg"
              whileHover={reduceMotion ? undefined : { y: -1 }}
              whileTap={reduceMotion ? undefined : { scale: 0.98 }}
            >
              <Github className="h-4 w-4" />
              <span className="hidden sm:inline">GitHub</span>
            </motion.a>
            <Link
              href="/studio"
              className="rounded-full bg-[#7c5cfc] px-3 py-2 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition-[filter,transform] hover:bg-[#8f72ff] hover:brightness-105 active:scale-[0.98] sm:px-4 sm:text-lg"
            >
              Open studio
            </Link>
          </div>
        </div>
      </header>

      <main id="main-content" className="relative z-10">
        <section className="relative mx-auto max-w-4xl px-4 pb-16 pt-14 text-center sm:px-6 sm:pt-20">
          <div
            className="pointer-events-none absolute left-1/2 top-0 -z-0 h-[min(28rem,90vw)] w-[min(42rem,100%)] -translate-x-1/2 rounded-[50%] bg-gradient-to-b from-violet-500/30 via-fuchsia-500/12 to-transparent blur-3xl dark:from-violet-600/35 dark:via-violet-500/15"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute left-[15%] top-24 -z-0 h-40 w-40 rounded-full bg-cyan-400/25 blur-[72px] dark:bg-cyan-500/20"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute right-[12%] top-40 -z-0 h-36 w-36 rounded-full bg-violet-400/20 blur-[64px] dark:bg-violet-400/18"
            aria-hidden
          />

          <div className="relative z-10">
            <motion.div
              className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-violet-500/35 bg-gradient-to-r from-violet-500/15 via-white/60 to-cyan-500/10 px-4 py-2 text-sm font-semibold text-violet-800 shadow-md shadow-violet-500/10 ring-1 ring-white/60 backdrop-blur-md dark:from-violet-500/20 dark:via-white/5 dark:to-cyan-500/10 dark:text-[#d4ccff] dark:ring-white/10 sm:text-lg"
              initial={reduceMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Sparkles className="h-3.5 w-3.5 shrink-0 text-violet-600 dark:text-violet-300" aria-hidden />
              <span className="relative flex h-2 w-2 shrink-0">
                {!reduceMotion ? (
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/60 opacity-75 dark:bg-emerald-400/50" />
                ) : null}
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.7)] dark:bg-emerald-400" />
              </span>
              <span className="text-balance">
                System design simulator · live canvas ·{" "}
                <span className="bg-gradient-to-r from-violet-700 to-cyan-600 bg-clip-text text-transparent dark:from-violet-200 dark:to-cyan-300">
                  AI architect
                </span>
              </span>
            </motion.div>

            <motion.h1
              className="font-sans text-[2.65rem] font-extrabold leading-[1.08] tracking-tight sm:text-6xl sm:leading-[1.05] md:text-7xl md:leading-[1.02]"
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
            >
              <span className="block text-foreground drop-shadow-sm dark:text-white">
                Design. Simulate.
              </span>
              <span className="mt-1 block bg-gradient-to-r from-[#7c5cfc] via-[#a78bfa] to-[#22d3ee] bg-clip-text text-transparent [text-shadow:none] sm:mt-2">
                Get Hired.
              </span>
            </motion.h1>

            <motion.p
              className="mx-auto mt-7 max-w-xl text-lg font-medium leading-relaxed text-muted-foreground sm:mt-8 sm:text-xl sm:leading-relaxed"
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              Stop reading articles. Start{" "}
              <strong className="font-bold text-foreground">building real architectures</strong> on a live canvas —
              simulate traffic, get scored like an interviewer would.
            </motion.p>

            <motion.div
              className="mt-10 flex flex-wrap items-center justify-center gap-3 sm:mt-11"
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <Link
                href="/studio"
                className="inline-flex items-center justify-center rounded-xl bg-[#7c5cfc] px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-violet-500/30 transition-[transform,box-shadow] hover:-translate-y-0.5 hover:bg-[#9070ff] hover:shadow-violet-500/40"
              >
                Launch studio →
              </Link>
              <a
                href={BRAND.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-xl border border-violet-500/30 bg-background/80 px-6 py-3.5 text-base font-semibold text-foreground backdrop-blur-sm transition-colors hover:border-violet-500/50 hover:bg-muted/40"
              >
                View on GitHub
              </a>
            </motion.div>
          </div>

          <LandingStatsRow />
        </section>

        <section className="mx-auto max-w-4xl px-4 pb-20 sm:px-6">
          <p className="mb-5 text-center text-sm font-medium uppercase tracking-[0.12em] text-muted-foreground">
            Live canvas preview
          </p>
          <LandingFlowCanvas />
        </section>

        <section id="features" className="scroll-mt-24 border-t border-border/60 py-20 dark:border-white/10">
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <div className="text-center">
              <span className="inline-block rounded-full border border-violet-500/25 bg-violet-500/10 px-3.5 py-1 text-sm font-semibold uppercase tracking-wider text-[#7c5cfc]">
                Features
              </span>
              <h2 className="mt-4 text-4xl font-medium tracking-tight text-foreground sm:text-5xl">
                Everything for interview prep
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
                Built by engineers, for engineers. No passive reading.
              </p>
            </div>
            <div className="mt-12 grid gap-4 sm:grid-cols-2">
              {FEATURE_CARDS.map((f) => (
                <div
                  key={f.title}
                  className={cn(
                    "group relative overflow-hidden rounded-2xl border border-violet-500/15 bg-card/90 p-6 transition-all hover:-translate-y-1 hover:border-violet-500/35 dark:bg-[#100e1a]/80",
                    f.wide && "sm:col-span-2",
                  )}
                >
                  <div
                    className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-500/40 to-transparent opacity-0 transition-opacity group-hover:opacity-100"
                    aria-hidden
                  />
                  <div
                    className={cn(
                      "mb-3 flex h-9 w-9 items-center justify-center rounded-xl",
                      f.iconClass,
                    )}
                  >
                    <f.Icon className="h-4 w-4" strokeWidth={2} />
                  </div>
                  <h3 className="text-lg font-medium text-foreground dark:text-[#d4ccff]">{f.title}</h3>
                  <p className="mt-2 text-base leading-relaxed text-muted-foreground">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="problems" className="scroll-mt-24 border-t border-border/60 py-20 dark:border-white/10">
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <div className="text-center">
              <span className="inline-block rounded-full border border-violet-500/25 bg-violet-500/10 px-3.5 py-1 text-sm font-semibold uppercase tracking-wider text-[#7c5cfc]">
                Problems
              </span>
              <h2 className="mt-4 text-4xl font-medium tracking-tight text-foreground sm:text-5xl">
                35 design challenges
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
                Easy to Expert — from URL shortener to Netflix. Scroll sideways through cards, tap any to open the studio.
              </p>
            </div>
            <div className="mt-12">
              <LandingProblemTeaser />
            </div>
          </div>
        </section>

        <section id="scoring" className="scroll-mt-24 border-t border-border/60 py-20 dark:border-white/10">
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <div className="text-center">
              <span className="inline-block rounded-full border border-violet-500/25 bg-violet-500/10 px-3.5 py-1 text-sm font-semibold uppercase tracking-wider text-[#7c5cfc]">
                Scoring
              </span>
              <h2 className="mt-4 text-4xl font-medium tracking-tight text-foreground sm:text-5xl">
                5-axis interview rubric
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
                100-point feedback across what interviewers actually score.
              </p>
            </div>
            <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-5">
              {SCORE_DEMO.map((s) => (
                <div
                  key={s.name}
                  className="rounded-xl border border-violet-500/15 bg-card/90 p-4 text-center dark:bg-[#100e1a]/80"
                >
                  <div className="text-3xl font-medium text-[#9070ff] dark:text-[#9070ff]">{s.pct}</div>
                  <div className="mx-auto mt-2 h-1 max-w-full overflow-hidden rounded-full bg-violet-500/15">
                    <div
                      className="h-full rounded-full bg-[#7c5cfc]"
                      style={{ width: `${s.pct}%` }}
                    />
                  </div>
                  <div className="mt-2 text-sm text-muted-foreground">{s.name}</div>
                </div>
              ))}
            </div>
            <p className="mt-6 text-center text-base text-muted-foreground">
              Verdict bands: Needs Work → Decent → Good → Excellent →{" "}
              <span className="font-medium text-[#9070ff]">Architect (86+)</span>
            </p>
          </div>
        </section>

        <section className="border-t border-border/60 px-4 py-24 text-center dark:border-white/10 sm:px-6">
          <h2 className="mx-auto max-w-md text-4xl font-medium tracking-tight text-foreground sm:text-5xl">
            Ready to design like an Architect?
          </h2>
          <p className="mx-auto mt-4 max-w-md text-muted-foreground">
            Open the studio, pick a problem, and start building. No signup required.
          </p>
          <Link
            href="/studio"
            className="mt-10 inline-flex items-center justify-center rounded-xl bg-[#7c5cfc] px-10 py-4 text-lg font-semibold text-white shadow-lg shadow-violet-500/30 transition-[transform] hover:-translate-y-0.5 hover:bg-[#8f72ff]"
          >
            Launch {BRAND.name} →
          </Link>
        </section>

        <section id="about" className="scroll-mt-24 border-t border-border/80 py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="relative overflow-hidden rounded-3xl border border-violet-500/15 bg-gradient-to-br from-violet-500/[0.06] via-background to-background p-8 dark:from-violet-500/10 sm:p-10">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
                About {BRAND.name}
              </h2>
              <p className="mt-5 max-w-3xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
                {ABOUT_SYSDES}
              </p>
            </div>
          </div>
        </section>

        <section id="testimonials" className="scroll-mt-24 border-t border-border/80 py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="text-center">
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
                <Star className="h-3.5 w-3.5" />
                Voices
              </span>
              <h3 className="mt-4 text-3xl font-bold text-foreground sm:text-5xl">What builders say</h3>
              <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
                Short notes from engineers using {BRAND.name} for practice and real design discussions.
              </p>
            </div>
            <div className="relative mt-10 space-y-5">
              <div
                className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-[#faf8ff] to-transparent dark:from-[#0a0a0f] sm:w-20"
                aria-hidden
              />
              <div
                className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-[#faf8ff] to-transparent dark:from-[#0a0a0f] sm:w-20"
                aria-hidden
              />
              <TestimonialMarqueeRow direction="ltr" />
              <TestimonialMarqueeRow direction="rtl" />
            </div>
          </div>
        </section>

        <section id="pricing" className="scroll-mt-24 border-t border-border/80 py-16 sm:py-20">
          <h3 className="text-center text-3xl font-bold text-foreground sm:text-5xl">Free &amp; open source</h3>
          <p className="mx-auto mt-3 max-w-2xl text-center text-muted-foreground">
            Self-host the full studio for ₹0 — no subscription, no payment gate. Fork the repo and run it anywhere.
          </p>
          <div className="mx-auto mt-10 grid max-w-md gap-8 sm:max-w-lg sm:items-stretch">
            {PRICING.map((plan, i) => {
              const featured = Boolean(plan.highlighted);
              const solidCta = plan.priceInr > 0;
              const ctaClass = solidCta
                ? "bg-primary text-primary-foreground shadow-md shadow-primary/25 hover:bg-primary/90"
                : "border-2 border-border bg-card text-foreground shadow-sm hover:border-primary/40 hover:bg-muted/50";
              return (
                <motion.div
                  key={plan.name}
                  className={`relative flex flex-col rounded-2xl border-2 px-6 pb-8 pt-10 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/20 focus-within:-translate-y-0.5 focus-within:shadow-xl focus-within:shadow-primary/15 ${
                    featured
                      ? "z-10 border-primary bg-gradient-to-b from-primary/12 to-card shadow-lg shadow-primary/10 ring-1 ring-primary/25 hover:border-primary"
                      : "border-border bg-card hover:border-primary/55"
                  }`}
                  initial={reduceMotion ? false : { opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                >
                  {plan.badge ? (
                    <span className="absolute left-1/2 top-0 z-20 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full bg-primary px-4 py-1 text-sm font-semibold text-primary-foreground shadow-md">
                      {plan.badge}
                    </span>
                  ) : null}
                  <h4 className="text-center text-2xl font-bold tracking-tight text-foreground">{plan.name}</h4>
                  <p className="mt-3 text-center text-base leading-relaxed text-muted-foreground">{plan.desc}</p>
                  <div className="mt-8 flex flex-col items-center border-b border-border/70 pb-6">
                    <div className="flex flex-wrap items-end justify-center gap-x-2 gap-y-1">
                      <span className="text-5xl font-bold tracking-tight text-foreground sm:text-6xl">
                        {formatInr(plan.priceInr)}
                      </span>
                      {plan.compareAt ? (
                        <span className="mb-1.5 text-lg font-semibold text-muted-foreground/80 line-through decoration-muted-foreground/50">
                          {plan.compareAt}
                        </span>
                      ) : null}
                      <span className="mb-2 text-base font-medium text-muted-foreground">/ {plan.period}</span>
                    </div>
                    {plan.priceHint ? (
                      <p className="mt-2 max-w-[260px] text-center text-sm leading-snug text-muted-foreground">
                        {plan.priceHint}
                      </p>
                    ) : null}
                    {plan.promoLine ? (
                      <p className="mt-3 max-w-[280px] text-center text-base font-medium leading-snug text-emerald-700 dark:text-emerald-400">
                        {plan.promoLine}
                      </p>
                    ) : null}
                  </div>
                  <ul className="mt-6 flex flex-1 flex-col gap-3 text-base text-muted-foreground">
                    {plan.features.map((f) => (
                      <li key={f} className="flex gap-2.5">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" strokeWidth={2.5} />
                        <span className="leading-snug">{f}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8">
                    <Link
                      href={plan.href}
                      className={`flex min-h-[3rem] w-full items-center justify-center rounded-xl px-4 py-3 text-center text-base font-semibold leading-snug transition-colors ${ctaClass}`}
                    >
                      {plan.cta}
                    </Link>
                    {plan.ctaNote ? (
                      <p className="mt-3 text-center text-sm italic text-muted-foreground">{plan.ctaNote}</p>
                    ) : null}
                  </div>
                </motion.div>
              );
            })}
          </div>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Open source — use and modify the project under the terms of its repository license.
          </p>
        </section>

        <section id="faq" className="scroll-mt-24 border-t border-border/80 py-16 sm:py-20">
          <h3 className="text-center text-3xl font-bold text-foreground sm:text-5xl">FAQ</h3>
          <p className="mx-auto mt-3 max-w-2xl text-center text-muted-foreground">
            Licensing, privacy, AI, and how SysDes compares to a plain canvas—before you open the studio.
          </p>
          <div className="mx-auto mt-10 max-w-2xl space-y-2">
            {FAQS.map((item) => (
              <FaqItem key={item.q} question={item.q} answer={item.a} />
            ))}
          </div>
        </section>

        <motion.section
          className="relative mx-4 mb-6 overflow-hidden rounded-2xl border border-border/80 bg-gradient-to-b from-card to-muted/20 px-6 py-12 text-center shadow-sm ring-1 ring-border/40 sm:mx-6 sm:py-14"
          initial={reduceMotion ? false : { opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,color-mix(in_oklab,var(--primary)_8%,transparent),transparent_70%)]"
            aria-hidden
          />
          <div className="relative z-10">
            <h3 className="text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
              Ready to draw your next system?
            </h3>
            <p className="mx-auto mt-3 max-w-lg text-base text-muted-foreground sm:text-lg">
              No signup for local use — open the studio or star the repo on GitHub.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href="/studio"
                className="inline-flex items-center justify-center rounded-xl bg-primary px-6 py-3 text-base font-semibold text-primary-foreground shadow-md transition-[filter,transform] hover:brightness-110 active:scale-[0.98]"
              >
                Open studio
              </Link>
              <a
                href={BRAND.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-background/80 px-6 py-3 text-base font-semibold text-foreground shadow-sm backdrop-blur-sm transition-colors hover:border-primary/30 hover:bg-muted/60"
              >
                <Github className="h-4 w-4" />
                Star on GitHub
              </a>
            </div>
          </div>
        </motion.section>

        <footer className="scroll-mt-24 border-t border-border/80 pt-5 pb-4 text-center">
          <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-4 sm:px-6">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/90 shadow-md shadow-violet-500/15 ring-1 ring-violet-500/20 dark:bg-[#14121c]/90 dark:ring-violet-400/25">
              <SysDesLogoIcon className="h-8 w-8" title={BRAND.name} />
            </div>
            <p className="text-base text-muted-foreground">
              <span className="font-semibold text-foreground">{BRAND.name}</span> — {BRAND.tagline}
            </p>
            <p className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-base font-semibold">
              <Link
                href="/studio"
                className="text-violet-600 transition-opacity hover:opacity-85 hover:underline dark:text-[#b8a8ff]"
              >
                Studio
              </Link>
              <span className="text-border" aria-hidden>
                ·
              </span>
              <a
                href={BRAND.githubUrl}
                className="text-violet-600 transition-opacity hover:opacity-85 hover:underline dark:text-[#b8a8ff]"
                target="_blank"
                rel="noreferrer"
              >
                GitHub
              </a>
            </p>
            <p className="mt-1 text-sm text-muted-foreground">All rights reserved © 2026</p>
          </div>
        </footer>
      </main>
    </div>
  );
}

function TestimonialMarqueeRow({ direction }: { direction: "ltr" | "rtl" }) {
  const doubled = [...TESTIMONIALS, ...TESTIMONIALS];
  const trackClass = direction === "ltr" ? "testimonial-track-ltr" : "testimonial-track-rtl";
  return (
    <div className="overflow-hidden py-1">
      <div className={`flex w-max gap-4 ${trackClass}`}>
        {doubled.map((t, i) => (
          <article
            key={`${t.name}-${i}`}
            className="flex w-[min(100vw-2rem,340px)] shrink-0 flex-col rounded-2xl border border-border/80 bg-card/95 p-5 shadow-sm ring-1 ring-border/30 backdrop-blur-sm"
          >
            <Quote className="h-7 w-7 shrink-0 text-primary/30" strokeWidth={1.5} aria-hidden />
            <p className="mt-2 text-base leading-relaxed text-foreground/90">&ldquo;{t.quote}&rdquo;</p>
            <div className="mt-4 border-t border-border/60 pt-3">
              <p className="text-base font-semibold text-foreground">{t.name}</p>
              <p className="text-sm text-muted-foreground">{t.role}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left text-base font-semibold text-foreground transition-colors hover:bg-muted/50"
      >
        {question}
        <ChevronDown className={`h-4 w-4 shrink-0 text-muted-foreground/80 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <p className="border-t border-border/70 px-4 py-3 text-base leading-relaxed text-muted-foreground">{answer}</p>}
    </div>
  );
}
