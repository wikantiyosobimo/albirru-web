// TIER 1 — Deterministik. Pure function, tanpa panggilan eksternal.
import type { WeaknessRecordInput, WeaknessScored, PrioritasTopik } from "./types";

/**
 * Hitung weakness_index dan prioritas_skor untuk setiap topik.
 * weakness_index = (1 - akurasi) * 100
 * prioritas_skor = weakness_index * bobot_mapel
 */
export function hitungWeaknessIndex(records: WeaknessRecordInput[]): WeaknessScored[] {
  return records.map((r) => {
    const weakness_index = Math.round((1 - Math.min(1, Math.max(0, r.akurasi))) * 100);
    const bobot = r.bobot_mapel ?? 1;
    return {
      ...r,
      weakness_index,
      prioritas_skor: Math.round(weakness_index * bobot * 100) / 100,
    };
  });
}

/**
 * Urutkan topik berdasarkan prioritas_skor (DESC) dan kembalikan top-N.
 * Digunakan oleh navigator/focus-plan & missions generator.
 */
export function getPrioritasTopik(
  records: WeaknessRecordInput[],
  topN = 5,
): PrioritasTopik[] {
  const scored = hitungWeaknessIndex(records);
  return scored
    .sort((a, b) => b.prioritas_skor - a.prioritas_skor)
    .slice(0, topN)
    .map((r, i) => ({
      topicId: r.topicId,
      weakness_index: r.weakness_index,
      prioritas_skor: r.prioritas_skor,
      rank: i + 1,
    }));
}
