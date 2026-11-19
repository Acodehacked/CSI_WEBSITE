import Image from "next/image";
import { cn } from "@/lib/utils";
import csiLogo from "@/public/CSI logo.png";

/** The Computer Society of India seal (white artwork on transparent). */
export function LogoMark({
  alt = "",
  className = "",
  priority = false,
}: {
  /** Leave empty where the logo sits next to visible "CSI" text. */
  alt?: string;
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      alt={alt}
      className={cn("object-contain select-none", className)}
      draggable={false}
      priority={priority}
      sizes="(min-width: 768px) 26px, 10px"
      src={csiLogo}
    />
  );
}
