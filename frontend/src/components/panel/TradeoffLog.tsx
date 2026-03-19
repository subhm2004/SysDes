"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2 } from "lucide-react";
import { useTradeoffStore, type TradeoffEntry } from "@/store/tradeoffStore";

const CATEGORIES: TradeoffEntry["category"][] = [
  "storage",
  "communication",
  "consistency",
  "scaling",
  "availability",
  "other",
];

function getCategoryColor(category: TradeoffEntry["category"]) {
  switch (category) {
    case "storage":
      return "border-blue-500/30 bg-blue-500/10 text-blue-400";
    case "communication":
      return "border-purple-500/30 bg-purple-500/10 text-purple-400";
    case "consistency":
      return "border-amber-500/30 bg-amber-500/10 text-amber-400";
    case "scaling":
      return "border-emerald-500/30 bg-emerald-500/10 text-emerald-400";
    case "availability":
      return "border-cyan-500/30 bg-cyan-500/10 text-cyan-400";
    case "other":
      return "border-zinc-500/30 bg-zinc-500/10 text-zinc-400";
  }
}

export function TradeoffLog() {
  const entries = useTradeoffStore((s) => s.entries);
  const addEntry = useTradeoffStore((s) => s.addEntry);
  const removeEntry = useTradeoffStore((s) => s.removeEntry);
  const [formOpen, setFormOpen] = useState(false);
  const [decision, setDecision] = useState("");
  const [rationale, setRationale] = useState("");
  const [alternatives, setAlternatives] = useState("");
  const [category, setCategory] = useState<TradeoffEntry["category"]>("other");

  const handleSave = () => {
    if (!decision.trim()) return;
    addEntry({
      decision: decision.trim(),
      rationale: rationale.trim(),
      alternatives: alternatives.trim(),
      category,
    });
    setDecision("");
    setRationale("");
    setAlternatives("");
    setCategory("other");
    setFormOpen(false);
  };

  const handleCancel = () => {
    setDecision("");
    setRationale("");
    setAlternatives("");
    setCategory("other");
    setFormOpen(false);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-sans font-semibold uppercase tracking-wider text-muted-foreground">
          Your trade-offs
        </p>
        {!formOpen && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setFormOpen(true)}
            className="h-8 gap-1 border-border px-2.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <Plus className="h-3.5 w-3.5" />
            Add
          </Button>
        )}
      </div>

      {formOpen && (
        <div className="space-y-2.5 rounded-md border border-border bg-card p-3">
          <input
            type="text"
            placeholder="Decision (e.g. Chose Redis over Memcached)"
            value={decision}
            onChange={(e) => setDecision(e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-cyan-600 focus:ring-1 focus:ring-cyan-500/30 dark:focus:border-cyan-400"
          />
          <textarea
            placeholder="Rationale — why this choice?"
            value={rationale}
            onChange={(e) => setRationale(e.target.value)}
            rows={2}
            className="w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-cyan-600 focus:ring-1 focus:ring-cyan-500/30 dark:focus:border-cyan-400"
          />
          <textarea
            placeholder="Alternatives considered"
            value={alternatives}
            onChange={(e) => setAlternatives(e.target.value)}
            rows={2}
            className="w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-cyan-600 focus:ring-1 focus:ring-cyan-500/30 dark:focus:border-cyan-400"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as TradeoffEntry["category"])}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-cyan-600 focus:ring-1 focus:ring-cyan-500/30 dark:focus:border-cyan-400"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSave}
              disabled={!decision.trim()}
              className="h-8 border-cyan-600 px-4 text-sm text-cyan-700 hover:bg-cyan-500/10 hover:text-cyan-800 disabled:opacity-40 dark:text-cyan-300 dark:hover:bg-cyan-500/15 dark:hover:text-cyan-200"
            >
              Save
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCancel}
              className="h-8 border-border px-4 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {entries.length === 0 && !formOpen && (
        <p className="text-sm leading-relaxed text-muted-foreground">
          No trade-offs logged yet. Record your design decisions as you go.
        </p>
      )}

      <div className="space-y-2">
        {entries.map((entry) => (
          <div
            key={entry.id}
            className="group rounded-md border border-border bg-card p-3"
          >
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm font-medium text-foreground">{entry.decision}</p>
              <button
                type="button"
                onClick={() => removeEntry(entry.id)}
                className="shrink-0 rounded p-0.5 text-muted-foreground opacity-0 transition-opacity hover:text-rose-500 group-hover:opacity-100"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            {entry.rationale && (
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                {entry.rationale}
              </p>
            )}
            {entry.alternatives && (
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground/90">
                Alt: {entry.alternatives}
              </p>
            )}
            <div className="mt-2">
              <Badge
                variant="outline"
                className={`h-5 px-2 text-xs font-medium ${getCategoryColor(entry.category)}`}
              >
                {entry.category}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
