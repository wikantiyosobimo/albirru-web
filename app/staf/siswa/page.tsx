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
          <div className="overflow-hidden rounded-2xl border bg-white">
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
        )}
      </div>
    </>
  );
}
