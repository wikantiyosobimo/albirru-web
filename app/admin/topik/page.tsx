import { FolderTree, Plus } from "lucide-react";
import { requireAdmin } from "@/lib/portal/roles";
import { createClient } from "@/lib/supabase/server";
import { ConsoleTopbar } from "@/components/console/topbar";
import { ConsoleCard, EmptyState, Pill } from "@/components/console/ui";

export const metadata = { title: "Topik — Admin Albirru" };

type Topic = { id: string; slug: string; nama: string; mapel: string; level: number; parent_id: string | null };

export default async function AdminTopikPage() {
  const { profile } = await requireAdmin();
  let topics: Topic[] = [];
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("topics").select("id, slug, nama, mapel, level, parent_id").order("mapel").order("urutan").limit(300);
    topics = (data as Topic[]) ?? [];
  } catch { /* kosong */ }

  // Kelompokkan per mapel
  const byMapel = topics.reduce<Record<string, Topic[]>>((acc, t) => { (acc[t.mapel] ??= []).push(t); return acc; }, {});

  return (
    <>
      <ConsoleTopbar eyebrow="Konten" title="Taksonomi Topik" subtitle={`${topics.length} topik di ${Object.keys(byMapel).length} mapel.`} nama={profile?.nama ?? "Admin"} roleLabel="Admin"
        right={<button className="inline-flex h-10 items-center gap-2 rounded-lg bg-brand px-4 text-body-sm font-semibold text-white hover:bg-brand-600"><Plus size={15} /> Tambah Topik</button>} />

      <div className="p-5 lg:p-7">
        {topics.length === 0 ? (
          <EmptyState icon={FolderTree} title="Belum ada topik" note="Taksonomi (mapel → bab → subtopik) menjadi dasar weakness mapping & smart revision." />
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {Object.entries(byMapel).map(([mapel, list]) => (
              <ConsoleCard key={mapel} title={mapel}>
                <div className="space-y-1.5">
                  {list.map((t) => (
                    <div key={t.id} className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-muted/50" style={{ paddingLeft: `${(t.level - 1) * 16 + 8}px` }}>
                      <FolderTree size={14} className="shrink-0 text-ink-muted" />
                      <span className="flex-1 text-body-sm text-ink">{t.nama}</span>
                      <Pill>L{t.level}</Pill>
                    </div>
                  ))}
                </div>
              </ConsoleCard>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
