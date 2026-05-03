"use client";

import { Moon, Sun } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { THEME_STORAGE_KEY } from "@/lib/theme";

type ThemeMode = "light" | "dark";

function readStoredTheme(): ThemeMode {
  if (typeof window === "undefined") return "dark";
  try {
    const v = localStorage.getItem(THEME_STORAGE_KEY);
    return v === "light" ? "light" : "dark";
  } catch {
    return "dark";
  }
}

function applyTheme(mode: ThemeMode) {
  document.documentElement.classList.toggle("dark", mode === "dark");
  document.documentElement.style.colorScheme = mode === "dark" ? "dark" : "light";
  try {
    localStorage.setItem(THEME_STORAGE_KEY, mode);
  } catch {
    /* ignore */
  }
}

export function ThemeToggle({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const [mode, setMode] = useState<ThemeMode>("dark");

  // Sync React state from storage. Do not call applyTheme here — the inline
  // theme-init script already set the DOM; a mount effect that applied "dark"
  // from default state was overwriting light mode.
  useEffect(() => {
    setMode(readStoredTheme());
  }, []);

  const toggle = useCallback(() => {
    setMode((m) => {
      const next = m === "dark" ? "light" : "dark";
      applyTheme(next);
      return next;
    });
  }, []);

  const iconClass = size === "lg" ? "size-5" : "size-4";
  const btnSize = size === "sm" ? "icon-sm" : size === "lg" ? "icon-lg" : "icon";

  return (
    <Button
      type="button"
      variant="outline"
      size={btnSize}
      onClick={toggle}
      aria-label={mode === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      className={cn("shrink-0 border-border bg-card/80 shadow-sm backdrop-blur-sm")}
    >
      {mode === "dark" ? <Sun className={iconClass} /> : <Moon className={iconClass} />}
    </Button>
  );
}
