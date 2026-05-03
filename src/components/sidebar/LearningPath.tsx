"use client";

import { useState, useCallback } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronRight, Star } from "lucide-react";
import { LEARNING_PATH, PROBLEM_CONCEPTS } from "@/data/learningPath";
import { PROBLEMS } from "@/data/problems";
import { useAppStore } from "@/store/appStore";

const STORAGE_KEY = "sds-completed-problems";

function getDifficultyColor(difficulty: string) {
  switch (difficulty) {
    case "Easy":
      return "border-emerald-500/30 bg-emerald-500/10 text-emerald-800 dark:text-emerald-400";
    case "Medium":
      return "border-amber-500/30 bg-amber-500/10 text-amber-800 dark:text-amber-400";
    case "Hard":
      return "border-rose-500/30 bg-rose-500/10 text-rose-800 dark:text-rose-400";
    default:
      return "";
  }
}

const TIER_COLORS: Record<string, string> = {
  Foundations: "text-emerald-700 dark:text-emerald-400",
  Intermediate: "text-amber-700 dark:text-amber-400",
  Advanced: "text-rose-700 dark:text-rose-400",
  Expert: "text-purple-700 dark:text-purple-400",
};

const TIER_BAR_COLORS: Record<string, string> = {
  Foundations: "bg-emerald-500",
  Intermediate: "bg-amber-500",
  Advanced: "bg-rose-500",
  Expert: "bg-purple-500",
};

function getConceptsForProblem(problemId: string): string[] {
  return PROBLEM_CONCEPTS.find((p) => p.problemId === problemId)?.concepts ?? [];
}

export function LearningPath() {
  const selectedProblemId = useAppStore((s) => s.selectedProblemId);
  const setSelectedProblem = useAppStore((s) => s.setSelectedProblem);
  const [expandedTiers, setExpandedTiers] = useState<Set<string>>(new Set(["Foundations"]));
  const [completed, setCompleted] = useState<Set<string>>(() => {
    if (typeof window === "undefined") return new Set();
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch {
      return new Set();
    }
  });

  const toggleCompleted = useCallback((problemId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCompleted((prev) => {
      const next = new Set(prev);
      if (next.has(problemId)) {
        next.delete(problemId);
      } else {
        next.add(problemId);
      }
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  const toggleTier = (name: string) => {
    setExpandedTiers((prev) => {
      const next = new Set(prev);
      if (next.has(name)) {
        next.delete(name);
      } else {
        next.add(name);
      }
      return next;
    });
  };

  // Find recommended next problem: first incomplete problem in earliest incomplete tier
  let recommendedId: string | null = null;
  for (const tier of LEARNING_PATH) {
    for (const pid of tier.problemIds) {
      if (!completed.has(pid)) {
        recommendedId = pid;
        break;
      }
    }
    if (recommendedId) break;
  }

  return (
    <ScrollArea className="h-full">
      <div className="space-y-1 p-3.5">
        {LEARNING_PATH.map((tier) => {
          const isExpanded = expandedTiers.has(tier.name);
          const completedCount = tier.problemIds.filter((id) => completed.has(id)).length;
          const totalCount = tier.problemIds.length;
          const progressPct = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

          return (
            <div key={tier.name}>
              {/* Tier header */}
              <button
                type="button"
                onClick={() => toggleTier(tier.name)}
                className="flex w-full items-center gap-2 rounded-md px-2.5 py-2.5 text-left text-sidebar-foreground transition-colors hover:bg-sidebar-accent"
              >
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4 shrink-0 text-sidebar-foreground/55" />
                ) : (
                  <ChevronRight className="h-4 w-4 shrink-0 text-sidebar-foreground/55" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-base font-sans font-semibold ${TIER_COLORS[tier.name] ?? "text-foreground"}`}
                    >
                      {tier.name}
                    </span>
                    <span className="text-sm tabular-nums text-sidebar-foreground/65">
                      {completedCount}/{totalCount}
                    </span>
                  </div>
                  <p className="mt-0.5 text-sm text-sidebar-foreground/70">{tier.description}</p>
                  {/* Progress bar */}
                  <div className="mt-1.5 h-1 w-full rounded-full bg-sidebar-accent">
                    <div
                      className={`h-1 rounded-full transition-all ${TIER_BAR_COLORS[tier.name] ?? "bg-violet-500"}`}
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                </div>
              </button>

              {/* Problems in tier */}
              {isExpanded && (
                <div className="ml-3 mt-1 space-y-0.5">
                  {tier.problemIds.map((pid) => {
                    const problem = PROBLEMS.find((p) => p.id === pid);
                    if (!problem) return null;
                    const concepts = getConceptsForProblem(pid);
                    const isCompleted = completed.has(pid);
                    const isRecommended = pid === recommendedId;
                    const isSelected = pid === selectedProblemId;

                    return (
                      <div
                        key={pid}
                        role="button"
                        tabIndex={0}
                        onClick={() => setSelectedProblem(pid)}
                        onKeyDown={(e) => { if (e.key === "Enter") setSelectedProblem(pid); }}
                        className={`flex w-full cursor-pointer flex-col gap-1.5 rounded-md px-2.5 py-2.5 text-left transition-colors ${
                          isSelected
                            ? "border border-sidebar-border bg-background text-foreground shadow-sm"
                            : isRecommended
                              ? "border border-violet-500/25 bg-violet-500/[0.08] hover:bg-violet-500/15 dark:border-violet-500/35 dark:bg-violet-950/30 dark:hover:bg-violet-950/45"
                              : "border border-transparent text-sidebar-foreground hover:bg-sidebar-accent"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1">
                          <div className="flex items-center gap-1.5 min-w-0">
                            {/* Completion toggle */}
                            <button
                              type="button"
                              onClick={(e) => toggleCompleted(pid, e)}
                              className={`h-4 w-4 shrink-0 rounded border transition-colors ${
                                isCompleted
                                  ? "border-violet-600 bg-violet-600 dark:border-violet-500 dark:bg-violet-500"
                                  : "border-border hover:border-violet-500/50"
                              }`}
                            >
                              {isCompleted && (
                                <svg viewBox="0 0 14 14" className="h-full w-full text-white dark:text-zinc-900">
                                  <path
                                    d="M3 7l3 3 5-5"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              )}
                            </button>
                            <span
                              className={`text-base font-sans font-medium truncate ${
                                isCompleted
                                  ? "text-sidebar-foreground/55 line-through"
                                  : isSelected
                                    ? "text-violet-700 dark:text-violet-400"
                                    : "text-sidebar-foreground"
                              }`}
                            >
                              {problem.title}
                            </span>
                            {isRecommended && !isCompleted && (
                              <Star className="h-3.5 w-3.5 shrink-0 fill-amber-400 text-amber-400" />
                            )}
                          </div>
                          <Badge
                            variant="outline"
                            className={`h-6 shrink-0 px-2 text-sm font-medium ${getDifficultyColor(problem.difficulty)}`}
                          >
                            {problem.difficulty}
                          </Badge>
                        </div>
                        {concepts.length > 0 && (
                          <div className="ml-5 flex flex-wrap gap-1">
                            {concepts.map((c) => (
                              <span
                                key={c}
                                className="rounded bg-sidebar-accent px-1.5 py-0.5 text-sm text-sidebar-foreground/75"
                              >
                                {c}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
}
