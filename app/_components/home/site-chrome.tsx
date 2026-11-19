"use client";

import { motion, useScroll, useSpring, useTransform } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { nav, sections } from "./content";
import { LogoMark } from "./logo-mark";

/**
 * Fixed header, page progress hairline and scroll readout. The right-hand
 * section rail only makes sense on the home page, so other pages pass
 * `rail={false}`.
 */
export function SiteChrome({ rail = true }: { rail?: boolean }) {
  const pathname = usePathname();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { damping: 30, stiffness: 160 });
  const percent = useTransform(scrollYProgress, (v) =>
    (v * 100).toFixed(1).padStart(5, "0"),
  );
  const [active, setActive] = useState<string>(sections[0].id);

  useEffect(() => {
    if (!rail) {
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        }
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    for (const section of sections) {
      const element = document.getElementById(section.id);
      if (element) {
        observer.observe(element);
      }
    }
    return () => observer.disconnect();
  }, [rail]);

  return (
    <>
      <motion.div
        aria-hidden="true"
        className="fixed inset-x-0 top-0 z-50 h-px origin-left bg-white/70"
        style={{ scaleX: progress }}
      />

      <header className="pointer-events-none fixed inset-x-0 top-0 z-40 text-white">
        {/* Black fade behind the bar so it reads over bright sections */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 -z-10 h-32 bg-gradient-to-b from-black via-black/70 to-transparent md:h-36"
        />
        {/* Equal side columns keep the centre label truly centred, and
            items-center puts all three on one baseline row. */}
        <div className="grid grid-cols-[1fr_auto] items-center px-5 py-4 lg:grid-cols-[1fr_auto_1fr] md:px-8 md:py-5">
          <Link
            className="pointer-events-auto flex w-fit items-center gap-3"
            href="/"
          >
            <LogoMark className="size-9" priority />
            <span className="text-[15px] font-medium tracking-tight">
              CSI SJCET
            </span>
          </Link>

          <p className="hidden font-mono text-[11px] uppercase tracking-[0.2em] text-white/70 lg:block">
            Student Branch · Computer Society of India
          </p>

          <nav aria-label="Primary" className="pointer-events-auto justify-self-end">
            <ul className="flex gap-5 font-mono text-[12px] uppercase tracking-[0.16em] md:gap-7">
              {nav.map((item) => {
                const current = item.href === pathname;
                return (
                  <li
                    className={item.href === "/#join" ? "" : "hidden md:block"}
                    key={item.href}
                  >
                    <Link
                      aria-current={current ? "page" : undefined}
                      className={
                        current
                          ? "text-white underline decoration-[#9cc2ff] underline-offset-[6px]"
                          : "text-white/75 transition-colors hover:text-white"
                      }
                      href={item.href}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </header>

      {rail ? (
      <aside
        aria-label="Sections"
        className="pointer-events-none fixed top-1/2 right-5 z-40 hidden -translate-y-1/2 text-white [text-shadow:0_1px_8px_rgba(0,0,0,0.8)] md:block md:right-8"
      >
        <ol className="flex flex-col items-end gap-2.5">
          {sections.map((section, index) => {
            const isActive = active === section.id;
            return (
              <li key={section.id}>
                <a
                  aria-current={isActive ? "true" : undefined}
                  className="pointer-events-auto flex items-center gap-3 font-mono text-[9px] uppercase tracking-[0.18em]"
                  href={`#${section.id}`}
                >
                  <span
                    className={
                      isActive
                        ? "text-white transition-opacity"
                        : "text-white/0 transition-opacity"
                    }
                  >
                    {String(index + 1).padStart(2, "0")} {section.label}
                  </span>
                  <span
                    className={
                      isActive
                        ? "h-2 w-2 rotate-45 bg-white transition-all"
                        : "h-1.5 w-1.5 rotate-45 border border-white/50 transition-all"
                    }
                  />
                </a>
              </li>
            );
          })}
        </ol>
      </aside>
      ) : null}

      <div className="pointer-events-none fixed bottom-5 left-5 z-40 font-mono text-[9px] uppercase tracking-[0.18em] text-white/70 [text-shadow:0_1px_8px_rgba(0,0,0,0.8)] md:bottom-6 md:left-8">
        SCR <motion.span>{percent}</motion.span>
      </div>
    </>
  );
}
