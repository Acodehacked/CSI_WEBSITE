import { About } from "@/app/_components/home/about";
import { Closing } from "@/app/_components/home/closing";
import { Events } from "@/app/_components/home/events";
import { Hero } from "@/app/_components/home/hero";
import { Join } from "@/app/_components/home/join";
import { Manifesto } from "@/app/_components/home/manifesto";
import { Programmes } from "@/app/_components/home/programmes";
import { SiteChrome } from "@/app/_components/home/site-chrome";
import { SmoothScroll } from "@/app/_components/home/smooth-scroll";
import { Tracks } from "@/app/_components/home/tracks";
import { Vision } from "@/app/_components/home/vision";

export default function Home() {
  return (
    <SmoothScroll>
      <div className="bg-black font-(family-name:--font-geist-sans) text-white antialiased selection:bg-[#9cc2ff] selection:text-black">
        <SiteChrome />
        <main>
          <Hero />
          <Manifesto />
          <Vision />
          <About />
          <Tracks />
          <Programmes />
          <Events />
          <Join />
        </main>
        <Closing />
      </div>
    </SmoothScroll>
  );
}
