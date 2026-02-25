import { create } from "zustand";

export interface Phase {
  name: string;
  targetMinutes: number;
  description: string;
  icon: string;
}

const PHASES: Phase[] = [
  {
    name: "Requirements",
    targetMinutes: 5,
    description: "Clarify functional and non-functional requirements",
    icon: "ClipboardList",
  },
  {
    name: "Estimation",
    targetMinutes: 5,
    description: "Back-of-envelope calculations",
    icon: "Calculator",
  },
  {
    name: "API Design",
    targetMinutes: 5,
    description: "Define core API endpoints",
    icon: "FileCode2",
  },
  {
    name: "Data Model",
    targetMinutes: 2,
    description: "Design key entities and relationships",
    icon: "Database",
  },
  {
    name: "High-Level Design",
    targetMinutes: 15,
    description: "Build the architecture on the canvas",
    icon: "LayoutDashboard",
  },
  {
    name: "Deep Dive",
    targetMinutes: 10,
    description: "Discuss trade-offs, failure modes, scaling",
    icon: "Search",
  },
];

interface InterviewState {
  mode: "free" | "interview";
  currentPhase: number;
  phases: Phase[];
  timerRunning: boolean;
  timerSeconds: number;
  phaseStartTime: number;

  startInterview: () => void;
  endInterview: () => void;
  nextPhase: () => void;
  prevPhase: () => void;
  setPhase: (index: number) => void;
  tickTimer: () => void;
  toggleTimer: () => void;
}

export const useInterviewStore = create<InterviewState>((set, get) => ({
  mode: "free",
  currentPhase: 0,
  phases: PHASES,
  timerRunning: false,
  timerSeconds: 0,
  phaseStartTime: 0,

  startInterview: () =>
    set({
      mode: "interview",
      currentPhase: 0,
      timerRunning: true,
      timerSeconds: 0,
      phaseStartTime: 0,
    }),

  endInterview: () =>
    set({
      mode: "free",
      currentPhase: 0,
      timerRunning: false,
      timerSeconds: 0,
      phaseStartTime: 0,
    }),

  nextPhase: () => {
    const { currentPhase, phases, timerSeconds } = get();
    if (currentPhase < phases.length - 1) {
      set({ currentPhase: currentPhase + 1, phaseStartTime: timerSeconds });
    }
  },

  prevPhase: () => {
    const { currentPhase, timerSeconds } = get();
    if (currentPhase > 0) {
      set({ currentPhase: currentPhase - 1, phaseStartTime: timerSeconds });
    }
  },

  setPhase: (index) => {
    const { phases, timerSeconds } = get();
    if (index >= 0 && index < phases.length) {
      set({ currentPhase: index, phaseStartTime: timerSeconds });
    }
  },

  tickTimer: () => {
    const { timerRunning } = get();
    if (timerRunning) {
      set((s) => ({ timerSeconds: s.timerSeconds + 1 }));
    }
  },

  toggleTimer: () => set((s) => ({ timerRunning: !s.timerRunning })),
}));
