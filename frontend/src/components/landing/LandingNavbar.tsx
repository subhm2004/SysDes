"use client";

import Link from "next/link";
import { useCallback, useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { BRAND } from "@/lib/brand";
import { smoothScrollToId } from "@/lib/smoothScroll";
import { SysDesLogoIcon } from "@/components/brand/SysDesLogoIcon";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { UserMenu } from "@/components/auth/UserMenu";
import { useAuthStore } from "@/store/authStore";
import { cn } from "@/lib/utils";

const LINKS = [
  ["features", "Features"],
  ["problems", "Problems"],
  ["scoring", "Scoring"],
  ["faq", "FAQ"],
] as const;

export function LandingNavbar() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);

  useEffect(() => setMounted(true), []);

  const loggedIn = mounted && isLoggedIn();

  const scrollToSection = useCallback((sectionId: string) => {
    setOpen(false);
    smoothScrollToId(sectionId);
    window.history.pushState(null, "", `#${sectionId}`);
  }, []);

  return (
    <header
      className={cn(
        "landing-pixa-nav fixed left-1/2 top-4 z-50 w-[calc(100%-1.5rem)] max-w-5xl -translate-x-1/2 rounded-md px-[3%] shadow-md dark:shadow-zinc-800/50",
        // Desktop: 3-col grid so nav is always perfectly centered
        "hidden h-15 items-center lg:grid lg:grid-cols-[1fr_auto_1fr]",
        // Mobile: flex column when open
        open
          ? "flex! flex-col py-4 max-lg:block"
          : "max-lg:flex max-lg:h-15 max-lg:items-center max-lg:justify-between",
      )}
    >
      {/* Col 1 — Logo */}
      <Link
        href="/"
        className="flex shrink-0 items-center gap-2 p-1"
        onClick={() => setOpen(false)}
      >
        <SysDesLogoIcon className="h-8 w-8" title={BRAND.name} />
        <span className="font-sans text-base font-medium uppercase tracking-wide text-(--landing-fg)">
          {BRAND.name}
        </span>
      </Link>

      {/* Col 2 — Nav links (always centered) */}
      <nav
        className={cn(
          "flex items-center justify-center gap-1",
          !open && "max-lg:hidden",
          open && "w-full flex-col py-4",
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

      {/* Col 3 — Actions (always right-aligned) */}
      <div
        className={cn(
          "flex items-center justify-end gap-3",
          !open && "max-lg:hidden",
          open && "w-full flex-col pt-2",
        )}
      >
        <ThemeToggle size="md" />
        <UserMenu />
        {!loggedIn && (
          <Link
            href="/studio"
            className="landing-btn-primary flex h-9 items-center gap-2 rounded-lg px-4 text-sm font-semibold whitespace-nowrap transition-transform duration-300 hover:translate-x-0.5"
            onClick={() => setOpen(false)}
          >
            <span>Open studio</span>
            <span aria-hidden>→</span>
          </Link>
        )}
      </div>

      {/* Mobile hamburger */}
      <button
        type="button"
        className="absolute right-3 top-3 z-50 text-(--landing-fg) lg:hidden"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close menu" : "Open menu"}
      >
        {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>
    </header>
  );
}
