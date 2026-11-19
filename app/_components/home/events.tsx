"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { events } from "./content";
import { CutText } from "./cut-text";
import { Reveal } from "./reveal";
import { ScrambleText } from "./scramble-text";

const pad = (n: number) => String(n).padStart(2, "0");

/** Square arrow button in the page's hairline style. */
function Arrow({
  direction,
  disabled,
  onClick,
}: {
  direction: "prev" | "next";
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      aria-label={direction === "prev" ? "Previous events" : "Next events"}
      className="grid size-11 place-items-center border border-white/15 text-[16px] md:text-[14px] text-white transition-colors hover:border-white/50 hover:bg-white hover:text-black disabled:pointer-events-none disabled:text-white/25"
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      {direction === "prev" ? "←" : "→"}
    </button>
  );
}

export function Events() {
  const trackRef = useRef<HTMLUListElement>(null);
  const [edges, setEdges] = useState({ end: false, start: true });

  const syncEdges = useCallback(() => {
    const track = trackRef.current;
    if (!track) {
      return;
    }
    const max = track.scrollWidth - track.clientWidth;
    setEdges({
      end: track.scrollLeft >= max - 4,
      start: track.scrollLeft <= 4,
    });
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) {
      return;
    }
    const observer = new ResizeObserver(syncEdges);
    observer.observe(track);
    track.addEventListener("scroll", syncEdges, { passive: true });
    return () => {
      observer.disconnect();
      track.removeEventListener("scroll", syncEdges);
    };
  }, [syncEdges]);

  const scrollByCard = (direction: 1 | -1) => {
    const track = trackRef.current;
    const card = track?.querySelector("li");
    if (!(track && card)) {
      return;
    }
    const gap = Number.parseFloat(getComputedStyle(track).columnGap) || 0;
    track.scrollBy({
      behavior: "smooth",
      left: direction * (card.clientWidth + gap),
    });
  };

  return (
    <section className="relative bg-[#050507] py-[24vh]" id="events">
      <div className="grid gap-12 px-5 md:grid-cols-12 md:gap-6 md:px-12">
        <p className="font-mono text-[12px] md:text-[10px] tracking-[0.2em] text-white/40 uppercase md:col-span-3">
          <ScrambleText text="(07) - Events" />
        </p>
        <div className="flex flex-col gap-10 md:col-span-8 md:col-start-5 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-[clamp(2rem,3vw,2.6rem)] leading-[1.08] font-light tracking-[-0.035em] text-white">
              <CutText lines={["Moments from", "the branch."]} />
            </h2>
            <Reveal delay={0.15}>
              <a
                className="mt-8 inline-flex items-center gap-1.5 font-mono text-[12px] md:text-[10px] tracking-[0.18em] text-white/70 uppercase transition-colors hover:text-white"
                href="#join"
              >
                Be in the next one <span aria-hidden="true">↗</span>
              </a>
            </Reveal>
          </div>
          <div className="flex items-center gap-2">
            <Arrow
              direction="prev"
              disabled={edges.start}
              onClick={() => scrollByCard(-1)}
            />
            <Arrow
              direction="next"
              disabled={edges.end}
              onClick={() => scrollByCard(1)}
            />
          </div>
        </div>
      </div>

      {/* The row reveals as one block: per-card in-view triggers are
          unreliable inside a horizontal scroller and could leave cards hidden. */}
      <Reveal className="mt-[12vh]">
        <ul
          aria-label="Event photos"
          className="flex snap-x snap-mandatory scroll-px-5 gap-4 overflow-x-auto px-5 pb-4 [scrollbar-width:none] md:scroll-px-12 md:gap-5 md:px-12 [&::-webkit-scrollbar]:hidden"
          ref={trackRef}
        >
          {events.map((event, i) => (
            <li
              className="group w-[min(84vw,520px)] shrink-0 snap-start"
              key={event.title}
            >
              <figure>
                <div className="relative aspect-[3/2] overflow-hidden rounded-xl border border-white/10 bg-[#0b0d1f]">
                  <Image
                    alt={event.alt}
                    className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
                    fill
                    loading="eager"
                    placeholder="blur"
                    sizes="(min-width: 768px) 520px, 84vw"
                    src={event.image}
                  />
                  {/* Light shade at the top only, so the labels read */}
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/55 to-transparent" />
                  <div className="absolute inset-x-0 top-0 flex justify-between p-3 font-mono text-[11px] md:text-[9px] tracking-[0.2em] text-white uppercase">
                    <span>E/{pad(i + 1)}</span>
                    <span className="rounded-sm border border-white/40 bg-black/30 px-1.5 py-0.5 backdrop-blur-sm">
                      {event.tag}
                    </span>
                  </div>
                </div>
                <figcaption className="mt-5 pr-4">
                  <h3 className="text-[24px] md:text-[22px] leading-tight font-light tracking-[-0.02em] text-white">
                    {event.title}
                  </h3>
                  <p className="mt-2 text-[15px] md:text-[13px] leading-[1.7] text-white/55">
                    {event.body}
                  </p>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </Reveal>

      <p className="mt-10 px-5 font-mono text-[12px] md:text-[10px] tracking-[0.2em] text-white/40 uppercase md:px-12">
        {pad(events.length)} moments in the archive
      </p>
    </section>
  );
}
