"use client";

import {
  useCallback,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { useReactFlow, useViewport } from "@xyflow/react";
import { getStroke } from "perfect-freehand";
import { usePenStore, type Stroke } from "@/store/penStore";

/* ---------- cursor helpers ---------- */

function buildPenCursor(color: string): string {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 28 28'>
    <path d='M2 2 L8 4 L24 20 L20 24 L4 8 Z' fill='${color}' stroke='white' stroke-width='1.5' stroke-linejoin='round'/>
    <path d='M18 18 L24 24' stroke='white' stroke-width='1.5' stroke-linecap='round'/>
    <circle cx='2.5' cy='2.5' r='1.6' fill='white' stroke='${color}' stroke-width='1'/>
  </svg>`;
  return `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}") 2 2, crosshair`;
}

function buildEraserCursor(): string {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 28 28'>
    <rect x='3' y='12' width='18' height='10' rx='2' transform='rotate(-35 12 17)' fill='#fda4af' stroke='white' stroke-width='1.5'/>
    <line x1='10' y1='8' x2='18' y2='16' stroke='white' stroke-width='1.5'/>
  </svg>`;
  return `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}") 4 22, cell`;
}

/* ---------- perfect-freehand wrappers ---------- */

function outlineToPath(outline: number[][]): string {
  if (outline.length === 0) return "";
  const d: (string | number)[] = ["M", outline[0][0], outline[0][1], "Q"];
  for (let i = 0; i < outline.length; i++) {
    const [x0, y0] = outline[i];
    const [x1, y1] = outline[(i + 1) % outline.length];
    d.push(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2);
  }
  d.push("Z");
  return d.join(" ");
}

function strokeToPath(points: [number, number][], size: number): string {
  const outline = getStroke(points, {
    size,
    thinning: 0.5,
    smoothing: 0.55,
    streamline: 0.55,
    simulatePressure: true,
    last: true,
  }) as number[][];
  return outlineToPath(outline);
}

/** Same as strokeToPath but with `last: false` — for the live stroke while drawing. */
function livePathFromPoints(points: [number, number][], size: number): string {
  const outline = getStroke(points, {
    size,
    thinning: 0.5,
    smoothing: 0.55,
    streamline: 0.55,
    simulatePressure: true,
    last: false,
  }) as number[][];
  return outlineToPath(outline);
}

/* ---------- eraser radius ---------- */

const ERASER_RADIUS_SCREEN = 14;

/* ---------- component ---------- */

export function PenOverlay() {
  const { screenToFlowPosition } = useReactFlow();
  const { x: vx, y: vy, zoom } = useViewport();

  const mode = usePenStore((s) => s.mode);
  const color = usePenStore((s) => s.color);
  const width = usePenStore((s) => s.width);
  const strokes = usePenStore((s) => s.strokes);
  const addStroke = usePenStore((s) => s.addStroke);
  const eraseAt = usePenStore((s) => s.eraseAt);

  const [livePoints, setLivePoints] = useState<[number, number][]>([]);
  const drawingRef = useRef(false);

  const eraserRadiusFlow = ERASER_RADIUS_SCREEN / Math.max(zoom, 0.1);

  const onPointerDown = useCallback(
    (e: ReactPointerEvent<SVGSVGElement>) => {
      if (mode === "off") return;
      if (e.button !== 0) return;
      e.preventDefault();
      (e.currentTarget as Element).setPointerCapture?.(e.pointerId);
      drawingRef.current = true;
      const pt = screenToFlowPosition({ x: e.clientX, y: e.clientY });
      if (mode === "pen") {
        setLivePoints([[pt.x, pt.y]]);
      } else {
        eraseAt(pt.x, pt.y, eraserRadiusFlow);
      }
    },
    [mode, screenToFlowPosition, eraseAt, eraserRadiusFlow]
  );

  const onPointerMove = useCallback(
    (e: ReactPointerEvent<SVGSVGElement>) => {
      if (!drawingRef.current) return;

      // Use coalesced events so fast flicks don't lose intermediate samples.
      const native = e.nativeEvent;
      const raws =
        typeof native.getCoalescedEvents === "function"
          ? native.getCoalescedEvents()
          : null;
      const events =
        raws && raws.length > 0 ? raws : [{ clientX: e.clientX, clientY: e.clientY }];

      if (mode === "pen") {
        const newPts: [number, number][] = events.map((ev) => {
          const p = screenToFlowPosition({ x: ev.clientX, y: ev.clientY });
          return [p.x, p.y];
        });
        setLivePoints((pts) => [...pts, ...newPts]);
      } else if (mode === "eraser") {
        for (const ev of events) {
          const p = screenToFlowPosition({ x: ev.clientX, y: ev.clientY });
          eraseAt(p.x, p.y, eraserRadiusFlow);
        }
      }
    },
    [mode, screenToFlowPosition, eraseAt, eraserRadiusFlow]
  );

  const finishStroke = useCallback(() => {
    if (!drawingRef.current) return;
    drawingRef.current = false;
    if (mode === "pen" && livePoints.length > 1) {
      const stroke: Stroke = {
        id: `stroke-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        points: livePoints,
        color,
        width,
      };
      addStroke(stroke);
    }
    setLivePoints([]);
  }, [mode, livePoints, color, width, addStroke]);

  const interactive = mode !== "off";

  const cursor = useMemo(() => {
    if (mode === "pen") return buildPenCursor(color);
    if (mode === "eraser") return buildEraserCursor();
    return "auto";
  }, [mode, color]);

  // Memoized committed-stroke paths (only recompute when strokes change).
  const committedPaths = useMemo(
    () => strokes.map((s) => ({ id: s.id, d: strokeToPath(s.points, s.width), color: s.color })),
    [strokes]
  );

  const livePath = useMemo(
    () => (livePoints.length > 0 ? livePathFromPoints(livePoints, width) : ""),
    [livePoints, width]
  );

  return (
    <svg
      className="absolute inset-0 h-full w-full"
      style={{
        pointerEvents: interactive ? "auto" : "none",
        cursor,
        zIndex: 5,
        touchAction: interactive ? "none" : "auto",
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={finishStroke}
      onPointerLeave={finishStroke}
      onPointerCancel={finishStroke}
    >
      <g transform={`translate(${vx}, ${vy}) scale(${zoom})`}>
        {committedPaths.map((p) => (
          <path key={p.id} d={p.d} fill={p.color} />
        ))}
        {livePath && <path d={livePath} fill={color} />}
      </g>
    </svg>
  );
}
