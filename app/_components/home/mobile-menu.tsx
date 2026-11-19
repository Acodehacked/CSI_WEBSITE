"use client";

import { AnimatePresence, motion, type Variants } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { address, nav } from "./content";
import { LightSlats } from "./light-slats";
import { LogoMark } from "./logo-mark";

const EASE = [0.22, 1, 0.36, 1] as const;
const pad = (n: number) => String(n).padStart(2, "0");

const listVariants: Variants = {
  closed: { transition: { staggerChildren: 0.04, staggerDirection: -1 } },
  open: { transition: { delayChildren: 0.28, staggerChildren: 0.07 } },
};
const itemVariants: Variants = {
  closed: { opacity: 0, transition: { duration: 0.25 }, y: "110%" },
  open: { opacity: 1, transition: { duration: 0.8, ease: EASE }, y: "0%" },
};

/** Two hairlines that cross into an X while the menu is open. */
function Burger({ open }: { open: boolean }) {
  return (
    <span aria-hidden="true" className="relative block h-2.5 w-5">
      <motion.span
        animate={open ? { rotate: 45, y: 4.5 } : { rotate: 0, y: 0 }}
        className="absolute inset-x-0 top-0 h-px bg-current"
        transition={{ duration: 0.4, ease: EASE }}
      />
      <motion.span
        animate={open ? { rotate: -45, y: -4.5 } : { rotate: 0, y: 0 }}
        className="absolute inset-x-0 bottom-0 h-px bg-current"
        transition={{ duration: 0.4, ease: EASE }}
      />
    </span>
  );
}

/**
 * Full-screen menu for small screens. The panel scales up while sliding in
 * from the right; links rise in one after another, and the hero's slatted
 * light glows out of the bottom-left corner.
 */
export function MobileMenu() {
  const pathname = usePathname();
  // Remember which page the menu was opened on: navigating anywhere closes
  // it without needing an effect to reset state.
  const [openedOn, setOpenedOn] = useState<string | null>(null);
  const open = openedOn === pathname;
  const buttonRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  const close = () => setOpenedOn(null);

  useEffect(() => {
    if (!open) {
      return;
    }
    // Freeze the page behind the panel; Lenis skips the panel itself via
    // data-lenis-prevent, and native touch scroll stops on overflow hidden.
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenedOn(null);
      }
    };
    // Close if the screen grows past the mobile breakpoint.
    const wide = window.matchMedia("(min-width: 768px)");
    const onWide = () => {
      if (wide.matches) {
        setOpenedOn(null);
      }
    };
    window.addEventListener("keydown", onKey);
    wide.addEventListener("change", onWide);
    const focusTimer = setTimeout(() => firstLinkRef.current?.focus(), 400);
    const button = buttonRef.current;

    return () => {
      root.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
      wide.removeEventListener("change", onWide);
      clearTimeout(focusTimer);
      button?.focus();
    };
  }, [open]);

  return (
    <>
      <button
        aria-controls="mobile-menu"
        aria-expanded={open}
        aria-label={open ? "Close menu" : "Open menu"}
        className="pointer-events-auto relative z-[70] flex items-center gap-3 rounded-full border border-white/25 bg-black/30 px-3.5 py-2 font-mono text-[11px] tracking-[0.18em] text-white uppercase backdrop-blur-md md:hidden"
        onClick={() => setOpenedOn(open ? null : pathname)}
        ref={buttonRef}
        type="button"
      >
        <span className="w-[5ch] text-left">{open ? "Close" : "Menu"}</span>
        <Burger open={open} />
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            animate={{ borderRadius: 0, opacity: 1, scale: 1, x: "0%" }}
            aria-label="Site menu"
            aria-modal="true"
            className="pointer-events-auto fixed inset-0 z-[60] flex origin-right flex-col overflow-hidden bg-[#03040f] md:hidden"
            data-lenis-prevent=""
            exit={{
              borderRadius: 36,
              opacity: 0.6,
              scale: 0.9,
              transition: { duration: 0.55, ease: EASE },
              x: "100%",
            }}
            id="mobile-menu"
            initial={{ borderRadius: 36, opacity: 0.6, scale: 0.9, x: "100%" }}
            role="dialog"
            transition={{ duration: 0.75, ease: EASE }}
          >
            {/* The hero light, fading out from the bottom-left corner */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{
                maskImage:
                  "radial-gradient(ellipse 95% 70% at 0% 100%, #000 0%, rgba(0,0,0,0.55) 40%, transparent 75%)",
                WebkitMaskImage:
                  "radial-gradient(ellipse 95% 70% at 0% 100%, #000 0%, rgba(0,0,0,0.55) 40%, transparent 75%)",
              }}
            >
              <LightSlats className="h-full w-full" />
            </div>

            <div className="relative flex items-center px-5 py-4">
              <Link
                className="flex items-center gap-3"
                href="/"
                onClick={close}
              >
                <LogoMark className="size-9" />
                <span className="text-[15px] font-medium tracking-tight">
                  CSI SJCET
                </span>
              </Link>
            </div>

            <motion.nav
              animate="open"
              aria-label="Mobile"
              className="relative flex flex-1 flex-col justify-center px-5"
              exit="closed"
              initial="closed"
              variants={listVariants}
            >
              <ul className="flex flex-col gap-3">
                {nav.map((item, i) => {
                  const current = item.href === pathname;
                  return (
                    <li className="overflow-hidden" key={item.href}>
                      <motion.div variants={itemVariants}>
                        <Link
                          aria-current={current ? "page" : undefined}
                          className="group flex items-baseline gap-4"
                          href={item.href}
                          onClick={close}
                          ref={i === 0 ? firstLinkRef : undefined}
                        >
                          <span className="w-6 font-mono text-[11px] tracking-[0.2em] text-white/40">
                            {pad(i + 1)}
                          </span>
                          <span
                            className={
                              current
                                ? "text-[clamp(2.6rem,12vw,4rem)] leading-[1.02] font-light tracking-[-0.045em] text-[#9cc2ff]"
                                : "text-[clamp(2.6rem,12vw,4rem)] leading-[1.02] font-light tracking-[-0.045em] text-white transition-colors group-active:text-[#9cc2ff]"
                            }
                          >
                            {item.label}
                          </span>
                        </Link>
                      </motion.div>
                    </li>
                  );
                })}
              </ul>
            </motion.nav>

            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="relative flex items-end justify-between gap-6 px-5 pb-8"
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
              initial={{ opacity: 0, y: 16 }}
              transition={{ delay: 0.6, duration: 0.7, ease: EASE }}
            >
              <address className="font-mono text-[9px] leading-[1.8] tracking-[0.16em] text-white/60 uppercase not-italic">
                {address.map((line) => (
                  <span className="block" key={line}>
                    {line}
                  </span>
                ))}
              </address>
              <Link
                className="shrink-0 rounded-full bg-white px-4 py-2 font-mono text-[10px] tracking-[0.16em] text-black uppercase"
                href="/#join"
                onClick={close}
              >
                Join →
              </Link>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
