import { CreditCard, Crown, Wallet, Receipt } from "lucide-react";
import { requireAdmin } from "@/lib/portal/roles";
import { getAdminAnalytics, getAdminOverview } from "@/lib/console/data";
import { createClient } from "@/lib/supabase/server";
import { ConsoleTopbar } from "@/components/console/topbar";
import { StatCard, ConsoleCard, EmptyState, Pill } from "@/components/console/ui";

export const metadata = { title: "Langganan — Admin Albirru" };

const rupiah = (n: number) => "Rp" + n.toLocaleString("id-ID");
type Pay = { id: string; order_id: string; jumlah: number; status: string | null; created_at: string };
const planLabel: Record<string, string> = { free: "Free", pro: "Pro", siswa_albirru: "Siswa Albirru" };

export default async function AdminLanggananPage() {
  const { profile } = await requireAdmin();
  const [ov, an] = await Promise.all([getAdminOverview(), getAdminAnalytics()]);
  let payments: Pay[] = [];
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("payment_logs").select("id, order_id, jumlah, status, created_at").order("created_at", { ascending: false }).limit(20);
    payments = (data as Pay[]) ?? [];
  } catch { /* kosong */ }

  const planDist = an.plan ?? [];
  const totalUser = planDist.reduce((a, p) => a + p.jml, 0) || 1;

  return (
    <>
      <ConsoleTopbar eyebrow="Pengguna & Bisnis" title="Langganan B2C" subtitle="Free / Pro / Siswa Albirru." nama={profile?.nama ?? "Admin"} roleLabel="Admin" />

      <div className="space-y-5 p-5 lg:p-7">
        <div className="grid gap-5 sm:grid-cols-3">
          <StatCard label="Pengguna Pro" value={ov.total_pro} icon={Crown} accent="warning" />
          <StatCard label="Pendapatan" value={rupiah(ov.pendapatan)} icon={Wallet} accent="success" />
          <StatCard label="Konversi" value={`${ov.total_user ? Math.round((ov.total_pro / ov.total_user) * 100) : 0}%`} icon={CreditCard} />
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <ConsoleCard title="Distribusi Paket">
            <div className="space-y-3">
              {planDist.map((p) => (
                <div key={p.plan}>
                  <div className="flex justify-between text-body-sm"><span className="font-semibold text-ink">{planLabel[p.plan] ?? p.plan}</span><span className="text-ink-muted">{p.jml} ({Math.round((p.jml / totalUser) * 100)}%)</span></div>
                  <div className="mt-1.5 h-2.5 rounded-full bg-hair"><div className="h-full rounded-full bg-brand" style={{ width: `${(p.jml / totalUser) * 100}%` }} /></div>
                </div>
              ))}
            </div>
          </ConsoleCard>

          <ConsoleCard title="Transaksi Terbaru">
            {payments.length === 0 ? (
              <EmptyState icon={Receipt} title="Belum ada transaksi" note="Aktif setelah Midtrans live (quick-win)." />
            ) : (
              <div className="divide-y">
                {payments.map((p) => (
                  <div key={p.id} className="flex items-center gap-3 py-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-ink-body"><Receipt size={16} /></span>
                    <div className="min-w-0 flex-1"><div className="truncate font-mono text-caption text-ink-body">{p.order_id}</div><div className="text-caption text-ink-muted">{new Date(p.created_at).toLocaleDateString("id-ID")}</div></div>
                    <span className="text-body-sm font-bold text-ink">{rupiah(p.jumlah)}</span>
                    <Pill tone={p.status === "settlement" ? "success" : "muted"}>{p.status ?? "—"}</Pill>
                  </div>
                ))}
              </div>
            )}
          </ConsoleCard>
        </div>
      </div>
    </>
  );
}
