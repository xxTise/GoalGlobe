"use client";

import { memo, useEffect, useRef } from "react";

/**
 * Canvas-based starfield behind the map.
 * Adapts star count to device capability.
 * Static render — no animation loop, zero ongoing cost.
 */
export const Starfield = memo(function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const isMobile = window.innerWidth < 768;
    const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1 : 2);

    function draw() {
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas!.width = w * dpr;
      canvas!.height = h * dpr;
      ctx!.scale(dpr, dpr);

      // Deep space background
      ctx!.fillStyle = "#04040c";
      ctx!.fillRect(0, 0, w, h);

      // Center glow
      const gradient = ctx!.createRadialGradient(
        w / 2, h / 2, 0,
        w / 2, h / 2, Math.max(w, h) * 0.5
      );
      gradient.addColorStop(0, "rgba(15, 20, 40, 0.4)");
      gradient.addColorStop(1, "transparent");
      ctx!.fillStyle = gradient;
      ctx!.fillRect(0, 0, w, h);

      // Stars — reduced on mobile
      const starCount = isMobile ? 120 : 300;
      for (let i = 0; i < starCount; i++) {
        const x = Math.random() * w;
        const y = Math.random() * h;
        const radius = Math.random() * 1.2 + 0.2;
        const opacity = Math.random() * 0.6 + 0.1;
        ctx!.beginPath();
        ctx!.arc(x, y, radius, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(200, 210, 240, ${opacity})`;
        ctx!.fill();
      }

      // Bright stars — fewer on mobile, skip glow effect
      const brightCount = isMobile ? 6 : 15;
      for (let i = 0; i < brightCount; i++) {
        const x = Math.random() * w;
        const y = Math.random() * h;
        const radius = Math.random() * 1.5 + 0.8;
        ctx!.beginPath();
        ctx!.arc(x, y, radius, 0, Math.PI * 2);
        ctx!.fillStyle = "rgba(220, 230, 255, 0.7)";
        ctx!.fill();

        if (!isMobile) {
          const glow = ctx!.createRadialGradient(x, y, 0, x, y, radius * 4);
          glow.addColorStop(0, "rgba(180, 200, 255, 0.15)");
          glow.addColorStop(1, "transparent");
          ctx!.fillStyle = glow;
          ctx!.fillRect(x - radius * 4, y - radius * 4, radius * 8, radius * 8);
        }
      }
    }

    draw();

    // Debounced resize
    let resizeTimer: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(draw, 500);
    };

    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      clearTimeout(resizeTimer);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0"
      style={{ width: "100%", height: "100%" }}
    />
  );
});
