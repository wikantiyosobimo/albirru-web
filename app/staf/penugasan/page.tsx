import { ClipboardCheck, Calendar } from "lucide-react";
import { requireStaff } from "@/lib/portal/roles";
import { createClient } from "@/lib/supabase/server";
import { ConsoleTopbar } from "@/components/console/topbar";
import { ConsoleCard, EmptyState, Pill } from "@/components/console/ui";
import { AssignmentForm } from "@/components/staf/quick-forms";

export const metadata = { title: "Penugasan — Staf Albirru" };

type Assignment = { id: string; judul: string; ref_tipe: string | null; target_kelas: string | null; due_at: string | null; created_at: string };

export default async function StafPenugasanPage() {
  const { profile } = await requireStaff();
  let list: Assignment[] = [];
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("assignments").select("id, judul, ref_tipe, target_kelas, due_at, created_at").order("created_at", { ascending: false }).limit(50);
    list = (data as Assignment[]) ?? [];
  } catch { /* kosong */ }

  return (
    <>
      <ConsoleTopbar eyebrow="Komunikasi" title="Penugasan" subtitle="Beri tugas ke siswa/kelas dengan tenggat." nama={profile?.nama ?? "Tim"} roleLabel="Staf" />
      <div className="grid gap-5 p-5 lg:grid-cols-[380px_minmax(0,1fr)] lg:p-7">
        <ConsoleCard title="Buat Penugasan"><AssignmentForm /></ConsoleCard>
        <ConsoleCard title="Penugasan Aktif">
          {list.length === 0 ? (
            <EmptyState icon={ClipboardCheck} title="Belum ada penugasan" note="Tugas yang dibuat akan tampil di sini." />
          ) : (
            <div className="divide-y">
              {list.map((a) => (
                <div key={a.id} className="flex items-center gap-3 py-3.5">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-100 text-brand"><ClipboardCheck size={18} /></span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-body-sm font-semibold text-ink">{a.judul}</div>
                    <div className="mt-0.5 flex flex-wrap items-center gap-2 text-caption text-ink-muted">
                      {a.ref_tipe ? <Pill>{a.ref_tipe}</Pill> : null}
                      {a.target_kelas ? <span>{a.target_kelas}</span> : null}
                      {a.due_at ? <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(a.due_at).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}</span> : null}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ConsoleCard>
      </div>
    </>
  );
}
