"use client";

import { motion } from "framer-motion";
import { Layers, Play, Target } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useHydrationSafeReducedMotion } from "@/hooks/useHydrationSafeReducedMotion";

const STEPS: { step: string; Icon: LucideIcon; title: string; desc: string }[] = [
  {
    step: "01",
    Icon: Target,
    title: "Pick a problem",
    desc: "35 challenges from URL shortener to Netflix — filter by difficulty and start.",
  },
  {
    step: "02",
    Icon: Layers,
    title: "Wire the architecture",
    desc: "DNS, load balancers, caches, queues, databases — with realistic throughput numbers.",
  },
  {
    step: "03",
    Icon: Play,
    title: "Run load & iterate",
    desc: "Run traffic through your design, see where it breaks, get a score, and improve.",
  },
];

export function LandingHowItWorks() {
  const reduceMotion = useHydrationSafeReducedMotion();

  return (
    <div className="mt-12 grid gap-6 md:grid-cols-3">
      {STEPS.map((s, i) => (
        <motion.article
          key={s.title}
          className="relative rounded-xl border border-landing bg-landing-surface p-6"
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ delay: i * 0.06 }}
        >
          <span className="font-mono text-xs font-medium text-landing-muted">{s.step}</span>
          <div className="landing-icon-box mt-4 flex h-10 w-10 items-center justify-center rounded-lg">
            <s.Icon className="h-5 w-5" strokeWidth={2} />
          </div>
          <h3 className="mt-4 text-base font-semibold text-(--landing-fg)">{s.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-landing-muted">{s.desc}</p>
        </motion.article>
      ))}
    </div>
  );
}
