"use client";

import { useState } from "react";
import { Mail, ArrowRight, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Field } from "@/components/ui/field";

export function ForgotPasswordForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "sent">("idle");
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setStatus("loading");
    const supabase = createClient();
    const redirectTo = typeof window !== "undefined" ? `${window.location.origin}/auth/callback?next=/lupa-sandi/reset` : undefined;
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
    if (error) {
      setError("Gagal mengirim email. Periksa alamat email dan coba lagi.");
      setStatus("idle");
      return;
    }
    setStatus("sent");
  }

  if (status === "sent") {
    return (
      <div className="rounded-xl border border-success/30 bg-success-subtle p-5 text-center">
        <CheckCircle2 className="mx-auto text-success" size={32} />
        <h3 className="mt-2 text-h-sm text-ink">Email terkirim!</h3>
        <p className="mt-1 text-body-sm text-ink-body">Kami sudah mengirim tautan reset kata sandi ke <b>{email}</b>. Cek kotak masuk (dan folder spam) ya.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      {error ? <p className="rounded-md bg-[#FCE4E4] px-3 py-2 text-body-sm text-[#B4282C]">{error}</p> : null}
      <Field
        label="Email" name="email" type="email" icon={Mail}
        placeholder="Masukkan email terdaftar" autoComplete="email" required
        value={email} onChange={(e) => setEmail(e.target.value)}
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="group inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-brand text-label text-white transition hover:bg-brand-600 disabled:opacity-60"
      >
        <ArrowRight size={18} />
        <span>{status === "loading" ? "Mengirim…" : "Kirim Tautan Reset"}</span>
      </button>
    </form>
  );
}
