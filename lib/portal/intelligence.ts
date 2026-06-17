import { createClient } from "@/lib/supabase/server";

export type SubtesAgg = { subtes: string; total: number; benar: number; salah: number; kosong: number; akurasi: number | null };
export type IntelTrend = { skor: number; tanggal: string; tryout_id: string };
export type IntelSummary = {
  total_attempts: number; skor_terbaru: number | null; skor_terbaik: number | null;
  skor_rata: number | null; benar: number; salah: number; kosong: number;
};
export type UserIntel = { summary: IntelSummary; subtes: SubtesAgg[]; trend: IntelTrend[]; hasData: boolean };

const EMPTY: UserIntel = {
  summary: { total_attempts: 0, skor_terbaru: null, skor_terbaik: null, skor_rata: null, benar: 0, salah: 0, kosong: 0 },
  subtes: [], trend: [], hasData: false,
};

// Agregat performa nyata user (lintas try out) untuk Dashboard & Intelligence.
export async function getUserIntelligence(): Promise<UserIntel> {
  const supabase = await createClient();
  const { data } = await supabase.rpc("get_user_intelligence");
  if (!data) return EMPTY;
  const summary = (data.summary ?? EMPTY.summary) as IntelSummary;
  const subtes = (data.subtes ?? []) as SubtesAgg[];
  const trend = (data.trend ?? []) as IntelTrend[];
  return { summary, subtes, trend, hasData: (summary.total_attempts ?? 0) > 0 };
}
