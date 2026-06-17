import Link from "next/link";
import { ArrowLeft, Check, Minus } from "lucide-react";
import { getPortalProfile } from "@/lib/portal/session";
import { createClient } from "@/lib/supabase/server";
import { PortalTopbar } from "@/components/portal/topbar";
import { getSegment, UNIVERSITIES, PRODI } from "@/lib/data/targets";
import { getPassingGrade } from "@/lib/data/passing-grades";
import { peluangLolos, warnaPeluang } from "@/lib/portal/peluang";

export const metadata = { title: "Bandingkan Target — Albirru" };

export default async function ComparePage() {
  const { profile } = await getPortalProfile();
  const seg = getSegment(profile?.segment);
  const isInstansi = seg.target === "instansi";
  const myTarget = (isInstansi ? profile?.target_instansi : profile?.target_kampus) || (seg.value === "kedinasan" ? "PKN STAN" : "Universitas Gadjah Mada");
  const prodi = (isInstansi ? profile?.target_jabatan : profile?.target_prodi) || "Teknik Informatika";

  const supabase = await createClient();
  const { data: attempt } = await supabase.from("tryout_attempts")
    .select("skor").eq("status", "selesai").order("submitted_at", { ascending: false }).limit(1).maybeSingle();
  const skor = attempt?.skor ?? (seg.model === "akademik" ? 712 : 385);

  // Bandingkan target utama dengan beberapa alternatif (prodi sama).
  const altKampus = seg.model === "akademik"
    ? [myTarget, ...UNIVERSITIES.filter((u) => u !== myTarget)].slice(0, 5)
    : [myTarget];
  const prodiPakai = seg.model === "akademik" ? (PRODI.includes(prodi) ? prodi : "Teknik Informatika") : prodi;

  const rows = altKampus.map((k) => {
    const pg = getPassingGrade(seg.value, k, prodiPakai);
    const aman = pg?.aman ?? 0;
    const peluang = peluangLolos(skor, aman);
    return { kampus: k, prodi: prodiPakai, aman, peluang, color: warnaPeluang(peluang), utama: k === myTarget };
  });

  return (
    <>
      <PortalTopbar eyebrow="Target  ›  Bandingkan" title="Bandingkan Target" subtitle={`Peluangmu (skor ${skor}) di beberapa pilihan ${seg.targetNoun.toLowerCase()}.`} nama={profile?.nama ?? "Farhan"}
        right={<Link href="/app/target" className="inline-flex h-10 items-center gap-2 rounded-lg border bg-white px-4 text-body-sm font-semibold text-ink transition-colors hover:bg-muted"><ArrowLeft size={15} /> Kembali</Link>} />

      <div className="p-5 lg:p-7">
        <div className="overflow-hidden rounded-2xl border bg-white">
          <div className="grid grid-cols-[1fr_auto_auto] gap-4 border-b bg-muted px-5 py-3 text-caption font-semibold text-ink-muted sm:grid-cols-[1fr_120px_120px]">
            <span>{seg.targetNoun} · {seg.subNoun}</span>
            <span className="text-right">Target Aman</span>
            <span className="text-right">Peluangmu</span>
          </div>
          {rows.map((r) => (
            <div key={r.kampus} className={`grid grid-cols-[1fr_auto_auto] items-center gap-4 px-5 py-4 sm:grid-cols-[1fr_120px_120px] ${r.utama ? "bg-brand-100/40" : ""}`}>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="truncate text-body-sm font-bold text-ink">{r.kampus}</span>
                  {r.utama ? <span className="shrink-0 rounded-md bg-brand px-1.5 py-0.5 text-[10px] font-bold text-white">Target</span> : null}
                </div>
                <div className="text-caption text-ink-muted">{r.prodi}</div>
              </div>
              <div className="text-right text-body-sm font-semibold text-ink">{r.aman}</div>
              <div className="flex items-center justify-end gap-1.5 text-right">
                {skor >= r.aman ? <Check size={14} className="text-success" /> : <Minus size={14} className="text-ink-muted" />}
                <span className="text-body-sm font-extrabold" style={{ color: r.color }}>{r.peluang}%</span>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-3 text-caption text-ink-muted">Estimasi keketatan & peluang bersifat indikatif. Ubah target di <Link href="/app/target/edit" className="font-semibold text-brand hover:underline">Edit Target</Link>.</p>
      </div>
    </>
  );
}
