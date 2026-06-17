// TIER 1 — Deterministik. Pure function, tanpa panggilan eksternal.
import type { RankResult } from "./types";

/**
 * Hitung persentil siswa dalam distribusi skor.
 * Persentil = persen peserta yang skornya LEBIH RENDAH dari `skor`.
 */
export function hitungPersentil(skor: number, distribusi: number[]): number {
  if (distribusi.length === 0) return 0;
  const dibawah = distribusi.filter((s) => s < skor).length;
  return Math.round((dibawah / distribusi.length) * 100);
}

/**
 * Hitung peringkat siswa dari daftar skor semua peserta.
 * Peringkat 1 = skor tertinggi.
 */
export function hitungPeringkat(
  skor: number,
  semua_skor: number[],
): RankResult {
  if (semua_skor.length === 0) {
    return { peringkat: 1, total_peserta: 1, persentil: 100 };
  }
  // TODO: gunakan query Supabase aggregate di route handler, bukan loop client-side
  const sorted = [...semua_skor].sort((a, b) => b - a);
  const peringkat = sorted.findIndex((s) => s <= skor) + 1;
  const persentil = hitungPersentil(skor, semua_skor);
  return {
    peringkat: peringkat === 0 ? sorted.length + 1 : peringkat,
    total_peserta: semua_skor.length,
    persentil,
  };
}
