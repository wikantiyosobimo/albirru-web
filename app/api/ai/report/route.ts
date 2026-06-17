import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getUserIntelligence } from "@/lib/portal/intelligence";
import { hitungWeaknessIndex } from "@/lib/intelligence/weakness";
import { prediksiSkorAkhir } from "@/lib/ml/score-predictor";
import { generateWeeklyReport } from "@/lib/ai/report";
import type { WeaknessRecordInput, SkorRiwayat } from "@/lib/intelligence/types";

// POST /api/ai/report
// Tier 3 (Claude) bila ANTHROPIC_API_KEY ada; jika tidak → fallback ringkasan deterministik.
export async function POST() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Tidak terautentikasi." }, { status: 401 });

  const { data: profile } = await supabase.from("profiles").select("nama").eq("id", user.id).single();
  const nama = profile?.nama ?? "Siswa";

  const intel = await getUserIntelligence();
  const records: WeaknessRecordInput[] = intel.subtes
    .filter((s) => s.total > 0)
    .map((s) => ({ topicId: s.subtes, subtes: s.subtes, akurasi: (s.akurasi ?? 0) / 100, total_soal: s.total }));
  const weakness = hitungWeaknessIndex(records).sort((a, b) => b.prioritas_skor - a.prioritas_skor);

  const riwayat: SkorRiwayat[] = intel.trend.map((t) => ({ tanggal: t.tanggal, skor: t.skor }));
  const prediksi = prediksiSkorAkhir(riwayat, 30);

  const skorIni = intel.summary.skor_terbaru ?? 0;
  const skorLalu = riwayat.length >= 2 ? riwayat[riwayat.length - 2].skor : skorIni;

  // Tier 3: coba Claude; fallback deterministik bila gagal/no key.
  try {
    const report = await generateWeeklyReport({
      nama, skor_minggu_ini: skorIni, skor_minggu_lalu: skorLalu,
      weakness_top3: weakness.slice(0, 3), riwayat, prediksi, hari_ke_ujian: 30,
    });
    return NextResponse.json({ source: "claude", report, prediksi });
  } catch {
    const delta = skorIni - skorLalu;
    return NextResponse.json({
      source: "deterministik",
      report: {
        judul: `Laporan Mingguan ${nama}`,
        ringkasan: `Skor terbarumu ${skorIni}${delta >= 0 ? ` (naik ${delta})` : ` (turun ${-delta})`}. Proyeksi hari-H ~${prediksi.proyeksi}.`,
        poin_kuat: intel.subtes.filter((s) => (s.akurasi ?? 0) >= 70).map((s) => s.subtes).slice(0, 2),
        poin_lemah: weakness.slice(0, 3).map((w) => `${w.topicId} (weakness ${w.weakness_index}%)`),
        rekomendasi: weakness.slice(0, 3).map((w) => `Latih ${w.topicId}: target naik ${Math.min(20, w.weakness_index)}%`),
        motivasi: `Terus konsisten, ${nama}! Setiap latihan menutup gap menuju target.`,
      },
      prediksi,
    });
  }
}
