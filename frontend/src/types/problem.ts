export interface ProblemRequirements {
  readsPerSec: number;
  writesPerSec: number;
  storageGB: number;
  latencyMs: number;
  users: string; // e.g. "100M DAU"
}

export interface ProblemHint {
  title: string;
  content: string;
}

export interface ReferenceSolution {
  nodes: Array<{ componentId: string; x: number; y: number }>;
  edges: Array<{ source: string; target: string }>;
}

export interface Problem {
  id: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  description: string;
  requirements: ProblemRequirements;
  constraints: string[];
  hints: ProblemHint[];
  referenceSolution: ReferenceSolution;
  tags: string[];
}
