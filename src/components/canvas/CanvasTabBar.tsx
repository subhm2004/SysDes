"use client";

import { X } from "lucide-react";
import { useCanvasStore } from "@/store/canvasStore";

export function CanvasTabBar() {
  const tabs = useCanvasStore((s) => s.tabs);
  const activeTabId = useCanvasStore((s) => s.activeTabId);
  const switchTab = useCanvasStore((s) => s.switchTab);
  const closeTab = useCanvasStore((s) => s.closeTab);

  return (
    <div className="flex h-11 shrink-0 items-center gap-1 overflow-x-auto border-b border-border bg-muted/30 px-2 dark:bg-zinc-950/80">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => switchTab(tab.id)}
          className={`group flex h-9 shrink-0 items-center gap-2 rounded-lg px-3 text-base font-sans font-semibold tracking-tight transition-colors ${
            tab.id === activeTabId
              ? "bg-white text-cyan-800 shadow-sm ring-1 ring-cyan-500/30 dark:bg-cyan-950/55 dark:text-cyan-100 dark:ring-cyan-400/25"
              : "text-cyan-950/70 hover:bg-cyan-500/12 hover:text-cyan-900 dark:text-cyan-200/75 dark:hover:bg-cyan-500/15 dark:hover:text-cyan-50"
          }`}
        >
          <span className="max-w-[200px] truncate font-sans">{tab.label}</span>
          {tab.readOnly && (
            <span className="shrink-0 rounded-md border border-cyan-400/35 bg-cyan-500/15 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-cyan-700 dark:border-cyan-400/25 dark:bg-cyan-500/20 dark:text-cyan-300">
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
              className="ml-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md opacity-0 transition-opacity hover:bg-cyan-500/15 dark:hover:bg-cyan-500/20 group-hover:opacity-100"
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
