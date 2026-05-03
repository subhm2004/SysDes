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
  ClipboardList: <ClipboardList className="h-4 w-4" />,
  Calculator: <Calculator className="h-4 w-4" />,
  FileCode2: <FileCode2 className="h-4 w-4" />,
  Database: <Database className="h-4 w-4" />,
  LayoutDashboard: <LayoutDashboard className="h-4 w-4" />,
  Search: <Search className="h-4 w-4" />,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      {/* Dialog */}
      <div className="relative z-10 w-full max-w-md rounded-lg border border-zinc-700 bg-zinc-900 p-6 shadow-xl">
        <h2 className="text-base font-semibold text-zinc-100">
          Practice Interview Mode
        </h2>
        <p className="mt-1.5 text-xs text-zinc-400">
          Simulate a {totalMinutes}-minute system design interview with guided phases.
          A timer will track your progress through each phase.
        </p>

        {/* Phase timeline */}
        <div className="mt-4 space-y-2">
          {phases.map((phase, i) => (
            <div
              key={phase.name}
              className="flex items-center gap-3 rounded-md bg-zinc-800 px-3 py-2"
            >
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-zinc-700 text-zinc-300">
                {PHASE_ICONS[phase.icon] ?? <span className="text-xs">{i + 1}</span>}
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium text-zinc-200">{phase.name}</p>
                <p className="text-[10px] text-zinc-500">{phase.description}</p>
              </div>
              <span className="font-mono text-[10px] text-zinc-500">
                {phase.targetMinutes} min
              </span>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="mt-5 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-md px-3 py-1.5 text-xs text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-200"
          >
            I&apos;ll practice freely
          </button>
          <button
            onClick={handleStart}
            className="rounded-md bg-cyan-500 px-4 py-1.5 text-xs font-medium text-white transition-colors hover:bg-cyan-400"
          >
            Start Interview
          </button>
        </div>
      </div>
    </div>
  );
}
