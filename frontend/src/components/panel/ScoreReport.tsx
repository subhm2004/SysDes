"use client";

import { motion } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, AlertCircle, ChevronDown, ChevronRight, ClipboardCheck } from "lucide-react";
import { useState } from "react";
import { useSimulationStore } from "@/store/simulationStore";
import { STUDIO_COPY } from "@/lib/studio-copy";
import type { CategoryScore } from "@/types/scoring";

function CategorySection({ category }: { category: CategoryScore }) {
  const [expanded, setExpanded] = useState(false);
  const pct = (category.score / category.maxScore) * 100;

  const barColor =
    pct >= 80 ? "bg-emerald-500" :
    pct >= 50 ? "bg-amber-500" : "bg-rose-500";

  return (
    <div className="rounded-md border border-border bg-card px-3 py-3">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between"
      >
        <div className="flex items-center gap-2">
          {expanded ? (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          )}
          <span className="text-sm font-medium text-foreground">{category.category}</span>
        </div>
        <span className="font-mono text-sm text-muted-foreground">
          {category.score}/{category.maxScore}
        </span>
      </button>

      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
        <motion.div
          className={`h-full rounded-full ${barColor}`}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      </div>

      {expanded && (
        <div className="mt-3 space-y-2">
          {category.passed.map((item, i) => (
            <div key={i} className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
              <span className="text-sm leading-relaxed text-muted-foreground">{item}</span>
            </div>
          ))}
          {category.feedback.map((item, i) => (
            <div key={i} className="flex items-start gap-2">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
              <span className="text-sm leading-relaxed text-muted-foreground">{item}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const VERDICT_BORDER: Record<string, string> = {
  "text-emerald-400": "border-emerald-400/30",
  "text-cyan-400": "border-cyan-400/30",
  "text-blue-400": "border-blue-400/30",
  "text-amber-400": "border-amber-400/30",
  "text-rose-400": "border-rose-400/30",
  "text-zinc-500": "border-zinc-500/30",
};

const VERDICT_BG: Record<string, string> = {
  "text-emerald-400": "bg-emerald-400/5",
  "text-cyan-400": "bg-cyan-400/5",
  "text-blue-400": "bg-blue-400/5",
  "text-amber-400": "bg-amber-400/5",
  "text-rose-400": "bg-rose-400/5",
  "text-zinc-500": "bg-zinc-500/5",
};

function verdictBorderClass(verdictColor: string): string {
  return VERDICT_BORDER[verdictColor] ?? "border-zinc-500/30";
}

function verdictBgClass(verdictColor: string): string {
  return VERDICT_BG[verdictColor] ?? "bg-zinc-500/5";
}

export function ScoreReport() {
  const scoreResult = useSimulationStore((s) => s.scoreResult);

  if (!scoreResult) {
    return (
      <div className="flex flex-col items-center gap-3 py-10 text-center">
        <div className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-muted">
          <ClipboardCheck className="h-5 w-5 text-emerald-600/80 dark:text-emerald-400/90" strokeWidth={2.25} />
        </div>
        <div>
          <p className="text-base font-medium text-foreground">{STUDIO_COPY.score.emptyTitle}</p>
          <p className="mt-1 max-w-[240px] text-sm leading-relaxed text-muted-foreground">
            {STUDIO_COPY.score.emptyBody}{" "}
            <span className="font-medium text-emerald-600 dark:text-emerald-400">{STUDIO_COPY.score.emptyCta}</span>{" "}
            {STUDIO_COPY.score.emptySuffix}
          </p>
        </div>
      </div>
    );
  }

  const topImprovements = scoreResult.categories
    .flatMap((c) => c.feedback)
    .slice(0, 3);

  return (
    <ScrollArea className="h-full">
      <div className="space-y-4 p-1">
        {/* Overall score */}
        <div className="flex flex-col items-center gap-2 py-3">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="relative flex items-center justify-center"
          >
            {(() => {
              const radius = 38;
              const circumference = 2 * Math.PI * radius;
              const progress = (scoreResult.total / 100) * circumference;
              const strokeColor = scoreResult.total >= 71 ? '#10b981' : scoreResult.total >= 51 ? '#22d3ee' : scoreResult.total >= 31 ? '#f59e0b' : '#ef4444';
              return (
                <svg width="96" height="96" className="-rotate-90">
                  <circle
                    cx="48"
                    cy="48"
                    r={radius}
                    fill="none"
                    stroke="var(--border)"
                    strokeWidth="6"
                  />
                  <motion.circle
                    cx="48" cy="48" r={radius} fill="none"
                    stroke={strokeColor} strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: circumference - progress }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </svg>
              );
            })()}
            <div className="absolute flex flex-col items-center">
              <span className="font-mono text-3xl font-bold text-foreground sm:text-4xl">
                {scoreResult.total}
              </span>
              <span className="text-xs text-muted-foreground sm:text-sm">/ 100</span>
            </div>
          </motion.div>

          <Badge
            variant="outline"
            className={`${scoreResult.verdictColor} ${verdictBorderClass(scoreResult.verdictColor)} ${verdictBgClass(scoreResult.verdictColor)} px-3 py-1 text-sm font-semibold`}
          >
            {scoreResult.verdict}
          </Badge>

          <p className="max-w-[18rem] text-center text-sm leading-relaxed text-muted-foreground">{scoreResult.summary}</p>
        </div>

        <Separator className="bg-border" />

        {/* Category breakdowns */}
        <div className="space-y-2">
          <p className="text-sm font-sans font-semibold uppercase tracking-wider text-muted-foreground">
            Categories
          </p>
          {scoreResult.categories.map((cat) => (
            <CategorySection key={cat.category} category={cat} />
          ))}
        </div>

        {/* Top improvements */}
        {topImprovements.length > 0 && (
          <>
            <Separator className="bg-border" />
            <div className="space-y-2">
              <p className="text-sm font-sans font-semibold uppercase tracking-wider text-muted-foreground">
                Top improvements
              </p>
              {topImprovements.map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2 rounded-md border border-border bg-card px-3 py-2.5"
                >
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-bold text-foreground">
                    {i + 1}
                  </span>
                  <span className="text-sm leading-relaxed text-muted-foreground">{item}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </ScrollArea>
  );
}
