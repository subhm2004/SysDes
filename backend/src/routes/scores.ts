import { Router, Request, Response } from "express";
import { db } from "../db/index.js";
import { scores } from "../db/schema.js";
import { requireAuth } from "../middleware/auth.js";
import { eq, and, desc, avg, max, count, sql } from "drizzle-orm";
import crypto from "crypto";

const router = Router();

router.use(requireAuth);

// ─── POST /api/scores ────────────────────────────────────────────────
// Save an evaluation result after the user clicks "Evaluate"
router.post("/", async (req: Request, res: Response) => {
  try {
    const { problemId, designId, axes, total, verdict, durationSec } = req.body as {
      problemId: string;
      designId?: string;
      axes: Record<string, number>;
      total: number;
      verdict: string;
      durationSec?: number;
    };

    if (!problemId || !axes || total == null || !verdict) {
      res.status(400).json({ error: "problemId, axes, total, and verdict are required" });
      return;
    }

    if (total < 0 || total > 100) {
      res.status(400).json({ error: "total must be between 0 and 100" });
      return;
    }

    const id = `score-${Date.now()}-${crypto.randomUUID().slice(0, 8)}`;

    await db.insert(scores).values({
      id,
      userId: req.user!.userId,
      problemId,
      designId: designId ?? null,
      axes,
      total,
      verdict,
      durationSec: durationSec ?? null,
      createdAt: new Date(),
    });

    res.status(201).json({ id, message: "Score saved" });
  } catch (err) {
    console.error("[scores/create]", err);
    res.status(500).json({ error: "Failed to save score" });
  }
});

// ─── GET /api/scores/stats ───────────────────────────────────────────
// Aggregated progress stats for the current user
router.get("/stats", async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;

    // Overall aggregates
    const [overall] = await db
      .select({
        totalAttempts: count(),
        avgScore: avg(scores.total),
        bestScore: max(scores.total),
      })
      .from(scores)
      .where(eq(scores.userId, userId));

    // Per-problem best scores
    const perProblem = await db
      .select({
        problemId: scores.problemId,
        attempts: count(),
        bestScore: max(scores.total),
        avgScore: avg(scores.total),
        lastVerdict: sql<string>`(
          SELECT verdict FROM scores s2
          WHERE s2.user_id = ${userId}
            AND s2.problem_id = scores.problem_id
          ORDER BY s2.created_at DESC
          LIMIT 1
        )`,
      })
      .from(scores)
      .where(eq(scores.userId, userId))
      .groupBy(scores.problemId)
      .orderBy(desc(max(scores.total)));

    // Last 10 attempts (for a sparkline / recent activity)
    const recent = await db
      .select({
        id: scores.id,
        problemId: scores.problemId,
        total: scores.total,
        verdict: scores.verdict,
        createdAt: scores.createdAt,
      })
      .from(scores)
      .where(eq(scores.userId, userId))
      .orderBy(desc(scores.createdAt))
      .limit(10);

    res.json({
      overall: {
        totalAttempts: Number(overall.totalAttempts),
        avgScore: overall.avgScore ? Math.round(Number(overall.avgScore)) : null,
        bestScore: overall.bestScore ?? null,
      },
      perProblem,
      recent,
    });
  } catch (err) {
    console.error("[scores/stats]", err);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

// ─── GET /api/scores/problem/:problemId ─────────────────────────────
// All attempts for one problem (newest first) — for the per-problem history panel
router.get("/problem/:problemId", async (req: Request, res: Response) => {
  try {
    const attempts = await db
      .select()
      .from(scores)
      .where(
        and(
          eq(scores.userId, req.user!.userId),
          eq(scores.problemId, req.params.problemId as string),
        ),
      )
      .orderBy(desc(scores.createdAt))
      .limit(50);

    res.json({ attempts });
  } catch (err) {
    console.error("[scores/problem]", err);
    res.status(500).json({ error: "Failed to fetch attempts" });
  }
});

// ─── GET /api/scores ─────────────────────────────────────────────────
// All scores for user, paginated
router.get("/", async (req: Request, res: Response) => {
  try {
    const limit = Math.min(parseInt((req.query.limit as string) ?? "20"), 100);
    const offset = parseInt((req.query.offset as string) ?? "0");

    const results = await db
      .select()
      .from(scores)
      .where(eq(scores.userId, req.user!.userId))
      .orderBy(desc(scores.createdAt))
      .limit(limit)
      .offset(offset);

    res.json({ scores: results, limit, offset });
  } catch (err) {
    console.error("[scores/list]", err);
    res.status(500).json({ error: "Failed to fetch scores" });
  }
});

export default router;
