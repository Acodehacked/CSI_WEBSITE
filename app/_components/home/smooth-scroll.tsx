"use client";

import Lenis from "lenis";
import { useReducedMotion } from "motion/react";
import { type ReactNode, useEffect } from "react";

/**
 * Inertial scrolling for the landing page. Lenis drives the native scroll
 * position, so `useScroll` and sticky sections keep working unchanged.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) {
      return;
    }
    const lenis = new Lenis({
      anchors: { offset: 0 },
      duration: 1.15,
      easing: (t) => 1 - Math.pow(1 - t, 4),
    });
    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);
    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, [reduceMotion]);

  return children;
}
