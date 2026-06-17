import Link from "next/link";
import { ClipboardList, Plus, ChevronRight, Clock, Users } from "lucide-react";
import { requireStaff } from "@/lib/portal/roles";
import { createClient } from "@/lib/supabase/server";
import { ConsoleTopbar } from "@/components/console/topbar";
import { EmptyState, Pill } from "@/components/console/ui";

export const metadata = { title: "Try Out — Staf Albirru" };

type TO = { id: string; title: string; tipe: string; durasi_menit: number; status: string; harga: number };

export default async function StafTryOutPage() {
  const { profile } = await requireStaff();
  let list: TO[] = [];
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("tryouts").select("id, title, tipe, durasi_menit, status, harga").order("created_at", { ascending: false });
    list = (data as TO[]) ?? [];
  } catch { /* kosong */ }

  const tone = (s: string) => (s === "tersedia" ? "success" : s === "berlangsung" ? "warning" : "muted") as "success" | "warning" | "muted";

  return (
    <>
      <ConsoleTopbar eyebrow="Akademik" title="Kelola Try Out" subtitle={`${list.length} paket try out.`} nama={profile?.nama ?? "Tim"} roleLabel="Staf"
        right={<Link href="/staf/try-out/buat" className="inline-flex h-10 items-center gap-2 rounded-lg bg-brand px-4 text-body-sm font-semibold text-white hover:bg-brand-600"><Plus size={15} /> Buat Try Out</Link>} />

      <div className="p-5 lg:p-7">
        {list.length === 0 ? (
          <EmptyState icon={ClipboardList} title="Belum ada try out" note="Buat paket try out dengan memilih soal dari bank." />
        ) : (
          <div className="grid gap-4">
            {list.map((t) => (
              <Link key={t.id} href={`/staf/try-out/${t.id}`} className="flex items-center gap-4 rounded-2xl border bg-white p-5 transition-colors hover:border-brand">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-100 text-brand"><ClipboardList size={22} /></span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2"><span className="text-body-lg font-bold text-ink">{t.title}</span><Pill tone={tone(t.status)}>{t.status}</Pill>{t.harga > 0 ? <Pill tone="warning">Berbayar</Pill> : <Pill tone="success">Gratis</Pill>}</div>
                  <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-caption text-ink-muted">
                    <span className="flex items-center gap-1"><ClipboardList size={13} /> {t.tipe}</span>
                    <span className="flex items-center gap-1"><Clock size={13} /> {t.durasi_menit} menit</span>
                  </div>
                </div>
                <ChevronRight size={18} className="text-ink-muted" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
