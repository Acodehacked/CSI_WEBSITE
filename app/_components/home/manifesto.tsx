"use client";

import {
  type MotionValue,
  motion,
  useScroll,
  useTransform,
} from "motion/react";
import { useRef } from "react";
import { LogoMark } from "./logo-mark";
import { SignalBars } from "./signal-bars";

/** Fades a line in at `start` and out near the end of the pinned span. */
const useLine = (progress: MotionValue<number>, start: number) =>
  useTransform(progress, [start, start + 0.12, 0.82, 0.94], [0, 1, 1, 0]);

export function Manifesto() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    offset: ["start start", "end end"],
    target: ref,
  });

  const gap = useTransform(scrollYProgress, [0.02, 0.5], [34, 4]);
  const gapEm = useTransform(gap, (v) => `${v}vw`);
  const markScale = useTransform(
    scrollYProgress,
    [0, 0.3, 0.94],
    [0.5, 1, 0.8],
  );
  const markRotate = useTransform(scrollYProgress, [0, 1], [-30, 30]);
  const markOpacity = useLine(scrollYProgress, 0);
  const line1 = useLine(scrollYProgress, 0.04);
  const line2 = useLine(scrollYProgress, 0.16);
  const line3 = useLine(scrollYProgress, 0.28);
  const note = useLine(scrollYProgress, 0.42);
  const noteY = useTransform(scrollYProgress, [0.42, 0.56], [16, 0]);

  return (
    <section
      aria-label="Manifesto"
      className="relative h-[260vh] bg-black"
      id="manifesto"
      ref={ref}
    >
      <div className="sticky top-0 flex h-svh flex-col items-center justify-center gap-16 overflow-hidden px-5">
        <div className="flex items-center gap-6 md:gap-8">
          <motion.div
            style={{
              opacity: markOpacity,
              rotate: markRotate,
              scale: markScale,
            }}
          >
            <LogoMark
              alt="Computer Society of India, established 1965"
              className="size-16"
            />
          </motion.div>

          <p className="font-mono text-[clamp(1rem,1.9vw,1.5rem)] leading-[1.15] tracking-[0.04em] text-white uppercase">
            <motion.span
              className="flex justify-between"
              style={{ columnGap: gapEm, opacity: line1 }}
            >
              <span>We</span>
              <span>are</span>
            </motion.span>
            <motion.span className="block" style={{ opacity: line2 }}>
              builders of
            </motion.span>
            <motion.span className="block" style={{ opacity: line3 }}>
              tomorrow
            </motion.span>
          </p>
        </div>

        <motion.p
          className="max-w-[46ch] text-center text-[15px] md:text-[12px] leading-relaxed text-white/45"
          style={{ opacity: note, y: noteY }}
        >
          A student-run chapter of the Computer Society of India - the
          country&apos;s first and largest body of computer professionals -
          based at St. Joseph&apos;s College of Engineering and Technology,
          Palai.
        </motion.p>

        <motion.div style={{ opacity: note }}>
          <SignalBars />
        </motion.div>
      </div>
    </section>
  );
}
