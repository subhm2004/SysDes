"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Activity,
  BookOpen,
  Check,
  ChevronDown,
  Github,
  GraduationCap,
  Infinity,
  LayoutGrid,
  PenLine,
  Quote,
  Server,
  Share2,
  Sparkles,
  Star,
  Trophy,
  Waypoints,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { BRAND } from "@/lib/brand";
import { ThemeToggle } from "@/components/theme/theme-toggle";

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
  /** Strikethrough list price (e.g. intro offer) */
  compareAt?: string;
  /** Green promo line under price */
  promoLine?: string;
  /** Muted hint under price (e.g. free tier) */
  priceHint?: string;
  /** Small note under CTA button */
  ctaNote?: string;
};

/** Keyword lines for landing SEO */
const SEO_LINES = [
  "System design interview preparation tool.",
  "Distributed systems visualization platform.",
  "Cloud architecture simulator for engineers.",
  "High-level design practice environment.",
  "Scalability and bottleneck analysis sandbox.",
  "Diagram as code alternative.",
  "Free system architecture diagram tool.",
];

const ABOUT_SYSDES =
  "SysDes is a visual system design and simulation platform for modeling distributed cloud architectures. It combines design mode, guided development workflows, production-style simulation, and AI-assisted optimization to help engineers test reliability, scalability, and cost trade-offs before deployment.";

const HERO_HIGHLIGHTS: { icon: LucideIcon; l: string }[] = [
  { icon: BookOpen, l: "35+ design problems" },
  { icon: Infinity, l: "Local designs" },
  { icon: Activity, l: "Load & latency simulation" },
  { icon: Trophy, l: "Trade-off scoring" },
  { icon: Share2, l: "Shareable diagrams" },
  { icon: GraduationCap, l: "Interview mode" },
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

const CAPABILITIES = [
  {
    t: "Design mode",
    d: "Model services, data stores, and traffic paths on a canvas built for how you whiteboard in interviews.",
  },
  {
    t: "Guided workflows",
    d: "Work through problems with structure — requirements, constraints, and hints without losing the big picture.",
  },
  {
    t: "Production-style simulation",
    d: "Stress paths with configurable load and playback speed to see bottlenecks and utilization before you ship.",
  },
  {
    t: "Trade-off analysis",
    d: "Score and iterate on architecture choices so reliability, scale, and cost stay explicit under pressure.",
  },
];

const PRICING: PricingPlan[] = [
  {
    name: "Open Studio",
    priceInr: 0,
    period: "month",
    priceHint: "Forever self-hosted · no card",
    desc: "Self-host, full studio, 35+ problems, simulation & scoring.",
    features: [
      "Full studio self-hosted — designs, simulation, scoring & interview mode",
      "Fork, extend, and run locally with no paywall",
    ],
    cta: "Open Studio",
    href: "/studio",
  },
  {
    name: "Plus",
    priceInr: 299,
    period: "month",
    compareAt: "₹499",
    promoLine: "Waitlist: lock ₹299/m vs. ₹499 list — cloud sync & backups when we ship.",
    desc: "Planned cloud tier on top of the free studio. Core stays open source; you pay only for Plus when it launches.",
    features: [
      "Cloud sync, backup & shared workspaces when Plus launches (planned)",
      "Template packs, exports & email support — waitlist perks at launch",
    ],
    cta: "Pay",
    href: "/studio",
    highlighted: true,
    badge: "Recommended",
  },
];

const FAQS = [
  {
    q: "Is the app really free?",
    a: "Yes. The studio is open source — clone, run locally, and use all core features. Plus is an optional future cloud tier; nothing is paywalled in the self-hosted version today.",
  },
  {
    q: "Why show prices in INR?",
    a: "We default to Indian Rupees for clarity for local users and teams. You can self-host for ₹0; paid tiers are optional add-ons when we ship cloud features.",
  },
  {
    q: "Do I need an account?",
    a: "No account required for local use. Your designs live in your browser / machine depending on how you deploy.",
  },
  {
    q: "How is this different from drawing on a whiteboard?",
    a: "You get real components, directed edges, load simulation, and automated scoring — closer to how you’ll defend a design in an interview.",
  },
];

function formatInr(n: number) {
  if (n === 0) return "₹0";
  return `₹${n.toLocaleString("en-IN")}`;
}

export function LandingPage() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="relative overflow-x-hidden bg-background text-foreground">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-card focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-foreground focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-ring"
      >
        Skip to main content
      </a>
      <div
        className="pointer-events-none fixed inset-0 -z-10 bg-background"
        style={{
          backgroundImage: `
            linear-gradient(to right, color-mix(in oklab, var(--primary) 12%, transparent) 1px, transparent 1px),
            linear-gradient(to bottom, color-mix(in oklab, var(--primary) 12%, transparent) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
        }}
      />
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_90%_60%_at_50%_-18%,color-mix(in_oklab,var(--primary)_18%,transparent),transparent_58%)] dark:bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,color-mix(in_oklab,var(--primary)_22%,transparent),transparent_55%)]" />
      {/* Ambient orbs */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[min(520px,90vw)] w-[min(900px,120vw)] -translate-x-1/2 rounded-[50%] bg-primary/18 blur-[100px] dark:bg-primary/12" />
        <div className="absolute top-[28%] -right-24 h-[min(380px,70vw)] w-[min(380px,70vw)] rounded-full bg-violet-500/14 blur-[88px] dark:bg-violet-400/10" />
        <div className="absolute bottom-[5%] -left-20 h-72 w-72 rounded-full bg-sky-500/10 blur-[80px] dark:bg-sky-400/8" />
      </div>

      <header className="sticky top-0 z-50 border-b border-border/70 bg-background/80 shadow-[0_1px_0_0_color-mix(in_oklab,var(--foreground)_4%,transparent)] backdrop-blur-xl dark:bg-background/75">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4 sm:gap-4 sm:px-6">
          <Link href="/" className="flex min-w-0 items-center gap-2.5 outline-none ring-offset-background focus-visible:rounded-lg focus-visible:ring-2 focus-visible:ring-ring">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-violet-600 text-primary-foreground shadow-lg shadow-primary/25 ring-1 ring-white/15">
              <LayoutGrid className="h-4 w-4" />
            </div>
            <div className="hidden flex-col leading-tight sm:flex">
              <span className="text-sm font-bold tracking-tight">{BRAND.name}</span>
              <span className="text-xs font-medium text-muted-foreground">{BRAND.tagline}</span>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 text-sm font-medium text-muted-foreground lg:flex">
            {(
              [
                ["#about", "About"],
                ["#capabilities", "Capabilities"],
                ["#testimonials", "Testimonials"],
                ["#pricing", "Pricing"],
                ["#faq", "FAQ"],
              ] as const
            ).map(([href, label]) => (
              <a
                key={href}
                href={href}
                className="rounded-lg px-3 py-2 transition-colors hover:bg-secondary/80 hover:text-foreground"
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
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-2 text-xs font-semibold text-foreground/90 shadow-sm transition-colors hover:border-border hover:bg-muted/50 sm:text-sm"
              whileHover={prefersReducedMotion ? undefined : { y: -1 }}
              whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}
            >
              <Github className="h-4 w-4" />
              <span className="hidden sm:inline">GitHub</span>
            </motion.a>
            <Link
              href="/studio"
              className="rounded-full bg-gradient-to-r from-primary to-violet-600 px-3 py-2 text-xs font-semibold text-primary-foreground shadow-lg shadow-primary/30 transition-[filter,transform] hover:brightness-105 active:scale-[0.98] sm:px-4 sm:text-sm"
            >
              Open studio
            </Link>
          </div>
        </div>
      </header>

      <main
        id="main-content"
        className="mx-auto max-w-6xl px-4 pt-14 pb-0 sm:px-6 sm:pt-20 lg:pt-24"
      >
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
          <motion.div
            className="space-y-8"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <motion.div
              className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-gradient-to-r from-primary/12 via-primary/8 to-violet-500/10 px-3.5 py-1.5 text-xs font-semibold text-primary shadow-sm backdrop-blur-sm dark:from-primary/15 dark:via-primary/10 sm:text-sm"
              initial={prefersReducedMotion ? false : { opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05, duration: 0.4 }}
            >
              <Sparkles className="h-3.5 w-3.5 shrink-0 opacity-90" />
              <span className="relative flex h-2 w-2 shrink-0">
                {!prefersReducedMotion ? (
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/50 opacity-75 dark:bg-emerald-400/40" />
                ) : null}
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500 dark:bg-emerald-400" />
              </span>
              Canvas + simulation + AI architect
            </motion.div>

            <h1 className="max-w-[22ch] text-4xl font-bold tracking-tight text-foreground leading-[1.06] sm:max-w-3xl sm:text-5xl sm:leading-[1.05] lg:text-[3.35rem] lg:leading-[1.04]">
              Design systems that{" "}
              <span className="bg-gradient-to-r from-primary via-violet-600 to-sky-600 bg-clip-text text-transparent dark:from-primary dark:via-violet-400 dark:to-sky-400">
                scale in interviews
              </span>
              <span className="block text-foreground">— visually &amp; with data.</span>
            </h1>

            <p className="max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              {SEO_LINES.slice(0, 3).join(" ")}
            </p>

            <div className="flex flex-wrap gap-3">
              <motion.div whileHover={prefersReducedMotion ? undefined : { scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link
                  href="/studio"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-violet-600 px-5 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-[filter] hover:brightness-105"
                >
                  <PenLine className="h-4 w-4" />
                  Start designing
                </Link>
              </motion.div>
              <motion.a
                href={BRAND.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-border/80 bg-card/90 px-5 py-3 text-sm font-semibold text-foreground shadow-sm backdrop-blur-sm transition-colors hover:border-primary/25 hover:bg-secondary/80"
                whileHover={prefersReducedMotion ? undefined : { y: -2 }}
              >
                <Github className="h-4 w-4" />
                View on GitHub
              </motion.a>
            </div>

            <div className="flex flex-wrap gap-x-8 gap-y-5 border-t border-border/80 pt-6">
              {HERO_HIGHLIGHTS.map((item) => (
                <div
                  key={item.l}
                  className="flex min-w-[10rem] max-w-[220px] gap-3 sm:min-w-[11rem]"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/12 text-primary ring-1 ring-primary/15">
                    <item.icon className="h-4 w-4" strokeWidth={2} />
                  </div>
                  <p className="self-center text-sm font-medium leading-snug text-foreground/90">
                    {item.l}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            id="preview"
            className="scroll-mt-24"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.12, ease: "easeOut" }}
          >
            <motion.div
              className="rounded-2xl border border-border/70 bg-card/95 p-1 shadow-2xl shadow-black/[0.07] ring-1 ring-border/40 backdrop-blur-md dark:bg-card/90 dark:shadow-black/40"
              whileHover={prefersReducedMotion ? undefined : { y: -4, boxShadow: "0 25px 50px -12px color-mix(in oklab, var(--primary) 12%, transparent)" }}
              transition={{ type: "spring", stiffness: 300, damping: 24 }}
            >
              <div className="flex items-center gap-2 rounded-t-[14px] border-b border-border/60 bg-muted/40 px-3 py-2.5 dark:bg-muted/25">
                <span className="flex gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-rose-400/90" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-400/90" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/90" />
                </span>
                <span className="flex-1 truncate text-center font-mono text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                  {BRAND.name} · studio preview
                </span>
                <span className="w-14 shrink-0" aria-hidden />
              </div>
              <div className="p-5 pt-4 sm:p-6">
              <div className="mb-4 flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-violet-500/15 text-primary ring-1 ring-primary/15">
                  <Waypoints className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Distributed architecture canvas</h2>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    Model cloud components and traffic, then run production-style simulation with adjustable playback to
                    surface bottlenecks and scalability trade-offs.
                  </p>
                </div>
              </div>

              <div
                className="relative overflow-hidden rounded-xl border border-border/60 bg-gradient-to-b from-muted/60 to-muted/30 dark:from-muted/30 dark:to-background/40"
                style={{
                  backgroundImage: `radial-gradient(color-mix(in oklab, var(--muted-foreground) 22%, transparent) 1px, transparent 1px)`,
                  backgroundSize: "18px 18px",
                }}
              >
                <div className="flex min-h-[220px] flex-col items-center justify-center gap-4 p-6 sm:flex-row sm:justify-between sm:px-8">
                  <MockNode label="Users" sub="10k RPS" delay={0} />
                  <FlowArrow />
                  <MockNode label="Load balancer" sub="Round-robin" highlight delay={0.1} />
                  <FlowArrow />
                  <MockNode label="API" sub="Auth +" delay={0.2} />
                  <FlowArrow className="hidden sm:flex" />
                  <MockNode label="Services" sub="Scale-out" className="hidden sm:flex" delay={0.3} />
                </div>
              </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        <section id="about" className="scroll-mt-24 border-t border-border/80 py-16 sm:py-20">
          <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-secondary/50 via-background to-primary/[0.06] p-8 shadow-sm dark:from-secondary/20 dark:to-primary/10 sm:p-10">
            <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary/10 blur-3xl dark:bg-primary/15" />
            <h2 className="relative text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              About {BRAND.name}
            </h2>
            <p className="relative mt-5 max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              {ABOUT_SYSDES}
            </p>
          </div>
        </section>

        <section id="capabilities" className="scroll-mt-24 border-t border-border/80 py-16 sm:py-20">
          <div className="text-center">
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <Zap className="h-3.5 w-3.5" />
              Platform
            </span>
            <h3 className="mt-4 text-2xl font-bold text-foreground sm:text-3xl">Design, simulate, optimize</h3>
            <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
              How {BRAND.name} supports end-to-end system design practice — from blank canvas to defended trade-offs.
            </p>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {CAPABILITIES.map((c, i) => (
              <motion.div
                key={c.t}
                className="group relative overflow-hidden rounded-2xl border border-border/80 bg-card p-5 shadow-sm transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
                initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                whileHover={prefersReducedMotion ? undefined : { y: -3 }}
              >
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/35 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 text-primary transition-transform group-hover:scale-110">
                  {i === 0 ? (
                    <LayoutGrid className="h-5 w-5" />
                  ) : i === 1 ? (
                    <Waypoints className="h-5 w-5" />
                  ) : i === 2 ? (
                    <Server className="h-5 w-5" />
                  ) : (
                    <Star className="h-5 w-5" />
                  )}
                </div>
                <h4 className="font-semibold text-foreground">{c.t}</h4>
                <p className="mt-2 text-sm text-muted-foreground">{c.d}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section id="testimonials" className="scroll-mt-24 border-t border-border/80 py-16 sm:py-20">
          <div className="text-center">
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <Star className="h-3.5 w-3.5" />
              Voices
            </span>
            <h3 className="mt-4 text-2xl font-bold text-foreground sm:text-3xl">What builders say</h3>
            <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
              Short notes from engineers using {BRAND.name} for practice and real design discussions.
            </p>
          </div>

          <div className="relative mt-10 space-y-5">
            <div
              className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-background to-transparent sm:w-20"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-background to-transparent sm:w-20"
              aria-hidden
            />
            <TestimonialMarqueeRow direction="ltr" />
            <TestimonialMarqueeRow direction="rtl" />
          </div>
        </section>

        <section id="pricing" className="scroll-mt-24 border-t border-border/80 py-16 sm:py-20">
          <h3 className="text-center text-2xl font-bold text-foreground sm:text-3xl">Simple pricing in INR</h3>
          <p className="mx-auto mt-3 max-w-2xl text-center text-muted-foreground">
            Self-host for ₹0 today. Plus (₹299/m) is on the waitlist — prices are indicative for India billing (GST may
            apply later).
          </p>
          <div className="mx-auto mt-10 grid max-w-4xl gap-8 sm:grid-cols-2 sm:items-stretch">
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
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                >
                  {plan.badge ? (
                    <span className="absolute left-1/2 top-0 z-20 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full bg-primary px-4 py-1 text-xs font-semibold text-primary-foreground shadow-md">
                      {plan.badge}
                    </span>
                  ) : null}
                  <h4 className="text-center text-xl font-bold tracking-tight text-foreground">{plan.name}</h4>
                  <p className="mt-3 text-center text-sm leading-relaxed text-muted-foreground">{plan.desc}</p>
                  <div className="mt-8 flex flex-col items-center border-b border-border/70 pb-6">
                    <div className="flex flex-wrap items-end justify-center gap-x-2 gap-y-1">
                      <span className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                        {formatInr(plan.priceInr)}
                      </span>
                      {plan.compareAt ? (
                        <span className="mb-1.5 text-base font-semibold text-muted-foreground/80 line-through decoration-muted-foreground/50">
                          {plan.compareAt}
                        </span>
                      ) : null}
                      <span className="mb-2 text-sm font-medium text-muted-foreground">/ {plan.period}</span>
                    </div>
                    {plan.priceHint ? (
                      <p className="mt-2 max-w-[260px] text-center text-xs leading-snug text-muted-foreground">{plan.priceHint}</p>
                    ) : null}
                    {plan.promoLine ? (
                      <p className="mt-3 max-w-[280px] text-center text-sm font-medium leading-snug text-emerald-700 dark:text-emerald-400">
                        {plan.promoLine}
                      </p>
                    ) : null}
                  </div>
                  <ul className="mt-6 flex flex-1 flex-col gap-3 text-sm text-muted-foreground">
                    {plan.features.map((f) => (
                      <li key={f} className="flex gap-2.5">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" strokeWidth={2.5} />
                        <span className="leading-snug">{f}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8">
                    {plan.external ? (
                      <a
                        href={plan.href}
                        className={`flex min-h-[3rem] w-full items-center justify-center rounded-xl px-4 py-3 text-center text-sm font-semibold leading-snug transition-colors ${ctaClass}`}
                      >
                        {plan.cta}
                      </a>
                    ) : (
                      <Link
                        href={plan.href}
                        className={`flex min-h-[3rem] w-full items-center justify-center rounded-xl px-4 py-3 text-center text-sm font-semibold leading-snug transition-colors ${ctaClass}`}
                      >
                        {plan.cta}
                      </Link>
                    )}
                    {plan.ctaNote ? (
                      <p className="mt-3 text-center text-xs italic text-muted-foreground">{plan.ctaNote}</p>
                    ) : null}
                  </div>
                </motion.div>
              );
            })}
          </div>
          <p className="mt-6 text-center text-xs text-muted-foreground">
            All amounts in INR (₹). Plus features are not live yet — use Open Studio for the current open-source build.
          </p>
        </section>

        <section id="faq" className="scroll-mt-24 border-t border-border/80 py-16 sm:py-20">
          <h3 className="text-center text-2xl font-bold text-foreground sm:text-3xl">FAQ</h3>
          <p className="mx-auto mt-3 max-w-2xl text-center text-muted-foreground">Quick answers before you open the studio.</p>
          <div className="mx-auto mt-10 max-w-2xl space-y-2">
            {FAQS.map((item) => (
              <FaqItem key={item.q} question={item.q} answer={item.a} />
            ))}
          </div>
        </section>

        <motion.section
          className="relative mt-4 overflow-hidden rounded-2xl border border-white/15 px-6 py-12 text-center text-white shadow-2xl shadow-violet-950/25 ring-1 ring-white/10 sm:py-14 dark:border-white/10 dark:shadow-black/40"
          initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          {/* Base wash — multi-stop for depth */}
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-400 via-primary to-indigo-900 dark:from-violet-500 dark:via-violet-600 dark:to-violet-950"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-violet-600/25 to-white/15 dark:via-violet-500/20 dark:to-white/10"
            aria-hidden
          />
          {/* Soft blobs */}
          <div
            className="pointer-events-none absolute -left-[20%] -top-[40%] h-[min(420px,90vw)] w-[min(420px,90vw)] rounded-full bg-fuchsia-400/30 blur-[80px] dark:bg-fuchsia-500/20"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -bottom-[35%] -right-[15%] h-[min(380px,85vw)] w-[min(380px,85vw)] rounded-full bg-indigo-600/40 blur-[72px] dark:bg-indigo-500/25"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_75%_55%_at_50%_115%,color-mix(in_oklab,white_28%,transparent),transparent_60%)] dark:bg-[radial-gradient(ellipse_70%_50%_at_50%_110%,color-mix(in_oklab,white_12%,transparent),transparent_58%)]"
            aria-hidden
          />
          <div className="relative z-10">
            <h3 className="text-2xl font-bold tracking-tight drop-shadow-sm sm:text-3xl">
              Ready to draw your next system?
            </h3>
            <p className="mx-auto mt-3 max-w-lg text-sm text-white/90 sm:text-base">
              No signup for local use — open the studio or star the repo on GitHub.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href="/studio"
                className="inline-flex items-center justify-center rounded-xl bg-white px-6 py-3 text-sm font-semibold text-violet-700 shadow-lg shadow-black/15 transition-[filter,transform] hover:bg-white/95 active:scale-[0.98] dark:text-violet-800"
              >
                Open studio
              </Link>
              <a
                href={BRAND.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-white/45 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-md transition-colors hover:border-white/60 hover:bg-white/18"
              >
                <Github className="h-4 w-4" />
                Star on GitHub
              </a>
            </div>
          </div>
        </motion.section>

        <footer className="scroll-mt-24 border-t border-border/80 pt-5 pb-4 text-center">
          <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-4 sm:px-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-violet-600 text-primary-foreground shadow-md shadow-primary/20">
              <LayoutGrid className="h-5 w-5" />
            </div>
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">{BRAND.name}</span> — {BRAND.tagline}
            </p>
            <p className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-sm font-semibold">
              <Link
                href="/studio"
                className="bg-gradient-to-r from-violet-600 via-primary to-indigo-600 bg-clip-text text-transparent transition-opacity hover:opacity-85 hover:underline dark:from-violet-400 dark:via-primary dark:to-indigo-400"
              >
                Studio
              </Link>
              <span className="text-border" aria-hidden>
                ·
              </span>
              <a
                href={BRAND.githubUrl}
                className="bg-gradient-to-r from-violet-600 via-primary to-indigo-600 bg-clip-text text-transparent transition-opacity hover:opacity-85 hover:underline dark:from-violet-400 dark:via-primary dark:to-indigo-400"
                target="_blank"
                rel="noreferrer"
              >
                GitHub
              </a>
            </p>
            <p className="mt-1 text-xs text-muted-foreground">All rights reserved © 2026</p>
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
            <p className="mt-2 text-sm leading-relaxed text-foreground/90">&ldquo;{t.quote}&rdquo;</p>
            <div className="mt-4 border-t border-border/60 pt-3">
              <p className="text-sm font-semibold text-foreground">{t.name}</p>
              <p className="text-xs text-muted-foreground">{t.role}</p>
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
        className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left text-sm font-semibold text-foreground transition-colors hover:bg-muted/50"
      >
        {question}
        <ChevronDown className={`h-4 w-4 shrink-0 text-muted-foreground/80 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <p className="border-t border-border/70 px-4 py-3 text-sm leading-relaxed text-muted-foreground">{answer}</p>}
    </div>
  );
}

function MockNode({
  label,
  sub,
  highlight,
  className = "",
  delay = 0,
}: {
  label: string;
  sub: string;
  highlight?: boolean;
  className?: string;
  delay?: number;
}) {
  const prefersReducedMotion = useReducedMotion();
  return (
    <motion.div
      className={`flex w-[100px] flex-col items-center gap-1 rounded-xl border bg-card px-2 py-3 text-center shadow-sm ${
        highlight ? "border-primary/50 ring-2 ring-primary/15" : "border-border"
      } ${className}`}
      initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 + delay, duration: 0.4 }}
      whileHover={prefersReducedMotion ? undefined : { y: -2, boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.08)" }}
    >
      <Server className={`h-4 w-4 ${highlight ? "text-primary" : "text-muted-foreground/80"}`} />
      <span className="text-xs font-semibold text-foreground">{label}</span>
      <span className="text-xs text-muted-foreground">{sub}</span>
    </motion.div>
  );
}

function FlowArrow({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center text-muted-foreground/35 ${className}`}>
      <div className="h-px w-6 bg-border sm:w-8" />
      <div className="h-0 w-0 border-y-[4px] border-l-[6px] border-y-transparent border-l-border" />
    </div>
  );
}
