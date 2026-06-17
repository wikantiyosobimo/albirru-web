"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { KeyRound, ArrowRight, CheckCircle2, ShieldCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Logo } from "@/components/common/logo";
import { PasswordField } from "@/components/ui/password-field";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const pw = String(form.get("password") ?? "");
    const pw2 = String(form.get("confirm") ?? "");
    if (pw.length < 8) { setError("Kata sandi minimal 8 karakter."); return; }
    if (pw !== pw2) { setError("Konfirmasi kata sandi tidak cocok."); return; }
    setError(null);
    setStatus("loading");
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password: pw });
    if (error) {
      setError(/auth session missing|jwt/i.test(error.message) ? "Sesi reset tidak valid atau kedaluwarsa. Minta tautan baru." : error.message);
      setStatus("idle");
      return;
    }
    setStatus("done");
    setTimeout(() => router.push("/app"), 1500);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border bg-white p-8 shadow-md">
        <Logo />
        {status === "done" ? (
          <div className="mt-6 text-center">
            <CheckCircle2 className="mx-auto text-success" size={36} />
            <h1 className="mt-2 text-h-md text-ink">Kata sandi diperbarui!</h1>
            <p className="mt-1 text-body-sm text-ink-body">Mengarahkanmu ke portal…</p>
          </div>
        ) : (
          <>
            <span className="mt-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-100 text-brand"><KeyRound size={24} /></span>
            <h1 className="mt-4 text-h-md text-ink">Buat kata sandi baru</h1>
            <p className="mt-1 text-body-sm text-ink-body">Masukkan kata sandi baru untuk akunmu.</p>
            <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-5">
              {error ? <p className="rounded-md bg-[#FCE4E4] px-3 py-2 text-body-sm text-[#B4282C]">{error}</p> : null}
              <PasswordField label="Kata Sandi Baru" name="password" placeholder="Minimal 8 karakter" autoComplete="new-password" />
              <PasswordField label="Konfirmasi Kata Sandi" name="confirm" placeholder="Ulangi kata sandi" autoComplete="new-password" />
              <button type="submit" disabled={status === "loading"} className="group inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-brand text-label text-white transition hover:bg-brand-600 disabled:opacity-60">
                {status === "loading" ? "Menyimpan…" : "Simpan Kata Sandi"} <ArrowRight size={18} />
              </button>
            </form>
            <div className="mt-6 flex items-center justify-center gap-2">
              <ShieldCheck size={16} className="shrink-0 text-ink-muted" />
              <span className="text-caption text-ink-muted">Tautan reset berlaku terbatas demi keamanan akunmu.</span>
            </div>
            <div className="mt-4 text-center"><Link href="/masuk" className="text-body-sm font-semibold text-brand hover:underline">Kembali ke Masuk</Link></div>
          </>
        )}
      </div>
    </main>
  );
}
