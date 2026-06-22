import Link from "next/link";
import { Users, Search, ChevronRight } from "lucide-react";
import { requireStaff } from "@/lib/portal/roles";
import { getStafStudents } from "@/lib/console/data";
import { ConsoleTopbar } from "@/components/console/topbar";
import { EmptyState, Pill } from "@/components/console/ui";

export const metadata = { title: "Siswa — Staf Albirru" };

export default async function StafSiswaPage({ searchParams }: { searchParams: { q?: string } }) {
  const { profile } = await requireStaff();
  const q = searchParams.q?.trim() || undefined;
  const students = await getStafStudents(q);

  return (
    <>
      <ConsoleTopbar eyebrow="Akademik" title="Daftar Siswa" subtitle={`${students.length} siswa termonitor.`} nama={profile?.nama ?? "Tim"} roleLabel="Staf" />

      <div className="space-y-5 p-5 lg:p-7">
        <form className="relative max-w-md">
          <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted" />
          <input name="q" aria-label="Cari nama atau sekolah" defaultValue={q} placeholder="Cari nama atau sekolah…" className="h-11 w-full rounded-lg border bg-white pl-10 pr-4 text-body-sm text-ink placeholder:text-ink-muted" />
        </form>

        {students.length === 0 ? (
          <EmptyState icon={Users} title="Belum ada siswa" note={q ? `Tidak ada hasil untuk "${q}".` : "Siswa akan muncul setelah mendaftar & onboarding."} />
        ) : (
          <>
          {/* Mobile: kartu (tap besar, semua data inti terlihat) */}
          <div className="grid gap-3 sm:hidden">
            {students.map((s) => (
              <Link key={s.id} href={`/staf/siswa/${s.id}`} className="flex items-center gap-3 rounded-2xl border bg-white p-4 active:bg-muted/40">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-100 text-body-sm font-bold text-brand">{(s.nama?.[0] ?? "S").toUpperCase()}</span>
                <div className="min-w-0 flex-1">
                  <div className="truncate font-semibold text-ink">{s.nama ?? "Tanpa nama"}</div>
                  <div className="mt-0.5 truncate text-caption text-ink-muted">{s.asal_sekolah ?? "—"} · {s.jumlah_tryout}× TO</div>
                </div>
                <div className="shrink-0 text-right">
                  <div className="text-body-lg font-bold text-ink">{s.skor_terakhir ?? "—"}</div>
                  <div className="text-caption text-ink-muted">skor</div>
                </div>
                <ChevronRight size={18} className="shrink-0 text-ink-muted" />
              </Link>
            ))}
          </div>

          {/* Desktop: tabel */}
          <div className="hidden overflow-hidden rounded-2xl border bg-white sm:block">
            <table className="w-full text-left text-body-sm">
              <thead className="border-b bg-muted/50 text-caption uppercase tracking-wide text-ink-muted">
                <tr>
                  <th className="px-5 py-3 font-semibold">Nama</th>
                  <th className="hidden px-5 py-3 font-semibold md:table-cell">Sekolah</th>
                  <th className="hidden px-5 py-3 font-semibold sm:table-cell">Jalur</th>
                  <th className="px-5 py-3 font-semibold">Skor</th>
                  <th className="hidden px-5 py-3 font-semibold sm:table-cell">TO</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y">
                {students.map((s) => (
                  <tr key={s.id} className="transition-colors hover:bg-muted/40">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-100 text-caption font-bold text-brand">{(s.nama?.[0] ?? "S").toUpperCase()}</span>
                        <div className="min-w-0">
                          <div className="truncate font-semibold text-ink">{s.nama ?? "Tanpa nama"}</div>
                          {s.plan !== "free" ? <Pill tone="brand">{s.plan}</Pill> : null}
                        </div>
                      </div>
                    </td>
                    <td className="hidden px-5 py-3 text-ink-body md:table-cell">{s.asal_sekolah ?? "—"}</td>
                    <td className="hidden px-5 py-3 sm:table-cell"><Pill>{(s.segment ?? "—").toUpperCase()}</Pill></td>
                    <td className="px-5 py-3 font-bold text-ink">{s.skor_terakhir ?? "—"}</td>
                    <td className="hidden px-5 py-3 text-ink-body sm:table-cell">{s.jumlah_tryout}</td>
                    <td className="px-5 py-3 text-right"><Link href={`/staf/siswa/${s.id}`} className="inline-flex items-center gap-1 text-body-sm font-semibold text-brand hover:underline">Detail <ChevronRight size={14} /></Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          </>
        )}
      </div>
    </>
  );
}
