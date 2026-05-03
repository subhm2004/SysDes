"use client";

import { cn } from "@/lib/utils";

type LandingArchBackdropProps = {
  reduceMotion: boolean;
  className?: string;
};

/**
 * Decorative system-diagram layer: faint nodes + edges with “traffic” motion
 * (marching dashes + SVG animateMotion packets). Honors `reduceMotion` + CSS
 * `prefers-reduced-motion`.
 */
export function LandingArchBackdrop({ reduceMotion, className }: LandingArchBackdropProps) {
  const motionOn = !reduceMotion;

  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-x-0 top-14 -z-[8] h-[min(92vh,920px)] overflow-hidden sm:top-0",
        "opacity-[0.28] [mask-image:linear-gradient(to_bottom,black_18%,black_45%,transparent_92%)]",
        "dark:opacity-[0.42]",
        className
      )}
      aria-hidden
    >
      <svg
        className="h-full w-[120%] min-h-[420px] -translate-x-[8%] sm:w-full sm:translate-x-0"
        viewBox="0 0 1100 520"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="arch-edge" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgb(6 182 212)" stopOpacity="0.35" />
            <stop offset="55%" stopColor="rgb(139 92 246)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="rgb(56 189 248)" stopOpacity="0.25" />
          </linearGradient>
          <linearGradient id="arch-glow" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgb(34 211 238)" stopOpacity="0.95" />
            <stop offset="100%" stopColor="rgb(167 139 250)" stopOpacity="0.9" />
          </linearGradient>
          <filter id="arch-blur" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="1.2" />
          </filter>
        </defs>

        {/* Base edges (dim) */}
        <g
          className="stroke-muted-foreground/25 dark:stroke-muted-foreground/35"
          fill="none"
          strokeWidth="1.25"
          strokeLinecap="round"
        >
          <path id="arch-path-a" d="M 118 268 L 248 268" />
          <path id="arch-path-b" d="M 332 268 L 458 268" />
          <path id="arch-path-c" d="M 542 268 L 628 268 L 628 200" />
          <path id="arch-path-d" d="M 628 268 L 628 340 L 712 340" />
          <path id="arch-path-e" d="M 628 200 L 712 200" />
          <path id="arch-path-f" d="M 796 200 L 868 200 L 868 268 L 932 268" />
          <path id="arch-path-g" d="M 796 340 L 932 340" />
          <path id="arch-path-h" d="M 458 268 L 458 188 L 542 188" />
        </g>

        {/* Animated “live” strokes */}
        {motionOn ? (
          <g
            className="landing-arch-dash fill-none"
            stroke="url(#arch-edge)"
            strokeWidth="1.6"
            strokeLinecap="round"
          >
            <path d="M 118 268 L 248 268" />
            <path d="M 332 268 L 458 268" />
            <path d="M 542 268 L 628 268 L 628 200" />
            <path d="M 628 268 L 628 340 L 712 340" />
            <path d="M 628 200 L 712 200" />
            <path d="M 796 200 L 868 200 L 868 268 L 932 268" />
            <path d="M 796 340 L 932 340" />
            <path d="M 458 268 L 458 188 L 542 188" />
          </g>
        ) : null}

        {/* Nodes */}
        <g className="text-foreground">
          <rect
            x="48"
            y="244"
            width="70"
            height="48"
            rx="8"
            className="fill-card/55 stroke-border/50 dark:fill-zinc-950/35 dark:stroke-zinc-600/50"
            strokeWidth="1"
          />
          <text
            x="83"
            y="274"
            textAnchor="middle"
            className="fill-muted-foreground font-sans font-semibold"
            style={{ fontSize: 11 }}
          >
            DNS
          </text>

          <rect
            x="248"
            y="244"
            width="84"
            height="48"
            rx="8"
            className="fill-card/55 stroke-border/50 dark:fill-zinc-950/35 dark:stroke-zinc-600/50"
            strokeWidth="1"
          />
          <text
            x="290"
            y="274"
            textAnchor="middle"
            className="fill-muted-foreground font-sans font-semibold"
            style={{ fontSize: 11 }}
          >
            LB
          </text>

          <rect
            x="458"
            y="244"
            width="84"
            height="48"
            rx="8"
            className="fill-card/55 stroke-border/50 dark:fill-zinc-950/35 dark:stroke-zinc-600/50"
            strokeWidth="1"
          />
          <text
            x="500"
            y="274"
            textAnchor="middle"
            className="fill-muted-foreground font-sans font-semibold"
            style={{ fontSize: 11 }}
          >
            App
          </text>

          <rect
            x="542"
            y="160"
            width="72"
            height="40"
            rx="8"
            className="fill-card/50 stroke-violet-500/25 dark:fill-zinc-950/30 dark:stroke-violet-400/35"
            strokeWidth="1"
          />
          <text
            x="578"
            y="184"
            textAnchor="middle"
            className="fill-muted-foreground font-sans font-medium"
            style={{ fontSize: 10 }}
          >
            API GW
          </text>

          <rect
            x="712"
            y="172"
            width="84"
            height="56"
            rx="8"
            className="fill-card/55 stroke-border/50 dark:fill-zinc-950/35 dark:stroke-zinc-600/50"
            strokeWidth="1"
          />
          <text
            x="754"
            y="202"
            textAnchor="middle"
            className="fill-muted-foreground font-sans font-semibold"
            style={{ fontSize: 11 }}
          >
            DB
          </text>

          <rect
            x="592"
            y="312"
            width="72"
            height="44"
            rx="8"
            className="fill-card/50 stroke-cyan-500/20 dark:fill-zinc-950/30 dark:stroke-cyan-400/30"
            strokeWidth="1"
          />
          <text
            x="628"
            y="338"
            textAnchor="middle"
            className="fill-muted-foreground font-sans font-medium"
            style={{ fontSize: 10 }}
          >
            Queue
          </text>

          <rect
            x="932"
            y="244"
            width="96"
            height="48"
            rx="8"
            className="fill-card/55 stroke-border/50 dark:fill-zinc-950/35 dark:stroke-zinc-600/50"
            strokeWidth="1"
          />
          <text
            x="980"
            y="274"
            textAnchor="middle"
            className="fill-muted-foreground font-sans font-semibold"
            style={{ fontSize: 11 }}
          >
            Workers
          </text>
        </g>

        {/* Glowing packets along routes */}
        {motionOn ? (
          <g filter="url(#arch-blur)">
            <circle r="4" fill="url(#arch-glow)" opacity="0.85">
              <animateMotion dur="3.2s" repeatCount="indefinite" rotate="auto">
                <mpath href="#arch-path-a" />
              </animateMotion>
            </circle>
            <circle r="3.5" fill="url(#arch-glow)" opacity="0.75">
              <animateMotion dur="2.8s" repeatCount="indefinite" begin="0.4s" rotate="auto">
                <mpath href="#arch-path-b" />
              </animateMotion>
            </circle>
            <circle r="3.5" fill="url(#arch-glow)" opacity="0.7">
              <animateMotion dur="3.6s" repeatCount="indefinite" begin="0.2s" rotate="auto">
                <mpath href="#arch-path-c" />
              </animateMotion>
            </circle>
            <circle r="3.2" fill="url(#arch-glow)" opacity="0.65">
              <animateMotion dur="4s" repeatCount="indefinite" begin="1s" rotate="auto">
                <mpath href="#arch-path-d" />
              </animateMotion>
            </circle>
            <circle r="3.2" fill="url(#arch-glow)" opacity="0.65">
              <animateMotion dur="3.4s" repeatCount="indefinite" begin="0.6s" rotate="auto">
                <mpath href="#arch-path-f" />
              </animateMotion>
            </circle>
            <circle r="3" fill="url(#arch-glow)" opacity="0.6">
              <animateMotion dur="2.6s" repeatCount="indefinite" begin="1.2s" rotate="auto">
                <mpath href="#arch-path-g" />
              </animateMotion>
            </circle>
          </g>
        ) : null}
      </svg>
    </div>
  );
}
