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

// Buat paket try out baru (staf/admin).
export async function createTryOut(formData: FormData): Promise<{ ok: boolean; error?: string }> {
  const { user, profile } = await getPortalProfile();
  if (profile?.role !== "staf" && profile?.role !== "admin") return { ok: false, error: "Tidak berwenang." };

  const judul = String(formData.get("judul") ?? "").trim();
  const tipe = String(formData.get("tipe") ?? "SNBT");
  const durasi = Number(formData.get("durasi") ?? 100) || 100;
  const jumlahSoal = Number(formData.get("jumlah_soal") ?? 20) || 20;
  const harga = Number(formData.get("harga") ?? 0) || 0;
  if (!judul) return { ok: false, error: "Judul wajib diisi." };

  const slug = judul.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60) || `tryout-${Date.now()}`;

  try {
    const supabase = await createClient();
    const { error } = await supabase.from("tryouts").insert({
      id: slug, title: judul, slug, tipe, durasi_menit: durasi,
      jumlah_soal: jumlahSoal, harga, status: "draft",
      dibuat_oleh: user?.id,
    });
    if (error) return { ok: false, error: error.message };
    revalidatePath("/staf/try-out");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Gagal menyimpan." };
  }
}

// Buat soal baru (admin/staf). Kunci jawaban DISIMPAN server-side, tak pernah dikirim ke klien.
export async function createQuestion(formData: FormData): Promise<{ ok: boolean; error?: string }> {
  const { profile } = await getPortalProfile();
  if (profile?.role !== "staf" && profile?.role !== "admin") return { ok: false, error: "Tidak berwenang." };

  const mapel = String(formData.get("mapel") ?? "").trim();
  const soal = String(formData.get("soal") ?? "").trim();
  const answer_key = String(formData.get("answer_key") ?? "").trim().toUpperCase();
  const level = Number(formData.get("level_kesulitan") ?? 3) || 3;
  const tipe = String(formData.get("tipe") ?? "pilihan_ganda");
  const cognitive_skill = String(formData.get("cognitive_skill") ?? "").trim() || null;
  const kode = String(formData.get("kode") ?? "").trim() || null;
  const pembahasan = String(formData.get("pembahasan") ?? "").trim() || null;

  // Bangun array opsi (A–E), buang ekor yang kosong agar selaras dengan struktur konten asli.
  const opsiRaw = ["opsi_a", "opsi_b", "opsi_c", "opsi_d", "opsi_e"].map((k) => String(formData.get(k) ?? "").trim());
  let lastFilled = -1;
  opsiRaw.forEach((v, i) => { if (v) lastFilled = i; });
  const opsi = opsiRaw.slice(0, lastFilled + 1);

  if (!soal) return { ok: false, error: "Teks soal wajib diisi." };
  if (!["A", "B", "C", "D", "E"].includes(answer_key)) return { ok: false, error: "Kunci jawaban harus A–E." };
  if (opsi.length < 2) return { ok: false, error: "Isi minimal 2 opsi jawaban." };
  if ((answer_key.charCodeAt(0) - 64) > opsi.length) return { ok: false, error: `Opsi ${answer_key} belum diisi.` };

  try {
    const supabase = await createClient();
    // Tulis via SECURITY DEFINER RPC — answer_key (rahasia) tak pernah lewat kolom yang ter-grant ke klien.
    const { error } = await supabase.rpc("admin_create_question", {
      p_mapel: mapel || "Penalaran Umum", p_soal: soal, p_opsi: opsi, p_answer_key: answer_key,
      p_level: level, p_tipe: tipe, p_skill: cognitive_skill, p_kode: kode, p_pembahasan: pembahasan,
    });
    if (error) return { ok: false, error: error.message };
    revalidatePath("/admin/bank-soal");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Gagal menyimpan." };
  }
}

// Buat topik / taksonomi (admin/staf).
export async function createTopic(formData: FormData): Promise<{ ok: boolean; error?: string }> {
  const { profile } = await getPortalProfile();
  if (profile?.role !== "staf" && profile?.role !== "admin") return { ok: false, error: "Tidak berwenang." };

  const nama = String(formData.get("nama") ?? "").trim();
  const mapel = String(formData.get("mapel") ?? "").trim();
  const level = Number(formData.get("level") ?? 1) || 1;
  const urutan = Number(formData.get("urutan") ?? 0) || 0;
  if (!nama || !mapel) return { ok: false, error: "Nama topik & mapel wajib diisi." };

  try {
    const supabase = await createClient();
    const { error } = await supabase.from("topics").insert({ slug: slugify(nama), nama, mapel, level, urutan });
    if (error) return { ok: false, error: error.message };
    revalidatePath("/admin/topik");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Gagal menyimpan." };
  }
}

// Tambah sekolah mitra (admin).
export async function createSchool(formData: FormData): Promise<{ ok: boolean; error?: string }> {
  const { profile } = await getPortalProfile();
  if (profile?.role !== "admin") return { ok: false, error: "Hanya admin." };

  const nama = String(formData.get("nama") ?? "").trim();
  const kota = String(formData.get("kota") ?? "").trim() || null;
  const provinsi = String(formData.get("provinsi") ?? "").trim() || null;
  const plan = String(formData.get("plan") ?? "free");
  if (!nama) return { ok: false, error: "Nama sekolah wajib diisi." };

  const kode = nama.split(/\s+/).map((w) => w[0] ?? "").join("").toUpperCase().slice(0, 4) + "-" + Math.floor(1000 + (nama.length * 137) % 9000);

  try {
    const supabase = await createClient();
    const { error } = await supabase.from("schools").insert({ nama, kode, kota, provinsi, plan });
    if (error) return { ok: false, error: error.message };
    revalidatePath("/admin/sekolah");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Gagal menyimpan." };
  }
}

// Buat blueprint paket (admin).
export async function createBlueprint(formData: FormData): Promise<{ ok: boolean; error?: string }> {
  const { profile } = await getPortalProfile();
  if (profile?.role !== "admin") return { ok: false, error: "Hanya admin." };

  const nama = String(formData.get("nama") ?? "").trim();
  const tipe = String(formData.get("tipe") ?? "SNBT");
  const durasi = Number(formData.get("durasi_menit") ?? 0) || null;
  if (!nama) return { ok: false, error: "Nama blueprint wajib diisi." };

  // Komposisi: pasangan mapel|jumlah dari textarea (satu per baris).
  const raw = String(formData.get("komposisi") ?? "").trim();
  const komposisi = raw.split("\n").map((line) => {
    const [mapel, jumlah] = line.split("|").map((s) => s.trim());
    return mapel ? { mapel, jumlah: Number(jumlah) || 0 } : null;
  }).filter(Boolean);

  try {
    const supabase = await createClient();
    const { error } = await supabase.from("test_blueprints").insert({ nama, tipe, durasi_menit: durasi, komposisi });
    if (error) return { ok: false, error: error.message };
    revalidatePath("/admin/blueprint");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Gagal menyimpan." };
  }
}

// Kirim email reset password ke pengguna (admin).
export async function sendPasswordReset(email: string): Promise<{ ok: boolean; error?: string }> {
  const { profile } = await getPortalProfile();
  if (profile?.role !== "admin") return { ok: false, error: "Hanya admin." };
  if (!email) return { ok: false, error: "Email tidak tersedia." };
  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://albirru-web.vercel.app"}/lupa-sandi/reset`,
    });
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Gagal mengirim." };
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
