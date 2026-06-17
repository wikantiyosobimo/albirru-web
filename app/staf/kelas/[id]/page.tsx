import Link from "next/link";
import { ArrowLeft, Users, TrendingUp, Target } from "lucide-react";
import { requireStaff } from "@/lib/portal/roles";
import { ConsoleTopbar } from "@/components/console/topbar";
import { StatCard, ConsoleCard } from "@/components/console/ui";

export const metadata = { title: "Statistik Kelas — Staf Albirru" };

const DIST = [
  { rentang: "800+", jml: 4 }, { rentang: "700-799", jml: 8 }, { rentang: "600-699", jml: 11 },
  { rentang: "500-599", jml: 6 }, { rentang: "<500", jml: 3 },
];
const TOPIK_LEMAH = [
  { topik: "Penalaran Matematika", akurasi: 48 }, { topik: "Literasi Inggris", akurasi: 56 },
  { topik: "Penalaran Umum", akurasi: 63 }, { topik: "Pengetahuan Kuantitatif", akurasi: 67 },
];

export default async function StafKelasDetail({ params }: { params: { id: string } }) {
  const { profile } = await requireStaff();
  const nama = params.id.replace(/-/g, " ").toUpperCase();
  const maxDist = Math.max(...DIST.map((d) => d.jml));

  return (
    <>
      <ConsoleTopbar eyebrow="Akademik  ›  Kelas" title={nama} subtitle="Distribusi skor & topik lemah kolektif." nama={profile?.nama ?? "Tim"} roleLabel="Staf"
        right={<Link href="/staf/kelas" className="inline-flex h-10 items-center gap-2 rounded-lg border bg-white px-4 text-body-sm font-semibold text-ink hover:bg-muted"><ArrowLeft size={15} /> Kembali</Link>} />

      <div className="space-y-5 p-5 lg:p-7">
        <div className="grid gap-5 sm:grid-cols-3">
          <StatCard label="Jumlah Siswa" value={32} icon={Users} />
          <StatCard label="Rata-rata Skor" value={642} icon={TrendingUp} accent="success" />
          <StatCard label="Siap Target" value="62%" sub="≥ skor target" icon={Target} accent="warning" />
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <ConsoleCard title="Distribusi Skor">
            <div className="space-y-3">
              {DIST.map((d) => (
                <div key={d.rentang} className="flex items-center gap-3">
                  <span className="w-20 text-body-sm text-ink-body">{d.rentang}</span>
                  <div className="h-6 flex-1 overflow-hidden rounded-md bg-muted">
                    <div className="flex h-full items-center justify-end rounded-md bg-brand px-2 text-[11px] font-bold text-white" style={{ width: `${(d.jml / maxDist) * 100}%` }}>{d.jml}</div>
                  </div>
                </div>
              ))}
            </div>
          </ConsoleCard>

          <ConsoleCard title="Topik Lemah Kolektif">
            <div className="space-y-4">
              {TOPIK_LEMAH.map((t) => (
                <div key={t.topik}>
                  <div className="flex justify-between text-body-sm"><span className="font-semibold text-ink">{t.topik}</span><span className="text-ink-muted">{t.akurasi}%</span></div>
                  <div className="mt-1.5 h-2.5 rounded-full bg-hair"><div className="h-full rounded-full bg-[#E5484D]" style={{ width: `${t.akurasi}%` }} /></div>
                </div>
              ))}
            </div>
            <Link href="/staf/penugasan" className="mt-5 inline-flex items-center gap-1.5 rounded-lg bg-brand px-4 py-2.5 text-body-sm font-semibold text-white hover:bg-brand-600">Beri penugasan terarah</Link>
          </ConsoleCard>
        </div>
      </div>
    </>
  );
}
