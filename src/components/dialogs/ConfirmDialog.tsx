"use client";

import { useEffect } from "react";
import { X, AlertTriangle } from "lucide-react";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  danger?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  danger = false,
  onConfirm,
  onClose,
}: ConfirmDialogProps) {
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "Enter") {
        e.preventDefault();
        onConfirm();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose, onConfirm]);

  if (!open) return null;

  const confirmClass = danger
    ? "bg-rose-600 shadow-lg shadow-rose-600/30 hover:bg-rose-500 dark:bg-rose-600 dark:hover:bg-rose-500"
    : "bg-cyan-600 shadow-lg shadow-cyan-600/25 hover:bg-cyan-500 dark:bg-cyan-600 dark:hover:bg-cyan-500";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
        onClick={onClose}
        aria-hidden
      />

      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-desc"
        className={`relative z-10 w-full max-w-md rounded-xl p-7 shadow-2xl ${
          danger
            ? "border border-rose-500/35 bg-gradient-to-b from-[#1c1418] via-zinc-950 to-[#110c0e] ring-1 ring-rose-500/15 shadow-rose-950/40"
            : "border border-zinc-700 bg-zinc-900 ring-1 ring-zinc-600/20"
        }`}
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-3">
            {danger && (
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-500/15 ring-1 ring-rose-400/25">
                <AlertTriangle className="h-5 w-5 text-rose-400" strokeWidth={2.25} aria-hidden />
              </span>
            )}
            <h2
              id="confirm-dialog-title"
              className={`text-lg font-semibold leading-snug tracking-tight sm:text-xl ${
                danger ? "text-rose-50" : "text-zinc-100"
              }`}
            >
              {title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors ${
              danger
                ? "text-rose-200/60 hover:bg-rose-500/15 hover:text-rose-100"
                : "text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300"
            }`}
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <p
          id="confirm-dialog-desc"
          className={`mb-6 text-sm leading-relaxed sm:text-base ${
            danger ? "text-rose-100/70" : "text-zinc-400"
          }`}
        >
          {message}
        </p>

        <div className="flex flex-wrap justify-end gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onClose}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              danger
                ? "text-rose-200/80 hover:bg-rose-500/10 hover:text-rose-50"
                : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
            }`}
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            autoFocus
            className={`rounded-lg px-5 py-2 text-sm font-semibold text-white transition-colors ${confirmClass}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
