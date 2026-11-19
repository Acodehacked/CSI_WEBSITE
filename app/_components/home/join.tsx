"use client";

import {
  type MotionValue,
  motion,
  useScroll,
  useTransform,
} from "motion/react";
import Link from "next/link";
import { useRef } from "react";
import { joinHref, steps } from "./content";
import { MARK_HEIGHT, MARK_PATHS, MARK_WIDTH } from "./csi-mark";
import { CutText } from "./cut-text";
import { LightSlats } from "./light-slats";
import { ScrambleText } from "./scramble-text";

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Scroll windows, as fractions of the pinned span. Each triangle (and its
 * step) gets one window; the finale follows once all four have landed.
 */
const STAGE_START = 0.08;
const STAGE_LENGTH = 0.17;
const FINALE = STAGE_START + STAGE_LENGTH * MARK_PATHS.length; // 0.76

const stageWindow = (i: number) => {
  const start = STAGE_START + i * STAGE_LENGTH;
  return [start, start + STAGE_LENGTH * 0.85] as const;
};

/**
 * Where each triangle flies in from: its own corner, spun. Offsets are in the
 * mark's own units (it is ~213 wide), so these start well off the mark.
 */
const ORIGINS = [
  { rotate: -120, x: -260, y: -210 }, // top-left
  { rotate: 140, x: -280, y: 230 }, // bottom-left
  { rotate: -150, x: 270, y: 240 }, // bottom-right
  { rotate: 110, x: 260, y: -220 }, // top-right
];

function Piece({
  d,
  index,
  progress,
}: {
  d: string;
  index: number;
  progress: MotionValue<number>;
}) {
  const [start, end] = stageWindow(index);
  const origin = ORIGINS[index];
  const x = useTransform(progress, [start, end], [origin.x, 0]);
  const y = useTransform(progress, [start, end], [origin.y, 0]);
  const rotate = useTransform(progress, [start, end], [origin.rotate, 0]);
  const scale = useTransform(progress, [start, end], [0.4, 1]);
  const opacity = useTransform(progress, [start, start + 0.04], [0, 1]);
  // A flash as the piece locks into place.
  const flash = useTransform(
    progress,
    [end - 0.01, end + 0.02, end + 0.1],
    [0, 1, 0.25],
  );

  return (
    <motion.g
      style={{
        opacity,
        rotate,
        scale,
        transformBox: "fill-box",
        transformOrigin: "center",
        x,
        y,
      }}
    >
      <path
        d={d}
        fill="url(#join-glass)"
        stroke="url(#join-rim)"
        strokeLinejoin="round"
        strokeWidth="1.4"
      />
      <motion.path d={d} fill="#c8ccff" style={{ opacity: flash }} />
    </motion.g>
  );
}

function StepRow({
  body,
  index,
  progress,
  title,
}: {
  body: string;
  index: number;
  progress: MotionValue<number>;
  title: string;
}) {
  const [start, end] = stageWindow(index);
  const last = index === MARK_PATHS.length - 1;
  // The step after this one takes over once its piece starts moving.
  const handOff = start + STAGE_LENGTH;
  const fill = useTransform(progress, [start, end], [0, 1]);
  // Upcoming steps wait dim; finished ones settle half-lit; the live one is full.
  const opacity = useTransform(
    progress,
    last
      ? [start - 0.02, start + 0.04]
      : [start - 0.02, start + 0.04, handOff, handOff + 0.04],
    last ? [0.3, 1] : [0.3, 1, 1, 0.5],
  );
  // Only the live step shows its description, so the column never fills up.
  const bodyHeight = useTransform(
    progress,
    last
      ? [start, start + 0.05]
      : [start, start + 0.05, handOff, handOff + 0.04],
    last ? ["0rem", "4rem"] : ["0rem", "4rem", "4rem", "0rem"],
  );
  const bodyOpacity = useTransform(
    progress,
    last
      ? [start + 0.02, start + 0.07]
      : [start + 0.02, start + 0.07, handOff - 0.02, handOff + 0.02],
    last ? [0, 1] : [0, 1, 1, 0],
  );

  return (
    <motion.li className="relative py-3.5" style={{ opacity }}>
      <div className="absolute inset-x-0 top-0 h-px bg-white/10">
        <motion.div
          className="h-full origin-left bg-[#9cc2ff]"
          style={{ scaleX: fill }}
        />
      </div>
      <div className="flex items-baseline gap-5">
        <span className="font-mono text-[10px] tracking-[0.2em] text-white/50">
          {pad(index + 1)}
        </span>
        <div>
          <h3 className="text-[18px] leading-tight font-light tracking-[-0.02em] text-white">
            {title}
          </h3>
          <motion.p
            className="mt-2 max-w-[40ch] overflow-hidden text-[12.5px] leading-[1.65] text-white/55"
            style={{ height: bodyHeight, opacity: bodyOpacity }}
          >
            {body}
          </motion.p>
        </div>
      </div>
    </motion.li>
  );
}

export function Join() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    offset: ["start start", "end end"],
    target: ref,
  });

  // The blind brightens as the mark assembles, then floods at the finale.
  const lightOpacity = useTransform(
    scrollYProgress,
    [0, FINALE, FINALE + 0.08],
    [0.18, 0.55, 1],
  );
  const markScale = useTransform(
    scrollYProgress,
    [FINALE, FINALE + 0.12],
    [1, 1.05],
  );
  const markRotate = useTransform(scrollYProgress, [0, FINALE], [-8, 0]);
  const halo = useTransform(
    scrollYProgress,
    [FINALE - 0.02, FINALE + 0.08],
    [0, 1],
  );
  const haloScale = useTransform(
    scrollYProgress,
    [FINALE - 0.02, FINALE + 0.14],
    [0.6, 1.25],
  );
  const cta = useTransform(
    scrollYProgress,
    [FINALE + 0.04, FINALE + 0.12],
    [0, 1],
  );
  const ctaY = useTransform(
    scrollYProgress,
    [FINALE + 0.04, FINALE + 0.12],
    [20, 0],
  );
  const counter = useTransform(scrollYProgress, (v) =>
    pad(
      Math.min(
        MARK_PATHS.length,
        Math.max(0, Math.floor((v - STAGE_START) / STAGE_LENGTH) + 1),
      ),
    ),
  );

  return (
    <section
      aria-label="Join the branch"
      className="relative h-[460vh] bg-[#020310]"
      id="join"
      ref={ref}
    >
      <div className="sticky top-0 h-svh overflow-hidden">
        <motion.div
          className="absolute inset-0"
          style={{ opacity: lightOpacity }}
        >
          <LightSlats className="h-full w-full" />
        </motion.div>
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,3,16,0.92)_0%,rgba(2,3,16,0.65)_38%,rgba(2,3,16,0.1)_70%)]"
        />

        <div className="relative z-10 grid h-full grid-rows-[auto_1fr] gap-6 px-5 pt-28 pb-10 md:grid-cols-12 md:grid-rows-1 md:gap-12 md:px-12 md:pt-36 md:pb-16">
          {/* Copy and steps */}
          <div className="flex flex-col justify-between md:col-span-5 lg:col-span-4">
            <div>
              <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.2em] text-white/50 uppercase">
                <ScrambleText text="(08) - Join" />
                <span>
                  <motion.span className="text-white">{counter}</motion.span> /{" "}
                  {pad(MARK_PATHS.length)}
                </span>
              </div>
              <h2 className="mt-6 text-[clamp(1.6rem,3vw,2.6rem)] leading-[1.06] font-light tracking-[-0.035em] text-white md:mt-10">
                <CutText lines={["Four pieces.", "One launchpad."]} />
              </h2>
            </div>

            <ol className="mt-10 hidden max-w-[26rem] md:block">
              {steps.map((step, i) => (
                <StepRow
                  body={step.body}
                  index={i}
                  key={step.title}
                  progress={scrollYProgress}
                  title={step.title}
                />
              ))}
            </ol>
          </div>

          {/* The mark assembling */}
          <div className="relative flex flex-col items-center justify-center gap-12 md:col-span-7 md:col-start-6 lg:col-span-8 lg:col-start-5">
            <motion.div
              aria-hidden="true"
              className="absolute aspect-square w-[min(90vw,72vh)] rounded-full bg-[radial-gradient(circle,rgba(200,204,255,0.55),rgba(98,104,255,0.28)_35%,transparent_68%)] blur-2xl"
              style={{ opacity: halo, scale: haloScale }}
            />
            <motion.svg
              aria-hidden="true"
              className="relative w-[min(64vw,40vh)] overflow-visible md:w-[min(32vw,44vh)]"
              style={{ rotate: markRotate, scale: markScale }}
              viewBox={`-6 -6 ${MARK_WIDTH + 12} ${MARK_HEIGHT + 12}`}
            >
              <defs>
                <linearGradient id="join-glass" x1="0" x2="1" y1="0" y2="1">
                  <stop offset="0" stopColor="#ffffff" stopOpacity="0.32" />
                  <stop offset="0.45" stopColor="#7d82ff" stopOpacity="0.22" />
                  <stop offset="1" stopColor="#262a9c" stopOpacity="0.35" />
                </linearGradient>
                <linearGradient id="join-rim" x1="0" x2="1" y1="0" y2="1">
                  <stop offset="0" stopColor="#ffffff" stopOpacity="0.95" />
                  <stop offset="0.6" stopColor="#9ca0ff" stopOpacity="0.7" />
                  <stop offset="1" stopColor="#3b3fd8" stopOpacity="0.4" />
                </linearGradient>
              </defs>
              {/* Ghost outline shows where every piece will land */}
              {MARK_PATHS.map((d) => (
                <path
                  d={d}
                  fill="none"
                  key={`ghost-${d.slice(0, 10)}`}
                  stroke="rgba(255,255,255,0.12)"
                  strokeDasharray="3 4"
                  strokeWidth="0.8"
                />
              ))}
              {MARK_PATHS.map((d, i) => (
                <Piece
                  d={d}
                  index={i}
                  key={d.slice(0, 12)}
                  progress={scrollYProgress}
                />
              ))}
            </motion.svg>

            {/* Steps on small screens: just the current one, under the mark */}
            <ol className="absolute inset-x-0 bottom-0 md:hidden">
              {steps.map((step, i) => (
                <MobileStep
                  index={i}
                  key={step.title}
                  progress={scrollYProgress}
                  title={step.title}
                />
              ))}
            </ol>

            <motion.div
              className="relative flex flex-wrap justify-center gap-3"
              style={{ opacity: cta, y: ctaY }}
            >
              <Link
                className="group inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 font-mono text-[11px] tracking-[0.16em] text-black uppercase shadow-[0_0_40px_rgba(156,194,255,0.5)] transition-colors hover:bg-[#bcd6ff]"
                href={joinHref}
              >
                Become a member
                <span className="transition-transform group-hover:translate-x-0.5">
                  →
                </span>
              </Link>
              <Link
                className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-black/20 px-5 py-2.5 font-mono text-[11px] tracking-[0.16em] text-white uppercase backdrop-blur-sm transition-colors hover:border-white hover:bg-white hover:text-black"
                href="/about"
              >
                About us
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MobileStep({
  index,
  progress,
  title,
}: {
  index: number;
  progress: MotionValue<number>;
  title: string;
}) {
  const [start, end] = stageWindow(index);
  const last = index === MARK_PATHS.length - 1;
  const opacity = useTransform(
    progress,
    last
      ? [start, start + 0.04, FINALE + 0.02, FINALE + 0.05]
      : [start, start + 0.04, end, end + 0.04],
    [0, 1, 1, 0],
  );
  return (
    <motion.li
      className="absolute inset-x-0 bottom-0 flex items-baseline justify-center gap-3 text-center"
      style={{ opacity }}
    >
      <span className="font-mono text-[10px] tracking-[0.2em] text-[#9cc2ff]">
        {pad(index + 1)}
      </span>
      <span className="text-[18px] font-light tracking-[-0.02em] text-white">
        {title}
      </span>
    </motion.li>
  );
}
