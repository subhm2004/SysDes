"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { useSimulationStore } from "@/store/simulationStore";
import { useCanvasStore } from "@/store/canvasStore";
import { Activity } from "lucide-react";
import { STUDIO_COPY } from "@/lib/studio-copy";

const STATUS_COLOR: Record<string, string> = {
  healthy: "bg-emerald-500",
  warning: "bg-amber-500",
  critical: "bg-rose-500",
  idle: "bg-muted-foreground/50",
};

export function MetricsDisplay() {
  const result = useSimulationStore((s) => s.result);
  const nodes = useCanvasStore((s) => s.nodes);

  if (!result || !(result.nodeMetrics instanceof Map)) {
    return (
      <div className="flex flex-col items-center gap-3 py-10 text-center">
        <div className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-muted">
          <Activity className="h-5 w-5 text-muted-foreground" />
        </div>
        <div>
          <p className="text-base font-medium text-foreground">{STUDIO_COPY.metrics.emptyTitle}</p>
          <p className="mt-1 max-w-[240px] text-base leading-snug text-muted-foreground">
            {STUDIO_COPY.metrics.emptyPrefix}{" "}
            <span className="font-medium text-cyan-700 dark:text-cyan-400">{STUDIO_COPY.metrics.emptyCta}</span>{" "}
            {STUDIO_COPY.metrics.emptySuffix}
          </p>
        </div>
      </div>
    );
  }

  const sortedMetrics = [...result.nodeMetrics.values()].sort(
    (a, b) => b.utilization - a.utilization
  );

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-md border border-border bg-card px-3 py-2.5">
          <p className="text-xs text-muted-foreground sm:text-sm">Throughput</p>
          <p className="font-mono text-base font-semibold text-foreground">
            {new Intl.NumberFormat("en-US").format(result.throughput)}
          </p>
          <p className="text-xs text-muted-foreground sm:text-sm">req/s</p>
        </div>
        <div className="rounded-md border border-border bg-card px-3 py-2.5">
          <p className="text-xs text-muted-foreground sm:text-sm">Total latency</p>
          <p className="font-mono text-base font-semibold text-foreground">
            {result.totalLatencyMs.toFixed(0)}
          </p>
          <p className="text-xs text-muted-foreground sm:text-sm">ms (longest path)</p>
        </div>
      </div>

      {result.bottleneckNodes.length > 0 && (
        <div className="rounded-md border border-rose-500/25 bg-rose-500/10 px-3 py-2.5 dark:bg-rose-950/30">
          <p className="text-sm font-medium text-rose-700 dark:text-rose-400">
            {result.bottleneckNodes.length} Bottleneck{result.bottleneckNodes.length > 1 ? "s" : ""}{" "}
            detected
          </p>
        </div>
      )}

      <p className="text-sm font-sans font-semibold uppercase tracking-wider text-muted-foreground">
        Per-node metrics
      </p>

      <ScrollArea className="max-h-[300px]">
        <div className="space-y-2">
          {sortedMetrics.map((m) => {
            const node = nodes.find((n) => n.id === m.nodeId);
            const label =
              ((node?.data as Record<string, unknown>)?.label as string) ?? m.nodeId;
            return (
              <div key={m.nodeId} className="rounded-md border border-border bg-card px-3 py-2.5">
                <div className="mb-1 flex items-center gap-1.5">
                  <div className={`h-1.5 w-1.5 rounded-full ${STATUS_COLOR[m.status]}`} />
                  <span className="text-sm font-medium text-foreground">{label}</span>
                  {m.isBottleneck && (
                    <span
                      className="ml-auto text-xs font-medium text-rose-600 dark:text-rose-400"
                      style={{ animation: "status-pulse 2s infinite" }}
                    >
                      BOTTLENECK
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <p className="text-xs text-muted-foreground">QPS</p>
                    <p className="font-mono text-sm text-foreground">{m.incomingQPS.toFixed(0)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Util</p>
                    <div className="flex items-center gap-1">
                      <div className="h-1 w-8 overflow-hidden rounded-full bg-muted">
                        <div
                          className={`h-full rounded-full ${
                            m.utilization > 0.8
                              ? "bg-rose-500"
                              : m.utilization > 0.5
                                ? "bg-amber-500"
                                : "bg-emerald-500"
                          }`}
                          style={{ width: `${Math.min(m.utilization * 100, 100)}%` }}
                        />
                      </div>
                      <p
                        className={`font-mono text-sm ${
                          m.utilization > 0.8
                            ? "text-rose-600 dark:text-rose-400"
                            : m.utilization > 0.5
                              ? "text-amber-600 dark:text-amber-400"
                              : "text-emerald-600 dark:text-emerald-400"
                        }`}
                      >
                        {(m.utilization * 100).toFixed(0)}%
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Latency</p>
                    <p className="font-mono text-sm text-foreground">{m.latencyMs.toFixed(0)}ms</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
