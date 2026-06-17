import { Megaphone } from "lucide-react";
import { requireStaff } from "@/lib/portal/roles";
import { createClient } from "@/lib/supabase/server";
import { ConsoleTopbar } from "@/components/console/topbar";
import { ConsoleCard, EmptyState } from "@/components/console/ui";
import { AnnouncementForm } from "@/components/staf/quick-forms";

export const metadata = { title: "Pengumuman — Staf Albirru" };

type Ann = { id: string; judul: string; isi: string; created_at: string };

export default async function StafPengumumanPage() {
  const { profile } = await requireStaff();
  let list: Ann[] = [];
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("announcements").select("id, judul, isi, created_at").order("created_at", { ascending: false }).limit(50);
    list = (data as Ann[]) ?? [];
  } catch { /* kosong */ }

  return (
    <>
      <ConsoleTopbar eyebrow="Komunikasi" title="Pengumuman" subtitle="Kirim pengumuman ke siswa." nama={profile?.nama ?? "Tim"} roleLabel="Staf" />
      <div className="grid gap-5 p-5 lg:grid-cols-[380px_minmax(0,1fr)] lg:p-7">
        <ConsoleCard title="Buat Pengumuman"><AnnouncementForm /></ConsoleCard>
        <ConsoleCard title="Riwayat">
          {list.length === 0 ? (
            <EmptyState icon={Megaphone} title="Belum ada pengumuman" note="Pengumuman yang dikirim tampil di sini." />
          ) : (
            <div className="space-y-3">
              {list.map((a) => (
                <div key={a.id} className="rounded-xl border bg-white p-4">
                  <div className="flex items-start gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-100 text-brand"><Megaphone size={16} /></span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2"><span className="font-semibold text-ink">{a.judul}</span><span className="shrink-0 text-caption text-ink-muted">{new Date(a.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}</span></div>
                      <p className="mt-1 text-body-sm text-ink-body">{a.isi}</p>
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
