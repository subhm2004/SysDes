"use client";

import { memo } from "react";
import {
  BaseEdge,
  EdgeLabelRenderer,
  getSmoothStepPath,
  type EdgeProps,
} from "@xyflow/react";
import { useSimulationStore } from "@/store/simulationStore";
import {
  getEdgeAnimationDurationSec,
  getEdgeAnimationStaggerSec,
} from "@/lib/simulationVisual";
import type { CustomEdgeData } from "@/store/canvasStore";

const protocolBadge: Record<string, { text: string; color: string } | null> = {
  http: null,
  grpc: { text: "gRPC", color: "bg-purple-500/20 text-purple-400 border-purple-500/30" },
  websocket: { text: "WS", color: "bg-green-500/20 text-green-400 border-green-500/30" },
  pubsub: { text: "pub/sub", color: "bg-amber-500/20 text-amber-400 border-amber-500/30" },
  tcp: { text: "TCP", color: "bg-zinc-500/20 text-zinc-400 border-zinc-500/30" },
  custom: null,
};

function AnimatedEdgeInner({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style,
  markerEnd,
  data,
}: EdgeProps) {
  const isRunning = useSimulationStore((s) => s.isRunning);
  const speedMultiplier = useSimulationStore((s) => s.config.speedMultiplier);
  const motionDur = getEdgeAnimationDurationSec(speedMultiplier);
  const motionStagger = getEdgeAnimationStaggerSec(speedMultiplier);
  const edgeData = (data ?? {}) as CustomEdgeData;
  const isAsync = edgeData.async === true;
  const protocol = edgeData.protocol;
  const label = edgeData.label;

  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    borderRadius: 10,
  });

  const badge = protocol ? protocolBadge[protocol] : null;
  const showLabel = label || badge;

  return (
    <g>
      {/* Main edge */}
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          ...style,
          stroke: isRunning ? "rgb(6, 182, 212)" : "var(--edge-stroke, rgb(100, 100, 110))",
          strokeWidth: 1.5,
          ...(isAsync ? { strokeDasharray: "6 4" } : {}),
        }}
      />
      {/* Animated dots — only render when simulation is running */}
      {isRunning && (
        <>
          <circle r="2" fill="rgb(6, 182, 212)" opacity="0.8">
            <animateMotion dur={motionDur} repeatCount="indefinite" path={edgePath} />
          </circle>
          <circle r="1.5" fill="rgb(6, 182, 212)" opacity="0.4">
            <animateMotion
              dur={motionDur}
              repeatCount="indefinite"
              path={edgePath}
              begin={motionStagger}
            />
          </circle>
        </>
      )}
      {/* Label + protocol badge */}
      {showLabel && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: "absolute",
              transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
              pointerEvents: "all",
            }}
            className="nodrag nopan flex items-center gap-1"
          >
            {label && (
              <span className="rounded border border-border bg-card px-1.5 py-0.5 text-[10px] text-muted-foreground leading-none shadow-sm">
                {label}
              </span>
            )}
            {badge && (
              <span
                className={`rounded border px-1 py-0.5 text-[9px] font-medium leading-none ${badge.color}`}
              >
                {badge.text}
              </span>
            )}
          </div>
        </EdgeLabelRenderer>
      )}
    </g>
  );
}

export const AnimatedEdge = memo(AnimatedEdgeInner);
