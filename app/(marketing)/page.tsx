import { Hero } from "@/components/sections/hero/hero";
import { Features } from "@/components/sections/features";
import { StatsBand } from "@/components/sections/stats-band";
import { Universities } from "@/components/sections/universities";
import { Conversion } from "@/components/sections/conversion";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Features />
      <StatsBand />
      <Universities />
      <Conversion />
    </>
  );
}
