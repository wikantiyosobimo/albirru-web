import { createClient } from "@/lib/supabase/server";

export type AttemptRow = {
  tryout_id: string; skor: number; benar: number; salah: number; kosong: number;
  submitted_at: string; tryout_judul?: string;
};

export type SubtesPerformance = {
  subtes: string; total: number; benar: number; akurasi: number;
};

export type StudentReport = {
  profile: {
    nama: string; email: string; jenjang: string | null; jurusan: string | null;
    asal_sekolah: string | null; segment: string | null; plan: string;
    target_kampus: string | null; target_prodi: string | null; target_skor: number | null;
    target_instansi: string | null; target_jabatan: string | null;
  } | null;
  attempts: AttemptRow[];
  subtes: SubtesPerformance[];
  stats: {
    totalAttempts: number; skorTerbaru: number | null; skorTerbaik: number | null;
    skorTerendah: number | null; skorRata: number | null;
    totalBenar: number; totalSalah: number; totalKosong: number;
    akurasiGlobal: number | null; tren: "naik" | "turun" | "stabil" | null;
    skorDelta: number | null;
  };
  strengths: string[];
  weaknesses: string[];
  xp: number;
  level: number;
};

export async function getStudentReport(userId: string): Promise<StudentReport> {
  const supabase = await createClient();

  // Profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("nama, jenjang, jurusan, asal_sekolah, segment, plan, target_kampus, target_prodi, target_skor, target_instansi, target_jabatan")
    .eq("id", userId)
    .single();

  // Email from auth (via admin RPC or direct query)
  const { data: authUser } = await supabase.auth.admin.getUserById(userId).catch(() => ({ data: null })) as { data: { user?: { email?: string } } | null };
  const email = authUser?.user?.email ?? "";

  // Attempts with tryout title
  const { data: rawAttempts } = await supabase
    .from("tryout_attempts")
    .select("tryout_id, skor, benar, salah, kosong, submitted_at, tryouts(judul)")
    .eq("user_id", userId)
    .order("submitted_at", { ascending: false })
    .limit(50);

  const attempts: AttemptRow[] = (rawAttempts ?? []).map((a: Record<string, unknown>) => {
    const t = a.tryouts as Record<string, unknown> | null;
    return {
      tryout_id: String(a.tryout_id ?? ""),
      skor: Number(a.skor ?? 0),
      benar: Number(a.benar ?? 0),
      salah: Number(a.salah ?? 0),
      kosong: Number(a.kosong ?? 0),
      submitted_at: String(a.submitted_at ?? ""),
      tryout_judul: String(t?.judul ?? "Try Out"),
    };
  });

  // Per-subtes from answers
  const { data: answers } = await supabase
    .from("tryout_answers")
    .select("is_correct, tryout_questions(subtes)")
    .eq("user_id", userId)
    .limit(2000);

  const subtesMap = new Map<string, { total: number; benar: number }>();
  for (const ans of (answers ?? []) as Record<string, unknown>[]) {
    const q = ans.tryout_questions as Record<string, unknown> | null;
    const subtes = String(q?.subtes ?? "Umum");
    const entry = subtesMap.get(subtes) ?? { total: 0, benar: 0 };
    entry.total++;
    if (ans.is_correct) entry.benar++;
    subtesMap.set(subtes, entry);
  }

  const subtes: SubtesPerformance[] = Array.from(subtesMap.entries())
    .map(([s, v]) => ({ subtes: s, total: v.total, benar: v.benar, akurasi: v.total > 0 ? Math.round((v.benar / v.total) * 100) : 0 }))
    .sort((a, b) => b.akurasi - a.akurasi);

  // Compute stats
  const totalAttempts = attempts.length;
  const scores = attempts.map((a) => a.skor);
  const skorTerbaru = scores[0] ?? null;
  const skorTerbaik = scores.length > 0 ? Math.max(...scores) : null;
  const skorTerendah = scores.length > 0 ? Math.min(...scores) : null;
  const skorRata = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : null;
  const totalBenar = attempts.reduce((s, a) => s + a.benar, 0);
  const totalSalah = attempts.reduce((s, a) => s + a.salah, 0);
  const totalKosong = attempts.reduce((s, a) => s + a.kosong, 0);
  const totalSoal = totalBenar + totalSalah + totalKosong;
  const akurasiGlobal = totalSoal > 0 ? Math.round((totalBenar / totalSoal) * 100) : null;

  // Trend: compare first half vs second half average
  let tren: "naik" | "turun" | "stabil" | null = null;
  let skorDelta: number | null = null;
  if (scores.length >= 2) {
    const recent = scores.slice(0, Math.ceil(scores.length / 2));
    const older = scores.slice(Math.ceil(scores.length / 2));
    const avgRecent = recent.reduce((a, b) => a + b, 0) / recent.length;
    const avgOlder = older.reduce((a, b) => a + b, 0) / older.length;
    skorDelta = Math.round(avgRecent - avgOlder);
    tren = skorDelta > 10 ? "naik" : skorDelta < -10 ? "turun" : "stabil";
  }

  // Strengths & weaknesses from subtes
  const strengths = subtes.filter((s) => s.akurasi >= 70).slice(0, 5).map((s) => `${s.subtes} (${s.akurasi}%)`);
  const weaknesses = subtes.filter((s) => s.akurasi < 60).sort((a, b) => a.akurasi - b.akurasi).slice(0, 5).map((s) => `${s.subtes} (${s.akurasi}%)`);

  // XP & level (simple estimate)
  const xp = totalAttempts * 100 + totalBenar * 5;
  const level = Math.max(1, Math.floor(xp / 500) + 1);

  return {
    profile: profile ? { ...profile, email } as StudentReport["profile"] : null,
    attempts, subtes,
    stats: { totalAttempts, skorTerbaru, skorTerbaik, skorTerendah, skorRata, totalBenar, totalSalah, totalKosong, akurasiGlobal, tren, skorDelta },
    strengths, weaknesses, xp, level,
  };
}
