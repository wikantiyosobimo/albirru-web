import Link from "next/link";
import { BookOpen, Video, FileText, Radio, Plus, Clock } from "lucide-react";
import { requireStaff } from "@/lib/portal/roles";
import { createClient } from "@/lib/supabase/server";
import { ConsoleTopbar } from "@/components/console/topbar";
import { EmptyState, Pill } from "@/components/console/ui";

export const metadata = { title: "Materi — Staf Albirru" };

const ICON: Record<string, typeof BookOpen> = { video: Video, artikel: FileText, latihan: BookOpen, live: Radio, pdf: FileText };

type Materi = { id: string; judul: string; tipe: string; durasi_menit: number | null; is_premium: boolean; aktif: boolean };

export default async function StafMateriPage() {
  const { profile } = await requireStaff();
  let materi: Materi[] = [];
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("learning_materials").select("id, judul, tipe, durasi_menit, is_premium, aktif").order("urutan").limit(100);
    materi = (data as Materi[]) ?? [];
  } catch { /* fallback kosong */ }

  return (
    <>
      <ConsoleTopbar eyebrow="Akademik" title="Kelola Materi" subtitle={`${materi.length} materi pembelajaran.`} nama={profile?.nama ?? "Tim"} roleLabel="Staf"
        right={<Link href="/staf/materi/upload" className="inline-flex h-10 items-center gap-2 rounded-lg bg-brand px-4 text-body-sm font-semibold text-white hover:bg-brand-600"><Plus size={15} /> Upload Materi</Link>} />

      <div className="p-5 lg:p-7">
        {materi.length === 0 ? (
          <EmptyState icon={BookOpen} title="Belum ada materi" note="Tabel learning_materials sudah siap. Unggah materi pertama untuk siswa." />
        ) : (
          <div className="overflow-hidden rounded-2xl border bg-white">
            <table className="w-full text-left text-body-sm">
              <thead className="border-b bg-muted/50 text-caption uppercase tracking-wide text-ink-muted">
                <tr><th className="px-5 py-3 font-semibold">Judul</th><th className="px-5 py-3 font-semibold">Tipe</th><th className="hidden px-5 py-3 font-semibold sm:table-cell">Durasi</th><th className="px-5 py-3 font-semibold">Status</th></tr>
              </thead>
              <tbody className="divide-y">
                {materi.map((m) => { const Icon = ICON[m.tipe] ?? BookOpen; return (
                  <tr key={m.id} className="hover:bg-muted/40">
                    <td className="px-5 py-3"><div className="flex items-center gap-3"><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-100 text-brand"><Icon size={15} /></span><span className="font-semibold text-ink">{m.judul}</span>{m.is_premium ? <Pill tone="warning">Premium</Pill> : null}</div></td>
                    <td className="px-5 py-3"><Pill>{m.tipe}</Pill></td>
                    <td className="hidden px-5 py-3 text-ink-body sm:table-cell">{m.durasi_menit ? <span className="inline-flex items-center gap-1"><Clock size={13} /> {m.durasi_menit}m</span> : "—"}</td>
                    <td className="px-5 py-3">{m.aktif ? <Pill tone="success">Aktif</Pill> : <Pill>Draft</Pill>}</td>
                  </tr>
                ); })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
