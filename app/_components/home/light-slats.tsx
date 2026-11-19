"use client";

import { useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";

const MAX_DPR = 1.5;
const GAP = 5; // dark seam between slats, CSS px
const EDGE = 0.22; // fraction of a slat's height shaded at top and bottom

/** Each slat holds its own drifting glows. */
interface Glow {
  phase: number;
  speed: number;
  span: number; // width as a fraction of the viewport
  strength: number;
}

interface Slat {
  glows: Glow[];
}

const hash = (n: number) => {
  const v = Math.sin(n * 127.1 + 311.7) * 43_758.545_3;
  return v - Math.floor(v);
};

const makeSlats = (count: number): Slat[] =>
  Array.from({ length: count }, (_, i) => ({
    glows: [0, 1].map((k) => ({
      phase: hash(i * 7 + k) * Math.PI * 2,
      span: 0.16 + hash(i * 13 + k) * 0.3,
      speed: 0.06 + hash(i * 3 + k) * 0.12,
      strength: 0.45 + hash(i * 5 + k) * 0.55,
    })),
  }));

/** White core → pale periwinkle → accent blue → nothing. */
const paintGlow = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  rx: number,
  ry: number,
  alpha: number,
) => {
  if (alpha <= 0.01 || rx <= 0 || ry <= 0) {
    return;
  }
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(rx / ry, 1);
  const g = ctx.createRadialGradient(0, 0, 0, 0, 0, ry);
  g.addColorStop(0, `rgba(255,255,255,${alpha})`);
  g.addColorStop(0.22, `rgba(200,204,255,${alpha * 0.9})`);
  g.addColorStop(0.55, `rgba(98,104,255,${alpha * 0.55})`);
  g.addColorStop(1, "rgba(60,64,220,0)");
  ctx.fillStyle = g;
  ctx.fillRect(-ry, -ry, ry * 2, ry * 2);
  ctx.restore();
};

/**
 * Light read through horizontal slats. Soft blue glows drift sideways inside
 * each slat, a broad light sweeps across all of them, and the pointer carries
 * its own lamp. Pauses off screen; draws one still frame for reduced motion.
 */
export function LightSlats({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!(canvas && ctx)) {
      return;
    }

    let width = 1;
    let height = 1;
    let slatHeight = 90;
    let slats: Slat[] = [];
    let frame = 0;
    let visible = true;
    const pointer = { active: 0, targetX: 0.5, targetY: 0.5, x: 0.5, y: 0.5 };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.max(6, Math.round(height / 92));
      slatHeight = height / count;
      if (slats.length !== count) {
        slats = makeSlats(count);
      }
    };

    const draw = (time: number) => {
      const t = time / 1000;
      pointer.x += (pointer.targetX - pointer.x) * 0.06;
      pointer.y += (pointer.targetY - pointer.y) * 0.06;

      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "#020310";
      ctx.fillRect(0, 0, width, height);

      // A broad light that sweeps slowly across the whole blind.
      const sweepX = width * (0.62 + 0.3 * Math.sin(t * 0.07));
      const sweepY = height * (0.22 + 0.12 * Math.sin(t * 0.05 + 1));

      slats.forEach((slat, row) => {
        const top = row * slatHeight;
        const h = slatHeight - GAP;
        const cy = top + h / 2;
        // Lower slats sit in more shadow so the copy over them stays legible.
        const depth = 1 - (row / Math.max(1, slats.length - 1)) * 0.55;

        ctx.save();
        ctx.beginPath();
        ctx.rect(0, top, width, h);
        ctx.clip();

        ctx.globalCompositeOperation = "source-over";
        ctx.fillStyle = `rgba(26,30,104,${0.85 * depth})`;
        ctx.fillRect(0, top, width, h);

        ctx.globalCompositeOperation = "lighter";
        for (const glow of slat.glows) {
          const x = width * (0.5 + 0.55 * Math.sin(t * glow.speed + glow.phase));
          const pulse = 0.75 + 0.25 * Math.sin(t * glow.speed * 2.3 + glow.phase);
          paintGlow(
            ctx,
            x,
            cy,
            width * glow.span,
            h * 0.42,
            glow.strength * pulse * depth * 0.8,
          );
        }
        paintGlow(ctx, sweepX, sweepY, width * 0.42, height * 0.38, 0.32 * depth);
        if (pointer.active > 0.01) {
          paintGlow(
            ctx,
            pointer.x * width,
            pointer.y * height,
            width * 0.16,
            slatHeight * 1.1,
            0.55 * pointer.active,
          );
        }

        // Rounded slat edges: shade top and bottom toward the seam.
        ctx.globalCompositeOperation = "source-over";
        const shade = ctx.createLinearGradient(0, top, 0, top + h);
        shade.addColorStop(0, "rgba(2,3,16,0.95)");
        shade.addColorStop(EDGE, "rgba(2,3,16,0)");
        shade.addColorStop(1 - EDGE, "rgba(2,3,16,0)");
        shade.addColorStop(1, "rgba(2,3,16,0.95)");
        ctx.fillStyle = shade;
        ctx.fillRect(0, top, width, h);
        ctx.restore();
      });
    };

    const tick = (time: number) => {
      draw(time);
      frame = requestAnimationFrame(tick);
    };
    const start = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(tick);
    };
    const stop = () => cancelAnimationFrame(frame);

    resize();
    if (reduceMotion) {
      draw(8000);
    } else {
      start();
    }

    const resizeObserver = new ResizeObserver(() => {
      resize();
      if (reduceMotion) {
        draw(8000);
      }
    });
    resizeObserver.observe(canvas);

    const sync = () => {
      if (reduceMotion) {
        return;
      }
      if (visible && document.visibilityState === "visible") {
        start();
      } else {
        stop();
      }
    };
    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    });
    intersection.observe(canvas);
    document.addEventListener("visibilitychange", sync);

    const onMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.targetX = (event.clientX - rect.left) / rect.width;
      pointer.targetY = (event.clientY - rect.top) / rect.height;
      pointer.active = 1;
    };
    const onLeave = () => {
      pointer.active = 0;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);

    return () => {
      stop();
      resizeObserver.disconnect();
      intersection.disconnect();
      document.removeEventListener("visibilitychange", sync);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, [reduceMotion]);

  return <canvas aria-hidden="true" className={className} ref={canvasRef} />;
}
