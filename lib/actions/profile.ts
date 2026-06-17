"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type ProfileState = { error?: string; ok?: boolean };

export async function updateProfile(_prev: ProfileState, formData: FormData): Promise<ProfileState> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/masuk");

  const nama = String(formData.get("nama") ?? "").trim();
  const jenjang = String(formData.get("jenjang") ?? "").trim() || null;
  const jurusan = String(formData.get("jurusan") ?? "").trim() || null;
  const asal_sekolah = String(formData.get("asal_sekolah") ?? "").trim() || null;
  const segment = String(formData.get("segment") ?? "utbk").trim() || "utbk";
  const isAparatur = segment === "cpns" || segment === "pppk";

  const target_kampus = isAparatur ? null : String(formData.get("target_kampus") ?? "").trim() || null;
  const target_prodi = isAparatur ? null : String(formData.get("target_prodi") ?? "").trim() || null;
  const target_instansi = isAparatur ? String(formData.get("target_instansi") ?? "").trim() || null : null;
  const target_jabatan = isAparatur ? String(formData.get("target_jabatan") ?? "").trim() || null : null;
  const skorRaw = String(formData.get("target_skor") ?? "").trim();
  const target_skor = skorRaw ? Number(skorRaw) : null;

  if (!nama) return { error: "Nama tidak boleh kosong." };
  if (target_skor !== null && (Number.isNaN(target_skor) || target_skor < 0 || target_skor > 1000)) {
    return { error: "Target skor tidak valid." };
  }

  const { error } = await supabase
    .from("profiles")
    .update({ nama, jenjang, jurusan, asal_sekolah, segment, target_kampus, target_prodi, target_instansi, target_jabatan, target_skor })
    .eq("id", user.id);

  if (error) return { error: "Gagal menyimpan. Silakan coba lagi." };

  revalidatePath("/app/profil");
  revalidatePath("/app");
  redirect("/app/profil");
}
