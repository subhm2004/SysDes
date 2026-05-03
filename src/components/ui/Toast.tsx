"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertCircle, Info } from "lucide-react";
import { useAppStore } from "@/store/appStore";

const ICONS = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
};

const COLORS = {
  success: "border-emerald-500/30 bg-zinc-900 text-emerald-300",
  error: "border-rose-500/30 bg-zinc-900 text-rose-300",
  info: "border-zinc-700 bg-zinc-900 text-zinc-300",
};

const ICON_COLORS = {
  success: "text-emerald-400",
  error: "text-rose-400",
  info: "text-cyan-400",
};

export function Toast() {
  const toast = useAppStore((s) => s.toast);
  const clearToast = useAppStore((s) => s.clearToast);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(clearToast, 3000);
    return () => clearTimeout(timer);
  }, [toast, clearToast]);

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="pointer-events-none fixed bottom-6 left-1/2 z-50 -translate-x-1/2"
        >
          <div
            className={`pointer-events-auto flex items-center gap-2 rounded-md border px-4 py-2.5 shadow-sm ${COLORS[toast.type]}`}
          >
            {(() => {
              const Icon = ICONS[toast.type];
              return <Icon className={`h-4 w-4 shrink-0 ${ICON_COLORS[toast.type]}`} />;
            })()}
            <span className="text-sm font-medium">{toast.message}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
