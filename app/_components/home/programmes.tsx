import { programmes } from "./content";
import { CutText } from "./cut-text";
import { Reveal } from "./reveal";
import { ScrambleText } from "./scramble-text";

export function Programmes() {
  return (
    <section
      className="relative bg-[#050507] px-5 py-[24vh] md:px-12"
      id="programmes"
    >
      <div className="grid gap-12 md:grid-cols-12 md:gap-6">
        <p className="font-mono text-[12px] md:text-[10px] tracking-[0.2em] text-white/40 uppercase md:col-span-3">
          <ScrambleText text="(06) - Programmes" />
        </p>
        <h2 className="text-[clamp(2rem,3vw,2.6rem)] leading-[1.08] font-light tracking-[-0.035em] text-white md:col-span-8 md:col-start-5">
          <CutText lines={["What a year", "on board looks like."]} />
        </h2>
      </div>

      <ol className="mt-[14vh] border-t border-white/10">
        {programmes.map((item, i) => (
          <li key={item.name}>
            <Reveal delay={i * 0.05}>
              <div className="group relative grid cursor-default grid-cols-12 items-baseline gap-x-4 gap-y-2 overflow-hidden border-b border-white/10 py-7 md:py-9">
                <span
                  aria-hidden="true"
                  className="absolute inset-0 origin-bottom scale-y-0 bg-white transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-y-100"
                />
                <span className="relative col-span-2 font-mono text-[12px] md:text-[10px] tracking-[0.2em] text-white/40 transition-colors duration-500 group-hover:text-black/50 md:col-span-1">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="relative col-span-10 text-[clamp(1.6rem,2.4vw,2rem)] leading-none font-light tracking-[-0.03em] text-white transition-all duration-500 group-hover:translate-x-2 group-hover:text-black md:col-span-4">
                  {item.name}
                </h3>
                <p className="relative col-span-10 col-start-3 text-[15px] md:text-[12.5px] leading-relaxed text-white/50 transition-colors duration-500 group-hover:text-black/70 md:col-span-4 md:col-start-6">
                  {item.body}
                </p>
                <span className="relative col-span-10 col-start-3 font-mono text-[11px] md:text-[9px] tracking-[0.2em] text-white/40 uppercase transition-colors duration-500 group-hover:text-black/60 md:col-span-2 md:col-start-10">
                  {item.cadence}
                </span>
                <span
                  aria-hidden="true"
                  className="relative hidden text-right text-[15px] md:text-[13px] text-white/40 transition-all duration-500 group-hover:-translate-x-1 group-hover:text-black md:col-span-1 md:block"
                >
                  ↗
                </span>
              </div>
            </Reveal>
          </li>
        ))}
      </ol>
    </section>
  );
}
