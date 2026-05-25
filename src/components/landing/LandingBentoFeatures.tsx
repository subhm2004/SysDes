"use client";

import { motion } from "framer-motion";
import { Activity, LayoutGrid, Scale, Sparkles, Timer } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useHydrationSafeReducedMotion } from "@/hooks/useHydrationSafeReducedMotion";

const FEATURES: { Icon: LucideIcon; title: string; desc: string }[] = [
  {
    Icon: LayoutGrid,
    title: "30 production components",
    desc: "DNS, CDN, load balancers, Kafka, Redis, SQL — each with benchmark QPS and latency.",
  },
  {
    Icon: Activity,
    title: "Live topological simulation",
    desc: "QPS flows through your graph. Watch caches, queues, and DBs saturate in real time.",
  },
  {
    Icon: Sparkles,
    title: "AI architect (optional)",
    desc: "Gemini challenges assumptions on the canvas — bring your own API key.",
  },
  {
    Icon: Timer,
    title: "45-minute interview mode",
    desc: "Six timed phases: requirements → design → deep dive, like a real loop.",
  },
  {
    Icon: Scale,
    title: "Trade-offs & patterns",
    desc: "Per-component tips plus 14 comparison cards — SQL vs NoSQL, push vs pull, and more.",
  },
];

export function LandingBentoFeatures() {
  const reduceMotion = useHydrationSafeReducedMotion();

  return (
    <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {FEATURES.map((f, i) => (
        <motion.article
          key={f.title}
          className="rounded-xl border border-landing bg-landing-surface p-6 lg:last:col-span-1"
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ delay: i * 0.04 }}
        >
          <div className="landing-icon-box flex h-10 w-10 items-center justify-center rounded-lg">
            <f.Icon className="h-5 w-5" strokeWidth={2} />
          </div>
          <h3 className="mt-4 text-base font-semibold text-[var(--landing-fg)]">{f.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-landing-muted">{f.desc}</p>
        </motion.article>
      ))}
    </div>
  );
}
