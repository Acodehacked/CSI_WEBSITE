"use client";

import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useState } from "react";
import { type TeamGroup, type TeamMember, team } from "./content";
import { MARK_HEIGHT, MARK_PATHS, MARK_WIDTH } from "./csi-mark";
import { EASE } from "./reveal";

const FILTERS: ("All" | TeamGroup)[] = ["All", "Faculty", "Execom", "Leads"];
const pad = (n: number) => String(n).padStart(2, "0");

/** Stand-in portrait: the CSI mark over a slice of slatted blue light. */
function Placeholder({ index }: { index: number }) {
  return (
    <div className="absolute inset-0 bg-[#070a26]">
      <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,rgba(2,3,16,0.9)_0px,rgba(2,3,16,0.9)_3px,transparent_3px,transparent_34px)]" />
      <div
        className="absolute inset-0 opacity-70 transition-opacity duration-700 group-hover:opacity-100"
        style={{
          backgroundImage: `radial-gradient(ellipse 70% 30% at ${30 + ((index * 37) % 50)}% ${25 + ((index * 23) % 50)}%, rgba(200,204,255,0.55), rgba(98,104,255,0.25) 45%, transparent 75%)`,
        }}
      />
      <svg
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 w-[38%] -translate-x-1/2 -translate-y-1/2 transition-transform duration-700 ease-out group-hover:rotate-90"
        viewBox={`-8 -8 ${MARK_WIDTH + 16} ${MARK_HEIGHT + 16}`}
      >
        {MARK_PATHS.map((d, i) => (
          <path
            className={
              i === index % 4
                ? "fill-[#9cc2ff] transition-colors duration-500 group-hover:fill-white"
                : "fill-white/[0.06] stroke-white/30"
            }
            d={d}
            key={d.slice(0, 12)}
            strokeWidth="1.5"
          />
        ))}
      </svg>
    </div>
  );
}

function MemberCard({ index, member }: { index: number; member: TeamMember }) {
  const body = (
    <>
      <div className="relative aspect-[4/5] overflow-hidden rounded-xl border border-white/10">
        {member.photo ? (
          <Image
            alt={`Portrait of ${member.name}`}
            className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
            fill
            placeholder="blur"
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            src={member.photo}
          />
        ) : (
          <Placeholder index={index} />
        )}
        <div className="absolute inset-x-0 top-0 flex justify-between p-3 font-mono text-[9px] tracking-[0.2em] text-white/80 uppercase">
          <span>M/{pad(index + 1)}</span>
          <span className="rounded-sm border border-white/30 bg-black/30 px-1.5 py-0.5 backdrop-blur-sm">
            {member.group}
          </span>
        </div>
      </div>
      <div className="mt-4">
        <p className="font-mono text-[10px] tracking-[0.18em] text-[#9cc2ff] uppercase">
          {member.role}
        </p>
        <h3 className="mt-2 text-[18px] leading-tight font-light tracking-[-0.02em] text-white">
          {member.name}
          {member.href ? (
            <span
              aria-hidden="true"
              className="ml-1.5 text-white/40 transition-colors group-hover:text-white"
            >
              ↗
            </span>
          ) : null}
        </h3>
      </div>
    </>
  );

  return member.href ? (
    <a
      className="group block"
      href={member.href}
      rel="noreferrer"
      target="_blank"
    >
      {body}
    </a>
  ) : (
    <div className="group">{body}</div>
  );
}

export function TeamGrid() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const shown =
    filter === "All" ? team : team.filter((m) => m.group === filter);

  return (
    <div>
      <div
        aria-label="Filter team"
        className="flex flex-wrap gap-2"
        role="group"
      >
        {FILTERS.map((option) => {
          const count =
            option === "All"
              ? team.length
              : team.filter((m) => m.group === option).length;
          const active = option === filter;
          return (
            <button
              aria-pressed={active}
              className={
                active
                  ? "rounded-full bg-white px-3.5 py-1.5 font-mono text-[10px] tracking-[0.16em] text-black uppercase"
                  : "rounded-full border border-white/20 px-3.5 py-1.5 font-mono text-[10px] tracking-[0.16em] text-white/70 uppercase transition-colors hover:border-white/60 hover:text-white"
              }
              key={option}
              onClick={() => setFilter(option)}
              type="button"
            >
              {option}{" "}
              <span className={active ? "text-black/50" : "text-white/35"}>
                {pad(count)}
              </span>
            </button>
          );
        })}
      </div>

      <motion.ul
        className="mt-12 grid grid-cols-2 gap-x-4 gap-y-12 sm:grid-cols-3 md:gap-x-5 lg:grid-cols-4"
        layout
      >
        <AnimatePresence mode="popLayout">
          {shown.map((member) => {
            const index = team.indexOf(member);
            return (
              <motion.li
                animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
                exit={{ filter: "blur(6px)", opacity: 0, y: 12 }}
                initial={{ filter: "blur(6px)", opacity: 0, y: 24 }}
                key={`${member.role}-${index}`}
                layout
                transition={{ duration: 0.6, ease: EASE }}
              >
                <MemberCard index={index} member={member} />
              </motion.li>
            );
          })}
        </AnimatePresence>
      </motion.ul>
    </div>
  );
}
