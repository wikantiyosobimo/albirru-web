import { ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { UniversityCard } from "@/components/common/university-card";
import { UNIVERSITIES } from "@/lib/content";

export function Universities() {
  return (
    <section className="bg-canvas py-16 md:py-24">
      <Container>
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-h-xl text-ink">Menuju Kampus Impian Bersama Albirru</h2>
          <Button href="/success-story" variant="link" trailingIcon={ArrowRight}>
            Lihat semua
          </Button>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {UNIVERSITIES.map((u) => (
            <UniversityCard key={u.id} university={u} />
          ))}
        </div>
      </Container>
    </section>
  );
}
