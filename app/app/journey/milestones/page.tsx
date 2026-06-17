import Link from "next/link";
import { ArrowLeft, CheckCircle2, Flag } from "lucide-react";
import { getPortalProfile } from "@/lib/portal/session";
import { PortalTopbar } from "@/components/portal/topbar";
import { cn } from "@/lib/utils";

export const metadata = { title: "Milestone — Albirru" };

// Milestone T-minus otomatis (PRD BAB 9).
const MILESTONES = [
  { t: "T-90", judul: "Assessment Awal", desc: "Try out diagnostik, peta kelemahan pertama, target & jadwal dibuat.", status: "selesai" },
  { t: "T-60", judul: "Penguatan", desc: "≥3 try out, remediasi topik lemah, skor +50 dari baseline, streak ≥14.", status: "selesai" },
  { t: "T-30", judul: "Simulasi Penuh", desc: "≥2 simulasi penuh, skor masuk range passing grade minimum.", status: "aktif" },
  { t: "T-14", judul: "Fokus ROI", desc: "Prioritaskan topik berdampak tertinggi; 1 simulasi/minggu.", status: "akan" },
  { t: "T-7", judul: "Final Review", desc: "Tinjau pola kesalahan; latihan ringan menjaga ritme.", status: "akan" },
  { t: "T-0", judul: "Hari H", desc: "Notifikasi motivasi + checklist logistik. Eksekusi maksimal!", status: "akan" },
];

const TONE: Record<string, string> = { selesai: "bg-success text-white", aktif: "bg-brand text-white", akan: "bg-hair text-ink-muted" };

export default async function MilestonesPage() {
  const { profile } = await getPortalProfile();

  return (
    <>
      <PortalTopbar eyebrow="Journey  ›  Milestone" title="Milestone Menuju Hari H" subtitle="Peta pencapaian otomatis berdasarkan jadwal ujianmu." nama={profile?.nama ?? "Farhan"}
        right={<Link href="/app/journey" className="inline-flex h-10 items-center gap-2 rounded-lg border bg-white px-4 text-body-sm font-semibold text-ink transition-colors hover:bg-muted"><ArrowLeft size={15} /> Kembali</Link>} />

      <div className="p-5 lg:p-7">
        <div className="rounded-2xl border bg-white p-6">
          {MILESTONES.map((m, i) => {
            const last = i === MILESTONES.length - 1;
            return (
              <div key={m.t} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <span className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-caption font-extrabold", TONE[m.status])}>
                    {m.status === "selesai" ? <CheckCircle2 size={20} /> : m.t}
                  </span>
                  {!last ? <span className={cn("my-1 w-0.5 flex-1", m.status === "selesai" ? "bg-success/40" : "bg-hair")} style={{ minHeight: 30 }} /> : null}
                </div>
                <div className={last ? "" : "pb-6"}>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-body-lg font-bold text-ink">{m.judul}</span>
                    <span className="text-caption text-ink-muted">· {m.t}</span>
                    {m.status === "aktif" ? <span className="rounded-md bg-brand-100 px-2 py-0.5 text-[11px] font-semibold text-brand">Tahap Sekarang</span> : null}
                    {m.status === "selesai" ? <span className="rounded-md bg-success-subtle px-2 py-0.5 text-[11px] font-semibold text-success-strong">Selesai</span> : null}
                  </div>
                  <p className="mt-0.5 text-body-sm text-ink-body">{m.desc}</p>
                </div>
              </div>
            );
          })}
          <div className="mt-2 flex items-center gap-2 rounded-xl bg-muted p-4 text-body-sm text-ink-body">
            <Flag size={16} className="shrink-0 text-brand" /> Atur tanggal ujianmu di <Link href="/app/target/edit" className="font-semibold text-brand hover:underline">Edit Target</Link> agar milestone dihitung otomatis.
          </div>
        </div>
      </div>
    </>
  );
}
