"use client";

import { motion, useScroll, useTransform } from "motion/react";
import Image, { type StaticImageData } from "next/image";
import { useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * Photo that opens from an inset frame to full size as it scrolls into view,
 * with the picture drifting inside the frame for parallax.
 */
export function ScrollImage({
  alt,
  className,
  priority = false,
  sizes = "100vw",
  src,
}: {
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
  src: StaticImageData;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    offset: ["start end", "end start"],
    target: ref,
  });
  const inset = useTransform(scrollYProgress, [0, 0.45], [14, 0]);
  const clipPath = useTransform(inset, (v) => `inset(${v}% ${v}% ${v}% ${v}% round ${v * 1.2}px)`);
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <motion.div
      className={cn("relative overflow-hidden", className)}
      ref={ref}
      style={{ clipPath }}
    >
      <motion.div className="absolute inset-x-0 -top-[10%] h-[120%]" style={{ y }}>
        <Image
          alt={alt}
          className="object-cover"
          fill
          placeholder="blur"
          priority={priority}
          sizes={sizes}
          src={src}
        />
      </motion.div>
    </motion.div>
  );
}
