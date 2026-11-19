import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { aboutStory, pillars, values } from "@/app/_components/home/content";
import {
  MARK_HEIGHT,
  MARK_PATHS,
  MARK_WIDTH,
} from "@/app/_components/home/csi-mark";
import { CutText } from "@/app/_components/home/cut-text";
import { LogoMark } from "@/app/_components/home/logo-mark";
import { PageHero } from "@/app/_components/home/page-hero";
import { PageShell } from "@/app/_components/home/page-shell";
import { CountUp, Reveal, RevealLines } from "@/app/_components/home/reveal";
import { ScrambleText } from "@/app/_components/home/scramble-text";
import { ScrollImage } from "@/app/_components/home/scroll-image";
import campus from "@/public/collage.png";
import workshop from "@/public/workshop.jpg";
import workshop2 from "@/public/workshop2.jpg";

export const metadata: Metadata = {
  description:
    "Who we are: the Computer Society of India student branch at St. Joseph's College of Engineering and Technology, Palai.",
  title: "About · CSI SJCET",
};

const pad = (n: number) => String(n).padStart(2, "0");

function SectionLabel({ text }: { text: string }) {
  return (
    <p className="font-mono text-[12px] md:text-[10px] tracking-[0.2em] text-white/40 uppercase md:col-span-3">
      <ScrambleText text={text} />
    </p>
  );
}

export default function AboutPage() {
  return (
    <PageShell>
      <PageHero
        intro="A student-run chapter of the Computer Society of India. We learn by building, teach what we know, and make room for anyone curious enough to show up."
        label="(About) - CSI SJCET"
        lines={["A chapter of builders", "at St. Joseph's, Palai."]}
      />

      {/* Story */}
      <section className="bg-[#050507] px-5 py-[22vh] md:px-12">
        <div className="grid gap-12 md:grid-cols-12 md:gap-6">
          <SectionLabel text="(01) - Our story" />
          <h2 className="text-[clamp(2rem,3vw,2.6rem)] leading-[1.08] font-light tracking-[-0.035em] text-white md:col-span-8 md:col-start-5">
            <RevealLines
              lines={[
                "Built on a campus",
                "in the hills of Palai,",
                "wired to a national network.",
              ]}
            />
          </h2>
        </div>

        <ScrollImage
          alt="The St. Joseph's College of Engineering and Technology campus, with the main block at the end of a long lawn"
          className="mt-[14vh] h-[min(78vh,760px)] w-full"
          sizes="100vw"
          src={campus}
        />

        <div className="mt-[12vh] grid gap-8 text-[15.5px] md:text-[13.5px] leading-[1.8] text-white/55 md:grid-cols-12 md:gap-6">
          {aboutStory.map((paragraph, i) => (
            <Reveal
              className={
                i === 0 ? "md:col-span-4 md:col-start-5" : "md:col-span-4"
              }
              delay={i * 0.12}
              key={paragraph.slice(0, 24)}
            >
              <p>{paragraph}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Mission & vision */}
      <section className="bg-[#050507] px-5 pb-[22vh] md:px-12">
        <div className="grid gap-12 md:grid-cols-12 md:gap-6">
          <SectionLabel text="(02) - Purpose" />
          <h2 className="text-[clamp(2rem,3vw,2.6rem)] leading-[1.08] font-light tracking-[-0.035em] text-white md:col-span-8 md:col-start-5">
            <CutText lines={["Why we", "do this."]} />
          </h2>
        </div>

        <div className="mt-[12vh] grid gap-px bg-white/10 md:grid-cols-2">
          {pillars.map((pillar, i) => (
            <div className="bg-[#050507]" key={pillar.label}>
              <Reveal
                className="group relative flex h-full flex-col gap-16 overflow-hidden p-6 md:p-10"
                delay={i * 0.12}
              >
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -top-1/2 -right-1/4 size-[120%] rounded-full bg-[radial-gradient(circle,rgba(98,104,255,0.22),transparent_60%)] opacity-0 transition-opacity duration-700 group-hover:opacity-100"
                />
                <div className="relative flex items-center justify-between">
                  <span className="font-mono text-[12px] md:text-[10px] tracking-[0.2em] text-white/40 uppercase">
                    {pad(i + 1)} / {pillar.label}
                  </span>
                  <Image
                    alt=""
                    className="size-10 opacity-80 transition-transform duration-700 group-hover:-rotate-12"
                    src={pillar.icon}
                  />
                </div>
                <p className="relative max-w-[30ch] text-[clamp(1.4rem,1.8vw,1.6rem)] leading-[1.3] font-light tracking-[-0.02em] text-white">
                  {pillar.body}
                </p>
              </Reveal>
            </div>
          ))}
        </div>
      </section>

      {/* CSI, nationally */}
      <section className="relative overflow-hidden bg-black px-5 py-[22vh] md:px-12">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-1/2 h-[80vmin] w-[120vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(60,70,200,0.25),transparent_65%)] blur-2xl"
        />
        <div className="relative grid gap-12 md:grid-cols-12 md:gap-6">
          <SectionLabel text="(03) - The society" />
          <div className="md:col-span-8 md:col-start-5">
            <Reveal>
              <LogoMark
                alt="Computer Society of India seal"
                className="size-24 md:size-28"
              />
            </Reveal>
            <h2 className="mt-12 text-[clamp(2rem,3vw,2.6rem)] leading-[1.08] font-light tracking-[-0.035em] text-white">
              <RevealLines
                lines={[
                  "Part of India's first",
                  "and largest body of",
                  "computer professionals.",
                ]}
              />
            </h2>
            <Reveal delay={0.15}>
              <p className="mt-8 max-w-[48ch] text-[15.5px] md:text-[13.5px] leading-[1.8] text-white/55">
                The Computer Society of India brings together IT professionals,
                academics and students through chapters and student branches
                across the country. Its motto, written on every seal, is a wish
                for the common good.
              </p>
            </Reveal>

            <dl className="mt-16 grid grid-cols-2 border-t border-white/10">
              <Reveal className="flex flex-col-reverse border-r border-white/10 py-8 pr-6">
                <dt className="mt-4 font-mono text-[11px] md:text-[9px] tracking-[0.18em] text-white/40 uppercase">
                  Society founded
                </dt>
                <dd className="text-[clamp(2.2rem,4vw,3.4rem)] leading-none font-extralight tracking-[-0.04em] text-white">
                  <CountUp value={1965} />
                </dd>
              </Reveal>
              <Reveal className="flex flex-col-reverse py-8 pl-6" delay={0.1}>
                <dt className="mt-4 font-mono text-[11px] md:text-[9px] tracking-[0.18em] text-white/40 uppercase">
                  Motto · May all be happy
                </dt>
                <dd
                  className="text-[clamp(1.4rem,2.6vw,2.2rem)] leading-tight font-light text-white"
                  lang="sa"
                >
                  सर्वे भवन्तु सुखिनः
                </dd>
              </Reveal>
            </dl>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-[#050507] px-5 py-[22vh] md:px-12">
        <div className="grid gap-12 md:grid-cols-12 md:gap-6">
          <SectionLabel text="(04) - Values" />
          <h2 className="text-[clamp(2rem,3vw,2.6rem)] leading-[1.08] font-light tracking-[-0.035em] text-white md:col-span-8 md:col-start-5">
            <CutText lines={["Four things", "we hold on to."]} />
          </h2>
        </div>
        {/* A 1px gap over a hairline background draws every divider, so each
            tile can carry the same padding on all sides. */}
        <ol className="mt-[12vh] grid gap-px border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((value, i) => (
            <li className="bg-[#050507]" key={value.title}>
              <Reveal
                className="group relative flex h-full min-h-[300px] flex-col justify-between gap-12 overflow-hidden p-6 md:p-8"
                delay={i * 0.08}
              >
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-[#9cc2ff] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -top-1/3 -right-1/3 size-[90%] rounded-full bg-[radial-gradient(circle,rgba(98,104,255,0.2),transparent_65%)] opacity-0 transition-opacity duration-700 group-hover:opacity-100"
                />

                <div className="relative flex items-start justify-between">
                  <span className="font-mono text-[12px] md:text-[10px] tracking-[0.2em] text-white/40 transition-colors duration-500 group-hover:text-[#9cc2ff]">
                    {pad(i + 1)} / {pad(values.length)}
                  </span>
                  {/* This value's own triangle of the CSI mark */}
                  <svg
                    aria-hidden="true"
                    className="w-9 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-rotate-12"
                    viewBox={`-4 -4 ${MARK_WIDTH + 8} ${MARK_HEIGHT + 8}`}
                  >
                    {MARK_PATHS.map((d, k) => (
                      <path
                        className={
                          k === i
                            ? "fill-[#9cc2ff] transition-colors duration-500 group-hover:fill-white"
                            : "fill-white/[0.06]"
                        }
                        d={d}
                        key={d.slice(0, 12)}
                      />
                    ))}
                  </svg>
                </div>

                <div className="relative">
                  <h3 className="text-[26px] md:text-[24px] font-light tracking-[-0.02em] text-white">
                    {value.title}
                  </h3>
                  <p className="mt-3 max-w-[28ch] text-[15px] md:text-[13px] leading-[1.7] text-white/55">
                    {value.body}
                  </p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </section>

      {/* In the room */}
      <section className="bg-[#050507] px-5 pb-[22vh] md:px-12">
        <div className="grid gap-12 md:grid-cols-12 md:gap-6">
          <SectionLabel text="(05) - In the room" />
          <h2 className="text-[clamp(2rem,3vw,2.6rem)] leading-[1.08] font-light tracking-[-0.035em] text-white md:col-span-8 md:col-start-5">
            <RevealLines lines={["Where the work", "actually happens."]} />
          </h2>
        </div>
        <div className="mt-[12vh] grid gap-4 md:grid-cols-12 md:gap-5">
          <ScrollImage
            alt="Students at a CSI SJCET workshop"
            className="aspect-[16/10] md:col-span-7"
            sizes="(min-width: 768px) 58vw, 100vw"
            src={workshop}
          />
          <ScrollImage
            alt="Another CSI SJCET workshop session in progress"
            className="aspect-[16/10] md:col-span-5 md:mt-[18vh]"
            sizes="(min-width: 768px) 42vw, 100vw"
            src={workshop2}
          />
        </div>
      </section>

      {/* Next */}
      <section className="border-t border-white/10 bg-[#050507] px-5 py-[16vh] md:px-12">
        <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <h2 className="text-[clamp(2rem,3vw,2.6rem)] leading-[1.08] font-light tracking-[-0.035em] text-white">
            <CutText lines={["Meet the people", "behind the branch."]} />
          </h2>
          <div className="flex flex-wrap gap-3">
            <Link
              className="group inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 font-mono text-[12px] md:text-[10px] tracking-[0.16em] text-black uppercase transition-colors hover:bg-[#bcd6ff]"
              href="/team"
            >
              Our team
              <span className="transition-transform group-hover:translate-x-0.5">
                →
              </span>
            </Link>
            <Link
              className="inline-flex items-center gap-2 rounded-full border border-white/30 px-4 py-2 font-mono text-[12px] md:text-[10px] tracking-[0.16em] text-white uppercase transition-colors hover:border-white hover:bg-white hover:text-black"
              href="/#join"
            >
              Join the branch
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
