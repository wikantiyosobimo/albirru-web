"use client";

import { useState } from "react";
import { ShieldCheck, CheckCircle2, Save } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { PasswordField } from "@/components/ui/password-field";

export function ChangePasswordForm({ email }: { email: string }) {
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const lama = String(f.get("lama") ?? "");
    const baru = String(f.get("baru") ?? "");
    const konfirmasi = String(f.get("konfirmasi") ?? "");
    if (baru.length < 8) { setError("Kata sandi baru minimal 8 karakter."); return; }
    if (baru !== konfirmasi) { setError("Konfirmasi kata sandi tidak cocok."); return; }
    setError(null); setStatus("loading");
    const supabase = createClient();
    // Verifikasi kata sandi lama (re-auth) sesuai AC PRD.
    const { error: reauth } = await supabase.auth.signInWithPassword({ email, password: lama });
    if (reauth) { setError("Kata sandi lama salah."); setStatus("idle"); return; }
    const { error } = await supabase.auth.updateUser({ password: baru });
    if (error) { setError(error.message); setStatus("idle"); return; }
    setStatus("done");
  }

  if (status === "done") {
    return (
      <div className="rounded-xl border border-success/30 bg-success-subtle p-5 text-center">
        <CheckCircle2 className="mx-auto text-success" size={32} />
        <h3 className="mt-2 text-h-sm text-ink">Kata sandi diperbarui</h3>
        <p className="mt-1 text-body-sm text-ink-body">Gunakan kata sandi baru saat masuk berikutnya.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      {error ? <p className="rounded-md bg-[#FCE4E4] px-3 py-2 text-body-sm text-[#B4282C]">{error}</p> : null}
      <PasswordField label="Kata Sandi Lama" name="lama" placeholder="Masukkan kata sandi saat ini" autoComplete="current-password" />
      <PasswordField label="Kata Sandi Baru" name="baru" placeholder="Minimal 8 karakter" autoComplete="new-password" />
      <PasswordField label="Konfirmasi Kata Sandi Baru" name="konfirmasi" placeholder="Ulangi kata sandi baru" autoComplete="new-password" />
      <button type="submit" disabled={status === "loading"} className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-brand text-label text-white transition hover:bg-brand-600 disabled:opacity-60">
        <Save size={18} /> {status === "loading" ? "Menyimpan…" : "Simpan Kata Sandi"}
      </button>
      <p className="flex items-center gap-1.5 text-caption text-ink-muted"><ShieldCheck size={13} /> Kami memverifikasi kata sandi lamamu sebelum mengganti.</p>
    </form>
  );
}
