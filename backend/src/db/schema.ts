import { pgTable, text, timestamp, jsonb, integer, index } from "drizzle-orm/pg-core";

// ─── Users ───────────────────────────────────────────────────────────
export const users = pgTable("users", {
  id: text("id").primaryKey(), // Google OAuth sub
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  image: text("image"), // Google avatar URL
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// ─── Saved Designs ───────────────────────────────────────────────────
export const savedDesigns = pgTable("saved_designs", {
  id: text("id").primaryKey(), // UUID
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  problemId: text("problem_id"),
  nodes: jsonb("nodes").notNull().default([]),
  edges: jsonb("edges").notNull().default([]),
  strokes: jsonb("strokes").notNull().default([]),
  annotations: jsonb("annotations").notNull().default([]),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// ─── Scores ──────────────────────────────────────────────────────────
export const scores = pgTable(
  "scores",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    problemId: text("problem_id").notNull(),
    designId: text("design_id").references(() => savedDesigns.id, {
      onDelete: "set null",
    }),
    // { scalability, reliability, performance, cost, operability } each 0-20
    axes: jsonb("axes").notNull(),
    total: integer("total").notNull(),          // 0-100
    verdict: text("verdict").notNull(),          // "Strong Hire" | "Hire" | "Lean Hire" | "Borderline" | "No Hire"
    durationSec: integer("duration_sec"),        // interview duration in seconds
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    index("scores_user_idx").on(t.userId),
    index("scores_problem_idx").on(t.problemId),
    index("scores_user_problem_idx").on(t.userId, t.problemId),
  ],
);

// ─── Types ───────────────────────────────────────────────────────────
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type SavedDesign = typeof savedDesigns.$inferSelect;
export type NewSavedDesign = typeof savedDesigns.$inferInsert;
export type Score = typeof scores.$inferSelect;
export type NewScore = typeof scores.$inferInsert;
