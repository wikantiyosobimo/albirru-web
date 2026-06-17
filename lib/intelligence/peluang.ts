// TIER 1 — Deterministik. Pure function, tanpa panggilan eksternal.
import type { PeluangResult } from "./types";

/**
 * Estimasi peluang lolos sederhana berdasarkan skor vs passing grade.
 * Tier 1 (deterministik) — tidak pakai ML. Lihat lib/ml/score-predictor.ts untuk Tier 2.
 *
 * Rumus logistik sederhana: peluang = sigmoid((skor - pgMin) / spread)
 * pgMin  = batas bawah minimal lulus
 * pgAman = passing grade "aman" (biasanya pgMin + margin)
 */
export function hitungPeluangSederhana(
  skor: number,
  pgMin: number,
  pgAman: number,
): PeluangResult {
  const spread = Math.max(pgAman - pgMin, 50); // hindari pembagian nol
  const x = (skor - pgMin) / spread;
  const peluang = Math.min(1, Math.max(0, sigmoid(x)));
  const gap = Math.max(0, pgAman - skor);
  return {
    peluang: Math.round(peluang * 100) / 100,
    persen: Math.round(peluang * 100),
    gap,
  };
}

/**
 * Hitung peluang dari multiple kampus/prodi sekaligus.
 */
export function hitungPeluangBatch(
  skor: number,
  targets: { prodiId: string; pgMin: number; pgAman: number }[],
): Array<{ prodiId: string } & PeluangResult> {
  return targets.map((t) => ({
    prodiId: t.prodiId,
    ...hitungPeluangSederhana(skor, t.pgMin, t.pgAman),
  }));
}

function sigmoid(x: number): number {
  return 1 / (1 + Math.exp(-x * 3)); // steepness *3 agar kurva lebih tajam
}
