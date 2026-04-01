"use client";

import {
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Pause,
  Play,
  X,
} from "lucide-react";
import { useInterviewStore } from "@/store/interviewStore";

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function InterviewBar() {
  const mode = useInterviewStore((s) => s.mode);
  const currentPhase = useInterviewStore((s) => s.currentPhase);
  const phases = useInterviewStore((s) => s.phases);
  const timerSeconds = useInterviewStore((s) => s.timerSeconds);
  const timerRunning = useInterviewStore((s) => s.timerRunning);
  const phaseStartTime = useInterviewStore((s) => s.phaseStartTime);
  const nextPhase = useInterviewStore((s) => s.nextPhase);
  const prevPhase = useInterviewStore((s) => s.prevPhase);
  const endInterview = useInterviewStore((s) => s.endInterview);
  const toggleTimer = useInterviewStore((s) => s.toggleTimer);

  if (mode !== "interview") return null;

  const phaseElapsed = timerSeconds - phaseStartTime;
  const targetSeconds = phases[currentPhase].targetMinutes * 60;
  const totalTarget = phases.reduce((sum, p) => sum + p.targetMinutes * 60, 0);

  // Phase timer color
  let phaseTimerColor = "text-emerald-400";
  if (phaseElapsed > targetSeconds * 2) {
    phaseTimerColor = "text-red-400";
  } else if (phaseElapsed > targetSeconds) {
    phaseTimerColor = "text-yellow-400";
  }

  // Total timer color
  let totalTimerColor = "text-zinc-700 dark:text-zinc-300";
  if (timerSeconds > totalTarget * 2) {
    totalTimerColor = "text-red-400";
  } else if (timerSeconds > totalTarget) {
    totalTimerColor = "text-yellow-400";
  }

  return (
    <div className="flex h-11 shrink-0 items-center justify-between gap-3 overflow-x-auto border-b border-zinc-200 bg-zinc-100 px-3 [scrollbar-width:none] dark:border-zinc-800 dark:bg-zinc-900 [&::-webkit-scrollbar]:hidden">
      {/* Phase stepper */}
      <div className="flex items-center gap-1">
        {phases.map((phase, i) => (
          <div key={phase.name} className="flex items-center">
            {/* Circle */}
            <button
              onClick={() => useInterviewStore.getState().setPhase(i)}
              className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-semibold transition-colors ${
                i === currentPhase
                  ? "bg-cyan-500 text-white"
                  : i < currentPhase
                    ? "bg-zinc-300 text-zinc-700 dark:bg-zinc-600 dark:text-zinc-300"
                    : "bg-zinc-200 text-zinc-500 dark:bg-zinc-700 dark:text-zinc-500"
              }`}
              title={phase.name}
            >
              {i < currentPhase ? <Check className="h-3 w-3" /> : i + 1}
            </button>
            {/* Connector line */}
            {i < phases.length - 1 && (
              <div
                className={`h-px w-4 ${
                  i < currentPhase ? "bg-zinc-400 dark:bg-zinc-500" : "bg-zinc-300 dark:bg-zinc-700"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Phase info */}
      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-xs font-medium text-zinc-800 dark:text-zinc-200">
            {phases[currentPhase].name}
          </p>
          <p className="text-[10px] text-zinc-600 dark:text-zinc-500">
            {phases[currentPhase].description}
          </p>
        </div>
      </div>

      {/* Timers and controls */}
      <div className="flex items-center gap-3">
        {/* Phase timer */}
        <div className="flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5 text-zinc-500 dark:text-zinc-500" />
          <span className={`font-mono text-xs ${phaseTimerColor}`}>
            Phase: {formatTime(phaseElapsed)} / {formatTime(targetSeconds)}
          </span>
        </div>

        <div className="h-4 w-px bg-zinc-300 dark:bg-zinc-700" />

        {/* Total timer */}
        <span className={`font-mono text-xs ${totalTimerColor}`}>
          Total: {formatTime(timerSeconds)} / {formatTime(totalTarget)}
        </span>

        <div className="h-4 w-px bg-zinc-300 dark:bg-zinc-700" />

        {/* Pause/Play */}
        <button
          onClick={toggleTimer}
          className="flex h-6 w-6 items-center justify-center rounded-md text-zinc-600 transition-colors hover:bg-zinc-200 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
          title={timerRunning ? "Pause timer" : "Resume timer"}
        >
          {timerRunning ? (
            <Pause className="h-3.5 w-3.5" />
          ) : (
            <Play className="h-3.5 w-3.5" />
          )}
        </button>

        {/* Prev / Next phase */}
        <button
          onClick={prevPhase}
          disabled={currentPhase === 0}
          className="flex h-6 w-6 items-center justify-center rounded-md text-zinc-600 transition-colors hover:bg-zinc-200 hover:text-zinc-900 disabled:opacity-30 disabled:cursor-not-allowed dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
          title="Previous phase"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          onClick={nextPhase}
          disabled={currentPhase === phases.length - 1}
          className="flex h-6 w-6 items-center justify-center rounded-md text-zinc-600 transition-colors hover:bg-zinc-200 hover:text-zinc-900 disabled:opacity-30 disabled:cursor-not-allowed dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
          title="Next phase"
        >
          <ChevronRight className="h-4 w-4" />
        </button>

        <div className="h-4 w-px bg-zinc-300 dark:bg-zinc-700" />

        {/* End interview */}
        <button
          onClick={endInterview}
          className="flex h-6 items-center gap-1 rounded-md px-2 text-xs text-zinc-600 transition-colors hover:bg-zinc-200 hover:text-rose-600 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-rose-400"
          title="End interview"
        >
          <X className="h-3.5 w-3.5" />
          End
        </button>
      </div>
    </div>
  );
}
