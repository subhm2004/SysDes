import { cn } from "@/lib/utils";

/** Same mark as `/sysdes-icon.svg` (favicon) — avoids inline SVG hydration issues from browser extensions. */
export function SysDesLogoIcon({ className, title }: { className?: string; title?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/sysdes-icon.svg"
      alt={title ?? "SysDes"}
      className={cn("shrink-0", className)}
      suppressHydrationWarning
    />
  );
}
