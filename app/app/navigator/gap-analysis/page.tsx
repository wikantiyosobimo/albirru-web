import Link from "next/link";
import { ArrowLeft, TrendingUp, ArrowRight } from "lucide-react";
import { getPortalProfile } from "@/lib/portal/session";
import { getUserIntelligence } from "@/lib/portal/intelligence";
import { getSegment } from "@/lib/data/targets";
import { statusSubtes } from "@/lib/portal/peluang";
import { PortalTopbar } from "@/components/portal/topbar";

export const metadata = { title: "Gap Analysis — Albirru" };

export default async function GapAnalysisPage() {
  const { profile } = await getPortalProfile();
  const seg = getSegment(profile?.segment);
  const intel = await getUserIntelligence();
  const targetAkurasi = 80; // target penguasaan per subtes

  const rows = (intel.hasData ? intel.subtes : [
    { subtes: "Penalaran Matematika", akurasi: 51 }, { subtes: "Literasi Indonesia", akurasi: 64 },
    { subtes: "Penalaran Umum", akurasi: 70 }, { subtes: "Literasi Inggris", akurasi: 74 },
  ] as { subtes: string; akurasi: number | null }[]).map((s) => {
    const akr = Math.round(s.akurasi ?? 0);
    const gap = Math.max(0, targetAkurasi - akr);
    return { subtes: s.subtes, akr, gap, st: statusSubtes(akr) };
  });
  const totalGap = rows.reduce((a, r) => a + r.gap, 0);

  return (
    <>
      <PortalTopbar eyebrow="Navigator  ›  Gap Analysis" title="Analisis Kesenjangan" subtitle={`Selisih penguasaanmu menuju target (${targetAkurasi}%) per subtes.`} nama={profile?.nama ?? "Farhan"}
        right={<Link href="/app/navigator" className="inline-flex h-10 items-center gap-2 rounded-lg border bg-white px-4 text-body-sm font-semibold text-ink transition-colors hover:bg-muted"><ArrowLeft size={15} /> Kembali</Link>} />

      <div className="space-y-5 p-5 lg:p-7">
        <div className="grid gap-5 sm:grid-cols-3">
          <div className="rounded-2xl border bg-white p-5"><div className="text-caption text-ink-muted">Total Gap</div><div className="text-stat text-ink">{totalGap}<span className="text-body-sm font-normal text-ink-muted"> poin%</span></div></div>
          <div className="rounded-2xl border bg-white p-5"><div className="text-caption text-ink-muted">Subtes di Bawah Target</div><div className="text-stat text-ink">{rows.filter((r) => r.gap > 0).length}<span className="text-body-sm font-normal text-ink-muted"> /{rows.length}</span></div></div>
          <div className="rounded-2xl border bg-white p-5"><div className="text-caption text-ink-muted">Jalur Tes</div><div className="text-h-md text-ink">{seg.short}</div></div>
        </div>

        <div className="rounded-2xl border bg-white p-5">
          <h3 className="text-h-sm text-ink">Kesenjangan per Subtes</h3>
          <div className="mt-4 space-y-4">
            {rows.map((r) => (
              <div key={r.subtes}>
                <div className="flex items-center justify-between text-body-sm">
                  <span className="font-semibold text-ink">{r.subtes}</span>
                  <span className="text-ink-muted">{r.akr}% <span className="text-ink-muted">/ {targetAkurasi}%</span> {r.gap > 0 ? <b className="text-[#E5484D]">· gap {r.gap}%</b> : <b className="text-success-strong">· tercapai</b>}</span>
                </div>
                <div className="mt-1.5 h-2.5 rounded-full bg-hair">
                  <div className="relative h-full rounded-full" style={{ width: `${r.akr}%`, backgroundColor: r.st.bar }} />
                </div>
              </div>
            ))}
          </div>
          <Link href="/app/navigator/focus-plan" className="mt-5 inline-flex items-center gap-1.5 rounded-lg bg-brand px-4 py-2.5 text-body-sm font-semibold text-white transition-colors hover:bg-brand-600"><TrendingUp size={15} /> Buat Rencana Fokus <ArrowRight size={14} /></Link>
        </div>
      </div>
    </>
  );
}
