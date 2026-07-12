"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";
import { useHydrationSafeReducedMotion } from "@/hooks/useHydrationSafeReducedMotion";
import { cn } from "@/lib/utils";

const FAQS = [
  {
    q: "Is SysDes free and open source?",
    a: "Yes. Clone the repo and run locally — canvas, simulation, scoring, and interview mode with no paywall.",
  },
  {
    q: "Who is this for?",
    a: "Anyone preparing for system design interviews, or teams who want structured architecture practice with evidence.",
  },
  {
    q: "How is this better than a whiteboard?",
    a: "You build your system on a canvas, run traffic through it to find bottlenecks, and get an AI score on five key areas.",
  },
  {
    q: "What about AI?",
    a: "Optional Gemini via your API key. Everything else works offline without AI.",
  },
  {
    q: "Can I fork or self-host?",
    a: "Yes — fork, extend, and deploy internally under the repository license.",
  },
] as const;

function FaqItem({
  question,
  answer,
  index,
  reduceMotion,
}: {
  question: string;
  answer: string;
  index: number;
  reduceMotion: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      className={cn(
        "overflow-hidden rounded-xl border transition-colors duration-300",
        open
          ? "border-indigo-500/40 bg-indigo-500/[0.06] shadow-sm shadow-indigo-500/10"
          : "border-landing bg-(--landing-surface) hover:border-indigo-500/25 hover:bg-landing-accent-muted/50",
      )}
      initial={reduceMotion ? false : { opacity: 0, y: 12 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ delay: index * 0.05, duration: 0.35 }}
    >
      <button
        type="button"
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left sm:px-6 sm:py-5"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <span className="font-sans text-base font-semibold leading-snug text-(--landing-fg) sm:text-lg">
          {question}
        </span>
        <span
          className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-landing bg-landing-accent-muted transition-all duration-300",
            open && "rotate-180 border-indigo-500/40 bg-indigo-500/15",
          )}
        >
          <ChevronDown
            className={cn(
              "h-4 w-4 transition-colors",
              open ? "text-indigo-500 dark:text-indigo-300" : "text-landing-muted",
            )}
            aria-hidden
          />
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            key="content"
            initial={reduceMotion ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reduceMotion ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: 0.38, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <p className="border-t border-landing/80 px-5 pb-5 pt-4 font-sans text-sm leading-relaxed text-landing-muted sm:px-6 sm:text-base">
              {answer}
            </p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.div>
  );
}

export function LandingFaqSection() {
  const reduceMotion = useHydrationSafeReducedMotion();

  return (
    <section id="faq" className="relative scroll-mt-28 overflow-hidden px-[5%] py-16 max-lg:px-4 sm:py-28">
      <div
        className="landing-pixa-purple-blob pointer-events-none absolute bottom-14 right-[12%] hidden h-[160px] w-[160px] md:block"
        aria-hidden
      />
      <div
        className="landing-pixa-purple-blob pointer-events-none absolute left-[8%] top-[20%] h-[120px] w-[120px] opacity-40"
        aria-hidden
      />

      <div className="relative mx-auto max-w-3xl">
        <motion.div
          className="text-center"
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-landing-accent">FAQ</p>
          <h2 className="mt-3 font-sans text-4xl font-bold tracking-tight text-(--landing-fg) max-md:text-3xl sm:text-5xl">
            Questions before{" "}
            <span className="bg-linear-to-r from-indigo-500 to-violet-400 bg-clip-text text-transparent">
              you start
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-md text-base text-landing-muted">
            Everything you need to know about running SysDes locally.
          </p>
        </motion.div>

        <div className="landing-faq-panel mt-10 rounded-2xl border border-landing p-3 sm:p-4">
          <div className="mb-3 flex items-center gap-2 border-b border-landing px-3 pb-3 sm:px-4">
            <HelpCircle className="h-4 w-4 text-indigo-500 dark:text-indigo-300" aria-hidden />
            <span className="text-sm font-medium text-landing-muted">{FAQS.length} common questions</span>
          </div>
          <div className="flex flex-col gap-2">
            {FAQS.map((item, i) => (
              <FaqItem
                key={item.q}
                question={item.q}
                answer={item.a}
                index={i}
                reduceMotion={reduceMotion}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
