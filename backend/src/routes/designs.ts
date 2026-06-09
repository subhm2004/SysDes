import { Router, Request, Response } from "express";
import { db } from "../db/index.js";
import { savedDesigns } from "../db/schema.js";
import { requireAuth } from "../middleware/auth.js";
import { eq, and, desc } from "drizzle-orm";
import crypto from "crypto";

const router = Router();

// All design routes require authentication
router.use(requireAuth);

// ─── GET /api/designs ────────────────────────────────────────────────
// List all designs for the current user
router.get("/", async (req: Request, res: Response) => {
  try {
    const designs = await db
      .select()
      .from(savedDesigns)
      .where(eq(savedDesigns.userId, req.user!.userId))
      .orderBy(desc(savedDesigns.updatedAt));

    res.json({ designs });
  } catch (err) {
    console.error("[designs/list]", err);
    res.status(500).json({ error: "Failed to fetch designs" });
  }
});

// ─── POST /api/designs ───────────────────────────────────────────────
// Save a new design
router.post("/", async (req: Request, res: Response) => {
  try {
    const { name, problemId, nodes, edges, strokes, annotations } = req.body;

    if (!name || !nodes || !edges) {
      res.status(400).json({ error: "name, nodes, and edges are required" });
      return;
    }

    const now = new Date();
    const id = `design-${Date.now()}-${crypto.randomUUID().slice(0, 8)}`;

    await db.insert(savedDesigns).values({
      id,
      userId: req.user!.userId,
      name,
      problemId: problemId || null,
      nodes,
      edges,
      strokes: strokes || [],
      annotations: annotations || [],
      createdAt: now,
      updatedAt: now,
    });

    res.status(201).json({ id, message: "Design saved" });
  } catch (err) {
    console.error("[designs/create]", err);
    res.status(500).json({ error: "Failed to save design" });
  }
});

// ─── GET /api/designs/:id ────────────────────────────────────────────
// Get a single design
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const results = await db
      .select()
      .from(savedDesigns)
      .where(
        and(
          eq(savedDesigns.id, req.params.id),
          eq(savedDesigns.userId, req.user!.userId)
        )
      )
      .limit(1);

    if (results.length === 0) {
      res.status(404).json({ error: "Design not found" });
      return;
    }

    res.json({ design: results[0] });
  } catch (err) {
    console.error("[designs/get]", err);
    res.status(500).json({ error: "Failed to fetch design" });
  }
});

// ─── PUT /api/designs/:id ────────────────────────────────────────────
// Update a design
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const { name, problemId, nodes, edges, strokes, annotations } = req.body;

    const existing = await db
      .select()
      .from(savedDesigns)
      .where(
        and(
          eq(savedDesigns.id, req.params.id),
          eq(savedDesigns.userId, req.user!.userId)
        )
      )
      .limit(1);

    if (existing.length === 0) {
      res.status(404).json({ error: "Design not found" });
      return;
    }

    await db
      .update(savedDesigns)
      .set({
        name: name || existing[0].name,
        problemId: problemId !== undefined ? problemId : existing[0].problemId,
        nodes: nodes || existing[0].nodes,
        edges: edges || existing[0].edges,
        strokes: strokes !== undefined ? strokes : existing[0].strokes,
        annotations: annotations !== undefined ? annotations : existing[0].annotations,
        updatedAt: new Date(),
      })
      .where(eq(savedDesigns.id, req.params.id));

    res.json({ message: "Design updated" });
  } catch (err) {
    console.error("[designs/update]", err);
    res.status(500).json({ error: "Failed to update design" });
  }
});

// ─── DELETE /api/designs/:id ─────────────────────────────────────────
// Delete a design
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const existing = await db
      .select()
      .from(savedDesigns)
      .where(
        and(
          eq(savedDesigns.id, req.params.id),
          eq(savedDesigns.userId, req.user!.userId)
        )
      )
      .limit(1);

    if (existing.length === 0) {
      res.status(404).json({ error: "Design not found" });
      return;
    }

    await db.delete(savedDesigns).where(eq(savedDesigns.id, req.params.id));

    res.json({ message: "Design deleted" });
  } catch (err) {
    console.error("[designs/delete]", err);
    res.status(500).json({ error: "Failed to delete design" });
  }
});

export default router;
