import "dotenv/config";
import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import designRoutes from "./routes/designs.js";
import aiRoutes from "./routes/ai.js";
import scoreRoutes from "./routes/scores.js";

const app = express();
const PORT = parseInt(process.env.PORT || "4000", 10);
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

// ─── Middleware ───────────────────────────────────────────────────────
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));

// ─── Health check ────────────────────────────────────────────────────
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ─── Routes ──────────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/designs", designRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/scores", scoreRoutes);

// ─── Start ───────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`
  ╔══════════════════════════════════════════╗
  ║  SysDes Backend running on port ${PORT}     ║
  ║  Health: http://localhost:${PORT}/api/health ║
  ╚══════════════════════════════════════════╝
  `);
});

export default app;
