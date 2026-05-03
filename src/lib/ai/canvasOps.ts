/**
 * Canvas mutations the AI may return. `componentId` must match the built-in catalog (e.g. load-balancer, redis).
 */
export type CanvasAiOperation =
  | { op: "add_component"; componentId: string; x?: number; y?: number }
  | { op: "connect"; sourceLabel: string; targetLabel: string }
  | { op: "remove_node"; label: string }
  | { op: "clear_canvas" }
  | { op: "add_text"; text: string; x?: number; y?: number };

export type CanvasAiChatResponse = {
  reply: string;
  operations: CanvasAiOperation[];
};

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

/** Best-effort parse of model JSON; falls back to plain text reply. */
export function parseModelJson(text: string): CanvasAiChatResponse {
  const trimmed = text.trim();
  try {
    const j = JSON.parse(trimmed) as unknown;
    if (!isRecord(j)) return { reply: trimmed, operations: [] };
    const reply = typeof j.reply === "string" ? j.reply : trimmed;
    const operations = sanitizeCanvasOperations(j.operations);
    return { reply, operations };
  } catch {
    return { reply: trimmed || "No response.", operations: [] };
  }
}

export function sanitizeCanvasOperations(raw: unknown): CanvasAiOperation[] {
  if (!Array.isArray(raw)) return [];
  const out: CanvasAiOperation[] = [];
  for (const item of raw) {
    if (!isRecord(item)) continue;
    const op = item.op;
    if (op === "clear_canvas") {
      out.push({ op: "clear_canvas" });
      continue;
    }
    if (op === "add_component" && typeof item.componentId === "string") {
      out.push({
        op: "add_component",
        componentId: item.componentId,
        x: typeof item.x === "number" ? item.x : undefined,
        y: typeof item.y === "number" ? item.y : undefined,
      });
      continue;
    }
    if (op === "connect" && typeof item.sourceLabel === "string" && typeof item.targetLabel === "string") {
      out.push({
        op: "connect",
        sourceLabel: item.sourceLabel,
        targetLabel: item.targetLabel,
      });
      continue;
    }
    if (op === "remove_node" && typeof item.label === "string") {
      out.push({ op: "remove_node", label: item.label });
      continue;
    }
    if (op === "add_text" && typeof item.text === "string") {
      out.push({
        op: "add_text",
        text: item.text,
        x: typeof item.x === "number" ? item.x : undefined,
        y: typeof item.y === "number" ? item.y : undefined,
      });
    }
  }
  return out;
}
