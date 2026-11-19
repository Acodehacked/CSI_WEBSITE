"use client";

import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "motion/react";
import { type ReactNode, useEffect, useRef } from "react";

export const EASE = [0.22, 1, 0.36, 1] as const;

/** Fades and lifts its children the first time they enter the viewport. */
export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      transition={{ delay, duration: 1.1, ease: EASE }}
      viewport={{ margin: "-12% 0px", once: true }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      {children}
    </motion.div>
  );
}

/** Text that rises line by line out of a clipped baseline. */
export function RevealLines({
  className,
  lines,
}: {
  className?: string;
  lines: string[];
}) {
  return (
    <span className={className}>
      {lines.map((line, i) => (
        <span className="block overflow-hidden pb-[0.1em]" key={line}>
          <motion.span
            className="block"
            initial={{ y: "105%" }}
            transition={{ delay: i * 0.09, duration: 1.1, ease: EASE }}
            viewport={{ margin: "-10% 0px", once: true }}
            whileInView={{ y: "0%" }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

/** Counts up to `value` once visible. */
export function CountUp({ pad = 0, value }: { pad?: number; value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { margin: "-10% 0px", once: true });
  const reduceMotion = useReducedMotion();
  const count = useMotionValue(0);
  const text = useTransform(count, (v) =>
    String(Math.round(v)).padStart(pad, "0"),
  );

  useEffect(() => {
    if (!inView) {
      return;
    }
    if (reduceMotion) {
      count.set(value);
      return;
    }
    const controls = animate(count, value, { duration: 2.2, ease: EASE });
    return () => controls.stop();
  }, [count, inView, reduceMotion, value]);

  return (
    <span className="tabular-nums" ref={ref}>
      <motion.span aria-hidden="true">{text}</motion.span>
      <span className="sr-only">{value}</span>
    </span>
  );
}
