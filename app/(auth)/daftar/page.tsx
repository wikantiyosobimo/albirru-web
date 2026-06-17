import { Star, Compass, BarChart3, Backpack, Presentation, Lock } from "lucide-react";
import { AuthLayout } from "@/components/sections/auth/auth-layout";
import { AuthLeftPanel } from "@/components/sections/auth/auth-left-panel";
import { StepIndicator } from "@/components/sections/auth/step-indicator";
import { RoleCard } from "@/components/sections/auth/role-card";

const FEATURES = [
  { icon: Star, title: "Kampus Impian", desc: "Raih kampus terbaik yang kamu impikan" },
  { icon: Compass, title: "Academic Navigator", desc: "Dapatkan arahan belajar sesuai targetmu" },
  { icon: BarChart3, title: "Analisis Personal", desc: "Pahami kekuatan & kelemahan untuk hasil maksimal" },
];

export default function DaftarPage() {
  return (
    <AuthLayout
      topRight={{ text: "Sudah punya akun?", linkLabel: "Masuk di sini", href: "/masuk" }}
      left={
        <AuthLeftPanel
          headline={
            <>
              Mulai perjalananmu menuju <span className="text-brand">kampus impian.</span>
            </>
          }
          subheading="Bergabung bersama puluhan ribu siswa dan tenaga akademik untuk meraih masa depan terbaik."
          features={FEATURES}
        />
      }
    >
      <StepIndicator current={1} />
      <h2 className="mt-6 text-center text-h-md text-ink">Daftar di Albirru</h2>
      <p className="mt-2 text-center text-body-sm text-ink-body">
        Pilih peran yang paling sesuai denganmu untuk memulai perjalanan akademik.
      </p>
      <div className="mt-6 flex flex-col gap-3">
        <RoleCard
          href="/daftar/buat-akun?peran=siswa"
          emphasized
          title="Saya Siswa"
          desc="Saya mendaftar sebagai siswa untuk persiapan masuk PTN."
          avatar={<Backpack size={28} />}
          accent="bg-brand-100 text-brand"
        />
        <RoleCard
          href="/daftar/buat-akun?peran=staf"
          title="Saya Tenaga Akademik"
          desc="Saya mendaftar sebagai guru, dosen, atau tenaga akademik."
          avatar={<Presentation size={28} />}
          accent="bg-[#DCF5EA] text-[#0E8A5C]"
        />
      </div>
      <div className="mt-6 flex items-center justify-center gap-2">
        <Lock size={14} className="text-ink-muted" />
        <span className="text-caption text-ink-muted">Data kamu aman dan terlindungi.</span>
      </div>
    </AuthLayout>
  );
}
