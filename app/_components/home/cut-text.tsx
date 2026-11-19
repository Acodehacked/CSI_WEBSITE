"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { EASE } from "./reveal";

const REACH = 140; // px beyond the heading where the cursor still cuts
const SPLIT = 0.16; // max opening, as a fraction of the font size
const SPREAD = 1.5; // horizontal falloff, in font sizes
const SHEAR = 0.3; // sideways slip of each half, relative to the opening
const EASING = 0.16; // per-frame approach toward the target opening

/**
 * Heading that splits along its midline where the cursor passes: the top
 * halves of nearby letters lift and the bottom halves drop, as if the line
 * were sliced. Each letter is drawn twice and clipped to one half; an
 * invisible copy holds the layout. Lines also rise in on first view.
 */
export function CutText({
  className,
  lines,
}: {
  className?: string;
  lines: string[];
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const root = ref.current;
    if (!root || reduceMotion) {
      return;
    }
    const glyphs = Array.from(root.querySelectorAll<HTMLElement>("[data-cut]"));
    const openings = glyphs.map(() => 0);
    const pointer = { x: 0, y: 0, inside: false };
    let frame = 0;
    let running = false;

    const step = () => {
      const fontSize = Number.parseFloat(getComputedStyle(root).fontSize) || 32;
      const box = root.getBoundingClientRect();
      const near =
        pointer.inside &&
        pointer.x > box.left - REACH &&
        pointer.x < box.right + REACH &&
        pointer.y > box.top - REACH &&
        pointer.y < box.bottom + REACH;

      let moving = false;
      glyphs.forEach((glyph, i) => {
        let target = 0;
        if (near) {
          const rect = glyph.getBoundingClientRect();
          const dx =
            (pointer.x - (rect.left + rect.width / 2)) / (fontSize * SPREAD);
          const dy =
            (pointer.y - (rect.top + rect.height / 2)) / (fontSize * 1.2);
          target = fontSize * SPLIT * Math.exp(-(dx * dx) - dy * dy);
        }
        const next = openings[i] + (target - openings[i]) * EASING;
        openings[i] = Math.abs(next) < 0.01 ? 0 : next;
        if (openings[i] !== 0 || target !== 0) {
          moving = true;
        }
        glyph.style.setProperty("--cut", openings[i].toFixed(2));
        glyph.style.setProperty("--slip", (openings[i] * SHEAR).toFixed(2));
      });

      if (moving) {
        frame = requestAnimationFrame(step);
      } else {
        running = false;
      }
    };

    const wake = () => {
      if (!running) {
        running = true;
        frame = requestAnimationFrame(step);
      }
    };
    const onMove = (event: PointerEvent) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.inside = true;
      wake();
    };
    const onLeave = () => {
      pointer.inside = false;
      wake();
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, [reduceMotion]);

  return (
    <span className={cn("block", className)} ref={ref}>
      <span className="sr-only">{lines.join(" ")}</span>
      {lines.map((line, row) => (
        <motion.span
          aria-hidden="true"
          className="block whitespace-nowrap"
          initial={{ filter: "blur(8px)", opacity: 0, y: "40%" }}
          key={line}
          transition={{ delay: row * 0.1, duration: 1.1, ease: EASE }}
          viewport={{ margin: "-10% 0px", once: true }}
          whileInView={{ filter: "blur(0px)", opacity: 1, y: "0%" }}
        >
          {Array.from(line, (char, i) => (
            <span
              className="relative inline-block whitespace-pre"
              data-cut=""
              key={`${char}-${i}`}
            >
              <span className="invisible">{char}</span>
              <span
                className="absolute inset-0 [clip-path:inset(-20%_-10%_50%_-10%)]"
                style={{
                  transform:
                    "translate3d(calc(var(--slip, 0) * -1px), calc(var(--cut, 0) * -1px), 0)",
                }}
              >
                {char}
              </span>
              <span
                className="absolute inset-0 [clip-path:inset(50%_-10%_-20%_-10%)]"
                style={{
                  transform:
                    "translate3d(calc(var(--slip, 0) * 1px), calc(var(--cut, 0) * 1px), 0)",
                }}
              >
                {char}
              </span>
            </span>
          ))}
        </motion.span>
      ))}
    </span>
  );
}
