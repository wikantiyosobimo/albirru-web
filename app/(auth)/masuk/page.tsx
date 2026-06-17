import { BookOpen, Compass, Target, BarChart3, FileText, ShieldCheck } from "lucide-react";
import { AuthLayout } from "@/components/sections/auth/auth-layout";
import { AuthLeftPanel } from "@/components/sections/auth/auth-left-panel";
import { AuthDivider } from "@/components/sections/auth/auth-divider";
import { GoogleButton } from "@/components/sections/auth/google-button";
import { LoginForm } from "@/components/sections/auth/login-form";

const FEATURES = [
  { icon: BookOpen, title: "Belajar Terarah", desc: "Tingkatkan kemampuan dengan belajar efektif" },
  { icon: Compass, title: "Academic Navigator", desc: "Dapatkan rekomendasi strategi personal" },
  { icon: Target, title: "Peta Kelemahan", desc: "Temukan kelemahanmu per topik dan materi" },
  { icon: BarChart3, title: "Analisis", desc: "Pahami hasilmu dengan analisis mendalam" },
  { icon: FileText, title: "Try Out", desc: "Ukur kemampuanmu dengan try out berkualitas" },
];

export default function MasukPage() {
  return (
    <AuthLayout
      topRight={{ text: "Belum punya akun?", linkLabel: "Daftar sekarang", href: "/daftar" }}
      left={
        <AuthLeftPanel
          headline={
            <>
              Setiap langkah hari ini, <span className="text-brand">membawa kamu lebih dekat ke kampus impian.</span>
            </>
          }
          subheading="Lanjutkan perjalanan akademikmu bersama Albirru dan wujudkan masa depan terbaik."
          features={FEATURES}
          floatingCard={{ label: "Posisimu Saat Ini", title: "Siap Melangkah", desc: "Perjalanan akademikmu menunggu untuk dilanjutkan." }}
        />
      }
    >
      <h2 className="text-center text-h-md text-ink">Selamat datang kembali!</h2>
      <p className="mt-2 text-center text-body-sm text-ink-body">Masuk untuk melanjutkan perjalanan akademikmu.</p>
      <div className="mt-6">
        <LoginForm />
      </div>
      <div className="mt-4">
        <AuthDivider label="atau lanjutkan dengan" />
      </div>
      <div className="mt-4">
        <GoogleButton label="Masuk dengan Google" />
      </div>
      <div className="mt-6 flex items-center justify-center gap-2">
        <ShieldCheck size={16} className="shrink-0 text-ink-muted" />
        <span className="text-caption text-ink-muted">Keamanan akun Anda prioritas kami. Semua data dienkripsi dengan aman.</span>
      </div>
    </AuthLayout>
  );
}
