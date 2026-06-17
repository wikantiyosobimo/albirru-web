"use server";

import { createClient } from "@/lib/supabase/server";
import type { LeadInsert } from "@/lib/supabase/types";

export type CreateLeadResult = { ok: true } | { ok: false; error: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Called from the "Daftar Gratis" form. Stores a lead via RLS anon-insert policy.
export async function createLead(input: LeadInsert): Promise<CreateLeadResult> {
  const nama = input.nama?.trim();
  const email = input.email?.trim().toLowerCase();
  const asal = input.asal_sekolah?.trim() || null;

  if (!nama || nama.length < 2) return { ok: false, error: "Nama tidak valid." };
  if (!email || !EMAIL_RE.test(email)) return { ok: false, error: "Email tidak valid." };

  const supabase = await createClient();
  const { error } = await supabase.from("leads").insert({
    nama,
    email,
    asal_sekolah: asal,
    source: input.source ?? "landing",
  });

  if (error) return { ok: false, error: "Gagal menyimpan. Silakan coba lagi." };
  return { ok: true };
}
