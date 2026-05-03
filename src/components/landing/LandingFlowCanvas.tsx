"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { BRAND } from "@/lib/brand";
import { THEME_STORAGE_KEY } from "@/lib/theme";

/** Prefer localStorage (matches user choice + other tabs), then dataset from theme-init, then class. */
function readCanvasIsDark(): boolean {
  try {
    const t = localStorage.getItem(THEME_STORAGE_KEY);
    if (t === "light") return false;
    if (t === "dark") return true;
  } catch {
    /* private mode */
  }
  const ds = document.documentElement.dataset.sysdesTheme;
  if (ds === "light") return false;
  if (ds === "dark") return true;
  return document.documentElement.classList.contains("dark");
}

const CANVAS_H = 420;

type NodeDef = {
  id: string;
  label: string;
  sub: string;
  col: string;
  accent: string;
  x: number;
  y: number;
  w: number;
  h: number;
};

const NODES: NodeDef[] = [
  { id: "client", label: "Client", sub: "Browser / Mobile", col: "#1a1530", accent: "#7c5cfc", x: 0.05, y: 0.45, w: 100, h: 50 },
  { id: "cdn", label: "CDN", sub: "500K QPS · 15ms", col: "#0f1e35", accent: "#5aa8f0", x: 0.22, y: 0.15, w: 100, h: 50 },
  { id: "lb", label: "Load Balancer", sub: "1M QPS · 1ms", col: "#1a1530", accent: "#7c5cfc", x: 0.22, y: 0.55, w: 110, h: 50 },
  { id: "ratelim", label: "Rate Limiter", sub: "Token bucket", col: "#1a1030", accent: "#c054f0", x: 0.4, y: 0.72, w: 110, h: 50 },
  { id: "api1", label: "API Server 1", sub: "10K QPS", col: "#0f2018", accent: "#2dc89a", x: 0.4, y: 0.25, w: 110, h: 50 },
  { id: "api2", label: "API Server 2", sub: "10K QPS", col: "#0f2018", accent: "#2dc89a", x: 0.4, y: 0.5, w: 110, h: 50 },
  { id: "cache", label: "Redis Cache", sub: "100K QPS · 1ms", col: "#1e1800", accent: "#f5a623", x: 0.6, y: 0.2, w: 110, h: 50 },
  { id: "db", label: "SQL DB (Primary)", sub: "10K QPS · 8ms", col: "#0f2018", accent: "#2dc89a", x: 0.6, y: 0.5, w: 120, h: 50 },
  { id: "dbrep", label: "DB Replica", sub: "Read replica", col: "#0f1e10", accent: "#2dc89a", x: 0.6, y: 0.75, w: 110, h: 50 },
  { id: "queue", label: "Kafka Queue", sub: "100K QPS · 5ms", col: "#1a1030", accent: "#c054f0", x: 0.8, y: 0.35, w: 110, h: 50 },
  { id: "worker", label: "Worker Service", sub: "Async processor", col: "#0f2018", accent: "#2dc89a", x: 0.8, y: 0.65, w: 120, h: 50 },
];

const EDGES: { from: string; to: string; type: keyof typeof TYPE_COLOR; label: string }[] = [
  { from: "client", to: "cdn", type: "cdn", label: "HTTPS" },
  { from: "client", to: "lb", type: "http", label: "HTTP" },
  { from: "cdn", to: "cache", type: "cdn", label: "cache-check" },
  { from: "lb", to: "ratelim", type: "http", label: "throttle" },
  { from: "lb", to: "api1", type: "http", label: "round-robin" },
  { from: "lb", to: "api2", type: "http", label: "round-robin" },
  { from: "api1", to: "cache", type: "cache", label: "GET/SET" },
  { from: "api2", to: "cache", type: "cache", label: "GET/SET" },
  { from: "api1", to: "db", type: "db", label: "write" },
  { from: "api2", to: "dbrep", type: "db", label: "read" },
  { from: "db", to: "dbrep", type: "db", label: "replicate" },
  { from: "api1", to: "queue", type: "queue", label: "pub" },
  { from: "queue", to: "worker", type: "queue", label: "sub" },
  { from: "worker", to: "db", type: "db", label: "persist" },
];

const TYPE_COLOR = {
  http: "#7c5cfc",
  cdn: "#5aa8f0",
  cache: "#f5a623",
  db: "#2dc89a",
  queue: "#c054f0",
} as const;

const QPS_VALS = ["84K", "91K", "78K", "110K", "95K", "63K", "120K"];

function roundRect(c: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  const rr = Math.min(r, w / 2, h / 2);
  c.beginPath();
  c.moveTo(x + rr, y);
  c.lineTo(x + w - rr, y);
  c.arcTo(x + w, y, x + w, y + rr, rr);
  c.lineTo(x + w, y + h - rr);
  c.arcTo(x + w, y + h, x + w - rr, y + h, rr);
  c.lineTo(x + rr, y + h);
  c.arcTo(x, y + h, x, y + h - rr, rr);
  c.lineTo(x, y + rr);
  c.arcTo(x, y, x + rr, y, rr);
  c.closePath();
}

/**
 * Full URL-shortener traffic flow from standalone HTML — dark studio chrome, curved edges, multi-type packets, QPS + legend.
 */
export function LandingFlowCanvas({ className }: { className?: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cssWRef = useRef(700);
  const dprRef = useRef(1);
  const [qpsDisplay, setQpsDisplay] = useState(QPS_VALS[0]);

  useEffect(() => {
    const id = window.setInterval(() => {
      setQpsDisplay((prev) => {
        const i = QPS_VALS.indexOf(prev);
        return QPS_VALS[(i + 1) % QPS_VALS.length];
      });
    }, 1800);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrapEl = wrapRef.current;
    if (!canvas || !wrapEl) return;
    const ctxInit = canvas.getContext("2d");
    if (!ctxInit) return;
    const ctx: CanvasRenderingContext2D = ctxInit;

    const packets: {
      fx: number;
      fy: number;
      tx: number;
      ty: number;
      t: number;
      speed: number;
      color: string;
      size: number;
    }[] = [];

    function syncSize() {
      const el = wrapRef.current;
      const cEl = canvasRef.current;
      if (!el || !cEl) return;
      const rect = el.getBoundingClientRect();
      const cssW = Math.max(rect.width || el.clientWidth, 280);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      cssWRef.current = cssW;
      dprRef.current = dpr;
      cEl.width = Math.max(1, Math.floor(cssW * dpr));
      cEl.height = Math.floor(CANVAS_H * dpr);
      cEl.style.width = `${cssW}px`;
      cEl.style.height = `${CANVAS_H}px`;
    }

    function nodePos(id: string, W: number, H: number) {
      const n = NODES.find((x) => x.id === id)!;
      return { x: n.x * W + n.w / 2, y: n.y * H + n.h / 2 };
    }

    function nodeRect(n: NodeDef, W: number, H: number) {
      return { x: n.x * W, y: n.y * H, w: n.w, h: n.h };
    }

    let tick = 0;
    let raf = 0;

    function spawnPacket(W: number, H: number) {
      const e = EDGES[Math.floor(Math.random() * EDGES.length)];
      const f = nodePos(e.from, W, H);
      const t = nodePos(e.to, W, H);
      packets.push({
        fx: f.x,
        fy: f.y,
        tx: t.x,
        ty: t.y,
        t: 0,
        speed: 0.007 + Math.random() * 0.007,
        color: TYPE_COLOR[e.type] || "#7c5cfc",
        size: 3.5,
      });
    }

    function drawFrame() {
      syncSize();
      const W = cssWRef.current;
      const H = CANVAS_H;
      const dpr = dprRef.current;
      const isDark = readCanvasIsDark();

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);

      ctx.fillStyle = isDark ? "#0a0a12" : "#faf8ff";
      ctx.fillRect(0, 0, W, H);

      ctx.strokeStyle = isDark ? "rgba(124,92,252,0.04)" : "rgba(91,66,216,0.08)";
      ctx.lineWidth = 0.5;
      for (let gx = 0; gx < W; gx += 40) {
        ctx.beginPath();
        ctx.moveTo(gx, 0);
        ctx.lineTo(gx, H);
        ctx.stroke();
      }
      for (let gy = 0; gy < H; gy += 40) {
        ctx.beginPath();
        ctx.moveTo(0, gy);
        ctx.lineTo(W, gy);
        ctx.stroke();
      }

      EDGES.forEach((e) => {
        const f = nodePos(e.from, W, H);
        const t = nodePos(e.to, W, H);
        const c = TYPE_COLOR[e.type] || "#7c5cfc";

        const mx = (f.x + t.x) / 2;
        const my = (f.y + t.y) / 2 - 18;

        ctx.beginPath();
        ctx.moveTo(f.x, f.y);
        ctx.quadraticCurveTo(mx, my, t.x, t.y);
        ctx.strokeStyle = isDark ? `${c}28` : `${c}42`;
        ctx.lineWidth = 1;
        ctx.setLineDash([]);
        ctx.stroke();

        const dx = t.x - mx;
        const dy = t.y - my;
        const len = Math.hypot(dx, dy) || 1;
        const ux = dx / len;
        const uy = dy / len;
        const ax = t.x - ux * 10;
        const ay = t.y - uy * 10;
        ctx.beginPath();
        ctx.moveTo(t.x, t.y);
        ctx.lineTo(ax - uy * 4, ay + ux * 4);
        ctx.lineTo(ax + uy * 4, ay - ux * 4);
        ctx.closePath();
        ctx.fillStyle = isDark ? `${c}55` : `${c}72`;
        ctx.fill();

        if (e.label) {
          const lx = (f.x + t.x) / 2;
          const ly = (f.y + t.y) / 2 - 22;
          ctx.font = "10px ui-sans-serif, system-ui, sans-serif";
          ctx.fillStyle = isDark ? `${c}88` : `${c}b0`;
          ctx.textAlign = "center";
          ctx.fillText(e.label, lx, ly);
        }
      });

      NODES.forEach((n) => {
        const { x, y, w, h } = nodeRect(n, W, H);

        const grad = ctx.createRadialGradient(x + w / 2, y + h / 2, 0, x + w / 2, y + h / 2, w * 0.7);
        grad.addColorStop(0, isDark ? `${n.accent}18` : `${n.accent}20`);
        grad.addColorStop(1, "transparent");
        ctx.fillStyle = grad;
        ctx.fillRect(x - 10, y - 10, w + 20, h + 20);

        roundRect(ctx, x, y, w, h, 8);
        ctx.fillStyle = isDark ? n.col : "#ffffff";
        ctx.fill();
        ctx.strokeStyle = isDark ? `${n.accent}55` : `${n.accent}7a`;
        ctx.lineWidth = isDark ? 0.8 : 1;
        ctx.stroke();

        roundRect(ctx, x, y, w, 3, 1.5);
        ctx.fillStyle = n.accent;
        ctx.fill();

        ctx.font = "500 13px ui-sans-serif, system-ui, sans-serif";
        ctx.fillStyle = isDark ? "rgba(220,210,255,0.9)" : "#312e81";
        ctx.textAlign = "center";
        ctx.fillText(n.label, x + w / 2, y + h / 2 - 3);

        ctx.font = "11px ui-sans-serif, system-ui, sans-serif";
        ctx.fillStyle = isDark ? "rgba(180,160,255,0.38)" : "rgba(91,79,178,0.52)";
        ctx.fillText(n.sub, x + w / 2, y + h / 2 + 12);
      });

      tick += 1;
      if (tick % 10 === 0) spawnPacket(W, H);

      for (let i = packets.length - 1; i >= 0; i--) {
        const p = packets[i];
        p.t += p.speed;
        if (p.t >= 1) {
          packets.splice(i, 1);
          continue;
        }
        const px = p.fx + (p.tx - p.fx) * p.t;
        const py = p.fy + (p.ty - p.fy) * p.t;

        ctx.beginPath();
        ctx.arc(px, py, p.size + 3, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}22`;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(px, py, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}cc`;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(px, py, p.size * 0.45, 0, Math.PI * 2);
        ctx.fillStyle = isDark ? "#fff" : "#faf8ff";
        ctx.fill();
      }

      raf = requestAnimationFrame(drawFrame);
    }

    syncSize();
    raf = requestAnimationFrame(drawFrame);
    const ro = new ResizeObserver(() => syncSize());
    ro.observe(wrapEl);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border-[0.5px] border-violet-300/45 bg-[#faf8ff] font-sans shadow-sm shadow-violet-500/10 dark:border-violet-400/25 dark:bg-[#0a0a12] dark:shadow-none",
        className,
      )}
    >
      <div className="flex items-center gap-2 border-b border-violet-200/70 bg-white/85 px-4 py-2.5 backdrop-blur-sm dark:border-violet-500/[0.12] dark:bg-[#111120]">
        <span className="h-[11px] w-[11px] shrink-0 rounded-full bg-[#ff5f57]" />
        <span className="h-[11px] w-[11px] shrink-0 rounded-full bg-[#febc2e]" />
        <span className="h-[11px] w-[11px] shrink-0 rounded-full bg-[#28c840]" />
        <span className="ml-2 truncate text-sm tracking-[0.04em] text-slate-500 dark:text-[rgba(180,160,255,0.35)]">
          {BRAND.name} Studio — URL Shortener · Traffic simulation running
        </span>
      </div>

      <div ref={wrapRef} className="relative w-full min-w-0" style={{ height: CANVAS_H }}>
        <canvas ref={canvasRef} className="absolute inset-0 block h-full w-full" />
        <div className="pointer-events-none absolute right-4 top-3 rounded-lg border border-violet-200/80 bg-white/90 px-3.5 py-2 text-sm text-slate-600 shadow-sm dark:border-violet-500/20 dark:bg-violet-500/[0.08] dark:text-[rgba(180,160,255,0.6)] dark:shadow-none">
          <span className="block text-xl font-medium text-violet-600 dark:text-[#9070ff]">{qpsDisplay}</span>
          req/s inbound
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-violet-200/60 bg-white/70 px-4 py-3 backdrop-blur-sm dark:border-violet-500/10 dark:bg-[#0d0d1a] sm:px-5">
        <LegendItem color="#7c5cfc" label="HTTP request" />
        <LegendItem color="#2dc89a" label="Cache hit" />
        <LegendItem color="#f5a623" label="DB write" />
        <LegendItem color="#5aa8f0" label="CDN serve" />
        <div className="ml-auto flex items-center gap-1.5 text-sm text-slate-500 dark:text-[rgba(180,160,255,0.4)]">
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#ff5f57]" />
          Bottleneck
        </div>
      </div>
    </div>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5 text-sm text-slate-600 dark:text-[rgba(180,160,255,0.4)]">
      <span className="h-[7px] w-[7px] shrink-0 rounded-full" style={{ background: color }} />
      {label}
    </div>
  );
}
