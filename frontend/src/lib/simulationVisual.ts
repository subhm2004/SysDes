import type { SimulationSpeedMultiplier } from "@/types/simulation";

/** One full dot trip along an edge at 1× speed (seconds). */
const BASE_EDGE_DURATION_SEC = 2;

/** How long the run stays “in progress” at 1× before applying results (ms). */
const BASE_HOLD_MS = 2200;

/** Minimum hold so 4× still shows a brief animation. */
const MIN_HOLD_MS = 450;

function edgeDurationSec(multiplier: SimulationSpeedMultiplier): number {
  return BASE_EDGE_DURATION_SEC / multiplier;
}

export function getEdgeAnimationDurationSec(multiplier: SimulationSpeedMultiplier): string {
  const sec = edgeDurationSec(multiplier);
  const rounded = Math.round(sec * 1000) / 1000;
  return `${rounded}s`;
}

export function getEdgeAnimationStaggerSec(multiplier: SimulationSpeedMultiplier): string {
  const sec = edgeDurationSec(multiplier) * 0.35;
  const rounded = Math.round(sec * 1000) / 1000;
  return `${rounded}s`;
}

export function getSimulationHoldMs(multiplier: SimulationSpeedMultiplier): number {
  return Math.max(MIN_HOLD_MS, Math.round(BASE_HOLD_MS / multiplier));
}
