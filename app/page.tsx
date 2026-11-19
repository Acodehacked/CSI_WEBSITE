import { About } from "@/app/_components/home/about";
import { Events } from "@/app/_components/home/events";
import { Hero } from "@/app/_components/home/hero";
import { Join } from "@/app/_components/home/join";
import { Manifesto } from "@/app/_components/home/manifesto";
import { PageShell } from "@/app/_components/home/page-shell";
import { Programmes } from "@/app/_components/home/programmes";
import { Tracks } from "@/app/_components/home/tracks";
import { Vision } from "@/app/_components/home/vision";

export default function Home() {
  return (
    <PageShell rail>
      <Hero />
      <Manifesto />
      <Vision />
      <About />
      <Tracks />
      <Programmes />
      <Events />
      <Join />
    </PageShell>
  );
}
