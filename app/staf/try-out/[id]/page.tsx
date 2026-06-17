import Link from "next/link";
import { ArrowLeft, Users, ClipboardList, TrendingUp, Download } from "lucide-react";
import { requireStaff } from "@/lib/portal/roles";
import { createClient } from "@/lib/supabase/server";
import { ConsoleTopbar } from "@/components/console/topbar";
import { StatCard, ConsoleCard, EmptyState, Pill } from "@/components/console/ui";

export const metadata = { title: "Detail Try Out — Staf Albirru" };

type Attempt = { skor: number; benar: number; salah: number; kosong: number; submitted_at: string };

export default async function StafTryOutDetail({ params }: { params: { id: string } }) {
  const { profile } = await requireStaff();
  let title = params.id;
  let attempts: Attempt[] = [];
  let jumlahSoal = 0;
  try {
    const supabase = await createClient();
    const [{ data: to }, { data: at }, { count }] = await Promise.all([
      supabase.from("tryouts").select("title").eq("id", params.id).single(),
      supabase.from("tryout_attempts").select("skor, benar, salah, kosong, submitted_at").eq("tryout_id", params.id).eq("status", "selesai").order("skor", { ascending: false }).limit(50),
      supabase.from("tryout_questions").select("id", { count: "exact", head: true }).eq("tryout_id", params.id),
    ]);
    if (to?.title) title = to.title;
    attempts = (at as Attempt[]) ?? [];
    jumlahSoal = count ?? 0;
  } catch { /* fallback */ }

  const rata = attempts.length ? Math.round(attempts.reduce((a, x) => a + x.skor, 0) / attempts.length) : null;

  return (
    <>
      <ConsoleTopbar eyebrow="Akademik  ›  Try Out" title={title} subtitle="Peserta & hasil." nama={profile?.nama ?? "Tim"} roleLabel="Staf"
        right={<Link href="/staf/try-out" className="inline-flex h-10 items-center gap-2 rounded-lg border bg-white px-4 text-body-sm font-semibold text-ink hover:bg-muted"><ArrowLeft size={15} /> Kembali</Link>} />

      <div className="space-y-5 p-5 lg:p-7">
        <div className="grid gap-5 sm:grid-cols-3">
          <StatCard label="Peserta" value={attempts.length} icon={Users} />
          <StatCard label="Rata-rata Skor" value={rata ?? "—"} icon={TrendingUp} accent="success" />
          <StatCard label="Jumlah Soal" value={jumlahSoal} icon={ClipboardList} accent="warning" />
        </div>

        <ConsoleCard title="Peringkat Peserta" action={<button className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-body-sm font-semibold text-ink hover:bg-muted"><Download size={14} /> Unduh CSV</button>}>
          {attempts.length === 0 ? (
            <EmptyState icon={Users} title="Belum ada peserta" note="Hasil muncul setelah siswa menyelesaikan try out ini." />
          ) : (
            <div className="overflow-hidden rounded-xl border">
              <table className="w-full text-left text-body-sm">
                <thead className="border-b bg-muted/50 text-caption uppercase tracking-wide text-ink-muted">
                  <tr><th className="px-4 py-2.5 font-semibold">#</th><th className="px-4 py-2.5 font-semibold">Skor</th><th className="px-4 py-2.5 font-semibold">B / S / K</th><th className="hidden px-4 py-2.5 font-semibold sm:table-cell">Tanggal</th></tr>
                </thead>
                <tbody className="divide-y">
                  {attempts.map((a, i) => (
                    <tr key={i} className="hover:bg-muted/40">
                      <td className="px-4 py-2.5 font-bold text-ink-muted">{i + 1}</td>
                      <td className="px-4 py-2.5 text-body-lg font-bold text-ink">{a.skor}</td>
                      <td className="px-4 py-2.5"><span className="flex gap-1.5"><Pill tone="success">{a.benar}</Pill><Pill tone="danger">{a.salah}</Pill><Pill>{a.kosong}</Pill></span></td>
                      <td className="hidden px-4 py-2.5 text-ink-body sm:table-cell">{new Date(a.submitted_at).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}</td>
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
