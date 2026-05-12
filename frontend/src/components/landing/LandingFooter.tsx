"use client";

import Link from "next/link";
import { BRAND } from "@/lib/brand";
import { smoothScrollToId } from "@/lib/smoothScroll";
import { SysDesLogoIcon } from "@/components/brand/SysDesLogoIcon";

function SectionLink({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <a
      href={`#${id}`}
      className="text-landing-muted transition-colors hover:text-(--landing-fg)"
      onClick={(e) => {
        e.preventDefault();
        smoothScrollToId(id);
        window.history.pushState(null, "", `#${id}`);
      }}
    >
      {children}
    </a>
  );
}

export function LandingFooter() {
  return (
    <footer className="relative mt-auto flex w-full flex-col gap-8 px-[5%] pb-12 pt-16 text-sm text-(--landing-fg)">
      {/* Top gradient divider */}
      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-(--landing-border) to-transparent" />
      {/* Subtle top fade */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-linear-to-b from-(--landing-bg)/50 to-transparent" />

      <div className="relative flex flex-wrap justify-around gap-10 max-md:flex-col max-md:items-center">
        {/* Brand column */}
        <div className="flex max-w-[250px] flex-col items-center gap-4 text-center md:items-start md:text-left">
          <Link href="/" className="flex flex-col items-center gap-2.5 md:items-start">
            <SysDesLogoIcon className="h-9 w-9 opacity-90" title={BRAND.name} />
            <span className="font-sans text-xl font-semibold tracking-tight text-(--landing-fg)">{BRAND.name}</span>
          </Link>
          <p className="text-sm leading-relaxed text-landing-muted">{BRAND.tagline}</p>
          <a
            href={BRAND.githubUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full border border-landing px-4 py-1.5 text-xs font-semibold text-landing-muted transition-all hover:border-indigo-500/40 hover:bg-indigo-500/8 hover:text-(--landing-fg)"
          >
            ★ Star on GitHub
          </a>
        </div>

        {/* Links columns */}
        <div className="flex flex-wrap justify-around gap-10">
          <div className="flex flex-col gap-3">
            <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-(--landing-fg)">Product</h2>
            <Link href="/studio" className="text-landing-muted transition-colors hover:text-(--landing-fg)">
              Studio
            </Link>
            <SectionLink id="features">Features</SectionLink>
            <SectionLink id="problems">Problems</SectionLink>
            <SectionLink id="scoring">Scoring</SectionLink>
            <SectionLink id="pricing">Pricing</SectionLink>
          </div>
          <div className="flex flex-col gap-3">
            <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-(--landing-fg)">Resources</h2>
            <SectionLink id="faq">FAQ</SectionLink>
            <a
              href={BRAND.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="text-landing-muted transition-colors hover:text-(--landing-fg)"
            >
              Source code
            </a>
          </div>
        </div>
      </div>

      <div className="relative h-px bg-linear-to-r from-transparent via-(--landing-border) to-transparent" />

      <p className="relative text-center text-xs text-landing-muted">
        © 2026 {BRAND.name}. Open source system design practice — built in public.
      </p>
    </footer>
  );
}
