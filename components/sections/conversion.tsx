"use client";

import { useState } from "react";
import { Calendar } from "lucide-react";
import { Container } from "@/components/layout/container";
import { CtaCard } from "@/components/common/cta-card";
import { TestimonialCard } from "@/components/common/testimonial-card";
import { TESTIMONIALS } from "@/lib/content";

export function Conversion() {
  const [idx, setIdx] = useState(0);

  return (
    <section className="bg-canvas pb-16 md:pb-24">
      <Container className="grid gap-5 lg:grid-cols-12">
        <CtaCard
          className="lg:col-span-4"
          variant="navyPhoto"
          title="Siap memulai perjalananmu?"
          body="Daftar sekarang dan dapatkan pengalaman belajar personal yang akan membawamu lebih dekat ke kampus impian."
          ctaLabel="Daftar Gratis Sekarang"
          ctaHref="/daftar"
        />

        <TestimonialCard className="lg:col-span-5" testimonial={TESTIMONIALS[idx]}>
          <div className="mt-5 flex gap-2" role="tablist" aria-label="Testimoni">
            {TESTIMONIALS.map((t, i) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-label={`Testimoni ${i + 1}`}
                aria-selected={i === idx}
                onClick={() => setIdx(i)}
                className="rounded-full transition-all"
                style={{
                  height: 8,
                  width: i === idx ? 22 : 8,
                  backgroundColor: i === idx ? "var(--blue-500)" : "var(--border)",
                }}
              />
            ))}
          </div>
        </TestimonialCard>

        <CtaCard
          className="lg:col-span-3"
          variant="gradientIcon"
          icon={Calendar}
          title="Try Out Nasional Terjadwal"
          body="Simulasi UTBK-SNBT terbaru setiap pekan."
          ctaLabel="Lihat Jadwal"
          ctaHref="/try-out"
        />
      </Container>
    </section>
  );
}
