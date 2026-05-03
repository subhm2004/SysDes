export interface CategoryScore {
  category: string;
  score: number; // 0-20
  maxScore: number; // 20
  feedback: string[];
  passed: string[];
}

export interface ScoreResult {
  total: number; // 0-100
  categories: CategoryScore[];
  verdict: string;
  verdictColor: string;
  summary: string;
}
