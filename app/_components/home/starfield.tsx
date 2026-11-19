"use client";

import { type MotionValue, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";

const MAX_DPR = 2;
const STAR_DENSITY = 1 / 1400; // stars per CSS pixel of area
const MAX_STARS = 1100;
const DEPTH = 1;
const NEAR = 0.04;
const BASE_SPEED = 0.018; // depth units per second while drifting
const WARP_SPEED = 0.55; // extra depth units per second at full warp
const SWIRL = 0.025; // radians per second the whole sky turns
const SHOOTING_CHANCE = 0.35; // expected shooting stars per second
const TINTS = ["255,255,255", "205,222,255", "170,200,255", "255,236,210"];

interface Star {
  x: number;
  y: number;
  z: number;
  size: number;
  tint: string;
  phase: number;
  twinkle: number;
}

interface Meteor {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  ttl: number;
}

const spawnStar = (star: Partial<Star> = {}, far = false): Star => ({
  phase: Math.random() * Math.PI * 2,
  size: 0.4 + Math.random() ** 3 * 1.6,
  tint: TINTS[Math.floor(Math.random() * TINTS.length)],
  twinkle: 0.6 + Math.random() * 2.4,
  x: (Math.random() * 2 - 1) * 1.4,
  y: (Math.random() * 2 - 1) * 1.4,
  z: far ? DEPTH : NEAR + Math.random() * (DEPTH - NEAR),
  ...star,
});

/**
 * Night sky that flows toward the viewer. Stars sit in a shallow 3D volume
 * that slowly turns and drifts forward; `warp` (0 – 1) speeds the drift up
 * and stretches stars into streaks. The occasional meteor crosses the sky.
 */
export function Starfield({
  className,
  warp,
}: {
  className?: string;
  warp?: MotionValue<number>;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!(canvas && context)) {
      return;
    }

    let width = 1;
    let height = 1;
    let stars: Star[] = [];
    const meteors: Meteor[] = [];
    let frame = 0;
    let visible = true;
    let last = performance.now();
    let angle = 0;
    let pointerX = 0;
    let pointerY = 0;
    let parallaxX = 0;
    let parallaxY = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      const target = Math.min(
        MAX_STARS,
        Math.round(width * height * STAR_DENSITY),
      );
      if (stars.length > target) {
        stars = stars.slice(0, target);
      }
      while (stars.length < target) {
        stars.push(spawnStar());
      }
    };

    const draw = (dt: number) => {
      const w = warp?.get() ?? 0;
      const speed = BASE_SPEED + WARP_SPEED * w * w;
      const cx = width / 2 + parallaxX;
      const cy = height / 2 + parallaxY;
      const fov = Math.max(width, height) * 0.5;
      const time = performance.now() / 1000;

      angle += SWIRL * dt;
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);

      context.clearRect(0, 0, width, height);
      context.lineCap = "round";

      for (const star of stars) {
        const previousZ = star.z;
        star.z -= speed * dt;
        if (star.z <= NEAR) {
          Object.assign(star, spawnStar({}, true));
          continue;
        }

        const rx = star.x * cos - star.y * sin;
        const ry = star.x * sin + star.y * cos;
        const sx = cx + (rx / star.z) * fov;
        const sy = cy + (ry / star.z) * fov;
        if (sx < -20 || sx > width + 20 || sy < -20 || sy > height + 20) {
          if (star.z < DEPTH * 0.6) {
            Object.assign(star, spawnStar({}, true));
          }
          continue;
        }

        const nearness = 1 - star.z / DEPTH;
        const twinkle =
          0.55 + 0.45 * Math.sin(time * star.twinkle + star.phase);
        const alpha = Math.min(1, (0.15 + nearness * 1.1) * twinkle);
        const radius = star.size * (0.4 + nearness * 1.4);

        // Streak length follows the distance travelled this frame, so stars
        // stay points while drifting and stretch only under warp.
        const px = cx + (rx / previousZ) * fov;
        const py = cy + (ry / previousZ) * fov;
        const streak = Math.hypot(sx - px, sy - py) * (1 + w * 6);

        if (streak > radius * 1.5) {
          const dx = (sx - px) / (Math.hypot(sx - px, sy - py) || 1);
          const dy = (sy - py) / (Math.hypot(sx - px, sy - py) || 1);
          context.strokeStyle = `rgba(${star.tint},${alpha.toFixed(3)})`;
          context.lineWidth = radius;
          context.beginPath();
          context.moveTo(sx - dx * streak, sy - dy * streak);
          context.lineTo(sx, sy);
          context.stroke();
        } else {
          context.fillStyle = `rgba(${star.tint},${alpha.toFixed(3)})`;
          context.beginPath();
          context.arc(sx, sy, radius, 0, Math.PI * 2);
          context.fill();
        }
      }

      // Meteors
      if (Math.random() < SHOOTING_CHANCE * dt * (1 - w)) {
        const fromLeft = Math.random() < 0.5;
        const velocity = 700 + Math.random() * 500;
        const dir = (fromLeft ? 1 : -1) * (0.35 + Math.random() * 0.25);
        meteors.push({
          life: 0,
          ttl: 0.6 + Math.random() * 0.6,
          vx: Math.cos(dir) * velocity * (fromLeft ? 1 : -1),
          vy: Math.abs(Math.sin(dir)) * velocity,
          x: fromLeft
            ? Math.random() * width * 0.5
            : width * (0.5 + Math.random() * 0.5),
          y: Math.random() * height * 0.4,
        });
      }
      for (let i = meteors.length - 1; i >= 0; i--) {
        const m = meteors[i];
        m.life += dt;
        m.x += m.vx * dt;
        m.y += m.vy * dt;
        const t = m.life / m.ttl;
        if (t >= 1) {
          meteors.splice(i, 1);
          continue;
        }
        const fade = Math.sin(t * Math.PI);
        const tail = 0.12;
        const gradient = context.createLinearGradient(
          m.x,
          m.y,
          m.x - m.vx * tail,
          m.y - m.vy * tail,
        );
        gradient.addColorStop(
          0,
          `rgba(255,255,255,${(0.9 * fade).toFixed(3)})`,
        );
        gradient.addColorStop(1, "rgba(160,200,255,0)");
        context.strokeStyle = gradient;
        context.lineWidth = 1.3;
        context.beginPath();
        context.moveTo(m.x, m.y);
        context.lineTo(m.x - m.vx * tail, m.y - m.vy * tail);
        context.stroke();
      }
    };

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      parallaxX += (pointerX - parallaxX) * 0.04;
      parallaxY += (pointerY - parallaxY) * 0.04;
      draw(dt);
      frame = requestAnimationFrame(tick);
    };

    const start = () => {
      cancelAnimationFrame(frame);
      last = performance.now();
      frame = requestAnimationFrame(tick);
    };

    resize();
    if (reduceMotion) {
      draw(0);
    } else {
      start();
    }

    const resizeObserver = new ResizeObserver(() => {
      resize();
      if (reduceMotion) {
        draw(0);
      }
    });
    resizeObserver.observe(canvas);

    // Stop drawing while the sky is off screen or the tab is hidden.
    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (reduceMotion) {
        return;
      }
      if (visible && document.visibilityState === "visible") {
        start();
      } else {
        cancelAnimationFrame(frame);
      }
    });
    intersection.observe(canvas);
    const onVisibility = () => {
      if (reduceMotion) {
        return;
      }
      if (visible && document.visibilityState === "visible") {
        start();
      } else {
        cancelAnimationFrame(frame);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    const onPointer = (event: PointerEvent) => {
      pointerX = (event.clientX / window.innerWidth - 0.5) * -40;
      pointerY = (event.clientY / window.innerHeight - 0.5) * -40;
    };
    window.addEventListener("pointermove", onPointer, { passive: true });

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersection.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pointermove", onPointer);
    };
  }, [reduceMotion, warp]);

  return <canvas aria-hidden="true" className={className} ref={canvasRef} />;
}
