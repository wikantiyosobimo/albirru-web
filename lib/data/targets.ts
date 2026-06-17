// Orkestrator data target onboarding/profil untuk semua jenis tes.
// Akademik (UTBK/Mandiri) -> estimasi skor kampus (utbk-scores).
// SKD (CPNS/PPPK/Kedinasan) -> ambang batas SKD (cpns-scores).

import { UNIVERSITIES, PRODI, getUtbkEstimate } from "@/lib/data/utbk-scores";
import { INSTANSI, JABATAN, getCpnsEstimate } from "@/lib/data/cpns-scores";
import { KEDINASAN, KEDINASAN_PROGRAM } from "@/lib/data/kedinasan";
import type { UtbkEstimate } from "@/lib/data/utbk-scores";
import type { CpnsEstimate, SkdJenis } from "@/lib/data/cpns-scores";

export { UNIVERSITIES, PRODI, INSTANSI, JABATAN, KEDINASAN, KEDINASAN_PROGRAM };

export type SegmentKey = "utbk" | "mandiri" | "kedinasan" | "cpns" | "pppk";

export type SegmentConfig = {
  value: SegmentKey;
  label: string;          // untuk dropdown
  short: string;          // label ringkas
  target: "kampus" | "instansi"; // kolom DB yang dipakai
  model: "akademik" | "skd";     // model penilaian
  targetNoun: string;     // "Kampus" / "Instansi" / "Sekolah Kedinasan"
  subNoun: string;        // "Program Studi" / "Jabatan / Formasi" / "Program"
  scoreMax: number;       // 1000 / 550
  scoreUnit: string;      // "/ 1000" / "/ 550 (SKD)"
  peluangNoun: string;    // "kampus" / "instansi" / "sekolah kedinasan"
};

export const SEGMENTS: SegmentConfig[] = [
  { value: "utbk", label: "UTBK-SNBT", short: "UTBK", target: "kampus", model: "akademik", targetNoun: "Kampus", subNoun: "Program Studi", scoreMax: 1000, scoreUnit: "/ 1000", peluangNoun: "kampus" },
  { value: "mandiri", label: "Ujian Mandiri PTN", short: "Mandiri", target: "kampus", model: "akademik", targetNoun: "Kampus", subNoun: "Program Studi", scoreMax: 1000, scoreUnit: "/ 1000", peluangNoun: "kampus" },
  { value: "kedinasan", label: "Sekolah Kedinasan", short: "Kedinasan", target: "kampus", model: "skd", targetNoun: "Sekolah Kedinasan", subNoun: "Program", scoreMax: 550, scoreUnit: "/ 550 (SKD)", peluangNoun: "sekolah kedinasan" },
  { value: "cpns", label: "CPNS", short: "CPNS", target: "instansi", model: "skd", targetNoun: "Instansi", subNoun: "Jabatan / Formasi", scoreMax: 550, scoreUnit: "/ 550 (SKD)", peluangNoun: "instansi" },
  { value: "pppk", label: "PPPK", short: "PPPK", target: "instansi", model: "skd", targetNoun: "Instansi", subNoun: "Jabatan / Formasi", scoreMax: 550, scoreUnit: "/ 550 (SKD)", peluangNoun: "instansi" },
];

export function getSegment(key?: string | null): SegmentConfig {
  return SEGMENTS.find((s) => s.value === key) ?? SEGMENTS[0];
}

// Daftar autocomplete (target & sub) sesuai segment.
export function targetLists(key?: string | null): { target: string[]; sub: string[] } {
  const seg = getSegment(key);
  if (seg.value === "kedinasan") return { target: KEDINASAN, sub: KEDINASAN_PROGRAM };
  if (seg.target === "instansi") return { target: INSTANSI, sub: JABATAN };
  return { target: UNIVERSITIES, sub: PRODI };
}

export type TargetEstimate =
  | ({ kind: "utbk"; value: number } & UtbkEstimate)
  | ({ kind: "cpns"; value: number } & CpnsEstimate)
  | null;

// `value` = angka yang disimpan ke kolom target_skor.
export function estimateTarget(segment: string, target: string, sub: string): TargetEstimate {
  const seg = getSegment(segment);
  if (seg.model === "skd") {
    const e = getCpnsEstimate(seg.value as SkdJenis, target, sub);
    if (!e) return null;
    return { kind: "cpns", value: e.totalAman, ...e };
  }
  const e = getUtbkEstimate(target, sub);
  if (!e) return null;
  return { kind: "utbk", value: e.targetAman, ...e };
}
