import { Settings, Flag } from "lucide-react";
import { requireAdmin } from "@/lib/portal/roles";
import { createClient } from "@/lib/supabase/server";
import { ConsoleTopbar } from "@/components/console/topbar";
import { ConsoleCard, EmptyState } from "@/components/console/ui";
import { FlagToggle } from "@/components/admin/flag-toggle";

export const metadata = { title: "Pengaturan — Admin Albirru" };

type Flag = { key: string; enabled: boolean; deskripsi: string | null };

export default async function AdminPengaturanPage() {
  const { profile } = await requireAdmin();
  let flags: Flag[] = [];
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("feature_flags").select("key, enabled, deskripsi").order("key");
    flags = (data as Flag[]) ?? [];
  } catch { /* kosong */ }

  const aktif = flags.filter((f) => f.enabled).length;

  return (
    <>
      <ConsoleTopbar eyebrow="Sistem" title="Pengaturan & Feature Flags" subtitle={`${aktif}/${flags.length} flag aktif.`} nama={profile?.nama ?? "Admin"} roleLabel="Admin" />

      <div className="p-5 lg:p-7">
        <ConsoleCard title="Feature Flags">
          {flags.length === 0 ? (
            <EmptyState icon={Settings} title="Belum ada feature flag" />
          ) : (
            <div className="divide-y">
              {flags.map((f) => (
                <div key={f.key} className="flex items-center gap-4 py-3.5">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-100 text-brand"><Flag size={18} /></span>
                  <div className="min-w-0 flex-1">
                    <div className="font-mono text-body-sm font-semibold text-ink">{f.key}</div>
                    {f.deskripsi ? <div className="text-caption text-ink-muted">{f.deskripsi}</div> : null}
                  </div>
                  <FlagToggle flagKey={f.key} enabled={f.enabled} />
                </div>
              ))}
            </div>
          )}
          <p className="mt-4 text-caption text-ink-muted">Perubahan flag tercatat di <code className="rounded bg-muted px-1">audit_logs</code> dan berlaku tanpa deploy.</p>
        </ConsoleCard>
      </div>
    </>
  );
}
