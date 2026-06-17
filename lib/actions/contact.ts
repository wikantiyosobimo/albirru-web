"use server";

import { createClient } from "@/lib/supabase/server";

export type ContactState = { ok?: boolean; error?: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function submitContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const nama = String(formData.get("nama") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const whatsapp = String(formData.get("whatsapp") ?? "").trim() || null;
  const topik = String(formData.get("topik") ?? "").trim() || null;
  const pesan = String(formData.get("pesan") ?? "").trim();

  if (nama.length < 2) return { error: "Nama tidak valid." };
  if (!EMAIL_RE.test(email)) return { error: "Email tidak valid." };
  if (pesan.length < 10) return { error: "Pesan terlalu pendek (min. 10 karakter)." };

  const supabase = await createClient();
  const { error } = await supabase.from("contacts").insert({ nama, email, whatsapp, topik, pesan });
  if (error) return { error: "Gagal mengirim pesan. Silakan coba lagi." };
  return { ok: true };
}
