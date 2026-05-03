import { create } from "zustand";
import { persist } from "zustand/middleware";

export type PenMode = "off" | "pen" | "eraser";

export interface Stroke {
  id: string;
  points: [number, number][];
  color: string;
  width: number;
}

interface PenState {
  strokes: Stroke[];
  mode: PenMode;
  color: string;
  width: number;
  setMode: (mode: PenMode) => void;
  setColor: (color: string) => void;
  setWidth: (width: number) => void;
  addStroke: (stroke: Stroke) => void;
  eraseAt: (x: number, y: number, radius: number) => void;
  clearAll: () => void;
  setStrokes: (strokes: Stroke[]) => void;
}

export const PEN_COLORS = [
  "#f43f5e", // rose
  "#fbbf24", // amber
  "#22d3ee", // cyan
  "#a78bfa", // violet
  "#f4f4f5", // white-ish
];
export const PEN_WIDTHS = [4, 8, 16];

export const usePenStore = create<PenState>()(
  persist(
    (set) => ({
      strokes: [],
      mode: "off",
      color: PEN_COLORS[2],
      width: PEN_WIDTHS[0],
      setMode: (mode) => set({ mode }),
      setColor: (color) => set({ color }),
      setWidth: (width) => set({ width }),
      addStroke: (stroke) => set((s) => ({ strokes: [...s.strokes, stroke] })),
      eraseAt: (x, y, radius) => {
        const r2 = radius * radius;
        set((s) => ({
          strokes: s.strokes.filter((stroke) => {
            for (const [px, py] of stroke.points) {
              const dx = px - x;
              const dy = py - y;
              if (dx * dx + dy * dy < r2) return false;
            }
            return true;
          }),
        }));
      },
      clearAll: () => set({ strokes: [] }),
      setStrokes: (strokes) => set({ strokes }),
    }),
    {
      name: "sysdes-pen-strokes",
      partialize: (state) => ({
        strokes: state.strokes,
        color: state.color,
        width: state.width,
      }),
    }
  )
);
