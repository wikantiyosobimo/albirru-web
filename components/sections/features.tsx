import { Container } from "@/components/layout/container";
import { Eyebrow } from "@/components/common/eyebrow";
import { FeatureCard } from "@/components/common/feature-card";
import { FEATURES } from "@/lib/content";

export function Features() {
  return (
    <section className="bg-muted py-16 md:py-24">
      <Container className="gap-10 lg:flex">
        <div className="max-w-[280px] shrink-0">
          <Eyebrow>Kenapa Albirru?</Eyebrow>
          <h2 className="mt-4 text-h-xl text-ink">
            Lebih dari
            <br />
            sekadar try out.
          </h2>
          <p className="mt-4 text-body-sm text-ink-body">
            Albirru memadukan teknologi, data, dan metode terbaik untuk membantumu mencapai hasil yang terukur.
          </p>
        </div>
        <div className="mt-8 grid flex-1 grid-cols-1 gap-5 sm:grid-cols-2 lg:mt-0 lg:grid-cols-5">
          {FEATURES.map((f) => (
            <FeatureCard key={f.id} feature={f} />
          ))}
        </div>
      </Container>
    </section>
  );
}
