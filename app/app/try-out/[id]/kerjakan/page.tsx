import { getPortalProfile } from "@/lib/portal/session";
import { createClient } from "@/lib/supabase/server";
import { ExamEngine, type EngineSoal } from "@/components/portal/exam-engine";

export const metadata = { title: "Pengerjaan Try Out — Albirru" };

export default async function KerjakanPage({ params }: { params: { id: string } }) {
  const { profile } = await getPortalProfile();
  const supabase = await createClient();

  const [{ data: tryout }, { data: soal }] = await Promise.all([
    supabase.from("tryouts").select("title, tipe, durasi_menit, poin_per_soal").eq("id", params.id).maybeSingle(),
    supabase.from("tryout_questions_public").select("id, subtes, teks, pilihan").eq("tryout_id", params.id).order("nomor"),
  ]);

  return (
    <ExamEngine
      nama={profile?.nama ?? "Farhan"}
      tryoutId={params.id}
      hasilHref={`/app/try-out/${params.id}/hasil`}
      soal={(soal ?? []) as EngineSoal[]}
      judul={tryout?.title ?? "Try Out"}
      tipe={tryout?.tipe ?? "SNBT"}
      durasiMenit={tryout?.durasi_menit ?? 100}
      poinPerSoal={tryout?.poin_per_soal ?? 4}
    />
  );
}
