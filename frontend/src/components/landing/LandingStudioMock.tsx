"use client";

import Link from "next/link";
import {
  Activity,
  ArrowRight,
  ChevronRight,
  LayoutGrid,
  Play,
  Target,
} from "lucide-react";
import { SysDesLogoIcon } from "@/components/brand/SysDesLogoIcon";
import { LandingFlowCanvas } from "@/components/landing/LandingFlowCanvas";
import { BRAND } from "@/lib/brand";

const SIDEBAR = [
  { Icon: Target, label: "Problems" },
  { Icon: LayoutGrid, label: "Canvas" },
  { Icon: Play, label: "Simulation" },
  { Icon: Activity, label: "Score report" },
] as const;

export function LandingStudioMock() {
  return (
    <div className="flex h-full min-h-[420px] w-full overflow-hidden rounded-[calc(0.75rem-2px)] bg-(--landing-surface) lg:min-h-[520px]">
      <aside className="hidden w-[220px] shrink-0 flex-col gap-2 border-r border-landing bg-(--landing-surface-2) p-3 lg:flex">
        <div className="flex items-center gap-2 px-2 py-1">
          <SysDesLogoIcon className="h-7 w-7 opacity-90" title={BRAND.name} />
          <span className="text-sm font-semibold text-(--landing-fg)">{BRAND.name}</span>
        </div>
        <nav className="mt-2 flex flex-col gap-0.5">
          {SIDEBAR.map(({ Icon, label }) => (
            <span
              key={label}
              className="flex items-center gap-2 rounded-md px-2 py-2 text-sm text-(--landing-fg) hover:bg-black/5 dark:hover:bg-white/5"
            >
              <Icon className="h-4 w-4 text-landing-muted" />
              {label}
            </span>
          ))}
        </nav>
        <Link
          href="/studio"
          className="mt-auto flex items-center justify-center gap-1 rounded-lg border border-landing px-3 py-2.5 text-sm font-semibold text-(--landing-fg) transition-colors hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black"
        >
          Open studio
          <ChevronRight className="h-4 w-4" />
        </Link>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center justify-between border-b border-landing px-4 py-2.5 lg:hidden">
          <SysDesLogoIcon className="h-6 w-6" title={BRAND.name} />
          <Link href="/studio" className="text-xs font-semibold text-landing-accent">
            Open studio →
          </Link>
        </div>
        <div className="relative min-h-0 flex-1">
          <LandingFlowCanvas className="border-0 shadow-none" />
        </div>
        <div className="flex items-center justify-between gap-2 border-t border-landing bg-(--landing-surface-2) px-4 py-2.5">
          <span className="truncate text-xs text-landing-muted">URL Shortener · 84K req/s</span>
          <span className="landing-btn-primary inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold">
            Run simulation
            <ArrowRight className="h-3 w-3" />
          </span>
        </div>
      </div>
    </div>
  );
}
