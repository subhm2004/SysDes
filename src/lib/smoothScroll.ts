const NAV_OFFSET_PX = 88;

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/** Slow eased scroll — respects fixed landing nav offset. */
export function smoothScrollToId(id: string, durationMs = 950) {
  const el = document.getElementById(id);
  if (!el) return;

  const prefersReduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReduced) {
    el.scrollIntoView({ block: "start" });
    return;
  }

  const startY = window.scrollY;
  const targetY = el.getBoundingClientRect().top + window.scrollY - NAV_OFFSET_PX;
  const distance = targetY - startY;
  if (Math.abs(distance) < 2) return;

  const startTime = performance.now();

  function frame(now: number) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / durationMs, 1);
    window.scrollTo(0, startY + distance * easeInOutCubic(progress));
    if (progress < 1) requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
}
