"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { CutText } from "./cut-text";
import { LightSlats } from "./light-slats";
import { EASE } from "./reveal";
import { ScrambleText } from "./scramble-text";

/**
 * Opening band for inner pages: the home hero's slatted light, a mono label,
 * a cut-effect headline and a short intro. It lifts and dims as you scroll.
 */
export function PageHero({
  intro,
  label,
  lines,
}: {
  intro: string;
  label: string;
  lines: string[];
}) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    offset: ["start start", "end start"],
    target: ref,
  });
  const slatsY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const copyY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const fade = useTransform(scrollYProgress, [0, 0.9], [0, 0.85]);

  return (
    <section
      className="relative flex min-h-[88svh] items-end overflow-hidden bg-[#020310]"
      ref={ref}
    >
      <motion.div className="absolute inset-x-0 -top-[4%] h-[112%]" style={{ y: slatsY }}>
        <LightSlats className="h-full w-full" />
      </motion.div>
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(0deg,rgba(2,3,16,0.95)_0%,rgba(2,3,16,0.4)_45%,rgba(2,3,16,0.2)_100%)]"
      />
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 bg-black"
        style={{ opacity: fade }}
      />

      <motion.div
        className="relative z-10 grid w-full gap-10 px-5 pt-40 pb-[12vh] md:grid-cols-12 md:gap-6 md:px-12"
        style={{ y: copyY }}
      >
        <p className="font-mono text-[10px] tracking-[0.2em] text-white/60 uppercase md:col-span-3">
          <ScrambleText text={label} />
        </p>
        <div className="md:col-span-8 md:col-start-5">
          <h1 className="text-[clamp(2.2rem,5vw,4.4rem)] leading-[0.98] font-light tracking-[-0.045em] text-white">
            <CutText lines={lines} />
          </h1>
          <motion.p
            animate={{ opacity: 1, y: 0 }}
            className="mt-10 max-w-[48ch] text-[14px] leading-[1.75] text-white/65"
            initial={{ opacity: 0, y: 16 }}
            transition={{ delay: 0.5, duration: 1, ease: EASE }}
          >
            {intro}
          </motion.p>
        </div>
      </motion.div>
    </section>
  );
}
