import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// Dev-only bypass: aktif hanya saat DEV_FAKE_AUTH=1 di lingkungan non-produksi.
// Memungkinkan preview portal /app tanpa Supabase. Produksi mengabaikan flag ini.
const DEV_FAKE_AUTH =
  process.env.NODE_ENV !== "production" && process.env.DEV_FAKE_AUTH === "1";

const FAKE_SESSION = {
  user: { id: "dev-dummy-user", email: "farhan@dummy.test" },
  profile: {
    nama: "Farhan",
    // Override via DEV_FAKE_ROLE=staf|admin untuk preview portal /staf & /admin lokal.
    role: (process.env.DEV_FAKE_ROLE as string) || "siswa",
    plan: "free",
    onboarding_done: true,
    jenjang: "12" as string | null,
    jurusan: "ipa" as string | null,
    asal_sekolah: "SMAN 1 Yogyakarta" as string | null,
    segment: "utbk",
    target_kampus: "Universitas Gadjah Mada",
    target_prodi: "Teknik Informatika",
    target_instansi: null as string | null,
    target_jabatan: null as string | null,
    target_skor: 850,
  },
} as const;

// Dedupes across layout + page within one request.
export const getPortalProfile = cache(async () => {
  if (DEV_FAKE_AUTH) return FAKE_SESSION;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/masuk");
  const { data: profile } = await supabase
    .from("profiles")
    .select("nama, role, plan, onboarding_done, jenjang, jurusan, asal_sekolah, segment, target_kampus, target_prodi, target_instansi, target_jabatan, target_skor")
    .eq("id", user.id)
    .single();
  return { user, profile };
});
