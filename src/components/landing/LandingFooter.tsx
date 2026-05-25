"use client";

import Link from "next/link";
import { BRAND } from "@/lib/brand";
import { smoothScrollToId } from "@/lib/smoothScroll";
import { SysDesLogoIcon } from "@/components/brand/SysDesLogoIcon";

function SectionLink({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <a
      href={`#${id}`}
      className="text-landing-muted hover:text-[var(--landing-fg)]"
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
    <footer className="mt-auto flex w-full flex-col gap-8 px-[5%] pb-12 pt-16 text-sm text-[var(--landing-fg)]">
      <div className="flex flex-wrap justify-around gap-10 max-md:flex-col max-md:items-center">
        <div className="flex max-w-[250px] flex-col items-center gap-5 text-center md:items-start md:text-left">
          <Link href="/" className="flex flex-col items-center gap-3 md:items-start">
            <SysDesLogoIcon className="h-10 w-10" title={BRAND.name} />
            <span className="font-sans text-2xl font-semibold tracking-tight">{BRAND.name}</span>
          </Link>
          <p className="text-landing-muted">{BRAND.tagline}</p>
          <a
            href={BRAND.githubUrl}
            target="_blank"
            rel="noreferrer"
            className="font-medium text-landing-accent hover:underline"
          >
            GitHub
          </a>
        </div>

        <div className="flex flex-wrap justify-around gap-10">
          <div className="flex flex-col gap-3">
            <h2 className="text-lg font-medium">Product</h2>
            <Link href="/studio" className="text-landing-muted hover:text-[var(--landing-fg)]">
              Studio
            </Link>
            <SectionLink id="features">Features</SectionLink>
            <SectionLink id="problems">Problems</SectionLink>
            <SectionLink id="scoring">Scoring</SectionLink>
          </div>
          <div className="flex flex-col gap-3">
            <h2 className="text-lg font-medium">Resources</h2>
            <SectionLink id="faq">FAQ</SectionLink>
            <a href={BRAND.githubUrl} target="_blank" rel="noreferrer" className="text-landing-muted hover:text-[var(--landing-fg)]">
              Source code
            </a>
          </div>
        </div>
      </div>

      <hr className="border-landing" />
      <p className="text-center text-xs text-landing-muted">© 2026 {BRAND.name}. Open source system design practice.</p>
    </footer>
  );
}
