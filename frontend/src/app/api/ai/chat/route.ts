import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import { buildAiSystemInstruction } from "@/lib/ai/systemPrompt";
import { parseModelJson } from "@/lib/ai/canvasOps";

export const runtime = "nodejs";

type ChatMessage = { role: "user" | "model"; content: string };

type Body = {
  messages: ChatMessage[];
  canvasSummary: string;
};

export async function POST(req: Request) {
  const key = process.env.GROQ_API_KEY;
  if (!key?.trim()) {
    return NextResponse.json(
      { error: "GROQ_API_KEY is not set. Copy .env.example to .env and add your key." },
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

  const FALLBACK_MODELS = [
    "llama-3.3-70b-versatile",
    "llama-3.1-8b-instant",
    "mixtral-8x7b-32768",
  ] as const;
  const userModel = process.env.GROQ_MODEL?.trim();
  const modelChain = userModel
    ? [userModel, ...FALLBACK_MODELS.filter((m) => m !== userModel)]
    : [...FALLBACK_MODELS];

  // Build chat messages for Groq (OpenAI-compatible format)
  const systemInstruction = buildAiSystemInstruction();

  const groqMessages: Groq.Chat.ChatCompletionMessageParam[] = [
    { role: "system", content: systemInstruction },
  ];

  // Add history (all messages except last)
  for (const m of messages.slice(0, -1)) {
    groqMessages.push({
      role: m.role === "user" ? "user" : "assistant",
      content: m.content,
    });
  }

  // Add latest user message with canvas context
  const last = messages[messages.length - 1];
  const userText = `Current canvas JSON:\n${canvasSummary}\n\nUser:\n${last.content}`;
  groqMessages.push({ role: "user", content: userText });

  function shouldTryNextModel(e: unknown): boolean {
    const s = e instanceof Error ? e.message : String(e);
    if (
      s.includes("429") ||
      s.includes("rate_limit") ||
      s.includes("quota") ||
      s.includes("Too Many Requests")
    ) {
      return true;
    }
    if (s.includes("404") || s.includes("not found") || s.includes("Not Found") || s.includes("model_not_found")) {
      return true;
    }
    return false;
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
      lastError instanceof Error ? lastError.message : "All Groq models failed (check quotas).";
    console.error("[api/ai/chat]", lastError);
    return NextResponse.json(
      {
        error: `${msg} Set GROQ_MODEL in .env to a model with quota, or wait and retry.`,
      },
      { status: 502 }
    );
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Groq request failed";
    console.error("[api/ai/chat]", e);
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}
