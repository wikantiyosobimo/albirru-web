// TIER 2 — ML/Stats. Pure function, tanpa panggilan eksternal.
// Algoritma SM-2 (SuperMemo 2) untuk spaced repetition.
import type { SrsItem, AnswerHistory } from "../intelligence/types";

const EASE_DEFAULT = 2.5;
const EASE_MIN = 1.3;

/**
 * Update SRS item setelah satu sesi review menggunakan SM-2.
 * @param item      - state SRS saat ini
 * @param kualitas  - grade 0..5 (0-2 = salah, 3-5 = benar dengan variasi mudah)
 *
 * Referensi: Wozniak (1987) Optimization of Learning, SM-2.
 * TODO: upgrade ke SM-18 atau FSRS untuk akurasi retention lebih baik.
 */
export function updateSrsItem(item: SrsItem, kualitas: number): SrsItem {
  const q = Math.min(5, Math.max(0, Math.round(kualitas)));

  // Hitung easiness factor baru
  const newEase = Math.max(
    EASE_MIN,
    item.ease + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)),
  );

  let newInterval: number;
  let newRepetisi: number;

  if (q < 3) {
    // Jawaban salah: reset ke repetisi 1
    newInterval = 1;
    newRepetisi = 0;
  } else if (item.repetisi === 0) {
    newInterval = 1;
    newRepetisi = 1;
  } else if (item.repetisi === 1) {
    newInterval = 6;
    newRepetisi = 2;
  } else {
    newInterval = Math.round(item.interval_hari * newEase);
    newRepetisi = item.repetisi + 1;
  }

  const jatuh_tempo = addDays(new Date(), newInterval).toISOString().split("T")[0];

  return {
    ...item,
    ease: Math.round(newEase * 100) / 100,
    interval_hari: newInterval,
    repetisi: newRepetisi,
    jatuh_tempo,
  };
}

/**
 * Hitung jadwal review untuk batch topik.
 * @param items    - daftar SRS state per topik
 * @param history  - jawaban terbaru yang belum diproses
 * @returns items yang sudah diperbarui (simpan ke DB)
 */
export function jadwalReview(items: SrsItem[], history: AnswerHistory[]): SrsItem[] {
  const histMap = new Map<string, number>();
  history.forEach((h) => histMap.set(h.topicId, h.kualitas));

  return items.map((item) => {
    const kualitas = histMap.get(item.topicId);
    if (kualitas === undefined) return item; // belum ada review terbaru
    return updateSrsItem(item, kualitas);
  });
}

/**
 * Filter topik yang jatuh tempo hari ini atau sudah lewat.
 */
export function getDueItems(items: SrsItem[], hari_ini?: string): SrsItem[] {
  const today = hari_ini ?? new Date().toISOString().split("T")[0];
  return items.filter((i) => i.jatuh_tempo <= today);
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}
