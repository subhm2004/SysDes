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
            className="inline-flex items-center gap-2 rounded-full border border-landing px-4 py-1.5 text-xs font-semibold text-landing-muted transition-all hover:border-indigo-500/40 hover:bg-indigo-500/8 hover:text-(--landing-fg)"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
              <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.604-3.369-1.342-3.369-1.342-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.741 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
            </svg>
            Star on GitHub
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
              className="inline-flex items-center gap-1.5 text-landing-muted transition-colors hover:text-(--landing-fg)"
            >
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current" aria-hidden>
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.604-3.369-1.342-3.369-1.342-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.741 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
              </svg>
              GitHub
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
