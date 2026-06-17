import Link from "next/link";
import { Users, ClipboardList, BookOpen, BarChart3, ArrowRight, Megaphone, ClipboardCheck } from "lucide-react";
import { requireStaff } from "@/lib/portal/roles";
import { getStafOverview, getStafStudents } from "@/lib/console/data";
import { ConsoleTopbar } from "@/components/console/topbar";
import { StatCard, ConsoleCard, Pill } from "@/components/console/ui";

export const metadata = { title: "Dashboard Staf — Albirru" };

export default async function StafDashboard() {
  const { profile } = await requireStaff();
  const [ov, students] = await Promise.all([getStafOverview(), getStafStudents()]);
  const recent = students.slice(0, 6);

  const aksi = [
    { href: "/staf/try-out/buat", label: "Buat Try Out", icon: ClipboardList },
    { href: "/staf/materi/upload", label: "Upload Materi", icon: BookOpen },
    { href: "/staf/penugasan", label: "Beri Penugasan", icon: ClipboardCheck },
    { href: "/staf/pengumuman", label: "Pengumuman", icon: Megaphone },
  ];

  return (
    <>
      <ConsoleTopbar eyebrow="Academic Team" title={`Halo, ${profile?.nama ?? "Tim"}`} subtitle="Ringkasan performa & aktivitas siswa." nama={profile?.nama ?? "Tim"} roleLabel="Staf" />

      <div className="space-y-5 p-5 lg:p-7">
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Total Siswa" value={ov.total_siswa} icon={Users} />
          <StatCard label="Try Out Selesai" value={ov.total_attempt} icon={ClipboardList} accent="success" />
          <StatCard label="Rata-rata Skor" value={ov.rata_skor ?? "—"} icon={BarChart3} accent="warning" />
          <StatCard label="Materi" value={ov.total_materi} icon={BookOpen} />
        </div>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
          <ConsoleCard title="Siswa Terbaru" action={<Link href="/staf/siswa" className="inline-flex items-center gap-1 text-body-sm font-semibold text-brand hover:underline">Lihat semua <ArrowRight size={14} /></Link>}>
            {recent.length === 0 ? (
              <p className="py-6 text-center text-body-sm text-ink-muted">Belum ada siswa terdaftar.</p>
            ) : (
              <div className="divide-y">
                {recent.map((s) => (
                  <Link key={s.id} href={`/staf/siswa/${s.id}`} className="flex items-center gap-3 py-3 transition-colors hover:bg-muted/50">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-100 text-body-sm font-bold text-brand">{(s.nama?.[0] ?? "S").toUpperCase()}</span>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-body-sm font-semibold text-ink">{s.nama ?? "Tanpa nama"}</div>
                      <div className="truncate text-caption text-ink-muted">{s.asal_sekolah ?? "—"}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-body-sm font-bold text-ink">{s.skor_terakhir ?? "—"}</div>
                      <div className="text-caption text-ink-muted">{s.jumlah_tryout}× TO</div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </ConsoleCard>

          <ConsoleCard title="Aksi Cepat">
            <div className="grid gap-3">
              {aksi.map((a) => { const Icon = a.icon; return (
                <Link key={a.href} href={a.href} className="flex items-center gap-3 rounded-xl border bg-white p-3.5 transition-colors hover:border-brand hover:bg-brand-100/40">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-100 text-brand"><Icon size={18} /></span>
                  <span className="flex-1 text-body-sm font-semibold text-ink">{a.label}</span>
                  <ArrowRight size={15} className="text-ink-muted" />
                </Link>
              ); })}
            </div>
            <div className="mt-4 rounded-xl bg-muted p-3.5 text-caption text-ink-muted">
              <Pill tone="brand">Info</Pill> <span className="ml-1">Data agregat real-time dari aktivitas siswa.</span>
            </div>
          </ConsoleCard>
        </div>
      </div>
    </>
  );
}
