import { School, MapPin, Users } from "lucide-react";
import { requireAdmin } from "@/lib/portal/roles";
import { createClient } from "@/lib/supabase/server";
import { ConsoleTopbar } from "@/components/console/topbar";
import { EmptyState, Pill } from "@/components/console/ui";
import { NewSchoolButton } from "@/components/admin/admin-actions";

export const metadata = { title: "Sekolah — Admin Albirru" };

type Sch = { id: string; nama: string; kode: string | null; kota: string | null; provinsi: string | null; plan: string | null };

export default async function AdminSekolahPage() {
  const { profile } = await requireAdmin();
  let list: Sch[] = [];
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("schools").select("id, nama, kode, kota, provinsi, plan").order("created_at", { ascending: false });
    list = (data as Sch[]) ?? [];
  } catch { /* kosong */ }

  return (
    <>
      <ConsoleTopbar eyebrow="Pengguna & Bisnis" title="Sekolah Mitra" subtitle={`${list.length} sekolah terdaftar.`} nama={profile?.nama ?? "Admin"} roleLabel="Admin"
        right={<NewSchoolButton />} />

      <div className="p-5 lg:p-7">
        {list.length === 0 ? (
          <EmptyState icon={School} title="Belum ada sekolah mitra" note="Aktifkan B2B lewat feature flag b2b_schools. Sekolah & anggotanya dikelola via schools / school_members." />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {list.map((s) => (
              <div key={s.id} className="rounded-2xl border bg-white p-5">
                <div className="flex items-start justify-between"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-100 text-brand"><School size={22} /></span>{s.plan ? <Pill tone={s.plan === "free" ? "muted" : "brand"}>{s.plan}</Pill> : null}</div>
                <h3 className="mt-3 text-h-sm text-ink">{s.nama}</h3>
                <div className="mt-1 flex items-center gap-1.5 text-caption text-ink-muted"><MapPin size={13} /> {[s.kota, s.provinsi].filter(Boolean).join(", ") || "—"}</div>
                {s.kode ? <div className="mt-3 flex items-center gap-1.5 border-t pt-3 text-caption text-ink-body"><Users size={13} /> Kode gabung: <code className="rounded bg-muted px-1 font-mono">{s.kode}</code></div> : null}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
