"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { X, Copy, Check, Heart } from "lucide-react";

interface SupportDialogProps {
  open: boolean;
  onClose: () => void;
}

const UPI_ID = "vijaygupta1818@ptyes";
const UPI_NAME = "Vijay Gupta";

/** Build a UPI intent URL — opens the user's UPI app with amount pre-filled. */
function upiIntent(amount?: number): string {
  const params = new URLSearchParams({
    pa: UPI_ID,
    pn: UPI_NAME,
    cu: "INR",
    tn: "SysDes support",
  });
  if (amount) params.set("am", String(amount));
  return `upi://pay?${params.toString()}`;
}

const QUICK_AMOUNTS = [
  { amount: 49, label: "Chai" },
  { amount: 99, label: "Thanks" },
];

export function SupportDialog({ open, onClose }: SupportDialogProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) setCopied(false);
  }, [open]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(UPI_ID);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Silent fail
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <div className="relative z-10 my-4 w-full max-w-sm overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl">
        {/* Decorative gradient band */}
        <div className="relative h-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/25 via-sky-500/10 to-blue-500/5" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_120%,rgba(34,211,238,0.3),transparent_60%)]" />
          <button
            onClick={onClose}
            className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-zinc-900/70 text-zinc-400 backdrop-blur transition-colors hover:bg-zinc-800 hover:text-zinc-200"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content — pulled up to overlap the band with the badge */}
        <div className="-mt-7 px-6 pb-6 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-rose-300/40 bg-gradient-to-br from-rose-400 via-rose-500 to-pink-600 shadow-lg shadow-rose-500/30 ring-4 ring-zinc-950">
            <Heart className="h-6 w-6 fill-zinc-950/20 text-zinc-950" />
          </div>

          <h2 className="mt-4 text-lg font-semibold tracking-tight text-zinc-100">
            Enjoying SysDes?
          </h2>
          <p className="mx-auto mt-1.5 max-w-[280px] text-xs leading-relaxed text-zinc-400">
            If this helped you prep for a system design interview, a chai goes a long way to keep it alive and open-source.
          </p>

          {/* Quick amounts — UPI intents (work best on mobile) */}
          <div className="mt-5 grid grid-cols-2 gap-2">
            {QUICK_AMOUNTS.map((q) => (
              <a
                key={q.amount}
                href={upiIntent(q.amount)}
                className="group flex flex-col items-center gap-0.5 rounded-xl border border-zinc-800 bg-zinc-900 px-2 py-2.5 transition-all hover:-translate-y-0.5 hover:border-amber-500/40 hover:bg-zinc-900/80"
              >
                <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-500 group-hover:text-amber-400">
                  {q.label}
                </span>
                <span className="font-mono text-sm font-semibold text-zinc-200">
                  ₹{q.amount}
                </span>
              </a>
            ))}
          </div>

          {/* QR */}
          <div className="mt-4 flex flex-col items-center gap-2">
            <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">
              Or scan with any UPI app
            </p>
            <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-100 p-1.5 shadow-lg">
              <Image
                src="/support-upi-qr.jpg"
                alt="UPI QR code — scan to support Vijay Gupta"
                width={1012}
                height={1600}
                className="h-auto w-[200px] rounded-md"
                priority={false}
              />
            </div>
          </div>

          {/* UPI ID copy */}
          <button
            onClick={handleCopy}
            className="mt-3 inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1.5 font-mono text-[11px] text-zinc-300 transition-colors hover:border-zinc-700 hover:bg-zinc-800"
          >
            {UPI_ID}
            {copied ? (
              <Check className="h-3.5 w-3.5 text-emerald-400" />
            ) : (
              <Copy className="h-3.5 w-3.5 text-zinc-500" />
            )}
          </button>

          <p className="mt-3 text-[10px] text-zinc-500">
            Pay what feels right · No pressure · No ads
          </p>

          <div className="mt-4 flex items-center justify-center gap-1.5 border-t border-zinc-800 pt-3 text-[11px] text-zinc-500">
            <span>Built with</span>
            <Heart className="h-3 w-3 fill-rose-400 text-rose-400" />
            <span>by</span>
            <span className="font-medium text-zinc-300">Vijay Gupta</span>
          </div>
        </div>
      </div>
    </div>
  );
}
