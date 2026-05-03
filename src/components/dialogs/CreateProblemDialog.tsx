"use client";

import { useState, useRef, useEffect } from "react";
import { X } from "lucide-react";
import { useCustomProblemsStore } from "@/store/customProblemsStore";
import { useAppStore } from "@/store/appStore";
import { useCanvasStore } from "@/store/canvasStore";

interface CreateProblemDialogProps {
  open: boolean;
  onClose: () => void;
}

const DIFFICULTIES = ["Easy", "Medium", "Hard"] as const;

export function CreateProblemDialog({ open, onClose }: CreateProblemDialogProps) {
  const addProblem = useCustomProblemsStore((s) => s.addProblem);
  const setSelectedProblem = useAppStore((s) => s.setSelectedProblem);
  const showToast = useAppStore((s) => s.showToast);
  const titleRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState("");
  const [difficulty, setDifficulty] = useState<"Easy" | "Medium" | "Hard">("Medium");
  const [description, setDescription] = useState("");
  const [readsPerSec, setReadsPerSec] = useState(10000);
  const [writesPerSec, setWritesPerSec] = useState(1000);
  const [storageGB, setStorageGB] = useState(1000);
  const [latencyMs, setLatencyMs] = useState(200);
  const [users, setUsers] = useState("10M DAU");
  const [constraintsText, setConstraintsText] = useState("");
  const [tagsText, setTagsText] = useState("");

  // Reset form and focus when dialog opens
  useEffect(() => {
    if (open) {
      setTitle("");
      setDifficulty("Medium");
      setDescription("");
      setReadsPerSec(10000);
      setWritesPerSec(1000);
      setStorageGB(1000);
      setLatencyMs(200);
      setUsers("10M DAU");
      setConstraintsText("");
      setTagsText("");
      setTimeout(() => titleRef.current?.focus(), 50);
    }
  }, [open]);

  if (!open) return null;

  const handleCreate = () => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;

    const constraints = constraintsText
      .split("\n")
      .map((c) => c.trim())
      .filter(Boolean);

    const tags = tagsText
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const id = addProblem({
      title: trimmedTitle,
      difficulty,
      description: description.trim(),
      requirements: { readsPerSec, writesPerSec, storageGB, latencyMs, users: users.trim() || "10M DAU" },
      constraints,
      tags,
    });

    // Clear canvas, select the new problem
    useCanvasStore.getState().clearCanvas();
    setSelectedProblem(id);
    showToast("Custom problem created!", "success");
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") onClose();
  };

  const inputClass =
    "w-full rounded-md border border-zinc-700 bg-zinc-800 px-2.5 py-1.5 text-xs text-zinc-100 placeholder-zinc-500 outline-none focus:border-cyan-500";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" onKeyDown={handleKeyDown}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      {/* Dialog */}
      <div className="relative z-10 w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-lg border border-zinc-800 bg-zinc-900 p-5 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-zinc-100">Create Custom Problem</h2>
          <button
            onClick={onClose}
            className="flex h-6 w-6 items-center justify-center rounded-md text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-3">
          {/* Title */}
          <div>
            <label className="mb-1 block text-xs text-zinc-400">Title *</label>
            <input
              ref={titleRef}
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={inputClass}
              placeholder="e.g. Real-time Collaboration Editor"
            />
          </div>

          {/* Difficulty */}
          <div>
            <label className="mb-1 block text-xs text-zinc-400">Difficulty</label>
            <div className="flex gap-1">
              {DIFFICULTIES.map((d) => (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className={`flex-1 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors ${
                    difficulty === d
                      ? d === "Easy"
                        ? "bg-emerald-600/20 text-emerald-400 border border-emerald-500/30"
                        : d === "Medium"
                          ? "bg-amber-600/20 text-amber-400 border border-amber-500/30"
                          : "bg-rose-600/20 text-rose-400 border border-rose-500/30"
                      : "bg-zinc-800 text-zinc-400 border border-zinc-700 hover:bg-zinc-700"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="mb-1 block text-xs text-zinc-400">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className={inputClass + " resize-none"}
              placeholder="Describe the system you want to design..."
            />
          </div>

          {/* Requirements */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-zinc-300">Requirements</label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="mb-0.5 block text-[11px] text-zinc-500">Reads/sec</label>
                <input
                  type="number"
                  value={readsPerSec}
                  onChange={(e) => setReadsPerSec(Number(e.target.value) || 0)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="mb-0.5 block text-[11px] text-zinc-500">Writes/sec</label>
                <input
                  type="number"
                  value={writesPerSec}
                  onChange={(e) => setWritesPerSec(Number(e.target.value) || 0)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="mb-0.5 block text-[11px] text-zinc-500">Storage (GB)</label>
                <input
                  type="number"
                  value={storageGB}
                  onChange={(e) => setStorageGB(Number(e.target.value) || 0)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="mb-0.5 block text-[11px] text-zinc-500">Latency SLA (ms)</label>
                <input
                  type="number"
                  value={latencyMs}
                  onChange={(e) => setLatencyMs(Number(e.target.value) || 0)}
                  className={inputClass}
                />
              </div>
              <div className="col-span-2">
                <label className="mb-0.5 block text-[11px] text-zinc-500">Users</label>
                <input
                  type="text"
                  value={users}
                  onChange={(e) => setUsers(e.target.value)}
                  className={inputClass}
                  placeholder="10M DAU"
                />
              </div>
            </div>
          </div>

          {/* Constraints */}
          <div>
            <label className="mb-1 block text-xs text-zinc-400">Constraints</label>
            <textarea
              value={constraintsText}
              onChange={(e) => setConstraintsText(e.target.value)}
              rows={3}
              className={inputClass + " resize-none"}
              placeholder={"Enter constraints, one per line...\ne.g. Must support offline mode\nEnd-to-end encryption required"}
            />
          </div>

          {/* Tags */}
          <div>
            <label className="mb-1 block text-xs text-zinc-400">Tags</label>
            <input
              type="text"
              value={tagsText}
              onChange={(e) => setTagsText(e.target.value)}
              className={inputClass}
              placeholder="caching, real-time, read-heavy"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-md px-3 py-1.5 text-xs text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={!title.trim()}
            className="rounded-md bg-cyan-600 px-4 py-1.5 text-xs font-medium text-white hover:bg-cyan-500 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Create Problem
          </button>
        </div>
      </div>
    </div>
  );
}
