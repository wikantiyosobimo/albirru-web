import { LayoutTemplate, Plus, Wand2 } from "lucide-react";
import { requireAdmin } from "@/lib/portal/roles";
import { createClient } from "@/lib/supabase/server";
import { ConsoleTopbar } from "@/components/console/topbar";
import { ConsoleCard, EmptyState, Pill } from "@/components/console/ui";

export const metadata = { title: "Blueprint — Admin Albirru" };

type BP = { id: string; nama: string; tipe: string | null; durasi_menit: number | null; komposisi: { mapel: string; jumlah: number }[] };

export default async function AdminBlueprintPage() {
  const { profile } = await requireAdmin();
  let list: BP[] = [];
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("test_blueprints").select("id, nama, tipe, durasi_menit, komposisi").order("created_at", { ascending: false });
    list = (data as BP[]) ?? [];
  } catch { /* kosong */ }

  return (
    <>
      <ConsoleTopbar eyebrow="Konten" title="Test Blueprint" subtitle="Template auto-generate paket try out." nama={profile?.nama ?? "Admin"} roleLabel="Admin"
        right={<button className="inline-flex h-10 items-center gap-2 rounded-lg bg-brand px-4 text-body-sm font-semibold text-white hover:bg-brand-600"><Plus size={15} /> Blueprint Baru</button>} />

      <div className="p-5 lg:p-7">
        {list.length === 0 ? (
          <EmptyState icon={LayoutTemplate} title="Belum ada blueprint" note="Blueprint mendefinisikan jumlah soal & distribusi kesulitan per mapel → sistem merakit paket otomatis dari bank soal." />
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {list.map((bp) => {
              const total = (bp.komposisi ?? []).reduce((a, k) => a + (k.jumlah ?? 0), 0);
              return (
                <ConsoleCard key={bp.id} title={bp.nama} action={<button className="inline-flex items-center gap-1.5 rounded-lg bg-brand-100 px-3 py-1.5 text-body-sm font-semibold text-brand hover:bg-brand-100/70"><Wand2 size={14} /> Generate</button>}>
                  <div className="mb-3 flex flex-wrap gap-2">{bp.tipe ? <Pill tone="brand">{bp.tipe}</Pill> : null}{bp.durasi_menit ? <Pill>{bp.durasi_menit} menit</Pill> : null}<Pill tone="success">{total} soal</Pill></div>
                  <div className="space-y-2">
                    {(bp.komposisi ?? []).map((k, i) => (
                      <div key={i} className="flex items-center justify-between text-body-sm"><span className="text-ink-body">{k.mapel}</span><span className="font-semibold text-ink">{k.jumlah} soal</span></div>
                    ))}
                  </div>
                </ConsoleCard>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
