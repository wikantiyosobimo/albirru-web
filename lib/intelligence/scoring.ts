// TIER 1 — Deterministik. Pure function, tanpa panggilan eksternal.
// Server-side only. answer_key TIDAK PERNAH dikirim ke client.
import type { AnswerInput, AnswerKeyInput, ScoreResult, SubtesScore } from "./types";

const SKOR_MAX = 1000;

/**
 * Hitung skor lengkap dari jawaban siswa + kunci jawaban.
 * Skema SNBT: benar = +poin, salah = 0, kosong = 0 (no penalty).
 *
 * @param answers   - jawaban siswa (tanpa kunci)
 * @param answerKeys - kunci jawaban SERVER ONLY, dipasangkan via questionId
 */
export function hitungSkor(
  answers: AnswerInput[],
  answerKeys: AnswerKeyInput[],
): ScoreResult {
  // TODO: validasi panjang answers === answerKeys (via questionId match)
  const keyMap = new Map(answerKeys.map((k) => [k.questionId, k]));

  const subtesAgg = new Map<string, { benar: number; salah: number; kosong: number; total: number; poinMaks: number }>();

  let benar = 0, salah = 0, kosong = 0, poinTotal = 0, poinMaks = 0;

  for (const ans of answers) {
    const key = keyMap.get(ans.questionId);
    if (!key) continue; // soal tidak ditemukan di kunci — lewati

    const poin = key.poin ?? 1;
    poinMaks += poin;

    // inisialisasi subtes bucket
    if (!subtesAgg.has(ans.subtes)) {
      subtesAgg.set(ans.subtes, { benar: 0, salah: 0, kosong: 0, total: 0, poinMaks: 0 });
    }
    const bucket = subtesAgg.get(ans.subtes)!;
    bucket.total++;
    bucket.poinMaks += poin;

    if (ans.pilihan === null) {
      kosong++;
      bucket.kosong++;
    } else if (ans.pilihan === key.kunci) {
      benar++;
      poinTotal += poin;
      bucket.benar++;
    } else {
      salah++;
      bucket.salah++;
    }
  }

  // Normalisasi ke skala 0..1000
  const skor_total = poinMaks > 0 ? Math.round((poinTotal / poinMaks) * SKOR_MAX) : 0;

  const skor_per_subtes: SubtesScore[] = Array.from(subtesAgg.entries()).map(([subtes, b]) => ({
    subtes,
    benar: b.benar,
    salah: b.salah,
    kosong: b.kosong,
    total: b.total,
    skor: b.poinMaks > 0 ? Math.round((b.benar / b.total) * SKOR_MAX) : 0,
    akurasi: b.total > 0 ? Math.round((b.benar / b.total) * 100) : 0,
  }));

  return {
    benar,
    salah,
    kosong,
    total: answers.length,
    skor_total,
    skor_per_subtes,
  };
}
