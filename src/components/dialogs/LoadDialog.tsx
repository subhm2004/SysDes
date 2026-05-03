"use client";

import { useRef } from "react";
import { X, Trash2, Download, Upload } from "lucide-react";
import {
  useSavedDesignsStore,
  getProblemTitle,
  type SavedDesign,
} from "@/store/savedDesignsStore";

interface LoadDialogProps {
  open: boolean;
  onClose: () => void;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function DesignRow({
  design,
  onLoad,
  onDelete,
  onExport,
}: {
  design: SavedDesign;
  onLoad: () => void;
  onDelete: () => void;
  onExport: () => void;
}) {
  return (
    <div className="group flex items-center gap-3 rounded-md border border-zinc-800 bg-zinc-800 px-3 py-2.5 transition-colors hover:border-zinc-700">
      {/* Click area to load */}
      <button
        onClick={onLoad}
        className="flex min-w-0 flex-1 flex-col gap-0.5 text-left"
      >
        <span className="truncate text-sm font-medium text-zinc-200">
          {design.name}
        </span>
        <span className="flex items-center gap-2 text-[11px] text-zinc-500">
          <span>{getProblemTitle(design.problemId)}</span>
          <span className="text-zinc-700">|</span>
          <span>
            {design.nodes.length} node{design.nodes.length !== 1 ? "s" : ""}
          </span>
          <span className="text-zinc-700">|</span>
          <span>{formatDate(design.updatedAt)}</span>
        </span>
      </button>

      {/* Actions */}
      <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onExport();
          }}
          className="flex h-6 w-6 items-center justify-center rounded text-zinc-500 hover:bg-zinc-700 hover:text-zinc-300"
          title="Export as JSON"
        >
          <Download className="h-3 w-3" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="flex h-6 w-6 items-center justify-center rounded text-zinc-500 hover:bg-zinc-700 hover:text-rose-400"
          title="Delete"
        >
          <Trash2 className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}

export function LoadDialog({ open, onClose }: LoadDialogProps) {
  const designs = useSavedDesignsStore((s) => s.designs);
  const loadDesign = useSavedDesignsStore((s) => s.loadDesign);
  const deleteDesign = useSavedDesignsStore((s) => s.deleteDesign);
  const exportDesign = useSavedDesignsStore((s) => s.exportDesign);
  const importDesign = useSavedDesignsStore((s) => s.importDesign);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!open) return null;

  const handleExport = (id: string, name: string) => {
    const json = exportDesign(id);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${name.replace(/[^a-zA-Z0-9-_ ]/g, "")}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        importDesign(reader.result);
      }
    };
    reader.readAsText(file);
    // Reset so the same file can be re-imported
    e.target.value = "";
  };

  const handleLoad = (id: string) => {
    loadDesign(id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="relative z-10 flex w-full max-w-lg flex-col rounded-lg border border-zinc-800 bg-zinc-900 shadow-lg" style={{ maxHeight: "80vh" }}>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-4">
          <h2 className="text-sm font-semibold text-zinc-100">
            Load Design
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handleImport}
              className="flex items-center gap-1.5 rounded-md border border-zinc-700 px-2.5 py-1 text-[11px] text-zinc-400 hover:border-zinc-600 hover:bg-zinc-800 hover:text-zinc-200"
            >
              <Upload className="h-3 w-3" />
              Import JSON
            </button>
            <button
              onClick={onClose}
              className="flex h-6 w-6 items-center justify-center rounded-md text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {designs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-sm text-zinc-500">No saved designs yet.</p>
              <p className="mt-1 text-xs text-zinc-600">
                Save your current canvas with Ctrl+S or the Save button.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {designs.map((design) => (
                <DesignRow
                  key={design.id}
                  design={design}
                  onLoad={() => handleLoad(design.id)}
                  onDelete={() => deleteDesign(design.id)}
                  onExport={() => handleExport(design.id, design.name)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Hidden file input for import */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
}
