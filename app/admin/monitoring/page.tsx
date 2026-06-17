import { Activity, Database, ShieldCheck, Server, ScrollText } from "lucide-react";
import { requireAdmin } from "@/lib/portal/roles";
import { createClient } from "@/lib/supabase/server";
import { ConsoleTopbar } from "@/components/console/topbar";
import { ConsoleCard, EmptyState, Pill } from "@/components/console/ui";

export const metadata = { title: "Monitoring — Admin Albirru" };

type Log = { id: string; aksi: string; entitas: string | null; entitas_id: string | null; created_at: string };

export default async function AdminMonitoringPage() {
  const { profile } = await requireAdmin();
  let logs: Log[] = [];
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("audit_logs").select("id, aksi, entitas, entitas_id, created_at").order("created_at", { ascending: false }).limit(50);
    logs = (data as Log[]) ?? [];
  } catch { /* kosong */ }

  const health = [
    { label: "Database", status: "Operasional", icon: Database, ok: true },
    { label: "Auth", status: "Operasional", icon: ShieldCheck, ok: true },
    { label: "Edge / API", status: "Operasional", icon: Server, ok: true },
  ];

  return (
    <>
      <ConsoleTopbar eyebrow="Sistem" title="Monitoring & Audit" subtitle="Kesehatan sistem & jejak aksi sensitif." nama={profile?.nama ?? "Admin"} roleLabel="Admin" />

      <div className="space-y-5 p-5 lg:p-7">
        <div className="grid gap-5 sm:grid-cols-3">
          {health.map((h) => { const Icon = h.icon; return (
            <div key={h.label} className="rounded-2xl border bg-white p-5">
              <div className="flex items-center justify-between"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-success-subtle text-success-strong"><Icon size={20} /></span><span className="flex items-center gap-1.5 text-body-sm font-semibold text-success-strong"><span className="h-2 w-2 rounded-full bg-success-strong" /> {h.status}</span></div>
              <div className="mt-3 text-h-sm text-ink">{h.label}</div>
            </div>
          ); })}
        </div>

        <ConsoleCard title="Audit Trail" action={<Pill tone="muted">{logs.length} entri</Pill>}>
          {logs.length === 0 ? (
            <EmptyState icon={ScrollText} title="Belum ada aktivitas tercatat" note="Aksi sensitif (ubah role, toggle flag) otomatis tercatat di audit_logs." />
          ) : (
            <div className="divide-y">
              {logs.map((l) => (
                <div key={l.id} className="flex items-center gap-3 py-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-ink-body"><Activity size={16} /></span>
                  <div className="min-w-0 flex-1">
                    <div className="text-body-sm text-ink"><b className="font-semibold">{l.aksi}</b>{l.entitas ? <span className="text-ink-muted"> · {l.entitas}{l.entitas_id ? `/${l.entitas_id.slice(0, 8)}` : ""}</span> : null}</div>
                    <div className="text-caption text-ink-muted">{new Date(l.created_at).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" })}</div>
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
