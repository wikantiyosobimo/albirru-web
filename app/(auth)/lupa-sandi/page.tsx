import Link from "next/link";
import { KeyRound, ShieldCheck, MailCheck, ArrowLeft } from "lucide-react";
import { AuthLayout } from "@/components/sections/auth/auth-layout";
import { AuthLeftPanel } from "@/components/sections/auth/auth-left-panel";
import { ForgotPasswordForm } from "@/components/sections/auth/forgot-password-form";

export const metadata = { title: "Lupa Kata Sandi — Albirru" };

const FEATURES = [
  { icon: KeyRound, title: "Reset Aman", desc: "Tautan reset dikirim langsung ke emailmu" },
  { icon: ShieldCheck, title: "Terenkripsi", desc: "Semua proses dilindungi enkripsi" },
  { icon: MailCheck, title: "Cepat", desc: "Email biasanya masuk dalam beberapa menit" },
];

export default function LupaSandiPage() {
  return (
    <AuthLayout
      topRight={{ text: "Sudah ingat?", linkLabel: "Masuk", href: "/masuk" }}
      left={
        <AuthLeftPanel
          headline={<>Tenang, <span className="text-brand">kata sandimu bisa dipulihkan.</span></>}
          subheading="Masukkan email terdaftar dan kami akan mengirimkan tautan untuk membuat kata sandi baru."
          features={FEATURES}
          floatingCard={{ label: "Keamanan", title: "Akunmu Terlindungi", desc: "Hanya kamu yang bisa mengakses tautan reset di emailmu." }}
        />
      }
    >
      <h2 className="text-center text-h-md text-ink">Lupa kata sandi?</h2>
      <p className="mt-2 text-center text-body-sm text-ink-body">Masukkan emailmu untuk menerima tautan reset.</p>
      <div className="mt-6">
        <ForgotPasswordForm />
      </div>
      <div className="mt-6 text-center">
        <Link href="/masuk" className="inline-flex items-center gap-1.5 text-body-sm font-semibold text-brand hover:underline">
          <ArrowLeft size={15} /> Kembali ke halaman masuk
        </Link>
      </div>
    </AuthLayout>
  );
}
