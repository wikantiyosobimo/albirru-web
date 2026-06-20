import Link from "next/link";
import { ArrowLeft, Trophy, ClipboardList, Target, TrendingUp, FileText } from "lucide-react";
import { requireStaff } from "@/lib/portal/roles";
import { getAdminUserDetail } from "@/lib/console/data";
import { ConsoleTopbar } from "@/components/console/topbar";
import { StatCard, ConsoleCard, EmptyState, Pill } from "@/components/console/ui";

export const metadata = { title: "Detail Siswa — Staf Albirru" };

export default async function StafSiswaDetail({ params }: { params: { id: string } }) {
  const { profile } = await requireStaff();
  const data = await getAdminUserDetail(params.id);
  const p = data.profile as Record<string, string | number | null> | null;
  const nama = (p?.nama as string) ?? "Siswa";
  const tryout = data.tryout ?? [];
  const skorTerakhir = tryout[0]?.skor ?? null;

  return (
    <>
      <ConsoleTopbar eyebrow="Akademik  ›  Siswa" title={nama} subtitle="Profil read-only — intelligence & riwayat." nama={profile?.nama ?? "Tim"} roleLabel="Staf"
        right={<div className="flex gap-2">
          <Link href={`/staf/siswa/${params.id}/report`} className="inline-flex h-10 items-center gap-2 rounded-lg bg-brand px-4 text-body-sm font-semibold text-white hover:bg-brand-600"><FileText size={15} /> Lihat Report</Link>
          <Link href="/staf/siswa" className="inline-flex h-10 items-center gap-2 rounded-lg border bg-white px-4 text-body-sm font-semibold text-ink hover:bg-muted"><ArrowLeft size={15} /> Kembali</Link>
        </div>} />

      <div className="space-y-5 p-5 lg:p-7">
        {!p ? (
          <EmptyState icon={ClipboardList} title="Siswa tidak ditemukan" note="Data profil tidak tersedia atau Anda tidak berwenang." />
        ) : (
          <>
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard label="Skor Terakhir" value={skorTerakhir ?? "—"} icon={TrendingUp} accent="success" />
              <StatCard label="Total Try Out" value={tryout.length} icon={ClipboardList} />
              <StatCard label="Level" value={data.level} sub={`${data.xp} XP`} icon={Trophy} accent="warning" />
              <StatCard label="Target" value={(p.target_skor as number) ?? "—"} sub={(p.target_kampus as string) ?? "Belum diatur"} icon={Target} />
            </div>

            <div className="grid gap-5 lg:grid-cols-[320px_minmax(0,1fr)]">
              <ConsoleCard title="Identitas">
                <dl className="space-y-3 text-body-sm">
                  {[
                    ["Jenjang", p.jenjang], ["Jurusan", p.jurusan], ["Sekolah", p.asal_sekolah],
                    ["Jalur", (p.segment as string)?.toUpperCase()], ["Prodi Target", p.target_prodi], ["Plan", p.plan],
                  ].map(([k, v]) => (
                    <div key={k as string} className="flex justify-between gap-3">
                      <dt className="text-ink-muted">{k}</dt>
                      <dd className="text-right font-semibold text-ink">{(v as string) || "—"}</dd>
                    </div>
                  ))}
                </dl>
              </ConsoleCard>

              <ConsoleCard title="Riwayat Try Out">
                {tryout.length === 0 ? (
                  <p className="py-6 text-center text-body-sm text-ink-muted">Belum ada try out yang diselesaikan.</p>
                ) : (
                  <div className="divide-y">
                    {tryout.map((t, i) => (
                      <div key={i} className="flex items-center gap-3 py-3">
                        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-ink-body"><ClipboardList size={16} /></span>
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-body-sm font-semibold text-ink">{t.tryout_id}</div>
                          <div className="text-caption text-ink-muted">{new Date(t.submitted_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Pill tone="success">{t.benar}B</Pill><Pill tone="danger">{t.salah}S</Pill><Pill>{t.kosong}K</Pill>
                          <span className="ml-1 w-12 text-right text-body-lg font-bold text-ink">{t.skor}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ConsoleCard>
            </div>
          </>
        )}
      </div>
    </>
  );
}
