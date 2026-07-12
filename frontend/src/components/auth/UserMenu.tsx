"use client";

import Link from "next/link";
import { BarChart3, LogOut, User, ChevronDown } from "lucide-react";
import { useAuthStore, API_BASE_URL } from "@/store/authStore";
import { useState, useRef, useEffect } from "react";

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

export function UserMenu() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // Skeleton placeholder during hydration — same size as the sign-in button
  if (!mounted) {
    return <div className="h-9 w-24 animate-pulse rounded-lg bg-zinc-200/60 dark:bg-zinc-800/60" />;
  }

  if (!isLoggedIn() || !user) {
    return (
      <a
        href={`${API_BASE_URL}/api/auth/google`}
        className="flex h-9 items-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-700 shadow-sm transition-all hover:bg-zinc-50 hover:shadow-md dark:border-zinc-700 dark:bg-zinc-800/80 dark:text-zinc-200 dark:hover:bg-zinc-800"
      >
        <GoogleIcon />
        <span className="whitespace-nowrap">Sign in</span>
      </a>
    );
  }

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex h-9 items-center gap-2 rounded-lg border border-zinc-200 bg-white pl-1.5 pr-2.5 text-sm font-medium text-zinc-700 shadow-sm transition-all hover:border-zinc-300 hover:shadow-md dark:border-zinc-700 dark:bg-zinc-800/80 dark:text-zinc-200 dark:hover:border-zinc-600"
      >
        {user.image ? (
          <img
            src={user.image}
            alt={user.name}
            className="h-6 w-6 rounded-full object-cover ring-1 ring-zinc-200 dark:ring-zinc-700"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900">
            <User className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-300" />
          </div>
        )}
        <span className="hidden max-w-[100px] truncate sm:block">{user.name.split(" ")[0]}</span>
        <ChevronDown className="h-3.5 w-3.5 text-zinc-400" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full z-50 mt-2 w-60 rounded-xl border border-zinc-200 bg-white shadow-xl dark:border-zinc-700 dark:bg-zinc-900">
            <div className="flex items-center gap-3 px-4 py-3 border-b border-zinc-100 dark:border-zinc-800">
              {user.image ? (
                <img
                  src={user.image}
                  alt={user.name}
                  className="h-9 w-9 rounded-full object-cover ring-2 ring-zinc-100 dark:ring-zinc-800"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900">
                  <User className="h-4 w-4 text-indigo-600 dark:text-indigo-300" />
                </div>
              )}
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-zinc-900 dark:text-zinc-100">{user.name}</p>
                <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">{user.email}</p>
              </div>
            </div>
            <div className="p-1.5">
              <Link
                href="/dashboard"
                onClick={() => setOpen(false)}
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-zinc-700 transition-colors hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800/60"
              >
                <BarChart3 className="h-4 w-4 text-indigo-500" />
                Dashboard
              </Link>
              <button
                onClick={() => {
                  setOpen(false);
                  logout();
                }}
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm text-rose-600 transition-colors hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/40"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
