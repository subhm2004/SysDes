"use client";

import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  ArrowRight,
  Award,
  BarChart3,
  CalendarDays,
  Flame,
  RefreshCw,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";
import { useAuthStore, getAuthHeaders, API_BASE_URL } from "@/store/authStore";
import { PROBLEMS } from "@/data/problems";
import { cn } from "@/lib/utils";

// ─── Types ───────────────────────────────────────────────────────────────────

interface OverallStats {
  totalAttempts: number;
  avgScore: number | null;
  bestScore: number | null;
}

interface PerProblemStat {
  problemId: string;
  attempts: number;
  bestScore: number;
  avgScore: number;
  lastVerdict: string;
}

interface RecentScore {
  id: string;
  problemId: string;
  total: number;
  verdict: string;
  createdAt: string;
}

interface ScoreRecord {
  id: string;
  problemId: string;
  axes: Record<string, number>;
  total: number;
  verdict: string;
  durationSec: number | null;
  createdAt: string;
}

interface StatsData {
  overall: OverallStats;
  perProblem: PerProblemStat[];
  recent: RecentScore[];
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const AXES = [
  { key: "scalability",   label: "Scale" },
  { key: "availability",  label: "Avail." },
  { key: "latency",       label: "Latency" },
  { key: "cost",          label: "Cost" },
  { key: "tradeoffs",     label: "Trade-offs" },
];

function verdictColor(v: string) {
  const x = v.toLowerCase();
  if (x === "architect") return "text-emerald-500 dark:text-emerald-400";
  if (x === "strong")    return "text-indigo-500 dark:text-indigo-300";
  if (x === "good")      return "text-blue-500 dark:text-blue-400";
  if (x === "developing") return "text-amber-500 dark:text-amber-400";
  return "text-rose-500 dark:text-rose-400";
}

function verdictBg(v: string) {
  const x = v.toLowerCase();
  if (x === "architect")  return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25";
  if (x === "strong")     return "bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 border-indigo-500/25";
  if (x === "good")       return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/25";
  if (x === "developing") return "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/25";
  return "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/25";
}

function scoreBarColor(s: number) {
  if (s >= 86) return "from-emerald-500 to-emerald-400";
  if (s >= 71) return "from-indigo-500 to-violet-400";
  if (s >= 51) return "from-blue-500 to-blue-400";
  if (s >= 31) return "from-amber-500 to-amber-400";
  return "from-rose-500 to-rose-400";
}

function diffBadge(d: string) {
  if (d === "Easy")   return "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
  if (d === "Medium") return "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400";
  return "border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400";
}

function timeAgo(iso: string): string {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function calcStreak(scores: { createdAt: string }[]): number {
  if (!scores.length) return 0;
  const days = [...new Set(scores.map((s) => new Date(s.createdAt).toDateString()))].sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime(),
  );
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86_400_000).toDateString();
  if (days[0] !== today && days[0] !== yesterday) return 0;
  let streak = 1;
  for (let i = 1; i < days.length; i++) {
    const prev = new Date(days[i - 1]).getTime();
    const curr = new Date(days[i]).getTime();
    if (Math.round((prev - curr) / 86_400_000) === 1) streak++;
    else break;
  }
  return streak;
}

function avgAxes(scores: ScoreRecord[]): Record<string, number> {
  if (!scores.length) return {};
  const sums: Record<string, number> = {};
  const counts: Record<string, number> = {};
  for (const s of scores) {
    for (const [k, v] of Object.entries(s.axes ?? {})) {
      sums[k] = (sums[k] ?? 0) + Number(v);
      counts[k] = (counts[k] ?? 0) + 1;
    }
  }
  const avg: Record<string, number> = {};
  for (const k of Object.keys(sums)) avg[k] = Math.round(sums[k] / counts[k]);
  return avg;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  accent,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  sub?: string;
  accent?: string;
}) {
  return (
    <div className="relative flex flex-col gap-3 overflow-hidden rounded-2xl border border-zinc-200/60 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="pointer-events-none absolute -right-4 -top-4 h-24 w-24 rounded-full bg-indigo-500/5 blur-2xl" />
      <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl", accent ?? "bg-indigo-500/12 text-indigo-600 dark:text-indigo-300")}>
        <Icon className="h-5 w-5" strokeWidth={2} />
      </div>
      <div>
        <p className="text-3xl font-bold tabular-nums tracking-tight text-zinc-900 dark:text-zinc-100">
          {value}
        </p>
        <p className="mt-0.5 text-sm font-medium text-zinc-500 dark:text-zinc-400">{label}</p>
        {sub && <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">{sub}</p>}
      </div>
    </div>
  );
}

function RadarChart({ data }: { data: Record<string, number> }) {
  const N = AXES.length;
  const size = 220;
  const cx = size / 2;
  const cy = size / 2;
  const r = 80;

  const pts = (frac: number) =>
    AXES.map((_, i) => {
      const angle = (Math.PI * 2 * i) / N - Math.PI / 2;
      return { x: cx + r * frac * Math.cos(angle), y: cy + r * frac * Math.sin(angle) };
    });

  const toPath = (points: { x: number; y: number }[]) =>
    points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ") + " Z";

  const valuePts = AXES.map((a, i) => {
    const angle = (Math.PI * 2 * i) / N - Math.PI / 2;
    const frac = (data[a.key] ?? 0) / 100;
    return { x: cx + r * frac * Math.cos(angle), y: cy + r * frac * Math.sin(angle) };
  });

  const labelPts = AXES.map((a, i) => {
    const angle = (Math.PI * 2 * i) / N - Math.PI / 2;
    return { x: cx + (r + 22) * Math.cos(angle), y: cy + (r + 22) * Math.sin(angle), label: a.label };
  });

  const hasData = Object.keys(data).length > 0;

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="w-full max-w-[220px]" aria-label="Radar chart">
      {[0.25, 0.5, 0.75, 1].map((f) => (
        <path key={f} d={toPath(pts(f))} fill="none" stroke="rgb(99 102 241 / 0.12)" strokeWidth="1" />
      ))}
      {AXES.map((_, i) => {
        const outer = pts(1)[i];
        return <line key={i} x1={cx} y1={cy} x2={outer.x} y2={outer.y} stroke="rgb(99 102 241 / 0.15)" strokeWidth="1" />;
      })}
      {hasData ? (
        <path d={toPath(valuePts)} fill="rgb(99 102 241 / 0.18)" stroke="rgb(99 102 241)" strokeWidth="2" strokeLinejoin="round" />
      ) : (
        <path d={toPath(pts(0.01))} fill="rgb(99 102 241 / 0.05)" stroke="rgb(99 102 241 / 0.2)" strokeWidth="1.5" />
      )}
      {hasData && valuePts.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="3.5" fill="rgb(99 102 241)" />
      ))}
      {labelPts.map((p, i) => (
        <text
          key={i}
          x={p.x}
          y={p.y}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize="9"
          fill="currentColor"
          className="fill-zinc-400 font-medium dark:fill-zinc-500"
        >
          {p.label}
          {hasData && (
            <tspan> {data[AXES[i].key] ?? 0}</tspan>
          )}
        </text>
      ))}
    </svg>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const [stats, setStats] = useState<StatsData | null>(null);
  const [allScores, setAllScores] = useState<ScoreRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const headers = getAuthHeaders();
      const [statsRes, scoresRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/scores/stats`, { headers }),
        fetch(`${API_BASE_URL}/api/scores?limit=100`, { headers }),
      ]);
      if (!statsRes.ok || !scoresRes.ok) throw new Error("Failed to fetch");
      const [statsData, scoresData] = await Promise.all([statsRes.json(), scoresRes.json()]);
      setStats(statsData);
      setAllScores(scoresData.scores ?? []);
    } catch {
      setError("Couldn't load your data. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const streak = calcStreak(allScores);
  const axisAvg = avgAxes(allScores);

  const firstName = user?.name?.split(" ")[0] ?? "there";

  // Build problem rows: merge perProblem stats with PROBLEMS metadata
  const problemRows = (stats?.perProblem ?? []).map((row) => {
    const problem = PROBLEMS.find((p) => p.id === row.problemId);
    return { ...row, problem };
  });

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Subtle background */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
        <div className="absolute -top-40 left-[20%] h-96 w-96 rounded-full bg-indigo-500/6 blur-[120px]" />
        <div className="absolute top-[50%] right-[10%] h-72 w-72 rounded-full bg-violet-500/5 blur-[100px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        {/* ── Header ── */}
        <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-4xl">
              Welcome back, {firstName} 👋
            </h1>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              {stats?.overall.totalAttempts
                ? `${stats.overall.totalAttempts} attempt${stats.overall.totalAttempts !== 1 ? "s" : ""} across ${problemRows.length} problem${problemRows.length !== 1 ? "s" : ""}`
                : "No attempts yet — open a problem to get started."}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchData}
              disabled={loading}
              className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3.5 py-2 text-sm font-medium text-zinc-600 shadow-sm transition-all hover:border-zinc-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:border-zinc-700 disabled:opacity-50"
            >
              <RefreshCw className={cn("h-3.5 w-3.5", loading && "animate-spin")} />
              Refresh
            </button>
            <Link
              href="/studio"
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 hover:shadow-md"
            >
              Practice
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* ── Error ── */}
        {error && (
          <div className="mb-6 rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-600 dark:text-rose-400">
            {error}
          </div>
        )}

        {/* ── Loading skeleton ── */}
        {loading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 animate-pulse rounded-2xl bg-zinc-200 dark:bg-zinc-800" />
            ))}
          </div>
        ) : (
          <>
            {/* ── Stat cards ── */}
            <motion.div
              className="grid grid-cols-2 gap-4 sm:grid-cols-4"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <StatCard icon={Target} label="Total Attempts" value={stats?.overall.totalAttempts ?? 0} sub="across all problems" />
              <StatCard
                icon={TrendingUp}
                label="Avg Score"
                value={stats?.overall.avgScore != null ? `${stats.overall.avgScore}` : "—"}
                sub="across all attempts"
                accent="bg-violet-500/12 text-violet-600 dark:text-violet-300"
              />
              <StatCard
                icon={Award}
                label="Best Score"
                value={stats?.overall.bestScore != null ? `${stats.overall.bestScore}` : "—"}
                sub="personal record"
                accent="bg-emerald-500/12 text-emerald-600 dark:text-emerald-400"
              />
              <StatCard
                icon={Flame}
                label="Streak"
                value={streak > 0 ? `${streak}d` : "—"}
                sub={streak > 0 ? "consecutive days" : "practice to start one"}
                accent="bg-amber-500/12 text-amber-600 dark:text-amber-400"
              />
            </motion.div>

            {/* ── Main 2-col ── */}
            <motion.div
              className="mt-6 grid gap-5 lg:grid-cols-5"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              {/* Radar chart */}
              <div className="flex flex-col gap-4 rounded-2xl border border-zinc-200/60 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900 lg:col-span-2">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-indigo-500" />
                  <h2 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Axis Strengths</h2>
                </div>
                <div className="flex flex-col items-center gap-3">
                  <RadarChart data={axisAvg} />
                  {Object.keys(axisAvg).length === 0 && (
                    <p className="text-xs text-zinc-400 dark:text-zinc-500">Complete evaluations to see your axis profile.</p>
                  )}
                  {Object.keys(axisAvg).length > 0 && (
                    <div className="grid w-full grid-cols-2 gap-x-4 gap-y-2">
                      {AXES.map((a) => (
                        <div key={a.key} className="flex items-center gap-2">
                          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                            <div
                              className={cn("h-full rounded-full bg-linear-to-r", scoreBarColor(axisAvg[a.key] ?? 0))}
                              style={{ width: `${axisAvg[a.key] ?? 0}%` }}
                            />
                          </div>
                          <span className="w-6 text-right font-mono text-xs font-bold text-zinc-600 dark:text-zinc-400">
                            {axisAvg[a.key] ?? 0}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Recent attempts */}
              <div className="flex flex-col gap-4 rounded-2xl border border-zinc-200/60 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900 lg:col-span-3">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-indigo-500" />
                  <h2 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Recent Activity</h2>
                </div>
                {(stats?.recent ?? []).length === 0 ? (
                  <div className="flex flex-1 flex-col items-center justify-center gap-3 py-8 text-center">
                    <Zap className="h-8 w-8 text-zinc-300 dark:text-zinc-700" />
                    <p className="text-sm text-zinc-400">No attempts yet.</p>
                    <Link href="/studio" className="text-xs font-semibold text-indigo-500 hover:underline dark:text-indigo-300">
                      Open the studio →
                    </Link>
                  </div>
                ) : (
                  <div className="flex flex-col gap-1">
                    {(stats?.recent ?? []).map((s) => {
                      const problem = PROBLEMS.find((p) => p.id === s.problemId);
                      return (
                        <div
                          key={s.id}
                          className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/60"
                        >
                          <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-bold", scoreBarColor(s.total).includes("emerald") ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400" : scoreBarColor(s.total).includes("indigo") ? "bg-indigo-500/15 text-indigo-600 dark:text-indigo-300" : scoreBarColor(s.total).includes("blue") ? "bg-blue-500/15 text-blue-600 dark:text-blue-400" : scoreBarColor(s.total).includes("amber") ? "bg-amber-500/15 text-amber-600 dark:text-amber-400" : "bg-rose-500/15 text-rose-600 dark:text-rose-400")}>
                            {s.total}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-zinc-800 dark:text-zinc-200">
                              {problem?.title ?? s.problemId}
                            </p>
                            <div className="flex items-center gap-2">
                              <span className={cn("text-xs font-semibold", verdictColor(s.verdict))}>
                                {s.verdict}
                              </span>
                              <span className="text-xs text-zinc-400">·</span>
                              <span className="text-xs text-zinc-400">{timeAgo(s.createdAt)}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>

            {/* ── Problem Progress Table ── */}
            <motion.div
              className="mt-5 rounded-2xl border border-zinc-200/60 bg-white dark:border-zinc-800 dark:bg-zinc-900"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <div className="flex items-center justify-between gap-3 px-6 py-5 border-b border-zinc-100 dark:border-zinc-800">
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-indigo-500" />
                  <h2 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                    Problem Progress
                  </h2>
                  <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-semibold text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                    {problemRows.length} attempted
                  </span>
                </div>
                <Link
                  href="/studio"
                  className="text-xs font-semibold text-indigo-500 hover:underline dark:text-indigo-300"
                >
                  Practice more →
                </Link>
              </div>

              {problemRows.length === 0 ? (
                <div className="flex flex-col items-center gap-3 py-14 text-center">
                  <Target className="h-8 w-8 text-zinc-300 dark:text-zinc-700" />
                  <p className="text-sm text-zinc-400 dark:text-zinc-500">
                    No problems attempted yet. Pick one from the studio!
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-zinc-100 dark:border-zinc-800">
                        <th className="py-3 pl-6 pr-4 text-left text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">Problem</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">Difficulty</th>
                        <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">Attempts</th>
                        <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">Best</th>
                        <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">Avg</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">Verdict</th>
                        <th className="py-3 pl-4 pr-6 text-right text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
                      {problemRows.map((row) => (
                        <tr key={row.problemId} className="group transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/40">
                          <td className="py-3.5 pl-6 pr-4">
                            <span className="font-medium text-zinc-800 dark:text-zinc-200">
                              {row.problem?.title ?? row.problemId}
                            </span>
                          </td>
                          <td className="px-4 py-3.5">
                            {row.problem ? (
                              <span className={cn("rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider", diffBadge(row.problem.difficulty))}>
                                {row.problem.difficulty}
                              </span>
                            ) : "—"}
                          </td>
                          <td className="px-4 py-3.5 text-center text-zinc-600 dark:text-zinc-400 tabular-nums">
                            {row.attempts}
                          </td>
                          <td className="px-4 py-3.5 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <div className="h-1.5 w-16 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                                <div
                                  className={cn("h-full rounded-full bg-linear-to-r", scoreBarColor(row.bestScore))}
                                  style={{ width: `${row.bestScore}%` }}
                                />
                              </div>
                              <span className="w-8 font-mono text-xs font-bold text-zinc-700 dark:text-zinc-300">{row.bestScore}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3.5 text-center font-mono text-xs text-zinc-500 dark:text-zinc-400 tabular-nums">
                            {Math.round(Number(row.avgScore))}
                          </td>
                          <td className="px-4 py-3.5">
                            <span className={cn("rounded-full border px-2.5 py-0.5 text-[10px] font-semibold", verdictBg(row.lastVerdict))}>
                              {row.lastVerdict}
                            </span>
                          </td>
                          <td className="py-3.5 pl-4 pr-6 text-right">
                            <Link
                              href="/studio"
                              className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-indigo-600 opacity-0 transition-all group-hover:opacity-100 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-500/10"
                            >
                              Retry <ArrowRight className="h-3 w-3" />
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}
