/**
 * Studio look & feel.
 *
 * Colors: primary tokens live in src/app/globals.css (:root / .dark --primary).
 * Accent utility classes use Tailwind `cyan-*` in studio components.
 *
 * Fonts: change Geist in src/app/layout.tsx (import + variable on <html>).
 * Optional: add a display font only for headings inside .studio-app in globals.css.
 */
export const STUDIO_THEME = {
  /** Tailwind color family used for accents in /studio (not the marketing landing page). */
  accent: "cyan" as const,
} as const;
