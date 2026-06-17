import Link from "next/link";
import { ArrowLeft, Target, BookOpen, Brain, Sigma, CheckCircle2, Clock } from "lucide-react";
import { getPortalProfile } from "@/lib/portal/session";
import { getUserIntelligence } from "@/lib/portal/intelligence";
import { statusSubtes } from "@/lib/portal/peluang";
import { PortalTopbar } from "@/components/portal/topbar";

export const metadata = { title: "Focus Plan — Albirru" };

function ikon(name: string) {
  const n = name.toLowerCase();
  if (n.includes("matematika") || n.includes("kuantitatif") || n.includes("tiu")) return Sigma;
  if (n.includes("penalaran") || n.includes("tkp")) return Brain;
  return BookOpen;
}
const HARI = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"];

export default async function FocusPlanPage() {
  const { profile } = await getPortalProfile();
  const intel = await getUserIntelligence();
  const fokus = (intel.hasData ? intel.subtes.slice(0, 3) : [
    { subtes: "Penalaran Matematika", akurasi: 51 }, { subtes: "Literasi Indonesia", akurasi: 64 }, { subtes: "Penalaran Umum", akurasi: 70 },
  ] as { subtes: string; akurasi: number | null }[]);

  return (
    <>
      <PortalTopbar eyebrow="Navigator  ›  Focus Plan" title="Rencana Fokus Mingguan" subtitle="Langkah konkret untuk area yang paling berdampak." nama={profile?.nama ?? "Farhan"}
        right={<Link href="/app/navigator" className="inline-flex h-10 items-center gap-2 rounded-lg border bg-white px-4 text-body-sm font-semibold text-ink transition-colors hover:bg-muted"><ArrowLeft size={15} /> Kembali</Link>} />

      <div className="space-y-5 p-5 lg:p-7">
        <div className="flex items-center gap-3 rounded-2xl border bg-brand-100 p-5">
          <Target size={22} className="shrink-0 text-brand" />
          <p className="text-body-sm text-ink-body">Rencana ini disusun dari <b className="text-ink">3 subtes terlemahmu</b>. Selesaikan bertahap untuk dampak skor paling besar.</p>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {fokus.map((f, i) => {
            const Icon = ikon(f.subtes);
            const akr = Math.round(f.akurasi ?? 0);
            const st = statusSubtes(akr);
            return (
              <div key={f.subtes} className="rounded-2xl border bg-white p-5">
                <div className="flex items-center justify-between">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ backgroundColor: st.sb, color: st.sc }}><Icon size={18} /></span>
                  <span className="rounded-full bg-muted px-2 py-0.5 text-caption font-bold text-ink-body">Prioritas {i + 1}</span>
                </div>
                <div className="mt-3 text-body-lg font-bold text-ink">{f.subtes}</div>
                <div className="text-caption text-ink-muted">Akurasi saat ini {akr}%</div>
                <div className="mt-2 h-2 rounded-full bg-hair"><div className="h-full rounded-full" style={{ width: `${akr}%`, backgroundColor: st.bar }} /></div>
                <ul className="mt-4 space-y-2 text-body-sm text-ink-body">
                  {["Pelajari materi inti di Learning Center", "Kerjakan 15 soal terfokus", "Review pembahasan soal salah"].map((s) => (
                    <li key={s} className="flex items-start gap-2"><CheckCircle2 size={15} className="mt-0.5 shrink-0 text-success" /> {s}</li>
                  ))}
                </ul>
                <Link href="/app/intelligence/smart-revision" className="mt-4 flex w-full items-center justify-center rounded-lg bg-brand py-2.5 text-body-sm font-semibold text-white transition-colors hover:bg-brand-600">Mulai Latihan</Link>
              </div>
            );
          })}
        </div>

        <div className="rounded-2xl border bg-white p-5">
          <h3 className="text-h-sm text-ink">Jadwal Belajar Minggu Ini</h3>
          <div className="mt-4 space-y-2.5">
            {HARI.map((h, i) => {
              const f = fokus[i % fokus.length];
              const Icon = ikon(f.subtes);
              return (
                <div key={h} className="flex items-center gap-3 rounded-xl border p-3">
                  <span className="w-16 shrink-0 text-body-sm font-bold text-ink">{h}</span>
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-100 text-brand"><Icon size={17} /></span>
                  <div className="min-w-0 flex-1 text-body-sm font-medium text-ink">{f.subtes} — sesi terfokus</div>
                  <span className="flex shrink-0 items-center gap-1 text-caption text-ink-muted"><Clock size={13} /> 45 mnt</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
