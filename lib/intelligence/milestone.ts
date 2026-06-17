// TIER 1 — Deterministik. Pure function, tanpa panggilan eksternal.
import type { Milestone, LevelInfo } from "./types";

// T-90 roadmap PRD BAB 9: checkpoint per 30 hari
const MILESTONE_TEMPLATES: Omit<Milestone, "status" | "hari_ke_ujian">[] = [
  { kode: "T-90", judul: "Pemetaan Awal", target: "Selesaikan 1 Try Out diagnostik + isi Target Kampus" },
  { kode: "T-60", judul: "Fondasi Kuat", target: "Akurasi subtes terendah ≥ 50%" },
  { kode: "T-30", judul: "Akselerasi", target: "Skor total ≥ 600 dalam 2 Try Out terakhir" },
  { kode: "T-14", judul: "Simulasi Nyata", target: "Try Out simulasi kondisi ujian (full timer)" },
  { kode: "T-7",  judul: "Persiapan Akhir", target: "Review semua soal salah T-30 s/d sekarang" },
  { kode: "T-1",  judul: "Malam Tenang", target: "Istirahat, cek dokumen, cek lokasi ujian" },
  { kode: "T-0",  judul: "Hari H 🎯", target: "Tampil terbaik!" },
];

const HARI_SETIAP_MILESTONE: Record<string, number> = {
  "T-90": 90,
  "T-60": 60,
  "T-30": 30,
  "T-14": 14,
  "T-7": 7,
  "T-1": 1,
  "T-0": 0,
};

/**
 * Kembalikan daftar milestone + status berdasarkan tanggal ujian.
 * @param tanggalUjian - ISO date "YYYY-MM-DD"
 * @param hari_ini     - opsional untuk testing (default today)
 */
export function getMilestones(tanggalUjian: string, hari_ini?: string): Milestone[] {
  const ujian = new Date(tanggalUjian);
  const today = hari_ini ? new Date(hari_ini) : new Date();
  const hariKe = Math.ceil((ujian.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  return MILESTONE_TEMPLATES.map((tmpl) => {
    const hari_ke_ujian = HARI_SETIAP_MILESTONE[tmpl.kode];
    let status: Milestone["status"];
    if (hariKe > hari_ke_ujian + 3) {
      status = "akan";
    } else if (hariKe < hari_ke_ujian - 3) {
      status = "selesai";
    } else {
      status = "aktif";
    }
    return { ...tmpl, hari_ke_ujian, status };
  });
}

// ────────── Gamification helpers ──────────

const XP_PER_LEVEL = 500;

/**
 * Hitung info level dan XP dari total XP kumulatif.
 */
export function hitungLevel(xp_total: number): LevelInfo {
  const level = Math.floor(xp_total / XP_PER_LEVEL) + 1;
  const xp_level = xp_total % XP_PER_LEVEL;
  const xp_target = XP_PER_LEVEL;
  return {
    level,
    xp_total,
    xp_level,
    xp_target,
    progress: Math.round((xp_level / xp_target) * 100),
  };
}

/**
 * Hitung XP reward untuk sebuah aksi.
 * Daftar aksi bisa dikembangkan — simpan di tabel xp_transactions.
 */
export function hitungXpReward(
  aksi: "tryout" | "latihan" | "review" | "streak_7" | "perfect_score",
): number {
  // TODO: baca dari tabel xp_config di DB agar admin bisa ubah tanpa deploy
  const tabel: Record<string, number> = {
    tryout: 80,
    latihan: 40,
    review: 30,
    streak_7: 100,
    perfect_score: 200,
  };
  return tabel[aksi] ?? 10;
}
