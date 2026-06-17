import type { ReactNode } from "react";
import { Quote, Users, Building2, Star, Headset } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Logo } from "@/components/common/logo";

export interface AuthFeature {
  icon: LucideIcon;
  title: string;
  desc: string;
}

const STATS = [
  { icon: Users, value: "23.814+", label: "Siswa Terdaftar" },
  { icon: Building2, value: "1.842+", label: "Kampus Tujuan" },
  { icon: Star, value: "98,6%", label: "Puas dengan Albirru" },
  { icon: Headset, value: "24/7", label: "Dukungan" },
];

// NOTE: ilustrasi gunung/jalur/kampus & avatar 3D = aset brand (belum tersedia).
// Sekarang pakai panel gradient + konten; ganti background dengan ilustrasi asli.
export function AuthLeftPanel({
  headline,
  subheading,
  features,
  floatingCard,
}: {
  headline: ReactNode;
  subheading: string;
  features: AuthFeature[];
  floatingCard?: { label: string; title: string; desc: string };
}) {
  return (
    <div
      className="relative hidden flex-col justify-between overflow-hidden p-10 lg:flex"
      style={{ backgroundImage: "linear-gradient(160deg,#eef3ff 0%,#dce8ff 55%,#cfe0ff 100%)" }}
    >
      <div className="relative z-10">
        <Logo />
        <div className="mt-10 max-w-md">
          <h1 className="text-h-xl text-ink">{headline}</h1>
          <p className="mt-3 text-body text-ink-body">{subheading}</p>
        </div>
      </div>

      <div className="relative z-10 my-8 flex max-w-sm flex-col gap-5">
        {features.map((f) => {
          const Icon = f.icon;
          return (
            <div key={f.title} className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-brand shadow-sm">
                <Icon size={20} />
              </div>
              <div>
                <div className="text-label text-ink">{f.title}</div>
                <div className="text-body-sm text-ink-body">{f.desc}</div>
              </div>
            </div>
          );
        })}
        {floatingCard ? (
          <div className="mt-2 max-w-xs rounded-xl p-4 text-white" style={{ background: "rgba(11,26,71,0.82)" }}>
            <div className="text-caption text-white/72">{floatingCard.label}</div>
            <div className="text-h-sm text-white">{floatingCard.title}</div>
            <div className="mt-1 text-body-sm text-white/72">{floatingCard.desc}</div>
          </div>
        ) : null}
      </div>

      <div className="relative z-10">
        <div className="flex max-w-xs items-start gap-2">
          <Quote size={20} className="shrink-0 text-brand-300" />
          <p className="text-body-sm italic text-ink-body">
            &ldquo;Perjalanan seribu mil dimulai dari satu langkah.&rdquo; — Lao Tzu
          </p>
        </div>
        <div className="mt-6 grid grid-cols-4 gap-3 rounded-xl bg-white/60 p-4">
          {STATS.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="flex flex-col gap-1">
                <Icon size={18} className="text-brand" />
                <div className="text-label text-ink">{s.value}</div>
                <div className="text-[11px] leading-tight text-ink-muted">{s.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
