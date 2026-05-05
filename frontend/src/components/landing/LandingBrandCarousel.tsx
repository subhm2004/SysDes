"use client";

import { motion } from "framer-motion";
import { useHydrationSafeReducedMotion } from "@/hooks/useHydrationSafeReducedMotion";

const BRANDS = [
  { src: "/landing/brands/google.svg",    alt: "Google" },
  { src: "/landing/brands/microsoft.svg", alt: "Microsoft" },
  { src: "/landing/brands/stripe.svg",    alt: "Stripe" },
  { src: "/landing/brands/airbnb.svg",    alt: "Airbnb" },
  { src: "/landing/brands/meta.svg",      alt: "Meta" },
  { src: "/landing/brands/adobe.svg",     alt: "Adobe" },
  { src: "/landing/brands/openai.svg",    alt: "OpenAI" },
  { src: "/landing/brands/reddit.svg",    alt: "Reddit" },
] as const;

export function LandingBrandCarousel() {
  const reduceMotion = useHydrationSafeReducedMotion();
  const doubled = [...BRANDS, ...BRANDS];

  return (
    <section className="relative flex w-full flex-col items-center overflow-hidden py-12 sm:py-14">
      {/* Top divider */}
      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-(--landing-border) to-transparent" />
      {/* Bottom divider */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-(--landing-border) to-transparent" />

      <motion.p
        className="text-center text-[11px] font-bold uppercase tracking-[0.2em] text-landing-muted/60"
        initial={reduceMotion ? false : { opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        Built for engineers interviewing at
      </motion.p>

      <div className="relative mt-7 w-full max-w-5xl overflow-hidden">
        {/* Fade edges */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-linear-to-r from-(--landing-bg) to-transparent sm:w-32" aria-hidden />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-linear-to-l from-(--landing-bg) to-transparent sm:w-32" aria-hidden />

        <div
          className={
            reduceMotion
              ? "flex flex-wrap items-center justify-center gap-8 px-4"
              : "landing-brand-track flex w-max items-center gap-12 px-4"
          }
        >
          {(reduceMotion ? BRANDS : doubled).map((b, i) => (
            <div
              key={`${b.alt}-${i}`}
              className="flex h-9 w-27.5 shrink-0 items-center justify-center opacity-30 transition-opacity duration-300 hover:opacity-70 sm:w-32.5"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={b.src}
                alt={b.alt}
                className="h-full w-full object-contain dark:invert"
                draggable={false}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
