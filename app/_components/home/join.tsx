import { steps } from "./content";
import { CutText } from "./cut-text";
import { Reveal } from "./reveal";
import { ScrambleText } from "./scramble-text";

export function Join() {
  return (
    <section
      className="relative bg-[#050507] px-5 py-[24vh] md:px-12"
      id="join"
    >
      <div className="grid gap-12 md:grid-cols-12 md:gap-6">
        <p className="font-mono text-[10px] tracking-[0.2em] text-white/40 uppercase md:col-span-3">
          <ScrambleText text="(08) - Join" />
        </p>
        <div className="md:col-span-8 md:col-start-5">
          <h2 className="text-[clamp(1.6rem,3vw,2.6rem)] leading-[1.08] font-light tracking-[-0.035em] text-white">
            <CutText lines={["Three steps", "to the launchpad."]} />
          </h2>
          <Reveal delay={0.15}>
            <p className="mt-8 max-w-[44ch] text-[13px] leading-[1.75] text-white/50">
              Membership is open to every student at SJCET, in every branch and
              every year. Reach out to the branch coordinators or drop by any
              session to get started.
            </p>
          </Reveal>
        </div>
      </div>

      <ol className="mt-[16vh] grid gap-px bg-white/10 md:grid-cols-3">
        {steps.map((step, i) => (
          <li className="bg-[#050507]" key={step.title}>
            <Reveal
              className="flex h-full flex-col gap-16 p-6 md:p-8"
              delay={i * 0.12}
            >
              <span className="font-mono text-[10px] tracking-[0.2em] text-white/40">
                {String(i + 1).padStart(2, "0")} /{" "}
                {String(steps.length).padStart(2, "0")}
              </span>
              <div>
                <h3 className="text-[20px] font-light tracking-[-0.02em] text-white">
                  {step.title}
                </h3>
                <p className="mt-3 text-[12.5px] leading-[1.7] text-white/50">
                  {step.body}
                </p>
              </div>
            </Reveal>
          </li>
        ))}
      </ol>
    </section>
  );
}
