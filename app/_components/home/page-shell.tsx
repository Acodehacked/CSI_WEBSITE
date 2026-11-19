import type { ReactNode } from "react";
import { Closing } from "./closing";
import { SiteChrome } from "./site-chrome";
import { SmoothScroll } from "./smooth-scroll";

/** Header, smooth scroll and the pixel-field footer shared by every page. */
export function PageShell({
  children,
  rail = false,
}: {
  children: ReactNode;
  rail?: boolean;
}) {
  return (
    <SmoothScroll>
      <div className="bg-black font-(family-name:--font-geist-sans) text-white antialiased selection:bg-[#9cc2ff] selection:text-black">
        <SiteChrome rail={rail} />
        <main>{children}</main>
        <Closing />
      </div>
    </SmoothScroll>
  );
}
