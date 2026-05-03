import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { buildAiSystemInstruction } from "@/lib/ai/systemPrompt";
import { parseModelJson } from "@/lib/ai/canvasOps";

export const runtime = "nodejs";

type ChatMessage = { role: "user" | "model"; content: string };

type Body = {
  messages: ChatMessage[];
  canvasSummary: string;
};

export async function POST(req: Request) {
  const key = process.env.GEMINI_API_KEY;
  if (!key?.trim()) {
    return NextResponse.json(
      { error: "GEMINI_API_KEY is not set. Copy .env.example to .env and add your key." },
      { status: 503 }
    );
  }

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const messages = Array.isArray(body.messages) ? body.messages : [];
  const canvasSummary = typeof body.canvasSummary === "string" ? body.canvasSummary : "{}";

  if (messages.length === 0 || messages[messages.length - 1]?.role !== "user") {
    return NextResponse.json({ error: "Last message must be from user" }, { status: 400 });
  }

  /**
   * Current API model ids (gemini-1.5-* removed from API → 404).
   * @see https://ai.google.dev/gemini-api/docs/models
   */
  const FALLBACK_MODELS = [
    "gemini-2.5-flash",
    "gemini-2.5-flash-lite",
    "gemini-2.0-flash",
  ] as const;
  const userModel = process.env.GEMINI_MODEL?.trim();
  const modelChain = userModel
    ? [userModel, ...FALLBACK_MODELS.filter((m) => m !== userModel)]
    : [...FALLBACK_MODELS];

  const history = messages.slice(0, -1).map((m) => ({
    role: m.role === "user" ? ("user" as const) : ("model" as const),
    parts: [{ text: m.content }],
  }));

  const last = messages[messages.length - 1];
  const userText = `Current canvas JSON:\n${canvasSummary}\n\nUser:\n${last.content}`;

  const systemInstruction = buildAiSystemInstruction();

  function shouldTryNextModel(e: unknown): boolean {
    const s = e instanceof Error ? e.message : String(e);
    if (
      s.includes("429") ||
      s.includes("RESOURCE_EXHAUSTED") ||
      s.includes("quota") ||
      s.includes("Too Many Requests")
    ) {
      return true;
    }
    /* Wrong/retired model name for this API version */
    if (s.includes("404") || s.includes("not found") || s.includes("Not Found")) {
      return true;
    }
    return false;
  }

  let lastError: unknown;
  try {
    const genAI = new GoogleGenerativeAI(key);

    for (const modelName of modelChain) {
      try {
        const model = genAI.getGenerativeModel({
          model: modelName,
          systemInstruction,
        });
        const chat = model.startChat({ history });
        const result = await chat.sendMessage(userText);
        const raw = result.response.text();
        const parsed = parseModelJson(raw);
        return NextResponse.json({
          reply: parsed.reply,
          operations: parsed.operations,
        });
      } catch (e) {
        lastError = e;
        if (shouldTryNextModel(e)) {
          console.warn(`[api/ai/chat] ${modelName} unavailable, trying next model…`);
          continue;
        }
        throw e;
      }
    }

    const msg =
      lastError instanceof Error ? lastError.message : "All Gemini models failed (check quotas).";
    console.error("[api/ai/chat]", lastError);
    return NextResponse.json(
      {
        error: `${msg} Set GEMINI_MODEL in .env to a model with quota, or wait and retry. See https://ai.google.dev/gemini-api/docs/rate-limits`,
      },
      { status: 502 }
    );
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Gemini request failed";
    console.error("[api/ai/chat]", e);
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}
