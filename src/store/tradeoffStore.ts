import { create } from "zustand";

export interface TradeoffEntry {
  id: string;
  timestamp: number;
  decision: string;
  rationale: string;
  alternatives: string;
  category: "storage" | "communication" | "consistency" | "scaling" | "availability" | "other";
}

interface TradeoffState {
  entries: TradeoffEntry[];
  addEntry: (entry: Omit<TradeoffEntry, "id" | "timestamp">) => void;
  removeEntry: (id: string) => void;
  clearEntries: () => void;
}

export const useTradeoffStore = create<TradeoffState>((set) => ({
  entries: [],
  addEntry: (entry) =>
    set((s) => ({
      entries: [
        {
          ...entry,
          id: `tradeoff-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          timestamp: Date.now(),
        },
        ...s.entries,
      ],
    })),
  removeEntry: (id) =>
    set((s) => ({ entries: s.entries.filter((e) => e.id !== id) })),
  clearEntries: () => set({ entries: [] }),
}));
