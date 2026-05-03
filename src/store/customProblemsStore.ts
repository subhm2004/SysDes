import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CustomProblem {
  id: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  description: string;
  requirements: {
    readsPerSec: number;
    writesPerSec: number;
    storageGB: number;
    latencyMs: number;
    users: string;
  };
  constraints: string[];
  tags: string[];
  createdAt: string;
}

interface CustomProblemsState {
  problems: CustomProblem[];
  addProblem: (problem: Omit<CustomProblem, "id" | "createdAt">) => string;
  updateProblem: (id: string, updates: Partial<CustomProblem>) => void;
  deleteProblem: (id: string) => void;
}

export const useCustomProblemsStore = create<CustomProblemsState>()(
  persist(
    (set, get) => ({
      problems: [],

      addProblem: (problem) => {
        const id = `custom-${crypto.randomUUID()}`;
        const newProblem: CustomProblem = {
          ...problem,
          id,
          createdAt: new Date().toISOString(),
        };
        set((s) => ({ problems: [newProblem, ...s.problems] }));
        return id;
      },

      updateProblem: (id, updates) => {
        set((s) => ({
          problems: s.problems.map((p) =>
            p.id === id ? { ...p, ...updates } : p
          ),
        }));
      },

      deleteProblem: (id) => {
        set((s) => ({
          problems: s.problems.filter((p) => p.id !== id),
        }));
      },
    }),
    {
      name: "sysdes-custom-problems",
    }
  )
);
