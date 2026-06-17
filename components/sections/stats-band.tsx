import { Container } from "@/components/layout/container";
import { StatItem } from "@/components/common/stat-item";
import { STATS } from "@/lib/content";

export function StatsBand() {
  return (
    <section className="bg-canvas py-8 md:py-12">
      <Container>
        <div className="relative overflow-hidden rounded-2xl bg-navy-800 p-8 md:p-10">
          <div className="grad-photo absolute right-0 top-0 hidden h-full w-[36%] opacity-90 lg:block" aria-hidden />
          <div className="relative grid grid-cols-2 gap-8 lg:grid-cols-4 lg:pr-[38%]">
            {STATS.map((s) => (
              <StatItem key={s.id} stat={s} />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
