import Link from "next/link";
import { Users, Database, ClipboardList, Wallet, UserCheck, Crown, ArrowRight, Activity } from "lucide-react";
import { requireAdmin } from "@/lib/portal/roles";
import { getAdminOverview } from "@/lib/console/data";
import { ConsoleTopbar } from "@/components/console/topbar";
import { StatCard, ConsoleCard } from "@/components/console/ui";

export const metadata = { title: "Dashboard Admin — Albirru" };

const rupiah = (n: number) => "Rp" + n.toLocaleString("id-ID");

export default async function AdminDashboard() {
  const { profile } = await requireAdmin();
  const ov = await getAdminOverview();

  const shortcuts = [
    { href: "/admin/pengguna", label: "Kelola Pengguna", icon: Users },
    { href: "/admin/bank-soal", label: "Bank Soal", icon: Database },
    { href: "/admin/analitik", label: "Analitik Global", icon: Activity },
    { href: "/admin/pengaturan", label: "Feature Flags", icon: ClipboardList },
  ];

  return (
    <>
      <ConsoleTopbar eyebrow="Admin Panel" title="Dashboard" subtitle="Kesehatan sistem & metrik bisnis." nama={profile?.nama ?? "Admin"} roleLabel="Admin" />

      <div className="space-y-5 p-5 lg:p-7">
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Total Pengguna" value={ov.total_user} sub={`${ov.signup_7hari} baru / 7 hari`} icon={Users} />
          <StatCard label="Pengguna Pro" value={ov.total_pro} icon={Crown} accent="warning" />
          <StatCard label="Try Out Selesai" value={ov.total_attempt} icon={ClipboardList} accent="success" />
          <StatCard label="Pendapatan" value={rupiah(ov.pendapatan)} icon={Wallet} accent="success" />
        </div>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
          <ConsoleCard title="Komposisi Sistem">
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { label: "Siswa", value: ov.total_siswa, icon: Users },
                { label: "Staf", value: ov.total_staf, icon: UserCheck },
                { label: "Bank Soal", value: ov.total_soal, icon: Database },
              ].map((m) => { const Icon = m.icon; return (
                <div key={m.label} className="rounded-xl bg-muted p-4"><Icon size={18} className="text-brand" /><div className="mt-2 text-h-md leading-none text-ink">{m.value}</div><div className="mt-1 text-caption text-ink-muted">{m.label}</div></div>
              ); })}
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border p-4"><div className="text-caption text-ink-muted">Paket Try Out</div><div className="mt-1 text-h-md text-ink">{ov.total_tryout}</div></div>
              <div className="rounded-xl border p-4"><div className="text-caption text-ink-muted">Konversi Pro</div><div className="mt-1 text-h-md text-ink">{ov.total_user ? Math.round((ov.total_pro / ov.total_user) * 100) : 0}%</div></div>
            </div>
          </ConsoleCard>

          <ConsoleCard title="Pintasan">
            <div className="grid gap-3">
              {shortcuts.map((s) => { const Icon = s.icon; return (
                <Link key={s.href} href={s.href} className="flex items-center gap-3 rounded-xl border bg-white p-3.5 transition-colors hover:border-brand hover:bg-brand-100/40">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-100 text-brand"><Icon size={18} /></span>
                  <span className="flex-1 text-body-sm font-semibold text-ink">{s.label}</span>
                  <ArrowRight size={15} className="text-ink-muted" />
                </Link>
              ); })}
            </div>
          </ConsoleCard>
        </div>
      </div>
    </>
  );
}
