"use client";

import { useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/<>_#";
const FRAME_MS = 32;

/**
 * Mono label that decodes from noise the first time it scrolls into view.
 * The resolved text is always what screen readers get.
 */
export function ScrambleText({
  className,
  delay = 0,
  text,
}: {
  className?: string;
  delay?: number;
  text: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const reduceMotion = useReducedMotion();
  const [display, setDisplay] = useState(text);

  useEffect(() => {
    if (!inView || reduceMotion) {
      return;
    }
    let frame = 0;
    const total = Math.max(text.length * 1.6, 14);
    let interval: ReturnType<typeof setInterval> | undefined;
    const timeout = setTimeout(() => {
      interval = setInterval(() => {
        frame += 1;
        const settled = Math.floor((frame / total) * text.length);
        setDisplay(
          Array.from(text, (char, i) => {
            if (i < settled || char === " ") {
              return char;
            }
            return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          }).join(""),
        );
        if (frame >= total) {
          clearInterval(interval);
          setDisplay(text);
        }
      }, FRAME_MS);
    }, delay * 1000);
    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [delay, inView, reduceMotion, text]);

  return (
    <span className={className} ref={ref}>
      <span aria-hidden="true">{display}</span>
      <span className="sr-only">{text}</span>
    </span>
  );
}
