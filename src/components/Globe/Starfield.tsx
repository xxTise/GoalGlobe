"use client";

import { useEffect, useRef } from "react";

/**
 * Canvas-based starfield that sits behind the map.
 * Visible around the globe edges at low zoom levels.
 * Uses a static render — no animation loop, no performance cost.
 */
export function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const w = window.innerWidth;
    const h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);

    // Deep space background
    ctx.fillStyle = "#04040c";
    ctx.fillRect(0, 0, w, h);

    // Subtle radial glow in the center (where the globe sits)
    const gradient = ctx.createRadialGradient(
      w / 2, h / 2, 0,
      w / 2, h / 2, Math.max(w, h) * 0.5
    );
    gradient.addColorStop(0, "rgba(15, 20, 40, 0.4)");
    gradient.addColorStop(1, "transparent");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, w, h);

    // Stars — scattered small dots with varying opacity and size
    const starCount = 300;
    for (let i = 0; i < starCount; i++) {
      const x = Math.random() * w;
      const y = Math.random() * h;
      const radius = Math.random() * 1.2 + 0.2;
      const opacity = Math.random() * 0.6 + 0.1;

      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200, 210, 240, ${opacity})`;
      ctx.fill();
    }

    // A few brighter stars
    for (let i = 0; i < 15; i++) {
      const x = Math.random() * w;
      const y = Math.random() * h;
      const radius = Math.random() * 1.5 + 0.8;

      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(220, 230, 255, 0.7)";
      ctx.fill();

      // Soft glow around bright stars
      const glow = ctx.createRadialGradient(x, y, 0, x, y, radius * 4);
      glow.addColorStop(0, "rgba(180, 200, 255, 0.15)");
      glow.addColorStop(1, "transparent");
      ctx.fillStyle = glow;
      ctx.fillRect(x - radius * 4, y - radius * 4, radius * 8, radius * 8);
    }

    // Resize handler
    const onResize = () => {
      const nw = window.innerWidth;
      const nh = window.innerHeight;
      canvas.width = nw * dpr;
      canvas.height = nh * dpr;
      // Re-render is not critical — the canvas stretches fine
    };

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0"
      style={{ width: "100%", height: "100%" }}
    />
  );
}
