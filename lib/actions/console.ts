"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getPortalProfile } from "@/lib/portal/session";

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60) || `materi-${Date.now()}`;
}

// Buat materi pembelajaran (staf/admin). RLS memvalidasi role.
export async function createMaterial(formData: FormData): Promise<{ ok: boolean; error?: string }> {
  const { profile } = await getPortalProfile();
  if (profile?.role !== "staf" && profile?.role !== "admin") return { ok: false, error: "Tidak berwenang." };

  const judul = String(formData.get("judul") ?? "").trim();
  const tipe = String(formData.get("tipe") ?? "artikel");
  const durasi = Number(formData.get("durasi") ?? 0) || null;
  const url = String(formData.get("url") ?? "").trim();
  const is_premium = formData.get("is_premium") === "on";
  if (!judul) return { ok: false, error: "Judul wajib diisi." };

  try {
    const supabase = await createClient();
    const { error } = await supabase.from("learning_materials").insert({
      judul, slug: slugify(judul), tipe, durasi_menit: durasi,
      konten: url ? { url } : {}, is_premium, aktif: true,
    });
    if (error) return { ok: false, error: error.message };
    revalidatePath("/staf/materi");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Gagal menyimpan." };
  }
}

// Buat pengumuman (staf/admin).
export async function createAnnouncement(formData: FormData): Promise<{ ok: boolean; error?: string }> {
  const { user, profile } = await getPortalProfile();
  if (profile?.role !== "staf" && profile?.role !== "admin") return { ok: false, error: "Tidak berwenang." };

  const judul = String(formData.get("judul") ?? "").trim();
  const isi = String(formData.get("isi") ?? "").trim();
  if (!judul || !isi) return { ok: false, error: "Judul & isi wajib diisi." };

  try {
    const supabase = await createClient();
    const { error } = await supabase.from("announcements").insert({ judul, isi, dibuat_oleh: user?.id });
    if (error) return { ok: false, error: error.message };
    revalidatePath("/staf/pengumuman");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Gagal menyimpan." };
  }
}

// Buat penugasan (staf/admin).
export async function createAssignment(formData: FormData): Promise<{ ok: boolean; error?: string }> {
  const { user, profile } = await getPortalProfile();
  if (profile?.role !== "staf" && profile?.role !== "admin") return { ok: false, error: "Tidak berwenang." };

  const judul = String(formData.get("judul") ?? "").trim();
  const ref_tipe = String(formData.get("ref_tipe") ?? "tryout");
  const target_kelas = String(formData.get("target_kelas") ?? "").trim() || null;
  const due = String(formData.get("due_at") ?? "").trim();
  if (!judul) return { ok: false, error: "Judul wajib diisi." };

  try {
    const supabase = await createClient();
    const { error } = await supabase.from("assignments").insert({
      judul, ref_tipe, target_kelas, due_at: due || null, dibuat_oleh: user?.id,
    });
    if (error) return { ok: false, error: error.message };
    revalidatePath("/staf/penugasan");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Gagal menyimpan." };
  }
}

// Ubah role pengguna (admin) via RPC ber-audit.
export async function setUserRole(userId: string, role: string): Promise<{ ok: boolean; error?: string }> {
  const { profile } = await getPortalProfile();
  if (profile?.role !== "admin") return { ok: false, error: "Hanya admin." };
  try {
    const supabase = await createClient();
    const { error } = await supabase.rpc("admin_set_role", { p_id: userId, p_role: role });
    if (error) return { ok: false, error: error.message };
    revalidatePath("/admin/pengguna");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Gagal." };
  }
}

// Toggle feature flag (admin) via RPC ber-audit.
export async function toggleFlag(key: string, enabled: boolean): Promise<{ ok: boolean; error?: string }> {
  const { profile } = await getPortalProfile();
  if (profile?.role !== "admin") return { ok: false, error: "Hanya admin." };
  try {
    const supabase = await createClient();
    const { error } = await supabase.rpc("admin_toggle_flag", { p_key: key, p_enabled: enabled });
    if (error) return { ok: false, error: error.message };
    revalidatePath("/admin/pengaturan");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Gagal." };
  }
}
