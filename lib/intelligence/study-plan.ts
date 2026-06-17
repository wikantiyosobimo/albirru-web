// TIER 1 — Deterministik. Pure function, tanpa panggilan eksternal.
import type { PrioritasTopik, StudyPlan, StudyBlock, HariMinggu } from "./types";

const HARI_URUT: HariMinggu[] = ["sen", "sel", "rab", "kam", "jum", "sab", "min"];
const DURASI_DEFAULT = 45; // menit per sesi

/**
 * Susun rencana belajar mingguan berdasarkan prioritas topik lemah.
 * Distribusi: topik terlemah mendapat lebih banyak sesi.
 *
 * @param prioritas    - output getPrioritasTopik() max 5 topik
 * @param mapsPerHari  - slot belajar per hari (default 2)
 * @param mulai        - ISO date awal minggu (default Senin ini)
 */
export function susunRencanaMingguan(
  prioritas: PrioritasTopik[],
  mapsPerHari = 2,
  mulai?: string,
): StudyPlan {
  // TODO: integrasikan dengan tabel study_schedules di DB
  const minggu_mulai = mulai ?? getSeninIni();
  const blok: StudyBlock[] = [];

  const totalSlot = HARI_URUT.length * mapsPerHari;
  const topikList = prioritas.length > 0 ? prioritas : [{ topicId: "umum", rank: 1, weakness_index: 50, prioritas_skor: 50 }];

  // Bobot: slot lebih banyak ke topik dengan prioritas_skor lebih tinggi
  const totalSkor = topikList.reduce((s, t) => s + t.prioritas_skor, 0);
  const kuota = topikList.map((t) =>
    Math.max(1, Math.round((t.prioritas_skor / totalSkor) * totalSlot)),
  );

  let slotIdx = 0;
  HARI_URUT.forEach((hari) => {
    for (let s = 0; s < mapsPerHari; s++) {
      const topikIdx = pilihanTopik(slotIdx, kuota, topikList.length);
      const topik = topikList[topikIdx];
      blok.push({
        hari,
        topicId: topik.topicId,
        judul: topik.topicId.replace(/-/g, " "),
        durasi_menit: DURASI_DEFAULT,
      });
      slotIdx++;
    }
  });

  return {
    minggu_mulai,
    blok,
    total_menit: blok.reduce((s, b) => s + b.durasi_menit, 0),
  };
}

function pilihanTopik(slotIdx: number, kuota: number[], n: number): number {
  let acc = 0;
  for (let i = 0; i < n; i++) {
    acc += kuota[i];
    if (slotIdx < acc) return i;
  }
  return n - 1;
}

function getSeninIni(): string {
  const d = new Date();
  const day = d.getDay(); // 0=min, 1=sen
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return d.toISOString().split("T")[0];
}
