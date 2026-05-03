"use client";

import { X } from "lucide-react";
import { useCanvasStore } from "@/store/canvasStore";

export function CanvasTabBar() {
  const tabs = useCanvasStore((s) => s.tabs);
  const activeTabId = useCanvasStore((s) => s.activeTabId);
  const switchTab = useCanvasStore((s) => s.switchTab);
  const closeTab = useCanvasStore((s) => s.closeTab);

  // Don't render if only 1 tab (default "My Design")
  if (tabs.length <= 1) return null;

  return (
    <div className="flex h-10 shrink-0 items-center gap-0.5 border-b border-zinc-200 bg-zinc-100 px-2 overflow-x-auto dark:border-zinc-800 dark:bg-zinc-950">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => switchTab(tab.id)}
          className={`group flex h-8 items-center gap-1.5 rounded-md px-3 text-sm font-sans transition-colors ${
            tab.id === activeTabId
              ? "bg-zinc-200 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100"
              : "text-zinc-600 hover:bg-zinc-200/80 hover:text-zinc-900 dark:text-zinc-500 dark:hover:bg-zinc-900 dark:hover:text-zinc-300"
          }`}
        >
          <span className="truncate max-w-[160px]">{tab.label}</span>
          {tab.readOnly && (
            <span className="rounded bg-cyan-500/10 px-1.5 py-0.5 text-[10px] font-medium text-cyan-400">
              REF
            </span>
          )}
          {tab.id !== "my-design" && (
            <span
              role="button"
              onClick={(e) => {
                e.stopPropagation();
                closeTab(tab.id);
              }}
              className="ml-0.5 flex h-3.5 w-3.5 items-center justify-center rounded opacity-0 transition-opacity hover:bg-zinc-300 dark:hover:bg-zinc-700 group-hover:opacity-100"
            >
              <X className="h-2.5 w-2.5" />
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
