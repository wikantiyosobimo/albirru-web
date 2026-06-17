"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type AuthState = { error?: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function login(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return { error: "Email dan kata sandi wajib diisi." };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: "Email atau kata sandi salah." };
  redirect("/app");
}

export async function signup(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const nama = String(formData.get("nama") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const konfirmasi = String(formData.get("konfirmasi") ?? "");
  const peran = String(formData.get("peran") ?? "siswa") === "staf" ? "staf" : "siswa";

  if (nama.length < 2) return { error: "Nama tidak valid." };
  if (!EMAIL_RE.test(email)) return { error: "Email tidak valid." };
  if (password.length < 8) return { error: "Kata sandi minimal 8 karakter." };
  if (password !== konfirmasi) return { error: "Konfirmasi kata sandi tidak cocok." };

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { nama, role: peran } },
  });
  if (error) {
    return { error: /registered|already/i.test(error.message) ? "Email sudah terdaftar." : "Gagal mendaftar. Coba lagi." };
  }
  redirect("/onboarding");
}
