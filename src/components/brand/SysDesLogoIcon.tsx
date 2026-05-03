"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";

/** Same mark as `/sysdes-icon.svg` (favicon) — 2×2 grid tiles for SysDes / studio. */
export function SysDesLogoIcon({ className, title }: { className?: string; title?: string }) {
  const uid = useId().replace(/:/g, "");
  const gradId = `sysdes-grad-${uid}`;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      fill="none"
      className={cn("shrink-0", className)}
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
    >
      {title ? <title>{title}</title> : null}
      <rect width="32" height="32" rx="8" fill="#0f0d14" />
      <path fill={`url(#${gradId})`} d="M8 8h6.5v6.5H8V8Zm9.25 0H24v6.5h-6.75V8ZM8 17.5h6.5V24H8v-6.5Zm9.25 0H24V24h-6.75v-6.5Z" />
      <defs>
        <linearGradient id={gradId} x1="8" y1="8" x2="24" y2="24" gradientUnits="userSpaceOnUse">
          <stop stopColor="#7c5cfc" />
          <stop offset="1" stopColor="#22d3ee" />
        </linearGradient>
      </defs>
    </svg>
  );
}
