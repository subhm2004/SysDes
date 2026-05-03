"use client";

import { useEffect, useRef } from "react";

/**
 * Full-viewport particle + edge mesh (similar to standalone landing HTML).
 * Colors adapt when `document.documentElement` toggles `dark`.
 */
export function LandingNodeMesh() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    if (!c.getContext("2d")) return; /* ensure 2d before animating */

    const nodes: { x: number; y: number; vx: number; vy: number; r: number }[] = [];
    let raf = 0;
    let dark = document.documentElement.classList.contains("dark");

    const observer = new MutationObserver(() => {
      dark = document.documentElement.classList.contains("dark");
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    function size() {
      const cv = canvasRef.current;
      if (!cv) return;
      const w = window.innerWidth;
      const h = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      cv.width = Math.floor(w * dpr);
      cv.height = Math.floor(h * dpr);
      cv.style.width = `${w}px`;
      cv.style.height = `${h}px`;
      const context = cv.getContext("2d");
      if (!context) return;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (nodes.length === 0) {
        for (let i = 0; i < 18; i++) {
          nodes.push({
            x: Math.random() * w,
            y: Math.random() * h,
            vx: (Math.random() - 0.5) * 0.35,
            vy: (Math.random() - 0.5) * 0.35,
            r: Math.random() * 2.5 + 1,
          });
        }
      }
    }

    function draw() {
      const context = canvasRef.current?.getContext("2d");
      if (!context) return;
      const w = window.innerWidth;
      const h = window.innerHeight;
      context.clearRect(0, 0, w, h);

      const nodeFill = dark ? "rgba(124,92,252,0.25)" : "rgba(91,33,182,0.22)";
      const lineBase = dark ? 0.08 : 0.06;

      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;

        for (let j = i + 1; j < nodes.length; j++) {
          const m = nodes[j];
          const dx = n.x - m.x;
          const dy = n.y - m.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 180) {
            const a = lineBase * (1 - dist / 180);
            context.beginPath();
            context.moveTo(n.x, n.y);
            context.lineTo(m.x, m.y);
            context.strokeStyle = dark ? `rgba(124,92,252,${a})` : `rgba(91,33,182,${a})`;
            context.lineWidth = 0.5;
            context.stroke();
          }
        }

        context.beginPath();
        context.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        context.fillStyle = nodeFill;
        context.fill();
      }

      raf = requestAnimationFrame(draw);
    }

    size();
    raf = requestAnimationFrame(draw);
    window.addEventListener("resize", size);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", size);
      observer.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0 h-full w-full"
      aria-hidden
    />
  );
}
