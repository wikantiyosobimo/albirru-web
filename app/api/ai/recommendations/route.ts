import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { rateLimit, tooManyRequests } from "@/lib/rate-limit";
import { getUserIntelligence } from "@/lib/portal/intelligence";
import { getPrioritasTopik } from "@/lib/intelligence/weakness";
import { susunRencanaMingguan } from "@/lib/intelligence/study-plan";
import { generateMissions } from "@/lib/intelligence/missions";
import type { WeaknessRecordInput } from "@/lib/intelligence/types";

// POST /api/ai/recommendations
// Tier 1 (deterministik, selalu jalan): prioritas topik lemah → rencana mingguan + misi.
// Estimasi dampak poin = weakness_index tertimbang. Hasil bisa disimpan ke study_plans.
export async function POST() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Tidak terautentikasi." }, { status: 401 });

  const rl = rateLimit(`ai-rec:${user.id}`, 10, 60_000);
  if (!rl.ok) return tooManyRequests(rl.retryAfter);

  const intel = await getUserIntelligence();

  // Map agregat subtes → input weakness (akurasi 0..1). Bobot = jumlah soal relatif.
  const records: WeaknessRecordInput[] = intel.subtes
    .filter((s) => s.total > 0)
    .map((s) => ({
      topicId: s.subtes,
      subtes: s.subtes,
      akurasi: (s.akurasi ?? 0) / 100,
      total_soal: s.total,
      bobot_mapel: 1,
    }));

  const prioritas = getPrioritasTopik(records, 5);
  const rencana = susunRencanaMingguan(prioritas, 2);
  const misi = generateMissions(prioritas, 0, 5);

  // Estimasi dampak: menutup gap topik terlemah ≈ kontribusi ke skor total.
  const estimasiDampak = prioritas.reduce((acc, p) => acc + Math.round(p.weakness_index * 1.2), 0);

  return NextResponse.json({
    hasData: intel.hasData,
    prioritas,
    rencana_mingguan: rencana,
    misi,
    estimasi_dampak_poin: estimasiDampak,
    catatan: intel.hasData ? null : "Belum ada riwayat try out — rekomendasi memakai contoh default.",
  });
}
