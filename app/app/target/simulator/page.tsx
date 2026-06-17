import Link from "next/link";
import { ArrowLeft, Info } from "lucide-react";
import { getPortalProfile } from "@/lib/portal/session";
import { createClient } from "@/lib/supabase/server";
import { PortalTopbar } from "@/components/portal/topbar";
import { TargetSimulator } from "@/components/portal/target-simulator";
import { getSegment } from "@/lib/data/targets";
import { getPassingGrade } from "@/lib/data/passing-grades";

export const metadata = { title: "Simulator Peluang — Albirru" };

export default async function SimulatorPage() {
  const { profile } = await getPortalProfile();
  const seg = getSegment(profile?.segment);
  const isInstansi = seg.target === "instansi";
  const target = (isInstansi ? profile?.target_instansi : profile?.target_kampus) || "";
  const sub = (isInstansi ? profile?.target_jabatan : profile?.target_prodi) || "";
  const pg = getPassingGrade(seg.value, target, sub);

  const scoreMax = seg.scoreMax;
  const targetSkor = profile?.target_skor ?? pg?.aman ?? (seg.model === "akademik" ? 850 : 420);

  const supabase = await createClient();
  const { data: attempt } = await supabase.from("tryout_attempts")
    .select("skor").eq("status", "selesai").order("submitted_at", { ascending: false }).limit(1).maybeSingle();
  const skorAwal = attempt?.skor ?? Math.round(targetSkor * 0.83);

  return (
    <>
      <PortalTopbar eyebrow="Target  ›  Simulator" title="Simulator Peluang Lolos" subtitle="Geser skor untuk melihat dampaknya ke peluangmu." nama={profile?.nama ?? "Farhan"}
        right={<Link href="/app/target" className="inline-flex h-10 items-center gap-2 rounded-lg border bg-white px-4 text-body-sm font-semibold text-ink transition-colors hover:bg-muted"><ArrowLeft size={15} /> Kembali</Link>} />

      <div className="space-y-5 p-5 lg:p-7">
        <TargetSimulator skorAwal={skorAwal} targetSkor={targetSkor} scoreMax={scoreMax} peluangNoun={seg.peluangNoun} />
        <div className="flex items-start gap-2 rounded-xl border bg-white p-4 text-body-sm text-ink-body">
          <Info size={16} className="mt-0.5 shrink-0 text-brand" />
          <span>{pg?.catatan ?? "Peluang dihitung dari skor terhadap target aman menggunakan kurva logistik. Ini estimasi, bukan janji kelulusan."}</span>
        </div>
      </div>
    </>
  );
}
