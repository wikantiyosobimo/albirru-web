import { createClient } from "@/lib/supabase/server";

// Helper tipis untuk memanggil RPC konsol staf/admin dari Server Components.
// Semua RPC SECURITY DEFINER dengan cek role internal — aman dipanggil via anon client.

async function rpc<T>(fn: string, args?: Record<string, unknown>, fallback?: T): Promise<T> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc(fn, args ?? {});
    if (error) return fallback as T;
    return (data as T) ?? (fallback as T);
  } catch {
    return fallback as T;
  }
}

export type StafOverview = {
  total_siswa: number; total_attempt: number; rata_skor: number | null;
  total_materi: number; total_tryout: number;
};
export type StudentRow = {
  id: string; nama: string | null; asal_sekolah: string | null; segment: string | null;
  plan: string; target_kampus: string | null; skor_terakhir: number | null; jumlah_tryout: number;
};
export type AdminOverview = {
  total_user: number; total_siswa: number; total_staf: number; total_pro: number;
  total_soal: number; total_tryout: number; total_attempt: number; pendapatan: number; signup_7hari: number;
};
export type UserRow = {
  id: string; nama: string | null; role: string; plan: string; segment: string | null;
  asal_sekolah: string | null; onboarding_done: boolean; created_at: string;
};
export type AdminAnalytics = {
  signup: { hari: string; jml: number }[];
  plan: { plan: string; jml: number }[];
  segment: { segment: string; jml: number }[];
};
export type AdminContentHealth = {
  total: number; aktif: number; nonaktif: number; tanpa_pembahasan: number; tanpa_topik: number;
  per_mapel: { mapel: string; total: number; aktif: number }[];
  per_level: { level: number; jml: number }[];
};
export type AdminFunnel = { siswa: number; aktivasi: number; pro: number; pendapatan: number };

export const getStafOverview = () => rpc<StafOverview>("staf_overview", {}, { total_siswa: 0, total_attempt: 0, rata_skor: null, total_materi: 0, total_tryout: 0 });
export const getStafStudents = (search?: string) => rpc<StudentRow[]>("staf_list_students", { p_search: search ?? null }, []);
export const getAdminOverview = () => rpc<AdminOverview>("admin_overview", {}, { total_user: 0, total_siswa: 0, total_staf: 0, total_pro: 0, total_soal: 0, total_tryout: 0, total_attempt: 0, pendapatan: 0, signup_7hari: 0 });
export const getAdminUsers = (search?: string, role?: string) => rpc<UserRow[]>("admin_list_users", { p_search: search ?? null, p_role: role ?? null }, []);
export const getAdminUserDetail = (id: string) => rpc<{ profile: Record<string, unknown> | null; tryout: { tryout_id: string; skor: number; benar: number; salah: number; kosong: number; submitted_at: string }[]; xp: number; level: number }>("admin_user_detail", { p_id: id }, { profile: null, tryout: [], xp: 0, level: 1 });
export const getAdminAnalytics = () => rpc<AdminAnalytics>("admin_analytics", {}, { signup: [], plan: [], segment: [] });
export const getAdminContentHealth = () => rpc<AdminContentHealth>("admin_content_health", {}, { total: 0, aktif: 0, nonaktif: 0, tanpa_pembahasan: 0, tanpa_topik: 0, per_mapel: [], per_level: [] });
export const getAdminConversionFunnel = () => rpc<AdminFunnel>("admin_conversion_funnel", {}, { siswa: 0, aktivasi: 0, pro: 0, pendapatan: 0 });
