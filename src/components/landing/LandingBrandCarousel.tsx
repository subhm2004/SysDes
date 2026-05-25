"use client";

import { motion } from "framer-motion";
import { useHydrationSafeReducedMotion } from "@/hooks/useHydrationSafeReducedMotion";

const BRANDS = [
  { src: "/landing/brands/google.svg", alt: "Google" },
  { src: "/landing/brands/microsoft.svg", alt: "Microsoft" },
  { src: "/landing/brands/stripe.svg", alt: "Stripe" },
  { src: "/landing/brands/airbnb.svg", alt: "Airbnb" },
  { src: "/landing/brands/adobe.svg", alt: "Adobe" },
  { src: "/landing/brands/reddit.svg", alt: "Reddit" },
] as const;

export function LandingBrandCarousel() {
  const reduceMotion = useHydrationSafeReducedMotion();
  const doubled = [...BRANDS, ...BRANDS];

  return (
    <section className="relative flex w-full flex-col items-center overflow-hidden border-y border-landing/60 bg-landing-accent-muted/30 px-4 py-14 sm:py-16">
      <motion.p
        className="text-center font-sans text-sm font-semibold uppercase tracking-[0.12em] text-landing-muted"
        initial={reduceMotion ? false : { opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        Built for engineers at
      </motion.p>

      <div className="relative mt-8 w-full max-w-5xl">
        <div
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[var(--landing-bg)] to-transparent sm:w-24"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[var(--landing-bg)] to-transparent sm:w-24"
          aria-hidden
        />

        <div
          className={reduceMotion ? "flex flex-wrap items-center justify-center gap-10 px-4" : "landing-brand-track flex w-max gap-14 px-4"}
        >
          {(reduceMotion ? BRANDS : doubled).map((b, i) => (
            <div
              key={`${b.alt}-${i}`}
              className="group flex h-10 w-[130px] shrink-0 items-center justify-center rounded-xl border border-transparent px-4 py-2 transition-all duration-300 hover:border-landing hover:bg-[var(--landing-surface)] sm:h-11 sm:w-[150px]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={b.src}
                alt={b.alt}
                className="h-7 w-full object-contain opacity-40 grayscale transition-all duration-300 group-hover:opacity-100 group-hover:grayscale-0 dark:invert sm:h-8"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
