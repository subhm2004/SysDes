import { Router, Request, Response } from "express";
import { google } from "googleapis";
import { db } from "../db/index.js";
import { users } from "../db/schema.js";
import { signToken, requireAuth, type AuthPayload } from "../middleware/auth.js";
import { eq } from "drizzle-orm";

const router = Router();

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "";
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || "";
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";
const BACKEND_URL = process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 4000}`;

function getOAuth2Client() {
  return new google.auth.OAuth2(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    `${BACKEND_URL}/api/auth/google/callback`
  );
}

// ─── GET /api/auth/google ────────────────────────────────────────────
// Redirects user to Google consent screen
router.get("/google", (_req: Request, res: Response) => {
  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
    res.status(503).json({
      error: "Google OAuth not configured. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env",
    });
    return;
  }

  console.log("[auth/google] callback_url =", `${BACKEND_URL}/api/auth/google/callback`);

  const oauth2Client = getOAuth2Client();
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ],
    prompt: "consent",
  });

  res.redirect(url);
});

// ─── GET /api/auth/google/callback ───────────────────────────────────
// Google redirects here after consent
router.get("/google/callback", async (req: Request, res: Response) => {
  const code = req.query.code as string;
  if (!code) {
    res.redirect(`${FRONTEND_URL}?auth_error=no_code`);
    return;
  }

  try {
    const oauth2Client = getOAuth2Client();
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    const oauth2 = google.oauth2({ version: "v2", auth: oauth2Client });
    const { data: profile } = await oauth2.userinfo.get();

    if (!profile.id || !profile.email) {
      res.redirect(`${FRONTEND_URL}?auth_error=no_profile`);
      return;
    }

    // Upsert user in database
    const now = new Date();
    const existing = await db.select().from(users).where(eq(users.id, profile.id)).limit(1);

    if (existing.length === 0) {
      await db.insert(users).values({
        id: profile.id,
        name: profile.name || "User",
        email: profile.email,
        image: profile.picture || null,
        createdAt: now,
        updatedAt: now,
      });
    } else {
      await db
        .update(users)
        .set({
          name: profile.name || existing[0].name,
          image: profile.picture || existing[0].image,
          updatedAt: now,
        })
        .where(eq(users.id, profile.id));
    }

    // Sign JWT
    const payload: AuthPayload = {
      userId: profile.id,
      email: profile.email,
      name: profile.name || "User",
      image: profile.picture || null,
    };
    const token = signToken(payload);

    // Redirect to frontend with token
    res.redirect(`${FRONTEND_URL}/studio?token=${token}`);
  } catch (err) {
    console.error("[auth/google/callback]", err);
    res.redirect(`${FRONTEND_URL}?auth_error=callback_failed`);
  }
});

// ─── GET /api/auth/me ────────────────────────────────────────────────
// Returns current user info (requires auth)
router.get("/me", requireAuth, (req: Request, res: Response) => {
  res.json({ user: req.user });
});

// ─── POST /api/auth/logout ───────────────────────────────────────────
router.post("/logout", (_req: Request, res: Response) => {
  // JWT is stateless — client just needs to delete the token
  res.json({ success: true });
});

export default router;
