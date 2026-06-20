import Link from "next/link";
import { Star, Compass, BarChart3, FileText, ArrowLeft, Lock } from "lucide-react";
import { AuthLayout } from "@/components/sections/auth/auth-layout";
import { AuthLeftPanel } from "@/components/sections/auth/auth-left-panel";
import { StepIndicator } from "@/components/sections/auth/step-indicator";
import { AuthDivider } from "@/components/sections/auth/auth-divider";
import { GoogleButton } from "@/components/sections/auth/google-button";
import { SignupForm } from "@/components/sections/auth/signup-form";

const FEATURES = [
  { icon: Star, title: "Kampus Impian", desc: "Raih kampus terbaik yang kamu impikan" },
  { icon: Compass, title: "Academic Navigator", desc: "Dapatkan arahan belajar sesuai targetmu" },
  { icon: BarChart3, title: "Analisis Personal", desc: "Pahami kekuatan & kelemahan untuk hasil maksimal" },
  { icon: FileText, title: "Try Out Berkualitas", desc: "Ukur kemampuanmu dengan tes yang relevan dan akurat" },
];

export default function BuatAkunPage({ searchParams }: { searchParams: { peran?: string } }) {
  const peran = searchParams.peran === "staf" ? "staf" : "siswa";
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
          subheading="Bersama Albirru, wujudkan tujuan akademikmu dengan strategi yang tepat, terarah, dan terukur."
          features={FEATURES}
        />
      }
    >
      <Link href="/daftar" className="mb-2 inline-flex items-center gap-1.5 text-body-sm text-ink-body hover:text-ink">
        <ArrowLeft size={16} /> Kembali
      </Link>
      <StepIndicator current={2} />
      <h2 className="mt-6 text-center text-h-md text-ink">Buat Akun Albirru</h2>
      <p className="mt-2 text-center text-body-sm text-ink-body">Isi data dirimu untuk memulai perjalanan akademikmu.</p>
      <div className="mt-6">
        <SignupForm peran={peran} />
      </div>
      <div className="mt-4">
        <AuthDivider label="atau daftar dengan" />
      </div>
      <div className="mt-4">
        <GoogleButton label="Daftar dengan Google" peran={peran} />
      </div>
      <div className="mt-6 flex items-center justify-center gap-2">
        <Lock size={14} className="text-ink-muted" />
        <span className="text-caption text-ink-muted">Data kamu aman dan terlindungi.</span>
      </div>
    </AuthLayout>
  );
}
