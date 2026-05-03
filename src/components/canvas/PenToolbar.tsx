"use client";

import { useState } from "react";
import { Pen, Eraser, Trash2 } from "lucide-react";
import { usePenStore, PEN_COLORS, PEN_WIDTHS } from "@/store/penStore";
import { ConfirmDialog } from "@/components/dialogs/ConfirmDialog";

export function PenToolbar() {
  const mode = usePenStore((s) => s.mode);
  const color = usePenStore((s) => s.color);
  const width = usePenStore((s) => s.width);
  const strokes = usePenStore((s) => s.strokes);
  const setMode = usePenStore((s) => s.setMode);
  const setColor = usePenStore((s) => s.setColor);
  const setWidth = usePenStore((s) => s.setWidth);
  const clearAll = usePenStore((s) => s.clearAll);

  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <>
    <div className="pointer-events-auto absolute right-3 top-3 z-20 flex items-center gap-1 rounded-md border border-border bg-card/95 p-1 text-card-foreground shadow-lg backdrop-blur-md">
      <button
        type="button"
        onClick={() => setMode(mode === "pen" ? "off" : "pen")}
        className={`flex h-7 w-7 items-center justify-center rounded transition-colors ${
          mode === "pen"
            ? "bg-cyan-500/15 text-cyan-700 dark:bg-cyan-500/20 dark:text-cyan-400"
            : "text-muted-foreground hover:bg-muted hover:text-foreground"
        }`}
        title="Pen (draw on canvas)"
      >
        <Pen className="h-3.5 w-3.5" />
      </button>
      <button
        type="button"
        onClick={() => setMode(mode === "eraser" ? "off" : "eraser")}
        className={`flex h-7 w-7 items-center justify-center rounded transition-colors ${
          mode === "eraser"
            ? "bg-rose-500/15 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400"
            : "text-muted-foreground hover:bg-muted hover:text-foreground"
        }`}
        title="Eraser"
      >
        <Eraser className="h-3.5 w-3.5" />
      </button>

      {mode !== "off" && (
        <>
          <div className="mx-1 h-4 w-px bg-border" />

          <div className="flex items-center gap-1">
            {PEN_COLORS.map((c) => (
              <button
                type="button"
                key={c}
                onClick={() => setColor(c)}
                className={`h-5 w-5 rounded-full border transition-transform ${
                  color === c
                    ? "scale-110 border-foreground ring-2 ring-border ring-offset-2 ring-offset-card"
                    : "border-border hover:scale-105"
                }`}
                style={{ backgroundColor: c }}
                title={c}
              />
            ))}
          </div>

          <div className="mx-1 h-4 w-px bg-border" />

          <div className="flex items-center gap-1">
            {PEN_WIDTHS.map((w) => (
              <button
                type="button"
                key={w}
                onClick={() => setWidth(w)}
                className={`flex h-5 w-5 items-center justify-center rounded transition-colors ${
                  width === w ? "bg-muted" : "hover:bg-muted/80"
                }`}
                title={`${w}px`}
              >
                <div
                  className="rounded-full bg-foreground/70 dark:bg-foreground/60"
                  style={{ width: `${Math.min(w / 2 + 2, 14)}px`, height: `${Math.min(w / 2 + 2, 14)}px` }}
                />
              </button>
            ))}
          </div>
        </>
      )}

      {strokes.length > 0 && (
        <>
          <div className="mx-1 h-4 w-px bg-border" />
          <button
            type="button"
            onClick={() => setConfirmOpen(true)}
            className="flex h-7 w-7 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-muted hover:text-rose-600 dark:hover:text-rose-400"
            title="Clear all drawings"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </>
      )}
    </div>

    <ConfirmDialog
      open={confirmOpen}
      title="Clear all drawings?"
      message={`This will remove ${strokes.length} drawing${strokes.length === 1 ? "" : "s"} from the canvas. This can't be undone.`}
      confirmText="Clear all"
      danger
      onConfirm={clearAll}
      onClose={() => setConfirmOpen(false)}
    />
    </>
  );
}
