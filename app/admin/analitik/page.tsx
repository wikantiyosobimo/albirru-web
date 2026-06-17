import { TrendingUp, Users, UserPlus, PieChart } from "lucide-react";
import { requireAdmin } from "@/lib/portal/roles";
import { getAdminAnalytics, getAdminOverview } from "@/lib/console/data";
import { ConsoleTopbar } from "@/components/console/topbar";
import { StatCard, ConsoleCard, EmptyState } from "@/components/console/ui";

export const metadata = { title: "Analitik — Admin Albirru" };

export default async function AdminAnalitikPage() {
  const { profile } = await requireAdmin();
  const [ov, an] = await Promise.all([getAdminOverview(), getAdminAnalytics()]);

  const signup = an.signup ?? [];
  const maxSignup = Math.max(1, ...signup.map((s) => s.jml));
  const totalSignup = signup.reduce((a, s) => a + s.jml, 0);

  // SVG sparkline
  const W = 640, H = 160, pad = 8;
  const pts = signup.map((s, i) => {
    const x = signup.length > 1 ? pad + (i / (signup.length - 1)) * (W - pad * 2) : W / 2;
    const y = H - pad - (s.jml / maxSignup) * (H - pad * 2);
    return `${x},${y}`;
  }).join(" ");

  const segDist = an.segment ?? [];
  const totalSeg = segDist.reduce((a, s) => a + s.jml, 0) || 1;

  return (
    <>
      <ConsoleTopbar eyebrow="Pengguna & Bisnis" title="Analitik Global" subtitle="Sign-up, MAU, distribusi pengguna." nama={profile?.nama ?? "Admin"} roleLabel="Admin" />

      <div className="space-y-5 p-5 lg:p-7">
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Total Pengguna" value={ov.total_user} icon={Users} />
          <StatCard label="Sign-up 30 hari" value={totalSignup} icon={UserPlus} accent="success" />
          <StatCard label="Sign-up 7 hari" value={ov.signup_7hari} icon={TrendingUp} accent="warning" />
          <StatCard label="Pengguna Pro" value={ov.total_pro} icon={PieChart} />
        </div>

        <ConsoleCard title="Tren Pendaftaran (30 hari)">
          {signup.length === 0 ? (
            <EmptyState icon={TrendingUp} title="Belum ada data pendaftaran" />
          ) : (
            <svg viewBox={`0 0 ${W} ${H}`} className="h-44 w-full" preserveAspectRatio="none" role="img" aria-label="Grafik tren pendaftaran 30 hari">
              <polyline points={pts} fill="none" stroke="var(--blue-500)" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
              {signup.map((s, i) => {
                const x = signup.length > 1 ? pad + (i / (signup.length - 1)) * (W - pad * 2) : W / 2;
                const y = H - pad - (s.jml / maxSignup) * (H - pad * 2);
                return <circle key={i} cx={x} cy={y} r={2.5} fill="var(--blue-600)" />;
              })}
            </svg>
          )}
        </ConsoleCard>

        <div className="grid gap-5 lg:grid-cols-2">
          <ConsoleCard title="Distribusi Jalur Tes">
            <div className="space-y-3">
              {segDist.map((s) => (
                <div key={s.segment}>
                  <div className="flex justify-between text-body-sm"><span className="font-semibold text-ink">{(s.segment ?? "—").toUpperCase()}</span><span className="text-ink-muted">{s.jml} ({Math.round((s.jml / totalSeg) * 100)}%)</span></div>
                  <div className="mt-1.5 h-2.5 rounded-full bg-hair"><div className="h-full rounded-full bg-brand" style={{ width: `${(s.jml / totalSeg) * 100}%` }} /></div>
                </div>
              ))}
            </div>
          </ConsoleCard>

          <ConsoleCard title="Ringkasan Aktivitas">
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Try Out Selesai", value: ov.total_attempt },
                { label: "Bank Soal", value: ov.total_soal },
                { label: "Paket Try Out", value: ov.total_tryout },
                { label: "Total Staf", value: ov.total_staf },
              ].map((m) => (
                <div key={m.label} className="rounded-xl bg-muted p-4"><div className="text-h-md leading-none text-ink">{m.value}</div><div className="mt-1 text-caption text-ink-muted">{m.label}</div></div>
              ))}
            </div>
          </ConsoleCard>
        </div>
      </div>
    </>
  );
}
