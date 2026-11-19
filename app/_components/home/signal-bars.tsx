"use client";

import { motion, useReducedMotion } from "motion/react";

const BARS = 15;
const PERIOD = 1.6;

/**
 * A row of hairline bars with a wave rolling through them, like a signal
 * being received. Each bar runs the same pulse, offset in time, so the crest
 * travels left to right.
 */
export function SignalBars({ className }: { className?: string }) {
  const reduceMotion = useReducedMotion();

  return (
    <div
      aria-hidden="true"
      className={`flex h-10 items-center gap-[15px] ${className ?? ""}`}
    >
      {Array.from({ length: BARS }, (_, i) => (
        <motion.span
          animate={reduceMotion ? undefined : { scaleY: [0.06, 1, 0.06] }}
          className="block h-full w-px origin-center bg-gradient-to-b from-transparent via-[#9dbb63] to-transparent"
          initial={{ scaleY: reduceMotion ? 0.5 : 0.06 }}
          key={i}
          transition={{
            delay: (i / BARS) * PERIOD,
            duration: PERIOD,
            ease: "easeInOut",
            repeat: Number.POSITIVE_INFINITY,
            repeatDelay: PERIOD * 0.35,
          }}
        />
      ))}
    </div>
  );
}
