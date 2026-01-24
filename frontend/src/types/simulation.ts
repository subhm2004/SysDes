export type NodeStatus = "healthy" | "warning" | "critical" | "idle";

export interface NodeMetrics {
  nodeId: string;
  incomingQPS: number;
  effectiveQPS: number;
  utilization: number;
  latencyMs: number;
  status: NodeStatus;
  isBottleneck: boolean;
}

export interface SimulationResult {
  nodeMetrics: Map<string, NodeMetrics>;
  totalLatencyMs: number;
  bottleneckNodes: string[];
  throughput: number;
  timestamp: number;
  warnings: string[];
}

/** Playback speed for edge animation and how long the “running” state lasts (1× = baseline). */
export type SimulationSpeedMultiplier = 0.25 | 0.5 | 1 | 2 | 4;

export const SIMULATION_SPEED_OPTIONS: SimulationSpeedMultiplier[] = [0.25, 0.5, 1, 2, 4];

export interface SimulationConfig {
  requestsPerSec: number;
  durationSec: number;
  rampUp: boolean;
  /** Higher = faster dots + shorter wait before results (e.g. 2× = twice as fast as 1×). */
  speedMultiplier: SimulationSpeedMultiplier;
}
