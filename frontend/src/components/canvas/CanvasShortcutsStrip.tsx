"use client";

import { Keyboard } from "lucide-react";
import { STUDIO_COPY } from "@/lib/studio-copy";

type CanvasShortcutsStripProps = {
  onOpenShortcuts?: () => void;
};

export function CanvasShortcutsStrip({ onOpenShortcuts }: CanvasShortcutsStripProps) {
  return (
    <div className="flex h-9 shrink-0 items-center border-r border-border pr-2">
      <button
        type="button"
        onClick={onOpenShortcuts}
        className="flex h-8 items-center gap-1 rounded-md px-2 text-[10px] font-semibold text-cyan-700 transition-colors hover:bg-cyan-500/12 dark:text-cyan-400 dark:hover:bg-cyan-500/15"
        title={STUDIO_COPY.shortcuts.hint}
      >
        <Keyboard className="h-3.5 w-3.5 shrink-0" aria-hidden />
        <span className="hidden sm:inline">{STUDIO_COPY.shortcuts.toolbarTitle}</span>
      </button>
    </div>
  );
}
