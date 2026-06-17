import { ClipboardList, Plus, Clock } from "lucide-react";
import { requireAdmin } from "@/lib/portal/roles";
import { createClient } from "@/lib/supabase/server";
import { ConsoleTopbar } from "@/components/console/topbar";
import { StatCard, ConsoleCard, EmptyState, Pill } from "@/components/console/ui";

export const metadata = { title: "Try Out — Admin Albirru" };

type TO = { id: string; title: string; tipe: string; durasi_menit: number; status: string; harga: number };
const tone = (s: string) => (s === "tersedia" ? "success" : s === "berlangsung" ? "warning" : "muted") as "success" | "warning" | "muted";

export default async function AdminTryOutPage() {
  const { profile } = await requireAdmin();
  let list: TO[] = [];
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("tryouts").select("id, title, tipe, durasi_menit, status, harga").order("created_at", { ascending: false });
    list = (data as TO[]) ?? [];
  } catch { /* kosong */ }

  const tersedia = list.filter((t) => t.status === "tersedia").length;
  const berbayar = list.filter((t) => t.harga > 0).length;

  return (
    <>
      <ConsoleTopbar eyebrow="Konten" title="Semua Try Out" subtitle="Kelola paket lintas sekolah." nama={profile?.nama ?? "Admin"} roleLabel="Admin"
        right={<button className="inline-flex h-10 items-center gap-2 rounded-lg bg-brand px-4 text-body-sm font-semibold text-white hover:bg-brand-600"><Plus size={15} /> Paket Baru</button>} />

      <div className="space-y-5 p-5 lg:p-7">
        <div className="grid gap-5 sm:grid-cols-3">
          <StatCard label="Total Paket" value={list.length} icon={ClipboardList} />
          <StatCard label="Tersedia" value={tersedia} icon={ClipboardList} accent="success" />
          <StatCard label="Berbayar" value={berbayar} icon={ClipboardList} accent="warning" />
        </div>

        <ConsoleCard title="Daftar Paket">
          {list.length === 0 ? (
            <EmptyState icon={ClipboardList} title="Belum ada try out" />
          ) : (
            <div className="overflow-hidden rounded-xl border">
              <table className="w-full text-left text-body-sm">
                <thead className="border-b bg-muted/50 text-caption uppercase tracking-wide text-ink-muted">
                  <tr><th className="px-4 py-2.5 font-semibold">Judul</th><th className="px-4 py-2.5 font-semibold">Tipe</th><th className="hidden px-4 py-2.5 font-semibold sm:table-cell">Durasi</th><th className="px-4 py-2.5 font-semibold">Harga</th><th className="px-4 py-2.5 font-semibold">Status</th></tr>
                </thead>
                <tbody className="divide-y">
                  {list.map((t) => (
                    <tr key={t.id} className="hover:bg-muted/40">
                      <td className="px-4 py-2.5 font-semibold text-ink">{t.title}</td>
                      <td className="px-4 py-2.5"><Pill>{t.tipe}</Pill></td>
                      <td className="hidden px-4 py-2.5 text-ink-body sm:table-cell"><span className="inline-flex items-center gap-1"><Clock size={13} /> {t.durasi_menit}m</span></td>
                      <td className="px-4 py-2.5 text-ink-body">{t.harga > 0 ? "Rp" + t.harga.toLocaleString("id-ID") : "Gratis"}</td>
                      <td className="px-4 py-2.5"><Pill tone={tone(t.status)}>{t.status}</Pill></td>
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
