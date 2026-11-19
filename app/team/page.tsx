import type { Metadata } from "next";
import Link from "next/link";
import { CutText } from "@/app/_components/home/cut-text";
import { PageHero } from "@/app/_components/home/page-hero";
import { PageShell } from "@/app/_components/home/page-shell";
import { Reveal, RevealLines } from "@/app/_components/home/reveal";
import { ScrambleText } from "@/app/_components/home/scramble-text";
import { ScrollImage } from "@/app/_components/home/scroll-image";
import { TeamGrid } from "@/app/_components/home/team-grid";
import groupPhoto from "@/public/group.jpeg";

export const metadata: Metadata = {
  description:
    "The faculty, executive committee and leads of the CSI student branch at SJCET Palai.",
  title: "Our Team · CSI SJCET",
};

export default function TeamPage() {
  return (
    <PageShell>
      <PageHero
        intro="Faculty who guide us, an executive committee that keeps the year running, and leads who turn ideas into sessions, designs and code."
        label="(Team) - CSI SJCET"
        lines={["The people", "behind the branch."]}
      />

      {/* Everyone, together */}
      <section className="bg-[#050507] px-5 pt-[18vh] md:px-12">
        <figure>
          <ScrollImage
            alt="Members and faculty of the CSI SJCET student branch posing together on the college steps"
            className="h-[min(82vh,820px)] w-full"
            priority
            sizes="100vw"
            src={groupPhoto}
          />
          <figcaption className="mt-5 flex justify-between font-mono text-[12px] md:text-[10px] tracking-[0.2em] text-white/40 uppercase">
            <span>The branch, together</span>
            <span>SJCET · Palai</span>
          </figcaption>
        </figure>
      </section>

      {/* Roster */}
      <section className="bg-[#050507] px-5 py-[22vh] md:px-12">
        <div className="grid gap-12 md:grid-cols-12 md:gap-6">
          <p className="font-mono text-[12px] md:text-[10px] tracking-[0.2em] text-white/40 uppercase md:col-span-3">
            <ScrambleText text="(01) - Roster" />
          </p>
          <div className="md:col-span-8 md:col-start-5">
            <h2 className="text-[clamp(2rem,3vw,2.6rem)] leading-[1.08] font-light tracking-[-0.035em] text-white">
              <CutText lines={["Faces of", "this year's crew."]} />
            </h2>
            <Reveal delay={0.15}>
              <p className="mt-8 max-w-[46ch] text-[15.5px] md:text-[13.5px] leading-[1.8] text-white/55">
                Filter by group to see who guides the branch, who runs it, and
                who leads each of its tracks.
              </p>
            </Reveal>
          </div>
        </div>

        <div className="mt-[10vh]">
          <TeamGrid />
        </div>
      </section>

      {/* Join the crew */}
      <section className="relative overflow-hidden border-t border-white/10 bg-black px-5 py-[18vh] md:px-12">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-1/3 left-1/2 h-[70vmin] w-[130vmin] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(60,70,200,0.28),transparent_65%)] blur-2xl"
        />
        <div className="relative flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <h2 className="text-[clamp(2rem,3vw,2.6rem)] leading-[1.08] font-light tracking-[-0.035em] text-white">
            <RevealLines lines={["Want your name", "on this page?"]} />
          </h2>
          <div className="flex flex-wrap gap-3">
            <Link
              className="group inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 font-mono text-[12px] md:text-[10px] tracking-[0.16em] text-black uppercase transition-colors hover:bg-[#bcd6ff]"
              href="/#join"
            >
              Join the branch
              <span className="transition-transform group-hover:translate-x-0.5">
                →
              </span>
            </Link>
            <Link
              className="inline-flex items-center gap-2 rounded-full border border-white/30 px-4 py-2 font-mono text-[12px] md:text-[10px] tracking-[0.16em] text-white uppercase transition-colors hover:border-white hover:bg-white hover:text-black"
              href="/about"
            >
              About us
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
