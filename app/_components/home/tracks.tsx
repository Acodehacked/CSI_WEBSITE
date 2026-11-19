"use client";

import { motion, useMotionValue, useScroll, useTransform } from "motion/react";
import { useEffect, useRef } from "react";
import { tracks } from "./content";
import { MARK_HEIGHT, MARK_PATHS, MARK_WIDTH } from "./csi-mark";
import { ScrambleText } from "./scramble-text";

/** The CSI mark with the triangles this track "owns" lit up. */
function TrackGlyph({ lit }: { lit: number[] }) {
  return (
    <svg
      aria-hidden="true"
      className="w-28 transition-transform duration-700 ease-out group-hover:rotate-90 md:w-32"
      viewBox={`-12 -12 ${MARK_WIDTH + 24} ${MARK_HEIGHT + 24}`}
    >
      {MARK_PATHS.map((d, i) => (
        <path
          className={
            lit.includes(i)
              ? "fill-[#9cc2ff] transition-colors duration-500 group-hover:fill-white"
              : "fill-white/[0.04] stroke-white/20"
          }
          d={d}
          key={d.slice(0, 12)}
          strokeWidth="1"
        />
      ))}
    </svg>
  );
}

export function Tracks() {
  const ref = useRef<HTMLElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const distance = useMotionValue(0);
  const { scrollYProgress } = useScroll({
    offset: ["start start", "end end"],
    target: ref,
  });
  const x = useTransform(() => -scrollYProgress.get() * distance.get());
  const counter = useTransform(scrollYProgress, (v) =>
    String(Math.min(tracks.length, Math.floor(v * tracks.length) + 1)).padStart(
      2,
      "0",
    ),
  );

  useEffect(() => {
    const row = rowRef.current;
    if (!row) {
      return;
    }
    const measure = () => {
      distance.set(Math.max(0, row.scrollWidth - window.innerWidth));
    };
    const observer = new ResizeObserver(measure);
    observer.observe(row);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [distance]);

  return (
    <section
      className="relative bg-[#050507]"
      id="tracks"
      ref={ref}
      style={{ height: `${tracks.length * 70}vh` }}
    >
      <div className="sticky top-0 flex h-svh flex-col justify-center gap-12 overflow-hidden">
        <div className="flex items-end justify-between px-5 md:px-12">
          <div>
            <p className="font-mono text-[12px] md:text-[10px] tracking-[0.2em] text-white/40 uppercase">
              <ScrambleText text="(05) - Tracks" />
            </p>
            <h2 className="mt-5 text-[clamp(1.9rem,2.6vw,2.2rem)] leading-[1.05] font-light tracking-[-0.035em] text-white">
              Six tracks, one orbit.
            </h2>
          </div>
          <p className="font-mono text-[12px] md:text-[10px] tracking-[0.2em] text-white/40 uppercase">
            <motion.span className="text-white">{counter}</motion.span> /{" "}
            {String(tracks.length).padStart(2, "0")}
          </p>
        </div>

        <motion.div
          className="flex w-max gap-4 px-5 md:gap-5 md:px-12"
          ref={rowRef}
          style={{ x }}
        >
          {tracks.map((track, i) => (
            <article
              className="group relative flex h-[min(60vh,500px)] w-[min(80vw,360px)] shrink-0 flex-col justify-between overflow-hidden border border-white/10 bg-gradient-to-b from-white/[0.035] to-transparent p-6 transition-colors duration-500 hover:border-white/30"
              key={track.title}
            >
              <div className="flex items-start justify-between font-mono text-[11px] md:text-[9px] tracking-[0.2em] text-white/40 uppercase">
                <span>T/{String(i + 1).padStart(2, "0")}</span>
                <span>{track.tags[0]}</span>
              </div>

              <div className="flex justify-center">
                <TrackGlyph lit={track.lit} />
              </div>

              <div>
                <h3 className="text-[24px] md:text-[22px] leading-tight font-light tracking-[-0.02em] text-white">
                  {track.title}
                </h3>
                <p className="mt-3 text-[15px] md:text-[12px] leading-[1.7] text-white/50">
                  {track.body}
                </p>
                <ul className="mt-5 flex flex-wrap gap-1.5">
                  {track.tags.map((tag) => (
                    <li
                      className="border border-white/15 px-2 py-1 font-mono text-[10.5px] md:text-[8.5px] tracking-[0.16em] text-white/60 uppercase"
                      key={tag}
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </motion.div>

        <div className="mx-5 h-px bg-white/10 md:mx-12">
          <motion.div
            className="h-full origin-left bg-white/70"
            style={{ scaleX: scrollYProgress }}
          />
        </div>
      </div>
    </section>
  );
}
