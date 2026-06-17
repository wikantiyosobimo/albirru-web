// TIER 1 — Deterministik. Pure function, tanpa panggilan eksternal.
import type { PrioritasTopik, Mission, MissionTipe } from "./types";

const XP_PER_TIPE: Record<MissionTipe, number> = {
  review: 30,
  latihan: 40,
  tryout: 80,
  revisi: 25,
  video: 20,
};

/**
 * Generate daftar misi harian/mingguan berdasarkan prioritas topik lemah.
 * @param prioritas - top-N topik dari getPrioritasTopik()
 * @param streak    - streak hari berturut-turut (mempengaruhi XP bonus)
 * @param maxMisi   - jumlah misi maksimal per siklus (default 5)
 */
export function generateMissions(
  prioritas: PrioritasTopik[],
  streak = 0,
  maxMisi = 5,
): Mission[] {
  // TODO: baca target harian dari DB (tabel daily_missions) dan hindari duplikasi
  const missions: Mission[] = [];
  const xpBonus = streak >= 7 ? 1.5 : streak >= 3 ? 1.2 : 1;

  prioritas.slice(0, maxMisi).forEach((p, i) => {
    const tipe: MissionTipe = i === 0 ? "latihan" : i === 1 ? "review" : "revisi";
    const baseXp = XP_PER_TIPE[tipe];
    missions.push({
      kode: `MISI-${p.rank}-${tipe.toUpperCase()}`,
      tipe,
      judul: tipeJudul(tipe, p.topicId),
      deskripsi: tipeDesk(tipe, p.topicId, p.weakness_index),
      target: tipe === "latihan" ? 20 : tipe === "review" ? 10 : 5,
      xp: Math.round(baseXp * xpBonus),
      topicId: p.topicId,
    });
  });

  // Misi bonus tryout jika streak >= 7
  if (streak >= 7 && missions.length < maxMisi) {
    missions.push({
      kode: "MISI-TRYOUT-BONUS",
      tipe: "tryout",
      judul: "Try Out Kilat",
      deskripsi: "Kerjakan 1 Try Out mini untuk uji kemajuanmu.",
      target: 1,
      xp: Math.round(XP_PER_TIPE.tryout * xpBonus),
    });
  }

  return missions;
}

function tipeJudul(tipe: MissionTipe, topicId: string): string {
  const label = topicId.replace(/-/g, " ");
  if (tipe === "latihan") return `Latihan: ${label}`;
  if (tipe === "review") return `Review: ${label}`;
  return `Revisi Cepat: ${label}`;
}

function tipeDesk(tipe: MissionTipe, topicId: string, wi: number): string {
  const label = topicId.replace(/-/g, " ");
  if (tipe === "latihan") return `Kerjakan 20 soal ${label} (weakness index ${wi}).`;
  if (tipe === "review") return `Ulangi 10 soal salah di ${label}.`;
  return `Baca ulang materi kunci ${label} selama 5 menit.`;
}
