// Data master passing grade / ambang skor target (PRD Fase 1, BAB 7.2 Target).
// Mengacu pada estimator yang sudah ada (utbk-scores / cpns-scores) agar satu sumber.
import { estimateTarget } from "@/lib/data/targets";

export type PassingGrade = {
  historis: number | null; // perkiraan nilai historis diterima (UTBK) — null untuk SKD
  aman: number;            // target nilai aman
  max: number;            // skala maksimum
  keketatan: string;
  catatan: string;
};

export function getPassingGrade(segment: string, target: string, sub: string): PassingGrade | null {
  const est = estimateTarget(segment, target, sub);
  if (!est) return null;
  if (est.kind === "utbk") {
    return { historis: est.historis, aman: est.targetAman, max: 1000, keketatan: est.keketatan, catatan: "Estimasi keketatan prodi & tier kampus — bukan janji lolos." };
  }
  return { historis: null, aman: est.totalAman, max: est.totalMax, keketatan: est.keketatan, catatan: est.skbNote };
}
