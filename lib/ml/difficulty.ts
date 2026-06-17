// TIER 2 — ML/Stats. Pure function, tanpa panggilan eksternal.
import type { ItemParams } from "../intelligence/types";

export interface DifficultyInput {
  questionId: string;
  total_attempt: number;
  total_benar: number;
}

export interface DifficultyCalibrated {
  questionId: string;
  p_value: number;   // proporsi benar (0..1)
  b_estimate: number; // estimasi kesulitan IRT (skala logit)
  kategori: "mudah" | "sedang" | "sulit";
}

/**
 * Kalibrasi kesulitan soal dari data attempt massal.
 * Tier 2 — estimasi b dari p-value (1PL/Rasch sederhana).
 * Untuk 2PL/3PL penuh, gunakan MML via Python microservice (TODO).
 *
 * p_value → b (logit): b = log((1-p)/p)  [Rasch]
 *
 * TODO: batch dari tabel tryout_answers setelah ada 100+ attempt per soal.
 * TODO: gunakan EM/MMLE (marginal maximum likelihood) untuk full IRT.
 */
export function kalibrasiKesulitan(inputs: DifficultyInput[]): DifficultyCalibrated[] {
  return inputs.map(({ questionId, total_attempt, total_benar }) => {
    const p = total_attempt > 0 ? total_benar / total_attempt : 0.5;
    // Clamp p untuk hindari log(0)
    const pClamped = Math.min(0.99, Math.max(0.01, p));
    const b_estimate = Math.log((1 - pClamped) / pClamped);

    return {
      questionId,
      p_value: Math.round(p * 1000) / 1000,
      b_estimate: Math.round(b_estimate * 100) / 100,
      kategori: p >= 0.7 ? "mudah" : p <= 0.4 ? "sulit" : "sedang",
    };
  });
}

/**
 * Update parameter IRT yang sudah ada dengan estimasi b baru dari kalibrasi.
 * Mempertahankan a dan c dari parameter sebelumnya.
 */
export function mergeIrtParams(
  existing: ItemParams[],
  calibrated: DifficultyCalibrated[],
): ItemParams[] {
  const calMap = new Map(calibrated.map((c) => [c.questionId, c]));
  return existing.map((item) => {
    const cal = calMap.get(item.questionId);
    if (!cal) return item;
    return { ...item, b: cal.b_estimate };
  });
}
