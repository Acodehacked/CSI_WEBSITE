import Link from "next/link";
import PixelFlowField from "@/app/_components/global/scramble";
import { address, nav } from "./content";
import { LogoMark } from "./logo-mark";

// The field's defaults reference theme tokens this page does not define, so
// the ramp is passed explicitly: dim field, signal blue accent, white ink.
const FIELD_COLORS = [
  "oklch(0.42 0.02 250)",
  "oklch(0.74 0.13 250)",
  "oklch(0.98 0 0)",
];

export function Closing() {
  return (
    <footer className="relative bg-black">
      <PixelFlowField
        cellSize={7}
        className="h-svh min-h-[640px] w-full"
        colors={FIELD_COLORS}
        gap={3}
        shape="square"
        text="CSI SJCET"
      >
        <div className="flex h-full flex-col justify-between px-5 pt-28 pb-6 md:px-12 md:pb-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <p className="max-w-[22ch] text-[clamp(1.3rem,2.2vw,1.9rem)] leading-[1.1] font-light tracking-[-0.03em] text-white">
              Ready to build something with us?
            </p>
            <Link
              className="group inline-flex w-fit items-center gap-2 rounded-full bg-white px-4 py-2 font-mono text-[10px] tracking-[0.16em] text-black uppercase transition-colors hover:bg-[#bcd6ff]"
              href="/#join"
            >
              Become a member
              <span className="transition-transform group-hover:translate-x-0.5">
                →
              </span>
            </Link>
          </div>

          <div className="grid gap-8 border-t border-white/15 pt-6 font-mono text-[9px] leading-[1.8] tracking-[0.16em] text-white/50 uppercase sm:grid-cols-3">
            <div className="flex items-start gap-3">
              <LogoMark className="size-10 shrink-0" />
              <address className="not-italic">
                {address.map((line) => (
                  <span className="block" key={line}>
                    {line}
                  </span>
                ))}
              </address>
            </div>
            <ul className="flex flex-wrap gap-x-5 gap-y-1 sm:justify-center">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link className="transition-colors hover:text-white" href={item.href}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="sm:text-right">
              Computer Society of India
              <br />
              Student Branch · SJCET Palai
            </p>
          </div>
        </div>
      </PixelFlowField>
    </footer>
  );
}
