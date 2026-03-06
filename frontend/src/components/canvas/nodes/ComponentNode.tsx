"use client";

import { memo, useState, useCallback, useRef, useEffect } from "react";
import { Handle, Position, type NodeProps, type Node, useReactFlow } from "@xyflow/react";
import { motion } from "framer-motion";
import type { ComponentNodeData } from "@/store/canvasStore";
import { useCanvasStore } from "@/store/canvasStore";
import { Server } from "lucide-react";
import { ICON_MAP } from "@/lib/icons";

type ComponentNode = Node<ComponentNodeData, "component">;

const CATEGORY_COLORS: Record<string, { icon: string }> = {
  networking: { icon: "text-blue-500 dark:text-blue-400" },
  compute: { icon: "text-cyan-600 dark:text-cyan-400" },
  storage: { icon: "text-amber-600 dark:text-amber-400" },
  messaging: { icon: "text-emerald-600 dark:text-emerald-400" },
  infrastructure: { icon: "text-cyan-500 dark:text-cyan-300" },
};

const STATUS_DOT: Record<string, string> = {
  healthy: "bg-emerald-500",
  warning: "bg-amber-500",
  critical: "bg-rose-500",
  idle: "bg-muted-foreground/50",
};

function ComponentNodeInner({ id, data, selected }: NodeProps<ComponentNode>) {
  const nodeData = data;
  const Icon = ICON_MAP[nodeData.icon] ?? Server;
  const colors = CATEGORY_COLORS[nodeData.category] ?? CATEGORY_COLORS.compute;
  const status = (nodeData.status as string) ?? "idle";
  const statusDot = STATUS_DOT[status] ?? STATUS_DOT.idle;
  const isBottleneck = nodeData.isBottleneck ?? false;
  const replicas = nodeData.replicas ?? 1;
  const utilization = nodeData.utilization ?? 0;

  const isCustom = nodeData.componentId === "custom";
  const [editing, setEditing] = useState(false);
  const [editLabel, setEditLabel] = useState(nodeData.label);
  const inputRef = useRef<HTMLInputElement>(null);
  const updateNodeData = useCanvasStore((s) => s.updateNodeData);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  const commitLabel = useCallback(() => {
    const trimmed = editLabel.trim();
    if (trimmed && trimmed !== nodeData.label) {
      updateNodeData(id, { label: trimmed });
    } else {
      setEditLabel(nodeData.label);
    }
    setEditing(false);
  }, [editLabel, nodeData.label, id, updateNodeData]);

  const handleDoubleClick = useCallback(() => {
    if (!isCustom) return;
    setEditLabel(nodeData.label);
    setEditing(true);
  }, [isCustom, nodeData.label]);

  return (
    <div
      className={`
        relative flex flex-col items-center gap-1.5 rounded-lg border border-border bg-card px-4 py-3.5
        text-card-foreground shadow-sm transition-colors
        ${isBottleneck ? "border-rose-500/60" : ""}
        ${selected ? "border-cyan-500 ring-1 ring-cyan-500/30" : ""}
      `}
    >
      {/* Status indicator dot */}
      <div
        className={`absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full ${statusDot}`}
        style={{ animation: status !== 'idle' ? 'status-pulse 2s infinite' : 'none' }}
      />

      {/* Icon + Label row */}
      <div className="flex items-center gap-2">
        <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md ${colors.icon}`}>
          <Icon className="h-4 w-4" />
        </div>
        {editing ? (
          <input
            ref={inputRef}
            value={editLabel}
            onChange={(e) => setEditLabel(e.target.value)}
            onBlur={commitLabel}
            onKeyDown={(e) => {
              if (e.key === "Enter") commitLabel();
              if (e.key === "Escape") {
                setEditLabel(nodeData.label);
                setEditing(false);
              }
            }}
            className="max-w-[7.5rem] border-b border-cyan-500 bg-transparent text-sm font-semibold text-foreground outline-none"
          />
        ) : (
          <span
            className={`max-w-[7.5rem] whitespace-normal break-words text-center text-sm font-semibold leading-snug text-foreground ${isCustom ? "cursor-text" : ""}`}
            onDoubleClick={handleDoubleClick}
          >
            {nodeData.label}
          </span>
        )}
      </div>

      {/* Stats */}
      <span className="font-mono text-xs tabular-nums text-muted-foreground">
        {nodeData.maxQPS === Infinity ? '\u221e' : ((nodeData.maxQPS ?? 0)/1000).toFixed(0) + 'k'} qps
      </span>

      {/* Replicas badge */}
      {replicas > 1 && (
        <span className="absolute -left-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-cyan-600 px-1 text-[10px] font-bold text-white dark:bg-cyan-500">
          ×{replicas}
        </span>
      )}

      {/* Utilization bar (shown during simulation) */}
      {utilization > 0 && (
        <div className="mt-0.5 flex w-full items-center gap-1">
          <div className="h-1 flex-1 overflow-hidden rounded-full bg-muted">
            <motion.div
              className={`h-full rounded-full ${
                utilization > 0.8 ? "bg-rose-500" : utilization > 0.5 ? "bg-amber-500" : "bg-emerald-500"
              }`}
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(utilization * 100, 100)}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <span className={`font-mono text-xs tabular-nums ${
            utilization > 0.8 ? "text-rose-400" : utilization > 0.5 ? "text-amber-400" : "text-emerald-400"
          }`}>{(utilization * 100).toFixed(0)}%</span>
        </div>
      )}

      {/* Handles */}
      <Handle
        type="target"
        position={Position.Left}
        className="!h-2 !w-2 !rounded-full !border !border-border !bg-muted"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="!h-2 !w-2 !rounded-full !border !border-border !bg-muted"
      />
    </div>
  );
}

function areComponentNodePropsEqual(
  prev: NodeProps<ComponentNode>,
  next: NodeProps<ComponentNode>
): boolean {
  if (prev.selected !== next.selected) return false;
  const p = prev.data;
  const n = next.data;
  return (
    p.componentId === n.componentId &&
    p.label === n.label &&
    p.status === n.status &&
    p.replicas === n.replicas &&
    p.utilization === n.utilization &&
    p.maxQPS === n.maxQPS &&
    p.latencyMs === n.latencyMs &&
    p.category === n.category &&
    p.icon === n.icon &&
    p.isBottleneck === n.isBottleneck
  );
}

export const ComponentNode = memo(ComponentNodeInner, areComponentNodePropsEqual);
