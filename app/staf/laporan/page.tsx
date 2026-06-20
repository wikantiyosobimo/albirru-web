import { BarChart3, Users, ClipboardList, TrendingUp, FileText } from "lucide-react";
import { requireStaff } from "@/lib/portal/roles";
import { getStafOverview } from "@/lib/console/data";
import { ConsoleTopbar } from "@/components/console/topbar";
import { StatCard, ConsoleCard } from "@/components/console/ui";
import { ExportButtons } from "@/components/staf/export-buttons";

export const metadata = { title: "Laporan — Staf Albirru" };

export default async function StafLaporanPage() {
  const { profile } = await requireStaff();
  const ov = await getStafOverview();

  const laporan = [
    { key: "performa", judul: "Rekap Performa Siswa", desc: "Skor & akurasi seluruh siswa", icon: Users },
    { key: "tryout", judul: "Hasil Try Out per Paket", desc: "Peringkat & distribusi skor", icon: ClipboardList },
    { key: "topik", judul: "Analisis Topik Lemah", desc: "Agregat weakness per kelas", icon: TrendingUp },
    { key: "progres", judul: "Progres Pembelajaran", desc: "Penyelesaian materi per siswa", icon: FileText },
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
              <div key={l.key} className="flex items-center gap-4 rounded-xl border bg-white p-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-100 text-brand"><Icon size={20} /></span>
                <div className="min-w-0 flex-1"><div className="text-body-sm font-semibold text-ink">{l.judul}</div><div className="text-caption text-ink-muted">{l.desc}</div></div>
                <ExportButtons reportKey={l.key} />
              </div>
            ); })}
          </div>
        </ConsoleCard>
      </div>
    </>
  );
}
