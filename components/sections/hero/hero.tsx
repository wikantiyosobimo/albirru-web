import { ArrowRight, FileText, ShieldCheck, Target } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Monogram } from "@/components/common/monogram";
import { DashboardMockup } from "./dashboard-mockup";

const AVATARS = ["A", "R", "N", "F"];

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-navy-900">
      <div className="blob absolute -right-32 -top-32 h-[520px] w-[520px] blur-sm" aria-hidden />
      <Container className="relative grid items-center gap-12 pb-16 pt-12 md:py-24 lg:grid-cols-2">
        {/* copy */}
        <div>
          <h1 className="text-display text-white">
            <span className="block">Personal</span>
            <span className="block text-brand-300">Academic</span>
            <span className="block text-brand-300">Intelligence</span>
            <span className="block">System</span>
          </h1>
          <p className="mt-5 max-w-[440px] text-body-lg text-white/72">
            Sistem bimbingan belajar online yang memahami kamu, menemukan kelemahanmu, dan memandu langkahmu menuju
            kampus impian.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Button href="/daftar" variant="primary" trailingIcon={ArrowRight} fullWidth className="sm:w-auto">
              Mulai Sekarang
            </Button>
            <Button href="/try-out" variant="ghostInverse" leadingIcon={FileText} fullWidth className="sm:w-auto">
              Coba Try Out Gratis
            </Button>
          </div>
          <div className="mt-8 flex items-center gap-4">
            <div className="flex">
              {AVATARS.map((l, i) => (
                <div key={l} style={{ marginLeft: i === 0 ? 0 : -10 }}>
                  <Monogram label={l} size={40} ring />
                </div>
              ))}
            </div>
            <p className="text-body-sm text-white/72">
              Bergabung dengan <span className="font-bold text-brand-300">120.000+</span> siswa di seluruh Indonesia
            </p>
          </div>
          <div className="mt-6 flex items-center gap-2">
            <ShieldCheck size={18} className="text-brand-300" />
            <span className="text-caption text-white/72">Tepercaya oleh sekolah dan siswa di seluruh Indonesia</span>
          </div>
        </div>

        {/* visual */}
        <div className="relative">
          <div className="grad-photo absolute -right-8 bottom-0 hidden h-[78%] w-[46%] rounded-xl opacity-90 xl:block" aria-hidden />
          <div className="relative z-10">
            <DashboardMockup />
          </div>
          <div className="relative z-20 mt-4 max-w-[300px] rounded-xl bg-brand p-4 text-white shadow-lg lg:absolute lg:bottom-0 lg:left-0 lg:mt-0">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/15">
                <Target size={20} className="text-white" />
              </div>
              <div>
                <div className="text-label text-white">Rekomendasi Utama</div>
                <p className="mt-1 text-caption text-white/72">
                  Tingkatkan Literasi Bahasa Indonesia sebesar 18% untuk mencapai target Psikologi UGM
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
