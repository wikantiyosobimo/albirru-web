import { BarChart3, Download, Users, ClipboardList, TrendingUp, FileText } from "lucide-react";
import { requireStaff } from "@/lib/portal/roles";
import { getStafOverview } from "@/lib/console/data";
import { ConsoleTopbar } from "@/components/console/topbar";
import { StatCard, ConsoleCard } from "@/components/console/ui";

export const metadata = { title: "Laporan — Staf Albirru" };

export default async function StafLaporanPage() {
  const { profile } = await requireStaff();
  const ov = await getStafOverview();

  const laporan = [
    { judul: "Rekap Performa Siswa", desc: "Skor & akurasi seluruh siswa", icon: Users, fmt: "CSV" },
    { judul: "Hasil Try Out per Paket", desc: "Peringkat & distribusi skor", icon: ClipboardList, fmt: "CSV" },
    { judul: "Analisis Topik Lemah", desc: "Agregat weakness per kelas", icon: TrendingUp, fmt: "PDF" },
    { judul: "Progres Pembelajaran", desc: "Penyelesaian materi per siswa", icon: FileText, fmt: "CSV" },
  ];

  return (
    <>
      <ConsoleTopbar eyebrow="Komunikasi" title="Laporan & Analitik" subtitle="Unduh laporan performa." nama={profile?.nama ?? "Tim"} roleLabel="Staf" />

      <div className="space-y-5 p-5 lg:p-7">
        <div className="grid gap-5 sm:grid-cols-3">
          <StatCard label="Total Siswa" value={ov.total_siswa} icon={Users} />
          <StatCard label="Try Out Selesai" value={ov.total_attempt} icon={ClipboardList} accent="success" />
          <StatCard label="Rata-rata Skor" value={ov.rata_skor ?? "—"} icon={BarChart3} accent="warning" />
        </div>

        <ConsoleCard title="Unduh Laporan">
          <div className="grid gap-4 sm:grid-cols-2">
            {laporan.map((l) => { const Icon = l.icon; return (
              <div key={l.judul} className="flex items-center gap-4 rounded-xl border bg-white p-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-100 text-brand"><Icon size={20} /></span>
                <div className="min-w-0 flex-1"><div className="text-body-sm font-semibold text-ink">{l.judul}</div><div className="text-caption text-ink-muted">{l.desc}</div></div>
                <button className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-body-sm font-semibold text-ink hover:bg-muted"><Download size={14} /> {l.fmt}</button>
              </div>
            ); })}
          </div>
          <p className="mt-4 text-caption text-ink-muted">Ekspor PDF/CSV memakai feature flag <code className="rounded bg-muted px-1">pdf_export</code> (Fase quick-win).</p>
        </ConsoleCard>
      </div>
    </>
  );
}
