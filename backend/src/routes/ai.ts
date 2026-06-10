import { Router, Request, Response } from "express";
import Groq from "groq-sdk";
import { optionalAuth } from "../middleware/auth.js";

const router = Router();

type ChatMessage = { role: "user" | "model"; content: string };

type Body = {
  messages: ChatMessage[];
  canvasSummary: string;
};

// Moved from frontend Next.js API route — now in the backend
function buildAiSystemInstruction(): string {
  return `You are an expert system-design assistant inside SysDes, a React Flow canvas tool for architecture diagrams.

You must answer in JSON only (no markdown fences). Schema:
{"reply": "<short helpful message in plain text, can use newlines>","operations": [<ops>]}

operations is an array of edits to apply to the canvas. Only include operations when the user wants the diagram changed. If unsure, use an empty array and only reply.

Allowed operation objects (exact keys):
- {"op":"add_component","componentId":"<id from catalog>","x":<optional number>,"y":<optional number>}
- {"op":"connect","sourceLabel":"<substring of node label>","targetLabel":"<substring of node label>"}
- {"op":"remove_node","label":"<substring matching a node label>"}
- {"op":"add_text","text":"<string>","x":<optional>,"y":<optional>}
- {"op":"clear_canvas"} — removes all nodes and edges (use only if user explicitly asks to clear/reset)

Rules:
- For add_component, componentId MUST be one of: dns, cdn, load-balancer, api-gateway, rate-limiter, reverse-proxy, origin-shield, app-server, auth-service, websocket-server, task-scheduler, stream-processor, notification-service, sql-db, nosql-db, cache-redis, object-storage, search-elasticsearch, graph-db, timeseries-db, data-warehouse, file-store, vector-db, geospatial-index, message-queue, pub-sub, service-mesh, monitoring, service-discovery, distributed-lock, circuit-breaker, coordination-service, config-service, id-generator, sharded-counter, custom
- Labels for connect/remove match case-insensitively against component labels.
- Prefer small, incremental operations. Place new components in a rough left-to-right flow when coordinates omitted.
- If the user only asks a conceptual question, return operations: [].
`;
}

function parseModelJson(text: string) {
  const trimmed = text.trim();
  try {
    const j = JSON.parse(trimmed);
    if (typeof j !== "object" || j === null) return { reply: trimmed, operations: [] };
    const reply = typeof j.reply === "string" ? j.reply : trimmed;
    const operations = Array.isArray(j.operations) ? j.operations : [];
    return { reply, operations };
  } catch {
    return { reply: trimmed || "No response.", operations: [] };
  }
}

// ─── POST /api/ai/chat ──────────────────────────────────────────────
router.post("/chat", optionalAuth, async (req: Request, res: Response) => {
  const key = process.env.GROQ_API_KEY;
  if (!key?.trim()) {
    res.status(503).json({ error: "GROQ_API_KEY is not set in backend .env" });
    return;
  }

  let body: Body;
  try {
    body = req.body as Body;
  } catch {
    res.status(400).json({ error: "Invalid JSON body" });
    return;
  }

  const messages = Array.isArray(body.messages) ? body.messages : [];
  const canvasSummary = typeof body.canvasSummary === "string" ? body.canvasSummary : "{}";

  if (messages.length === 0 || messages[messages.length - 1]?.role !== "user") {
    res.status(400).json({ error: "Last message must be from user" });
    return;
  }

  const FALLBACK_MODELS = [
    "llama-3.3-70b-versatile",
    "llama-3.1-8b-instant",
    "mixtral-8x7b-32768",
  ] as const;
  const userModel = process.env.GROQ_MODEL?.trim();
  const modelChain = userModel
    ? [userModel, ...FALLBACK_MODELS.filter((m) => m !== userModel)]
    : [...FALLBACK_MODELS];

  const systemInstruction = buildAiSystemInstruction();

  const groqMessages: Groq.Chat.ChatCompletionMessageParam[] = [
    { role: "system", content: systemInstruction },
  ];

  for (const m of messages.slice(0, -1)) {
    groqMessages.push({
      role: m.role === "user" ? "user" : "assistant",
      content: m.content,
    });
  }

  const last = messages[messages.length - 1];
  const userText = `Current canvas JSON:\n${canvasSummary}\n\nUser:\n${last.content}`;
  groqMessages.push({ role: "user", content: userText });

  function shouldTryNextModel(e: unknown): boolean {
    const s = e instanceof Error ? e.message : String(e);
    return (
      s.includes("429") ||
      s.includes("rate_limit") ||
      s.includes("quota") ||
      s.includes("Too Many Requests") ||
      s.includes("404") ||
      s.includes("not found") ||
      s.includes("Not Found") ||
      s.includes("model_not_found")
    );
  }

  let lastError: unknown;
  try {
    const groq = new Groq({ apiKey: key });

    for (const modelName of modelChain) {
      try {
        const chatCompletion = await groq.chat.completions.create({
          model: modelName,
          messages: groqMessages,
          temperature: 0.7,
          max_tokens: 4096,
        });

        const raw = chatCompletion.choices[0]?.message?.content ?? "";
        const parsed = parseModelJson(raw);
        res.json({ reply: parsed.reply, operations: parsed.operations });
        return;
      } catch (e) {
        lastError = e;
        if (shouldTryNextModel(e)) {
          console.warn(`[ai/chat] ${modelName} unavailable, trying next…`);
          continue;
        }
        throw e;
      }
    }

    const msg =
      lastError instanceof Error ? lastError.message : "All Groq models failed.";
    console.error("[ai/chat]", lastError);
    res.status(502).json({ error: msg });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Groq request failed";
    console.error("[ai/chat]", e);
    res.status(502).json({ error: msg });
  }
});

export default router;
