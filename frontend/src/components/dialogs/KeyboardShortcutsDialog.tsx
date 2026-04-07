"use client";

import { useEffect } from "react";
import { X, Keyboard } from "lucide-react";
import { STUDIO_COPY } from "@/lib/studio-copy";

interface KeyboardShortcutsDialogProps {
  open: boolean;
  onClose: () => void;
}

const mod = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform)
  ? "⌘"
  : "Ctrl";

export function KeyboardShortcutsDialog({ open, onClose }: KeyboardShortcutsDialogProps) {
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const sections = STUDIO_COPY.shortcuts.items.map((section) => ({
    group: section.group,
    rows: section.rows.map((row) => ({
      label: row.label,
      keys: row.keys.map((k) => k.replace("Mod", mod)),
    })),
  }));

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" onClick={onClose} aria-hidden />
      <div
        className="relative z-10 w-full max-w-md rounded-xl border border-border bg-card p-5 shadow-2xl"
        role="dialog"
        aria-labelledby="shortcuts-title"
        aria-modal="true"
      >
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Keyboard className="h-5 w-5 text-cyan-600 dark:text-cyan-400" aria-hidden />
            <h2 id="shortcuts-title" className="text-base font-semibold text-foreground">
              {STUDIO_COPY.shortcuts.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="max-h-[min(60vh,420px)] space-y-4 overflow-y-auto pr-1">
          {sections.map((section) => (
            <div key={section.group}>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {section.group}
              </p>
              <ul className="space-y-1.5">
                {section.rows.map((row) => (
                  <li
                    key={row.label}
                    className="flex items-center justify-between gap-3 rounded-md border border-border/80 bg-muted/30 px-3 py-2"
                  >
                    <span className="text-sm text-foreground">{row.label}</span>
                    <span className="flex shrink-0 flex-wrap justify-end gap-1">
                      {row.keys.map((key, i) => (
                        <kbd
                          key={`${row.label}-${i}`}
                          className="rounded border border-border bg-background px-1.5 py-0.5 font-mono text-[11px] text-muted-foreground"
                        >
                          {key}
                        </kbd>
                      ))}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="mt-4 text-center text-xs text-muted-foreground">{STUDIO_COPY.shortcuts.hint}</p>
      </div>
    </div>
  );
}
