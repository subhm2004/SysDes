import type { Node, Edge } from "@xyflow/react";
import type { ComponentNodeData } from "@/store/canvasStore";
import type { ScoreResult } from "@/types/scoring";
import { scoreScalability } from "./rules/scalability";
import { scoreAvailability } from "./rules/availability";
import { scoreLatency } from "./rules/latency";
import { scoreCost } from "./rules/cost";
import { scoreTradeoffs } from "./rules/tradeoffs";

function getVerdict(total: number): { verdict: string; verdictColor: string } {
  if (total >= 86) return { verdict: "Architect Level", verdictColor: "text-emerald-400" };
  if (total >= 71) return { verdict: "Excellent", verdictColor: "text-cyan-400" };
  if (total >= 51) return { verdict: "Good", verdictColor: "text-blue-400" };
  if (total >= 31) return { verdict: "Decent", verdictColor: "text-amber-400" };
  return { verdict: "Needs Work", verdictColor: "text-rose-400" };
}

export function scoreDesign(
  nodes: Node<ComponentNodeData>[],
  edges: Edge[]
): ScoreResult {
  if (nodes.length === 0) {
    return {
      total: 0,
      categories: [],
      verdict: "Empty Canvas",
      verdictColor: "text-zinc-500",
      summary: "Add components to the canvas to get a score.",
    };
  }

  const categories = [
    scoreScalability(nodes, edges),
    scoreAvailability(nodes, edges),
    scoreLatency(nodes, edges),
    scoreCost(nodes, edges),
    scoreTradeoffs(nodes, edges),
  ];

  // Clamp each category score to [0, maxScore]
  for (const c of categories) {
    c.score = Math.max(0, Math.min(c.score, c.maxScore));
  }

  const rawTotal = categories.reduce((sum, c) => sum + c.score, 0);
  const total = Math.max(0, Math.min(rawTotal, 100));
  const { verdict, verdictColor } = getVerdict(total);

  const totalFeedback = categories.flatMap((c) => c.feedback);
  const summary =
    totalFeedback.length === 0
      ? "Outstanding system design! All criteria met."
      : `${totalFeedback.length} suggestion${totalFeedback.length > 1 ? "s" : ""} for improvement.`;

  return { total, categories, verdict, verdictColor, summary };
}
