"use client";

import { X } from "lucide-react";
import { useCanvasStore } from "@/store/canvasStore";

export function CanvasTabBar() {
  const tabs = useCanvasStore((s) => s.tabs);
  const activeTabId = useCanvasStore((s) => s.activeTabId);
  const switchTab = useCanvasStore((s) => s.switchTab);
  const closeTab = useCanvasStore((s) => s.closeTab);

  return (
    <div className="flex h-11 shrink-0 items-center gap-1 overflow-x-auto border-b border-violet-200/60 bg-gradient-to-r from-[#faf8ff] via-zinc-50 to-[#faf8ff] px-2 dark:border-violet-500/15 dark:from-[#0f0d14] dark:via-zinc-950 dark:to-[#0f0d14]">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => switchTab(tab.id)}
          className={`group flex h-9 shrink-0 items-center gap-2 rounded-lg px-3 text-base font-sans font-semibold tracking-tight transition-colors ${
            tab.id === activeTabId
              ? "bg-white text-violet-800 shadow-sm ring-1 ring-violet-500/30 dark:bg-violet-950/55 dark:text-violet-100 dark:ring-violet-400/25"
              : "text-violet-950/70 hover:bg-violet-500/12 hover:text-violet-900 dark:text-violet-200/75 dark:hover:bg-violet-500/15 dark:hover:text-violet-50"
          }`}
        >
          <span className="max-w-[200px] truncate font-sans">{tab.label}</span>
          {tab.readOnly && (
            <span className="shrink-0 rounded-md border border-violet-400/35 bg-violet-500/15 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-violet-700 dark:border-violet-400/25 dark:bg-violet-500/20 dark:text-violet-300">
              REF
            </span>
          )}
          {tab.id !== "my-design" && (
            <span
              role="button"
              tabIndex={0}
              onClick={(e) => {
                e.stopPropagation();
                closeTab(tab.id);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.stopPropagation();
                  closeTab(tab.id);
                }
              }}
              className="ml-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md opacity-0 transition-opacity hover:bg-violet-500/15 dark:hover:bg-violet-500/20 group-hover:opacity-100"
              aria-label={`Close ${tab.label}`}
            >
              <X className="h-3.5 w-3.5 text-zinc-500 dark:text-zinc-400" />
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
