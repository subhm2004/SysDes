"use client";

import { useEffect, useRef } from "react";

type NodeDef = { id: string; x: number; y: number };
type EdgeDef = { from: string; to: string };
type Packet = { edgeIdx: number; t: number; speed: number; trail: { x: number; y: number }[] };

/** Right-side ambient topology (x ≥ 0.5) — stays out of the hero copy column */
const NODES: NodeDef[] = [
  { id: "client", x: 0.52, y: 0.48 },
  { id: "cdn", x: 0.62, y: 0.28 },
  { id: "lb", x: 0.62, y: 0.58 },
  { id: "api", x: 0.74, y: 0.42 },
  { id: "cache", x: 0.84, y: 0.3 },
  { id: "db", x: 0.84, y: 0.55 },
  { id: "queue", x: 0.93, y: 0.45 },
];

const EDGES: EdgeDef[] = [
  { from: "client", to: "cdn" },
  { from: "client", to: "lb" },
  { from: "cdn", to: "cache" },
  { from: "lb", to: "api" },
  { from: "api", to: "cache" },
  { from: "api", to: "db" },
  { from: "api", to: "queue" },
];

function nodeMap(w: number, h: number) {
  const m = new Map<string, { x: number; y: number }>();
  for (const n of NODES) m.set(n.id, { x: n.x * w, y: n.y * h });
  return m;
}

function curvePoint(ax: number, ay: number, bx: number, by: number, t: number) {
  const mx = (ax + bx) / 2;
  const my = (ay + by) / 2;
  const dx = bx - ax;
  const dy = by - ay;
  const cx = mx - dy * 0.12;
  const cy = my + dx * 0.12;
  const u = 1 - t;
  const x = u * u * ax + 2 * u * t * cx + t * t * bx;
  const y = u * u * ay + 2 * u * t * cy + t * t * by;
  const tx = 2 * u * (cx - ax) + 2 * t * (bx - cx);
  const ty = 2 * u * (cy - ay) + 2 * t * (by - cy);
  return { x, y, angle: Math.atan2(ty, tx) };
}

function withAlpha(color: string, alpha: number) {
  return color.replace(/\)$/, ` / ${alpha})`);
}

function drawCurve(ctx: CanvasRenderingContext2D, ax: number, ay: number, bx: number, by: number) {
  const mx = (ax + bx) / 2;
  const my = (ay + by) / 2;
  const dx = bx - ax;
  const dy = by - ay;
  const cx = mx - dy * 0.12;
  const cy = my + dx * 0.12;
  ctx.beginPath();
  ctx.moveTo(ax, ay);
  ctx.quadraticCurveTo(cx, cy, bx, by);
}

/** Subtle right-side packet flow — ambient, not distracting */
export function LandingPacketFlow() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reducedRef = useRef(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    reducedRef.current = mq.matches;
    const onMq = () => {
      reducedRef.current = mq.matches;
    };
    mq.addEventListener("change", onMq);

    let dark = document.documentElement.classList.contains("dark");
    const observer = new MutationObserver(() => {
      dark = document.documentElement.classList.contains("dark");
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    const packets: Packet[] = [];
    let raf = 0;
    let lastSpawn = 0;

    const accent = () => (dark ? "oklch(0.65 0.19 285)" : "oklch(0.55 0.24 285)");
    const edgeColor = () => (dark ? "oklch(0.65 0.19 285 / 0.1)" : "oklch(0.55 0.24 285 / 0.08)");
    const nodeColor = () => (dark ? "oklch(0.65 0.19 285 / 0.45)" : "oklch(0.55 0.24 285 / 0.35)");

    function spawnPacket() {
      packets.push({
        edgeIdx: Math.floor(Math.random() * EDGES.length),
        t: 0,
        speed: 0.003 + Math.random() * 0.003,
        trail: [],
      });
      if (packets.length > 10) packets.shift();
    }

    function resize() {
      const el = canvasRef.current;
      if (!el) return;
      const c2 = el.getContext("2d");
      if (!c2) return;
      const w = window.innerWidth;
      const h = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      el.width = Math.floor(w * dpr);
      el.height = Math.floor(h * dpr);
      el.style.width = `${w}px`;
      el.style.height = `${h}px`;
      c2.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function draw() {
      const el = canvasRef.current;
      const c2 = el?.getContext("2d");
      if (!el || !c2) return;

      const w = window.innerWidth;
      const h = window.innerHeight;
      const nm = nodeMap(w, h);
      const reduced = reducedRef.current;
      const col = accent();

      c2.clearRect(0, 0, w, h);

      for (const e of EDGES) {
        const a = nm.get(e.from);
        const b = nm.get(e.to);
        if (!a || !b) continue;
        drawCurve(c2, a.x, a.y, b.x, b.y);
        c2.strokeStyle = edgeColor();
        c2.lineWidth = 1;
        c2.stroke();
      }

      const now = performance.now();
      if (!reduced && now - lastSpawn > 420) {
        spawnPacket();
        lastSpawn = now;
      }

      for (let i = packets.length - 1; i >= 0; i--) {
        const p = packets[i];
        const e = EDGES[p.edgeIdx];
        const a = nm.get(e.from);
        const b = nm.get(e.to);
        if (!a || !b) {
          packets.splice(i, 1);
          continue;
        }

        if (!reduced) p.t += p.speed;
        const pt = curvePoint(a.x, a.y, b.x, b.y, Math.min(p.t, 1));

        p.trail.push({ x: pt.x, y: pt.y });
        if (p.trail.length > 5) p.trail.shift();

        for (let j = 0; j < p.trail.length; j++) {
          const tr = p.trail[j];
          c2.beginPath();
          c2.arc(tr.x, tr.y, 1 + j * 0.15, 0, Math.PI * 2);
          c2.fillStyle = withAlpha(col, (j / p.trail.length) * 0.25);
          c2.fill();
        }

        c2.save();
        c2.translate(pt.x, pt.y);
        c2.rotate(pt.angle);
        c2.fillStyle = withAlpha(col, 0.85);
        c2.beginPath();
        c2.moveTo(4, 0);
        c2.lineTo(-3, 2.5);
        c2.lineTo(-3, -2.5);
        c2.closePath();
        c2.fill();
        c2.restore();

        if (p.t >= 1) packets.splice(i, 1);
      }

      for (const n of NODES) {
        const px = n.x * w;
        const py = n.y * h;
        c2.beginPath();
        c2.arc(px, py, 3.5, 0, Math.PI * 2);
        c2.fillStyle = nodeColor();
        c2.fill();
        c2.beginPath();
        c2.arc(px, py, 8, 0, Math.PI * 2);
        c2.strokeStyle = withAlpha(col, 0.12);
        c2.lineWidth = 1;
        c2.stroke();
      }

      raf = requestAnimationFrame(draw);
    }

    resize();
    if (!reducedRef.current) spawnPacket();
    raf = requestAnimationFrame(draw);
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      observer.disconnect();
      mq.removeEventListener("change", onMq);
    };
  }, []);

  return (
    <div className="landing-packet-layer pointer-events-none fixed inset-0 z-0" aria-hidden>
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
}
