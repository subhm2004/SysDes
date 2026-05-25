"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Loader2, Send, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCanvasStore, type ComponentNodeData, type TextNodeData } from "@/store/canvasStore";
import { useAppStore } from "@/store/appStore";
import type { CanvasAiOperation } from "@/lib/ai/canvasOps";

type ChatRole = "user" | "model";

export type ChatMessage = { role: ChatRole; content: string };

function buildCanvasSummary(): string {
  const { nodes, edges } = useCanvasStore.getState();
  return JSON.stringify(
    {
      nodes: nodes.map((n) => ({
        id: n.id,
        type: n.type,
        position: n.position,
        label:
          n.type === "component"
            ? (n.data as ComponentNodeData).label
            : String((n.data as TextNodeData).text ?? ""),
        componentId: n.type === "component" ? (n.data as ComponentNodeData).componentId : undefined,
      })),
      edges: edges.map((e) => ({ id: e.id, source: e.source, target: e.target })),
    },
    null,
    2
  );
}

interface AiChatPanelProps {
  open: boolean;
  onClose: () => void;
}

export function AiChatPanel({ open, onClose }: AiChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || loading) return;

    const nextMessages: ChatMessage[] = [...messages, { role: "user", content: text }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages,
          canvasSummary: buildCanvasSummary(),
        }),
      });
      const data = (await res.json()) as { reply?: string; operations?: CanvasAiOperation[]; error?: string };

      if (!res.ok) {
        throw new Error(data.error || "Request failed");
      }

      const reply = typeof data.reply === "string" ? data.reply : "";
      setMessages((m) => [...m, { role: "model", content: reply }]);

      const ops = Array.isArray(data.operations) ? data.operations : [];
      if (ops.length > 0) {
        const { warnings } = useCanvasStore.getState().applyAiOperations(ops);
        const toast = useAppStore.getState().showToast;
        if (warnings.length) {
          warnings.forEach((w) => toast(w, "info"));
        }
        if (warnings.length === 0 && ops.length > 0) {
          toast("Canvas updated from AI", "success");
        }
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Something went wrong";
      useAppStore.getState().showToast(msg, "error");
      setMessages((m) => [...m, { role: "model", content: `Error: ${msg}` }]);
    } finally {
      setLoading(false);
    }
  }, [input, loading, messages]);

  if (!open) return null;

  return (
    <aside
      className="fixed right-0 top-14 z-[45] flex h-[calc(100%-3.5rem)] w-full max-w-md flex-col border-l border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-950"
      aria-label="AI assistant"
    >
      <div className="flex shrink-0 items-center justify-between gap-2 border-b border-zinc-200 px-3 py-2.5 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-100 text-cyan-600 dark:bg-cyan-950 dark:text-cyan-300">
            <Sparkles className="h-4 w-4" />
          </span>
          <div>
            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">AI assistant</p>
            <p className="text-[10px] text-zinc-500 dark:text-zinc-400">Gemini · can edit the canvas</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="flex h-8 w-8 items-center justify-center rounded-md text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-800 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
          aria-label="Close AI chat"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div ref={listRef} className="min-h-0 flex-1 space-y-3 overflow-y-auto px-3 py-3">
        {messages.length === 0 && (
          <p className="rounded-lg border border-dashed border-zinc-200 bg-zinc-50/80 px-3 py-3 text-xs leading-relaxed text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-400">
            Ask for architecture help or say things like: “Add load balancer, API gateway, and Redis, then connect them
            left to right.” The model can apply changes when you ask it to.
          </p>
        )}
        {messages.map((msg, i) => (
          <div
            key={`${i}-${msg.role}`}
            className={`max-w-[95%] rounded-xl px-3 py-2 text-sm leading-relaxed ${
              msg.role === "user"
                ? "ml-auto bg-cyan-600 text-white"
                : "mr-auto border border-zinc-200 bg-zinc-50 text-zinc-800 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
            }`}
          >
            <span className="block whitespace-pre-wrap break-words">{msg.content}</span>
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            Thinking…
          </div>
        )}
      </div>

      <div className="shrink-0 border-t border-zinc-200 p-3 dark:border-zinc-800">
        <div className="flex gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void send();
              }
            }}
            placeholder="Ask or describe diagram changes…"
            rows={2}
            className="min-h-[44px] flex-1 resize-none rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none ring-cyan-500/30 placeholder:text-zinc-400 focus:border-cyan-400 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
            disabled={loading}
          />
          <Button
            type="button"
            onClick={() => void send()}
            disabled={loading || !input.trim()}
            className="h-11 shrink-0 self-end bg-cyan-600 hover:bg-cyan-500"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </aside>
  );
}
