"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Activity, ArrowRight, LayoutGrid, Scale, Sparkles, Timer } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useHydrationSafeReducedMotion } from "@/hooks/useHydrationSafeReducedMotion";
import { cn } from "@/lib/utils";

type FeatureTag = { Icon: LucideIcon; label: string };

type Feature = {
  Icon: LucideIcon;
  title: string;
  desc: string;
  accent: string;
  iconBg: string;
  tags?: FeatureTag[];
};

const TOP: Feature[] = [
  {
    Icon: LayoutGrid,
    title: "30 production components",
    desc: "DNS, CDN, load balancers, Kafka, Redis, SQL — each with realistic throughput and latency numbers.",
    accent: "from-indigo-500/20 via-transparent to-transparent",
    iconBg: "bg-indigo-500/15 text-indigo-500 dark:text-indigo-300",
  },
  {
    Icon: Activity,
    title: "Topological simulation",
    desc: "QPS flows through your graph. Watch caches, queues, and DBs saturate in real time.",
    accent: "from-emerald-500/20 via-transparent to-transparent",
    iconBg: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  },
  {
    Icon: Sparkles,
    title: "AI architect",
    desc: "Optional Gemini challenges assumptions on the canvas — bring your own API key.",
    accent: "from-violet-500/20 via-transparent to-transparent",
    iconBg: "bg-violet-500/15 text-violet-600 dark:text-violet-300",
  },
];

const BOTTOM: Feature[] = [
  {
    Icon: Scale,
    title: "Trade-offs & patterns",
    desc: "Per-component interview tips plus built-in comparison cards — SQL vs NoSQL, push vs pull, and more.",
    accent: "from-amber-500/20 via-transparent to-transparent",
    iconBg: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
    tags: [{ Icon: LayoutGrid, label: "14 comparison cards" }],
  },
  {
    Icon: Timer,
    title: "Interview mode & scoring",
    desc: "Run a realistic 45-minute loop with six timed phases, then evaluate on the same five-axis rubric panels use.",
    accent: "from-indigo-500/20 via-transparent to-transparent",
    iconBg: "bg-indigo-500/15 text-indigo-500 dark:text-indigo-300",
    tags: [
      { Icon: Timer, label: "6 interview phases" },
      { Icon: Activity, label: "5-axis rubric" },
    ],
  },
];

function FeatureCard({
  f,
  index,
  reduceMotion,
}: {
  f: Feature;
  index: number;
  reduceMotion: boolean;
}) {
  return (
    <motion.article
      className={cn(
        "landing-feature-card group relative flex min-h-[300px] flex-col overflow-hidden rounded-2xl border border-landing p-7 transition-all duration-300 sm:min-h-[340px] sm:p-8",
        "hover:-translate-y-1 hover:border-indigo-500/35 hover:shadow-lg hover:shadow-indigo-500/10",
      )}
      initial={reduceMotion ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: index * 0.07, duration: 0.4 }}
    >
      <div
        className={cn("pointer-events-none absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-300 group-hover:opacity-100", f.accent)}
        aria-hidden
      />
      <div className="relative z-10 flex flex-1 flex-col">
        <span className={cn("flex h-12 w-12 items-center justify-center rounded-xl", f.iconBg)}>
          <f.Icon className="h-6 w-6" strokeWidth={2} />
        </span>
        <h3 className="mt-5 font-sans text-xl font-semibold leading-snug text-[var(--landing-fg)] sm:text-2xl">
          {f.title}
        </h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-landing-muted sm:text-base">{f.desc}</p>
        {f.tags && f.tags.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {f.tags.map((tag) => (
              <span
                key={tag.label}
                className="inline-flex items-center gap-1.5 rounded-full border border-landing bg-landing-accent-muted/50 px-3 py-1.5 text-xs font-medium text-[var(--landing-fg)]"
              >
                <tag.Icon className="h-3.5 w-3.5 text-landing-accent" aria-hidden />
                {tag.label}
              </span>
            ))}
          </div>
        ) : null}
        <Link
          href="/studio"
          className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-indigo-500 transition-all group-hover:gap-3 dark:text-indigo-300"
        >
          Learn more
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </motion.article>
  );
}

export function LandingFeaturesSection() {
  const reduceMotion = useHydrationSafeReducedMotion();

  return (
    <section id="features" className="relative scroll-mt-28 overflow-hidden px-[5%] py-16 max-lg:px-4 sm:py-28">
      <div className="landing-pixa-purple-blob pointer-events-none absolute left-[15%] top-[8%] h-[200px] w-[200px] opacity-35" aria-hidden />

      <div className="relative mx-auto max-w-6xl">
        <motion.div
          className="text-center"
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-landing-accent">Platform</p>
          <h2 className="mt-3 font-sans text-4xl font-bold tracking-tight text-[var(--landing-fg)] max-md:text-3xl sm:text-5xl lg:text-6xl">
            Everything you need to{" "}
            <span className="bg-gradient-to-r from-indigo-500 to-violet-400 bg-clip-text text-transparent">
              pass the loop
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-base text-landing-muted">
            Canvas, simulation, rubric, and interview pacing — one studio, no tab switching.
          </p>
        </motion.div>

        <div className="mt-12 flex flex-col gap-5">
          <div className="grid gap-5 lg:grid-cols-3">
            {TOP.map((f, i) => (
              <FeatureCard key={f.title} f={f} index={i} reduceMotion={reduceMotion} />
            ))}
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {BOTTOM.map((f, i) => (
              <FeatureCard key={f.title} f={f} index={i + 3} reduceMotion={reduceMotion} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
