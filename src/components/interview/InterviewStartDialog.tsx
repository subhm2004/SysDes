"use client";

import { useInterviewStore } from "@/store/interviewStore";
import {
  ClipboardList,
  Calculator,
  FileCode2,
  Database,
  LayoutDashboard,
  Search,
} from "lucide-react";
import type { ReactNode } from "react";

const PHASE_ICONS: Record<string, ReactNode> = {
  ClipboardList: <ClipboardList className="h-4 w-4 sm:h-5 sm:w-5" />,
  Calculator: <Calculator className="h-4 w-4 sm:h-5 sm:w-5" />,
  FileCode2: <FileCode2 className="h-4 w-4 sm:h-5 sm:w-5" />,
  Database: <Database className="h-4 w-4 sm:h-5 sm:w-5" />,
  LayoutDashboard: <LayoutDashboard className="h-4 w-4 sm:h-5 sm:w-5" />,
  Search: <Search className="h-4 w-4 sm:h-5 sm:w-5" />,
};

interface InterviewStartDialogProps {
  open: boolean;
  onClose: () => void;
}

export function InterviewStartDialog({ open, onClose }: InterviewStartDialogProps) {
  const phases = useInterviewStore((s) => s.phases);
  const startInterview = useInterviewStore((s) => s.startInterview);

  if (!open) return null;

  const totalMinutes = phases.reduce((sum, p) => sum + p.targetMinutes, 0);

  const handleStart = () => {
    startInterview();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
        onClick={onClose}
        aria-hidden
      />

      {/* Dialog */}
      <div
        className="relative z-10 w-full max-w-md rounded-xl border border-violet-500/25 bg-gradient-to-b from-[#16131f] to-[#0f0d14] p-7 shadow-2xl shadow-violet-950/40 ring-1 ring-violet-400/10"
        role="dialog"
        aria-labelledby="interview-start-title"
        aria-modal="true"
      >
        <h2
          id="interview-start-title"
          className="text-lg font-semibold tracking-tight text-zinc-50 sm:text-xl"
        >
          Practice Interview Mode
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-zinc-400 sm:text-[0.9375rem]">
          Simulate a {totalMinutes}-minute system design interview with guided phases.
          A timer will track your progress through each phase.
        </p>

        {/* Phase timeline */}
        <div className="mt-5 space-y-2.5">
          {phases.map((phase, i) => (
            <div
              key={phase.name}
              className="flex items-center gap-3 rounded-lg border border-violet-500/10 bg-violet-950/25 px-3.5 py-2.5"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-500/20 text-violet-200 ring-1 ring-violet-400/25 sm:h-9 sm:w-9">
                {PHASE_ICONS[phase.icon] ?? <span className="text-sm font-medium">{i + 1}</span>}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-zinc-100">{phase.name}</p>
                <p className="mt-0.5 text-xs leading-snug text-zinc-500">{phase.description}</p>
              </div>
              <span className="shrink-0 font-mono text-xs tabular-nums text-violet-300/80">
                {phase.targetMinutes} min
              </span>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="mt-6 flex flex-wrap items-center justify-end gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-3.5 py-2 text-sm text-zinc-400 transition-colors hover:bg-violet-500/10 hover:text-violet-100"
          >
            I&apos;ll practice freely
          </button>
          <button
            type="button"
            onClick={handleStart}
            className="rounded-lg bg-[#7c5cfc] px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-violet-600/25 transition-colors hover:bg-[#9070ff]"
          >
            Start Interview
          </button>
        </div>
      </div>
    </div>
  );
}
