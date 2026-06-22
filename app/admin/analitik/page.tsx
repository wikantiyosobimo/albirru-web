import { TrendingUp, Users, UserPlus, PieChart, Crown, Database, Zap, AlertTriangle, CheckCircle2, FolderTree } from "lucide-react";
import { requireAdmin } from "@/lib/portal/roles";
import { getAdminAnalytics, getAdminOverview, getAdminContentHealth, getAdminConversionFunnel } from "@/lib/console/data";
import { ConsoleTopbar } from "@/components/console/topbar";
import { StatCard, ConsoleCard, EmptyState } from "@/components/console/ui";

export const metadata = { title: "Analitik — Admin Albirru" };

const rupiah = (n: number) => "Rp" + n.toLocaleString("id-ID");
const pct = (num: number, den: number) => (den > 0 ? Math.round((num / den) * 100) : 0);
const LEVEL_LABEL: Record<number, string> = { 0: "Tanpa level", 1: "Sangat mudah", 2: "Mudah", 3: "Sedang", 4: "Sulit", 5: "Sangat sulit" };

export default async function AdminAnalitikPage() {
  const { profile } = await requireAdmin();
  const [ov, an, ch, fn] = await Promise.all([getAdminOverview(), getAdminAnalytics(), getAdminContentHealth(), getAdminConversionFunnel()]);

  const funnel = [
    { label: "Daftar", value: fn.siswa, icon: Users, tone: "var(--blue-400)", desc: "Total siswa" },
    { label: "Aktivasi", value: fn.aktivasi, icon: Zap, tone: "var(--blue-500)", desc: "≥1 try out" },
    { label: "Pro", value: fn.pro, icon: Crown, tone: "var(--blue-700)", desc: "Berlangganan" },
  ];
  const maxMapel = Math.max(1, ...ch.per_mapel.map((m) => m.total));
  const maxLevel = Math.max(1, ...ch.per_level.map((l) => l.jml));
  const flags = [
    { label: "Soal nonaktif", value: ch.nonaktif, icon: AlertTriangle, warn: ch.nonaktif > 0 },
    { label: "Tanpa pembahasan", value: ch.tanpa_pembahasan, icon: AlertTriangle, warn: ch.tanpa_pembahasan > 0 },
    { label: "Tanpa topik", value: ch.tanpa_topik, icon: FolderTree, warn: ch.tanpa_topik > 0 },
  ];

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

        {/* Funnel konversi: Daftar → Aktivasi → Pro */}
        <ConsoleCard title="Funnel Konversi" action={<span className="text-body-sm text-ink-muted">Pendapatan aktif: <span className="font-semibold text-ink">{rupiah(fn.pendapatan)}</span></span>}>
          <div className="grid gap-4 sm:grid-cols-3">
            {funnel.map((f, i) => {
              const Icon = f.icon;
              const conv = i === 0 ? 100 : pct(f.value, funnel[0].value);
              const dropFromPrev = i === 0 ? null : pct(f.value, funnel[i - 1].value);
              return (
                <div key={f.label} className="rounded-xl border p-4">
                  <div className="flex items-center justify-between">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg" style={{ backgroundColor: "color-mix(in srgb, " + f.tone + " 16%, white)", color: f.tone }}><Icon size={18} /></span>
                    {dropFromPrev !== null ? <span className="text-caption text-ink-muted">{dropFromPrev}% dari tahap sebelumnya</span> : <span className="text-caption text-ink-muted">{f.desc}</span>}
                  </div>
                  <div className="mt-3 text-stat leading-none text-ink">{f.value}</div>
                  <div className="mt-1 flex items-center justify-between text-caption text-ink-muted"><span>{f.label}</span><span>{conv}% dari daftar</span></div>
                  <div className="mt-2 h-1.5 rounded-full bg-hair"><div className="h-full rounded-full" style={{ width: `${conv}%`, backgroundColor: f.tone }} /></div>
                </div>
              );
            })}
          </div>
          {fn.pro === 0 ? (
            <p className="mt-4 rounded-xl bg-muted p-3 text-caption text-ink-muted">Belum ada konversi Pro. Funnel akan terisi saat siswa mulai berlangganan — fokuskan dorongan upgrade pada {fn.aktivasi} siswa yang sudah aktif.</p>
          ) : null}
        </ConsoleCard>

        {/* Kesehatan pipeline soal */}
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
          <ConsoleCard title="Bank Soal per Mata Pelajaran" action={<span className="text-body-sm text-ink-muted">{ch.aktif} aktif / {ch.total} total</span>}>
            {ch.per_mapel.length === 0 ? (
              <EmptyState icon={Database} title="Belum ada soal" />
            ) : (
              <div className="space-y-3">
                {ch.per_mapel.map((m) => (
                  <div key={m.mapel}>
                    <div className="flex justify-between text-body-sm"><span className="font-semibold text-ink">{m.mapel}</span><span className="text-ink-muted">{m.aktif} aktif{m.total !== m.aktif ? ` / ${m.total}` : ""}</span></div>
                    <div className="mt-1.5 h-2.5 rounded-full bg-hair"><div className="h-full rounded-full bg-brand" style={{ width: `${(m.total / maxMapel) * 100}%` }} /></div>
                  </div>
                ))}
              </div>
            )}
          </ConsoleCard>

          <div className="space-y-5">
            <ConsoleCard title="Sebaran Tingkat Kesulitan">
              {ch.per_level.length === 0 ? (
                <p className="py-4 text-center text-body-sm text-ink-muted">—</p>
              ) : (
                <div className="space-y-2.5">
                  {ch.per_level.map((l) => (
                    <div key={l.level} className="flex items-center gap-3">
                      <span className="w-24 shrink-0 text-caption text-ink-muted">{LEVEL_LABEL[l.level] ?? `Level ${l.level}`}</span>
                      <div className="h-2 flex-1 rounded-full bg-hair"><div className="h-full rounded-full bg-brand" style={{ width: `${(l.jml / maxLevel) * 100}%` }} /></div>
                      <span className="w-6 shrink-0 text-right text-caption font-semibold text-ink">{l.jml}</span>
                    </div>
                  ))}
                </div>
              )}
            </ConsoleCard>

            <ConsoleCard title="Kualitas Konten">
              <div className="space-y-2">
                {flags.map((f) => {
                  const Icon = f.warn ? f.icon : CheckCircle2;
                  return (
                    <div key={f.label} className="flex items-center gap-2.5 rounded-lg border p-2.5">
                      <Icon size={16} className={f.warn ? "text-[#E5484D]" : "text-success"} />
                      <span className="flex-1 text-body-sm text-ink-body">{f.label}</span>
                      <span className={`text-body-sm font-bold ${f.warn ? "text-[#E5484D]" : "text-ink"}`}>{f.value}</span>
                    </div>
                  );
                })}
              </div>
            </ConsoleCard>
          </div>
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
