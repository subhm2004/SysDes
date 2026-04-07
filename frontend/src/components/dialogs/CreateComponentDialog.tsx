"use client";

import { useEffect, useRef, useState } from "react";
import { X, Server } from "lucide-react";
import { useCustomComponentsStore } from "@/store/customComponentsStore";
import { useAppStore } from "@/store/appStore";
import { COMPONENT_CATEGORIES } from "@/data/components";
import { ICON_MAP } from "@/lib/icons";
import type { ComponentCategory } from "@/types/component";

interface CreateComponentDialogProps {
  open: boolean;
  onClose: () => void;
}

const ICON_OPTIONS = Object.keys(ICON_MAP);

const inputClass =
  "w-full rounded-md border border-input bg-background px-2.5 py-1.5 text-xs text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/25";

export function CreateComponentDialog({ open, onClose }: CreateComponentDialogProps) {
  const addComponent = useCustomComponentsStore((s) => s.addComponent);
  const showToast = useAppStore((s) => s.showToast);
  const labelRef = useRef<HTMLInputElement>(null);

  const [label, setLabel] = useState("");
  const [category, setCategory] = useState<ComponentCategory>("compute");
  const [icon, setIcon] = useState<string>("Box");
  const [maxQPS, setMaxQPS] = useState(5000);
  const [latencyMs, setLatencyMs] = useState(20);
  const [scalable, setScalable] = useState(true);
  const [stateful, setStateful] = useState(false);
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (open) {
      setLabel("");
      setCategory("compute");
      setIcon("Box");
      setMaxQPS(5000);
      setLatencyMs(20);
      setScalable(true);
      setStateful(false);
      setDescription("");
      setTimeout(() => labelRef.current?.focus(), 50);
    }
  }, [open]);

  if (!open) return null;

  const handleCreate = () => {
    const trimmedLabel = label.trim();
    if (!trimmedLabel) return;

    addComponent({
      label: trimmedLabel,
      category,
      icon,
      maxQPS: Number.isFinite(maxQPS) && maxQPS > 0 ? maxQPS : 1000,
      latencyMs: Number.isFinite(latencyMs) && latencyMs >= 0 ? latencyMs : 0,
      scalable,
      stateful,
      description: description.trim(),
    });

    showToast(`Custom component "${trimmedLabel}" created`, "success");
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") onClose();
  };

  const SelectedIcon = ICON_MAP[icon] ?? Server;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" onKeyDown={handleKeyDown}>
      <div className="absolute inset-0 bg-black/50 dark:bg-black/60" onClick={onClose} aria-hidden />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-component-title"
        className="relative z-10 max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-lg border border-border bg-card p-5 text-card-foreground shadow-lg"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 id="create-component-title" className="text-sm font-semibold text-foreground">
            Create Custom Component
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-xs text-muted-foreground">Label *</label>
            <input
              ref={labelRef}
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className={inputClass}
              placeholder="e.g. Vector Database"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs text-muted-foreground">Category</label>
            <div className="grid grid-cols-5 gap-1">
              {COMPONENT_CATEGORIES.map((c) => (
                <button
                  type="button"
                  key={c.key}
                  onClick={() => setCategory(c.key as ComponentCategory)}
                  className={`rounded-md px-2 py-1.5 text-[11px] font-medium transition-colors ${
                    category === c.key
                      ? "border border-cyan-500/40 bg-cyan-500/10 text-cyan-700 dark:border-cyan-500/30 dark:bg-cyan-600/20 dark:text-cyan-400"
                      : "border border-border bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs text-muted-foreground">Icon</label>
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border bg-muted">
                <SelectedIcon className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
              </div>
              <select value={icon} onChange={(e) => setIcon(e.target.value)} className={inputClass}>
                {ICON_OPTIONS.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="mb-0.5 block text-[11px] text-muted-foreground">Max QPS</label>
              <input
                type="number"
                min={1}
                value={maxQPS}
                onChange={(e) => setMaxQPS(Number(e.target.value) || 0)}
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-0.5 block text-[11px] text-muted-foreground">Latency (ms)</label>
              <input
                type="number"
                min={0}
                value={latencyMs}
                onChange={(e) => setLatencyMs(Number(e.target.value) || 0)}
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <label className="flex cursor-pointer items-center gap-2 rounded-md border border-border bg-muted/50 px-2.5 py-2 text-xs text-foreground transition-colors hover:bg-muted">
              <input
                type="checkbox"
                checked={scalable}
                onChange={(e) => setScalable(e.target.checked)}
                className="h-3.5 w-3.5 accent-cyan-600 dark:accent-cyan-500"
              />
              Scalable (can add replicas)
            </label>
            <label className="flex cursor-pointer items-center gap-2 rounded-md border border-border bg-muted/50 px-2.5 py-2 text-xs text-foreground transition-colors hover:bg-muted">
              <input
                type="checkbox"
                checked={stateful}
                onChange={(e) => setStateful(e.target.checked)}
                className="h-3.5 w-3.5 accent-cyan-600 dark:accent-cyan-500"
              />
              Stateful
            </label>
          </div>

          <div>
            <label className="mb-1 block text-xs text-muted-foreground">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className={`${inputClass} resize-none`}
              placeholder="What does this component do? When should it be used?"
            />
          </div>
        </div>

        <div className="mt-4 flex justify-end gap-2 border-t border-border pt-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleCreate}
            disabled={!label.trim()}
            className="rounded-md bg-cyan-600 px-4 py-1.5 text-xs font-medium text-white hover:bg-cyan-500 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Create Component
          </button>
        </div>
      </div>
    </div>
  );
}
