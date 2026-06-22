import Link from "next/link";
import { Database, Upload, Filter } from "lucide-react";
import { requireAdmin } from "@/lib/portal/roles";
import { createClient } from "@/lib/supabase/server";
import { ConsoleTopbar } from "@/components/console/topbar";
import { StatCard, ConsoleCard, EmptyState, Pill } from "@/components/console/ui";
import { NewQuestionButton } from "@/components/admin/admin-actions";

export const metadata = { title: "Bank Soal — Admin Albirru" };

type Q = { id: string; kode: string | null; mapel: string; level_kesulitan: number; tipe: string; cognitive_skill: string | null; aktif: boolean };
const lvlTone = (l: number) => (l >= 4 ? "danger" : l === 3 ? "warning" : "success") as "danger" | "warning" | "success";

export default async function AdminBankSoal() {
  const { profile } = await requireAdmin();
  let soal: Q[] = [];
  let total = 0;
  try {
    const supabase = await createClient();
    const { data, count } = await supabase.from("questions").select("id, kode, mapel, level_kesulitan, tipe, cognitive_skill, aktif", { count: "exact" }).order("created_at", { ascending: false }).limit(50);
    soal = (data as Q[]) ?? [];
    total = count ?? 0;
  } catch { /* kosong */ }

  const aktif = soal.filter((s) => s.aktif).length;

  return (
    <>
      <ConsoleTopbar eyebrow="Konten" title="Bank Soal" subtitle={`${total} soal dalam bank.`} nama={profile?.nama ?? "Admin"} roleLabel="Admin"
        right={<div className="flex gap-2"><Link href="/admin/bank-soal/import" className="inline-flex h-10 items-center gap-2 rounded-lg border bg-white px-4 text-body-sm font-semibold text-ink hover:bg-muted"><Upload size={15} /> Import</Link><NewQuestionButton /></div>} />

      <div className="space-y-5 p-5 lg:p-7">
        <div className="grid gap-5 sm:grid-cols-3">
          <StatCard label="Total Soal" value={total} icon={Database} />
          <StatCard label="Aktif" value={aktif} icon={Filter} accent="success" />
          <StatCard label="Draft" value={total - aktif} icon={Filter} accent="warning" />
        </div>

        <ConsoleCard title="Daftar Soal">
          {soal.length === 0 ? (
            <EmptyState icon={Database} title="Bank soal kosong" note="Tabel questions siap. Tambah soal manual atau import CSV. Kunci jawaban tetap server-side." />
          ) : (
            <div className="overflow-hidden rounded-xl border">
              <table className="w-full text-left text-body-sm">
                <thead className="border-b bg-muted/50 text-caption uppercase tracking-wide text-ink-muted">
                  <tr><th className="px-4 py-2.5 font-semibold">Kode</th><th className="px-4 py-2.5 font-semibold">Mapel</th><th className="hidden px-4 py-2.5 font-semibold sm:table-cell">Skill</th><th className="px-4 py-2.5 font-semibold">Level</th><th className="px-4 py-2.5 font-semibold">Status</th></tr>
                </thead>
                <tbody className="divide-y">
                  {soal.map((s) => (
                    <tr key={s.id} className="hover:bg-muted/40">
                      <td className="px-4 py-2.5 font-mono text-caption text-ink-body">{s.kode ?? s.id.slice(0, 8)}</td>
                      <td className="px-4 py-2.5 font-semibold text-ink">{s.mapel}</td>
                      <td className="hidden px-4 py-2.5 text-ink-body sm:table-cell">{s.cognitive_skill ?? "—"}</td>
                      <td className="px-4 py-2.5"><Pill tone={lvlTone(s.level_kesulitan)}>L{s.level_kesulitan}</Pill></td>
                      <td className="px-4 py-2.5">{s.aktif ? <Pill tone="success">Aktif</Pill> : <Pill>Draft</Pill>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </ConsoleCard>
      </div>
    </>
  );
}
