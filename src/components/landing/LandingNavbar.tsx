"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import { Menu, X } from "lucide-react";
import { BRAND } from "@/lib/brand";
import { smoothScrollToId } from "@/lib/smoothScroll";
import { SysDesLogoIcon } from "@/components/brand/SysDesLogoIcon";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { cn } from "@/lib/utils";

const LINKS = [
  ["features", "Features"],
  ["problems", "Problems"],
  ["scoring", "Scoring"],
  ["faq", "FAQ"],
] as const;

export function LandingNavbar() {
  const [open, setOpen] = useState(false);

  const scrollToSection = useCallback((sectionId: string) => {
    setOpen(false);
    smoothScrollToId(sectionId);
    window.history.pushState(null, "", `#${sectionId}`);
  }, []);

  return (
    <header
      className={cn(
        "landing-pixa-nav fixed left-1/2 top-4 z-50 flex h-[60px] w-[calc(100%-1.5rem)] max-w-5xl -translate-x-1/2 items-center justify-between rounded-md px-[3%] shadow-md dark:shadow-zinc-800/50 lg:justify-around",
        open && "max-lg:!h-auto max-lg:flex-col max-lg:py-4",
      )}
    >
      <Link href="/" className="flex shrink-0 items-center gap-2 p-1" onClick={() => setOpen(false)}>
        <SysDesLogoIcon className="h-8 w-8" title={BRAND.name} />
        <span className="font-sans text-base font-medium uppercase tracking-wide text-[var(--landing-fg)]">
          {BRAND.name}
        </span>
      </Link>

      <nav
        className={cn(
          "flex items-center gap-1 max-lg:w-full max-lg:flex-col max-lg:py-4",
          !open && "max-lg:hidden",
        )}
        aria-label="Main"
      >
        {LINKS.map(([id, label]) => (
          <a
            key={id}
            href={`#${id}`}
            className="landing-pixa-nav-link font-sans"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection(id);
            }}
          >
            {label}
          </a>
        ))}
      </nav>

      <div
        className={cn(
          "flex items-center gap-3 max-lg:w-full max-lg:flex-col max-lg:pt-2",
          !open && "max-lg:hidden",
        )}
      >
        <ThemeToggle size="md" />
        <Link
          href="/studio"
          className="landing-btn-primary flex items-center gap-2 rounded-[10px] px-4 py-2.5 text-sm font-semibold transition-transform duration-300 hover:translate-x-0.5"
          onClick={() => setOpen(false)}
        >
          <span>Open studio</span>
          <span aria-hidden>→</span>
        </Link>
      </div>

      <button
        type="button"
        className="absolute right-3 top-3 z-50 text-[var(--landing-fg)] lg:hidden"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close menu" : "Open menu"}
      >
        {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>
    </header>
  );
}
