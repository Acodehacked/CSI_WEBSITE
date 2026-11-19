"use client";

import {
  type MotionValue,
  motion,
  useScroll,
  useTransform,
} from "motion/react";
import { useRef } from "react";
import { vision } from "./content";
import { Starfield } from "./starfield";

const WORDS = vision.split(" ");
const REVEAL_START = 0.42;
const REVEAL_END = 0.78;

function Word({
  index,
  progress,
  word,
}: {
  index: number;
  progress: MotionValue<number>;
  word: string;
}) {
  const span = (REVEAL_END - REVEAL_START) / WORDS.length;
  const start = REVEAL_START + index * span;
  const opacity = useTransform(progress, [start, start + span * 3], [0.12, 1]);
  const blur = useTransform(progress, [start, start + span * 3], [8, 0]);
  const filter = useTransform(blur, (v) => `blur(${v}px)`);
  return (
    <motion.span className="inline-block" style={{ filter, opacity }}>
      {word}&nbsp;
    </motion.span>
  );
}

export function Vision() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    offset: ["start start", "end end"],
    target: ref,
  });

  // Drift → jump to warp → settle into a calm sky as the sentence resolves.
  const warp = useTransform(
    scrollYProgress,
    [0, 0.12, 0.3, 0.46, 1],
    [0, 0.25, 1, 0.08, 0.04],
  );
  const skyOpacity = useTransform(scrollYProgress, [0, 0.08], [0, 1]);
  const glowScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.7, 1.15, 1]);
  const glowOpacity = useTransform(
    scrollYProgress,
    [0.1, 0.35, 0.9, 1],
    [0, 0.9, 0.6, 0],
  );
  const chromeOpacity = useTransform(scrollYProgress, [0.4, 0.52], [0, 1]);
  const exit = useTransform(scrollYProgress, [0.9, 1], [1, 0.4]);

  return (
    <section
      aria-label="Vision"
      className="relative h-[300vh] bg-black"
      id="vision"
      ref={ref}
    >
      <div className="sticky top-0 h-svh overflow-hidden">
        <motion.div className="absolute inset-0" style={{ opacity: exit }}>
          {/* Faint nebula behind the stars */}
          <motion.div
            aria-hidden="true"
            className="absolute inset-0"
            style={{ opacity: glowOpacity, scale: glowScale }}
          >
            <div className="absolute top-1/2 left-1/2 h-[90vmin] w-[140vmin] -translate-x-1/2 -translate-y-1/2 -rotate-12 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(60,96,170,0.35),rgba(30,40,90,0.18)_40%,transparent_70%)] blur-2xl" />
            <div className="absolute top-[38%] left-[62%] h-[50vmin] w-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(120,80,170,0.18),transparent_70%)] blur-2xl" />
          </motion.div>

          <motion.div
            className="absolute inset-0"
            style={{ opacity: skyOpacity }}
          >
            <Starfield className="h-full w-full" warp={warp} />
          </motion.div>

          {/* Vignette keeps the edges deep and the copy legible */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(0,0,0,0.75)_100%)]"
          />

          <div className="absolute inset-0 flex items-center justify-center px-6">
            <p className="max-w-[24ch] text-center text-[clamp(1.25rem,2.5vw,2.25rem)] leading-[1.12] font-light tracking-[-0.03em] text-white">
              {WORDS.map((word, i) => (
                <Word
                  index={i}
                  key={`${word}-${i}`}
                  progress={scrollYProgress}
                  word={word}
                />
              ))}
            </p>
          </div>

          <motion.div
            className="absolute inset-x-0 bottom-[16%] flex justify-center"
            style={{ opacity: chromeOpacity }}
          >
            <a
              className="inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1.5 font-mono text-[9px] tracking-[0.18em] text-black uppercase transition-colors hover:bg-[#bcd6ff]"
              href="#join"
            >
              Join us
              <span className="size-1.5 rounded-full border border-black" />
            </a>
          </motion.div>

          <motion.p
            className="absolute right-5 bottom-6 hidden items-center gap-2 font-mono text-[8px] tracking-[0.18em] text-white/60 uppercase md:right-8 md:flex md:text-[9px]"
            style={{ opacity: chromeOpacity }}
          >
            <span className="size-1.5 rounded-full border border-white/70" />
            Scroll to explore
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
