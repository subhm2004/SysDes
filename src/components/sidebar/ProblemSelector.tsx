"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Plus, X } from "lucide-react";
import { PROBLEMS } from "@/data/problems";
import { useAppStore } from "@/store/appStore";
import { useCustomProblemsStore } from "@/store/customProblemsStore";

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

interface ProblemSelectorProps {
  onCreateProblem?: () => void;
}

export function ProblemSelector({ onCreateProblem }: ProblemSelectorProps) {
  const selectedProblemId = useAppStore((s) => s.selectedProblemId);
  const setSelectedProblem = useAppStore((s) => s.setSelectedProblem);
  const customProblems = useCustomProblemsStore((s) => s.problems);
  const deleteProblem = useCustomProblemsStore((s) => s.deleteProblem);

  const handleDeleteCustom = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    deleteProblem(id);
    // If the deleted problem was selected, switch to the first predefined problem
    if (selectedProblemId === id) {
      setSelectedProblem(PROBLEMS[0].id);
    }
    useAppStore.getState().showToast("Custom problem deleted", "info");
  };

  return (
    <ScrollArea className="h-full">
      <div className="space-y-1 p-3">
        {/* Create Problem button */}
        <button
          type="button"
          onClick={onCreateProblem}
          className="flex w-full items-center gap-2 rounded-md border border-dashed border-sidebar-border px-2.5 py-2 text-left text-sm font-sans font-medium text-violet-700 transition-colors hover:border-violet-500/40 hover:bg-sidebar-accent dark:text-violet-400"
        >
          <Plus className="h-3.5 w-3.5" />
          Create Custom Problem
        </button>

        {/* Custom problems */}
        {customProblems.map((problem) => (
          <div
            key={problem.id}
            role="button"
            tabIndex={0}
            onClick={() => setSelectedProblem(problem.id)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setSelectedProblem(problem.id);
              }
            }}
            aria-pressed={problem.id === selectedProblemId}
            className={`group flex w-full cursor-pointer flex-col gap-1.5 rounded-md px-2.5 py-2 text-left transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
              problem.id === selectedProblemId
                ? "border border-sidebar-border bg-background text-foreground shadow-sm"
                : "border border-transparent text-sidebar-foreground hover:bg-sidebar-accent"
            }`}
          >
            <div className="flex items-center justify-between gap-1">
              <span
                className={`flex-1 truncate text-sm font-sans font-medium ${
                  problem.id === selectedProblemId
                    ? "text-cyan-700 dark:text-cyan-400"
                    : "text-sidebar-foreground"
                }`}
              >
                {problem.title}
              </span>
              <div className="flex items-center gap-1">
                <Badge
                  variant="outline"
                  className="h-4 shrink-0 border-violet-500/30 bg-violet-500/10 px-1.5 text-[11px] font-medium text-violet-800 dark:text-violet-400"
                >
                  Custom
                </Badge>
                <Badge
                  variant="outline"
                  className={`h-4 shrink-0 px-1.5 text-[11px] font-medium ${getDifficultyColor(
                    problem.difficulty
                  )}`}
                >
                  {problem.difficulty}
                </Badge>
                <button
                  type="button"
                  onClick={(e) => handleDeleteCustom(e, problem.id)}
                  className="flex h-4 w-4 shrink-0 items-center justify-center rounded text-sidebar-foreground/50 opacity-0 transition-opacity hover:text-rose-600 group-hover:opacity-100 dark:hover:text-rose-400"
                  title="Delete custom problem"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            </div>
            <div className="flex flex-wrap gap-1">
              {problem.tags.map((tag, i) => (
                <span key={tag} className="text-xs text-sidebar-foreground/70">
                  {tag}{i < problem.tags.length - 1 ? " ·" : ""}
                </span>
              ))}
            </div>
          </div>
        ))}

        {/* Separator if there are custom problems */}
        {customProblems.length > 0 && (
          <div className="!my-2 h-px bg-sidebar-border" />
        )}

        {/* Predefined problems */}
        {PROBLEMS.map((problem) => (
          <button
            type="button"
            key={problem.id}
            onClick={() => setSelectedProblem(problem.id)}
            aria-pressed={problem.id === selectedProblemId}
            className={`flex w-full flex-col gap-1.5 rounded-md px-2.5 py-2 text-left transition-colors ${
              problem.id === selectedProblemId
                ? "border border-sidebar-border bg-background text-foreground shadow-sm"
                : "border border-transparent text-sidebar-foreground hover:bg-sidebar-accent"
            }`}
          >
            <div className="flex items-center justify-between">
              <span
                className={`text-sm font-sans font-medium ${
                  problem.id === selectedProblemId
                    ? "text-cyan-700 dark:text-cyan-400"
                    : "text-sidebar-foreground"
                }`}
              >
                {problem.title}
              </span>
              <Badge
                variant="outline"
                className={`h-4 px-1.5 text-[11px] font-medium ${getDifficultyColor(
                  problem.difficulty
                )}`}
              >
                {problem.difficulty}
              </Badge>
            </div>
            <div className="flex flex-wrap gap-1">
              {problem.tags.map((tag, i) => (
                <span key={tag} className="text-xs text-sidebar-foreground/70">
                  {tag}{i < problem.tags.length - 1 ? " ·" : ""}
                </span>
              ))}
            </div>
          </button>
        ))}
      </div>
    </ScrollArea>
  );
}
