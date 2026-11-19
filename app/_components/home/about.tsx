import Link from "next/link";
import { facts } from "./content";
import { CountUp, Reveal, RevealLines } from "./reveal";
import { ScrambleText } from "./scramble-text";

export function About() {
  return (
    <section
      className="relative bg-[#050507] px-5 py-[24vh] md:px-12"
      id="about"
    >
      <div className="grid gap-12 md:grid-cols-12 md:gap-6">
        <p className="font-mono text-[10px] tracking-[0.2em] text-white/40 uppercase md:col-span-3">
          <ScrambleText text="(04) - About" />
        </p>

        <div className="md:col-span-8 md:col-start-5">
          <h2 className="text-[clamp(1.6rem,3vw,2.6rem)] leading-[1.08] font-light tracking-[-0.035em] text-white">
            <RevealLines
              lines={[
                "A launchpad for students",
                "who would rather build",
                "than just read about it.",
              ]}
            />
          </h2>

          <div className="mt-20 grid gap-8 text-[13px] leading-[1.75] text-white/50 sm:grid-cols-2 md:mt-28 md:gap-12">
            <Reveal>
              <p>
                The CSI student branch at SJCET brings together students from
                every department who share one habit: making things with
                computers. We run sessions, contests and builds year-round, and
                we connect members to the wider network of CSI chapters across
                India.
              </p>
            </Reveal>
            <Reveal delay={0.12}>
              <p>
                Membership is about practice, not prerequisites. First-years sit
                next to final-years; beginners pair with people who have
                shipped. The only requirement is curiosity and a willingness to
                show your work.
              </p>
            </Reveal>
            <Reveal className="sm:col-span-2" delay={0.2}>
              <Link
                className="group inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.18em] text-white/75 uppercase transition-colors hover:text-white"
                href="/about"
              >
                More about us
                <span className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                  ↗
                </span>
              </Link>
            </Reveal>
          </div>
        </div>
      </div>

      <dl className="mt-[18vh] grid grid-cols-2 border-t border-white/10 md:grid-cols-4">
        {facts.map((fact, i) => (
          <Reveal
            className="flex flex-col-reverse border-b border-white/10 py-8 pr-6 md:border-r md:border-b-0 md:px-6 md:first:pl-0 md:last:border-r-0"
            delay={i * 0.08}
            key={fact.label}
          >
            <dt className="mt-4 font-mono text-[9px] leading-relaxed tracking-[0.18em] text-white/40 uppercase">
              {fact.label}
            </dt>
            <dd className="text-[clamp(2.2rem,4vw,3.4rem)] leading-none font-extralight tracking-[-0.04em] text-white">
              <CountUp pad={fact.pad} value={fact.value} />
            </dd>
          </Reveal>
        ))}
      </dl>
    </section>
  );
}
