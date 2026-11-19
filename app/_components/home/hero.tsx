"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { fitMark, MARK_PATHS } from "./csi-mark";
import { LightSlats } from "./light-slats";
import { ScrambleText } from "./scramble-text";

// The CSI mark is drawn into a 1000-unit box, inset 120 on each side, and the
// CSS mask below uses the same fit (760 / 1000 = 76% wide, centred) so the
// frosted glass and the rim outline line up exactly.
const MARK = fitMark(1000, 120);
const RIM = 2.5; // px
const EASE = [0.22, 1, 0.36, 1] as const;

const GLASS_MASK = {
  maskImage: "url(/herobg.svg)",
  maskPosition: "center",
  maskRepeat: "no-repeat",
  maskSize: "76% auto",
  WebkitMaskImage: "url(/herobg.svg)",
  WebkitMaskPosition: "center",
  WebkitMaskRepeat: "no-repeat",
  WebkitMaskSize: "76% auto",
} as const;

const HEADLINE = ["Where Ideas", "Become Innovation."];

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    offset: ["start start", "end start"],
    target: ref,
  });

  const markScale = useTransform(scrollYProgress, [0, 1], [1, 1.9]);
  const markRotate = useTransform(scrollYProgress, [0, 1], [0, -24]);
  const slatsY = useTransform(scrollYProgress, [0, 1], ["0%", "-12%"]);
  const copyY = useTransform(scrollYProgress, [0, 0.5], [0, -140]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
  const blackout = useTransform(scrollYProgress, [0.55, 0.95], [0, 1]);

  return (
    <section className="relative h-[180vh] bg-[#020310]" id="top" ref={ref}>
      <div className="sticky top-0 h-svh overflow-hidden">
        {/* Slatted light, drifting up slightly as you scroll */}
        <motion.div
          className="absolute inset-x-0 -top-[2%] h-[116%]"
          style={{ y: slatsY }}
        >
          <LightSlats className="h-full w-full" />
        </motion.div>

        {/* Shade the lower left so the headline always reads */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,3,16,0.7)_0%,rgba(2,3,16,0.15)_45%,transparent_70%),linear-gradient(0deg,rgba(2,3,16,0.8)_0%,transparent_40%)]"
        />

        {/* The CSI mark as frosted glass over the light. No opacity or filter
            on this wrapper: either would cut the glass off from its backdrop. */}
        <motion.div
          animate={{ scale: 1 }}
          className="absolute top-1/2 left-1/2 aspect-square w-[min(118vh,150vw)] -translate-x-1/2 -translate-y-1/2 md:w-[min(104vh,100vw)]"
          initial={{ scale: 0.88 }}
          transition={{ duration: 1.6, ease: EASE }}
        >
          <motion.div
            className="relative h-full w-full"
            style={{ rotate: markRotate, scale: markScale }}
          >
            <motion.div
              animate={{ opacity: 1 }}
              aria-hidden="true"
              className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.14),rgba(120,126,255,0.06)_45%,rgba(2,3,16,0.25))] backdrop-blur-2xl backdrop-brightness-150 backdrop-saturate-150"
              initial={{ opacity: 0 }}
              style={GLASS_MASK}
              transition={{ delay: 0.2, duration: 1.4, ease: EASE }}
            />
            <svg
              aria-hidden="true"
              className="absolute inset-0 h-full w-full overflow-visible"
              viewBox="0 0 1000 1000"
            >
              <defs>
                <linearGradient id="hero-rim" x1="0" x2="1" y1="0" y2="1">
                  <stop offset="0" stopColor="#ffffff" stopOpacity="0.9" />
                  <stop offset="0.5" stopColor="#7d82ff" stopOpacity="0.7" />
                  <stop offset="1" stopColor="#3b3fd8" stopOpacity="0.35" />
                </linearGradient>
              </defs>
              <g transform={MARK.transform}>
                {MARK_PATHS.map((d, i) => (
                  <motion.path
                    animate={{ pathLength: 1 }}
                    d={d}
                    fill="none"
                    initial={{ pathLength: 0 }}
                    key={`rim-${i}`}
                    stroke="url(#hero-rim)"
                    strokeLinejoin="round"
                    strokeWidth={RIM / MARK.scale}
                    transition={{
                      delay: 0.3 + i * 0.14,
                      duration: 1.6,
                      ease: EASE,
                    }}
                  />
                ))}
              </g>
            </svg>
          </motion.div>
        </motion.div>

        {/* Copy */}
        <motion.div
          className="relative z-10 flex h-full flex-col justify-between px-5 pt-28 pb-16 md:px-12 md:pb-10"
          style={{ opacity: copyOpacity, y: copyY }}
        >
          <div className="flex flex-1 flex-col justify-center gap-10 md:flex-row md:items-center md:justify-between">
            <h1 className="text-[clamp(2.4rem,5.4vw,4.6rem)] leading-[0.95] font-light tracking-[-0.045em] text-white drop-shadow-[0_2px_24px_rgba(0,0,0,0.6)]">
              {HEADLINE.map((line, i) => (
                <span className="block overflow-hidden pb-[0.08em]" key={line}>
                  <motion.span
                    animate={{ y: "0%" }}
                    className="block"
                    initial={{ y: "110%" }}
                    transition={{
                      delay: 0.5 + i * 0.12,
                      duration: 1.1,
                      ease: EASE,
                    }}
                  >
                    {line}
                  </motion.span>
                </span>
              ))}
            </h1>

            <motion.a
              animate={{ opacity: 1, x: 0 }}
              className="group inline-flex w-fit items-center gap-2 rounded-full bg-white px-4 py-2 font-mono text-[10px] tracking-[0.16em] text-black uppercase transition-colors hover:bg-[#bcd6ff] md:mr-[14vw]"
              href="#join"
              initial={{ opacity: 0, x: 24 }}
              transition={{ delay: 1, duration: 1, ease: EASE }}
            >
              Join the branch
              <span className="transition-transform group-hover:translate-x-0.5">
                →
              </span>
            </motion.a>
          </div>

          <div className="flex items-end justify-center">
            <p className="max-w-[34ch] text-center font-mono text-[9px] leading-[1.7] tracking-[0.18em] text-white/70 uppercase md:text-[10px]">
              <ScrambleText
                delay={0.8}
                text="CSI SJCET is the student branch of the Computer Society of India at St. Joseph's, Palai"
              />
            </p>
          </div>
        </motion.div>

        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-20 bg-black"
          style={{ opacity: blackout }}
        />
      </div>
    </section>
  );
}
