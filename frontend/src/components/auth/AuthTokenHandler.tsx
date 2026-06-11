"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";

/**
 * Extracts the JWT token from the URL after Google OAuth redirect.
 * The backend redirects to /studio?token=... after successful auth.
 */
export function AuthTokenHandler() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      // Decode JWT payload (without verification — backend already verified)
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        useAuthStore.getState().setAuth(token, {
          userId: payload.userId,
          email: payload.email,
          name: payload.name,
          image: payload.image || null,
        });
      } catch {
        console.error("Failed to parse auth token");
      }

      // Clean URL
      params.delete("token");
      const q = params.toString();
      const clean = window.location.pathname + (q ? `?${q}` : "") + window.location.hash;
      window.history.replaceState({}, "", clean);
    }
  }, []);

  return null;
}
