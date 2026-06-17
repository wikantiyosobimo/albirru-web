import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { rateLimit, tooManyRequests } from "@/lib/rate-limit";
import { getUserIntelligence } from "@/lib/portal/intelligence";
import { getPrioritasTopik } from "@/lib/intelligence/weakness";
import { generateMissions } from "@/lib/intelligence/missions";
import type { WeaknessRecordInput } from "@/lib/intelligence/types";

// POST /api/ai/missions
// Tier 1: generate misi harian dari topik terlemah + streak. Idempoten per hari
// bila disimpan ke tabel daily_missions (unique user_id, tanggal).
export async function POST() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Tidak terautentikasi." }, { status: 401 });

  const rl = rateLimit(`ai-mis:${user.id}`, 10, 60_000);
  if (!rl.ok) return tooManyRequests(rl.retryAfter);

  // Streak (jika tabel terisi)
  let streak = 0;
  try {
    const { data } = await supabase.from("streaks").select("streak_aktif").eq("user_id", user.id).single();
    streak = data?.streak_aktif ?? 0;
  } catch { /* default 0 */ }

  const intel = await getUserIntelligence();
  const records: WeaknessRecordInput[] = intel.subtes
    .filter((s) => s.total > 0)
    .map((s) => ({ topicId: s.subtes, subtes: s.subtes, akurasi: (s.akurasi ?? 0) / 100, total_soal: s.total }));

  const prioritas = getPrioritasTopik(records, 5);
  const misi = generateMissions(prioritas, streak, 3);

  // Simpan ke daily_missions (best-effort; lewati bila gagal)
  try {
    const tanggal = new Date().toISOString().split("T")[0];
    await supabase.from("daily_missions").upsert(
      { user_id: user.id, tanggal, missions: misi, total: misi.length, ai_generated: true },
      { onConflict: "user_id,tanggal" },
    );
  } catch { /* abaikan */ }

  return NextResponse.json({ tanggal: new Date().toISOString().split("T")[0], streak, misi });
}
