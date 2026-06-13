"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuthStore, API_BASE_URL } from "@/store/authStore";
import { SysDesLogoIcon } from "@/components/brand/SysDesLogoIcon";

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

export function DashboardGuard({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<"checking" | "authed" | "unauthenticated">("checking");

  useEffect(() => {
    setStatus(useAuthStore.getState().isLoggedIn() ? "authed" : "unauthenticated");
  }, []);

  if (status === "checking") {
    return (
      <div className="flex h-dvh w-full items-center justify-center bg-zinc-950">
        <div className="h-7 w-7 animate-spin rounded-full border-2 border-zinc-800 border-t-indigo-400" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="flex h-dvh w-full flex-col items-center justify-center bg-zinc-950 px-4">
        <div className="pointer-events-none absolute left-1/2 top-1/3 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/6 blur-3xl" />
        <div className="relative flex w-full max-w-sm flex-col items-center gap-8">
          <div className="flex flex-col items-center gap-2.5">
            <SysDesLogoIcon className="h-12 w-12" title="SysDes" />
            <h1 className="text-xl font-bold tracking-tight text-zinc-100">Sign in to view dashboard</h1>
            <p className="text-center text-sm text-zinc-500">Your progress, scores, and practice history live here.</p>
          </div>
          <div className="w-full rounded-2xl border border-zinc-800 bg-zinc-900/80 p-7 shadow-2xl backdrop-blur-sm">
            <a
              href={`${API_BASE_URL}/api/auth/google`}
              className="flex w-full items-center justify-center gap-3 rounded-xl border border-zinc-700 bg-white px-4 py-3 text-sm font-semibold text-zinc-900 shadow-sm transition-all hover:shadow-md hover:brightness-95 active:scale-[0.98]"
            >
              <GoogleIcon />
              Continue with Google
            </a>
          </div>
          <Link href="/" className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors">
            ← Back to home
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
