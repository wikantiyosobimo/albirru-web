import {
  Info, CheckCircle2, TrendingUp, AlertCircle, Search, SlidersHorizontal, ChevronDown, ChevronUp,
  BookOpen, Brain, Calculator, Globe, FlaskConical, ArrowRight, ArrowUpRight, Map, Target, Sparkles,
} from "lucide-react";
import Link from "next/link";
import { getPortalProfile } from "@/lib/portal/session";
import { getUserIntelligence } from "@/lib/portal/intelligence";
import { Dropdown } from "@/components/portal/dropdown";
import { PortalTopbar } from "@/components/portal/topbar";
import { Ring } from "@/components/portal/ring";
import { Donut } from "@/components/portal/intelligence/donut-chart";
import { cn } from "@/lib/utils";

export const metadata = { title: "Topic Mastery — Albirru" };

const TOPICS = [
  {
    label: "TPS", value: 82, expanded: true, sub: [
      {
        label: "Penalaran Umum", expanded: true, children: [
          { label: "Inferensi", value: 82, active: true },
          { label: "Logika", value: 65 },
          { label: "Analogi", value: 90 },
          { label: "Silogisme", value: 78 },
        ],
      },
      { label: "Penalaran Kuantitatif", value: 71 },
      { label: "Pengetahuan dan Pemahaman Umum", value: 74 },
    ],
  },
  { label: "Literasi Indonesia", value: 76, icon: BookOpen },
  { label: "Literasi Inggris", value: 72, icon: Globe },
  { label: "Penalaran Matematika", value: 68, icon: Calculator },
  { label: "Sains", value: 64, icon: FlaskConical },
];

const SUBTOPICS = [
  { label: "Bacaan Panjang", value: 82 },
  { label: "Kesimpulan", value: 80 },
  { label: "Makna Tersirat", value: 85 },
  { label: "Fakta vs Opini", value: 78 },
  { label: "Implikasi", value: 85 },
];

const TREND = [
  { label: "Mar '24", value: 60 },
  { label: "Apr '24", value: 68 },
  { label: "Mei '24 (1)", value: 75 },
  { label: "Mei '24 (2)", value: 82 },
];

const JOURNEY = [
  { topik: "Inferensi", vals: [48, 58, 72, 82] },
  { topik: "Logika", vals: [40, 50, 58, 65] },
  { topik: "Ide Pokok", vals: [55, 60, 68, 72] },
  { topik: "Integral Dasar", vals: [35, 42, 50, 55] },
  { topik: "Bacaan Panjang", vals: [45, 52, 58, 62] },
];

const RECOMMENDED = [
  { icon: BookOpen, color: "#2F5BFF", bg: "#EAF0FF", topik: "Inferensi", next: "Analisis Argumentasi" },
  { icon: Brain, color: "#16B47A", bg: "#E9F9F1", topik: "Logika", next: "Logika Formal Lanjutan" },
  { icon: Calculator, color: "#6D49C9", bg: "#F2EBFF", topik: "Integral Dasar", next: "Aplikasi Integral" },
];

const ACTIONS = [
  { icon: Map, color: "#2F5BFF", bg: "#EAF0FF", title: "Lihat Weakness Mapping", desc: "Lihat area yang masih menghambat pencapaian targetmu.", href: "/app/intelligence/weakness-mapping" },
  { icon: Target, color: "#16B47A", bg: "#E9F9F1", title: "Mulai Latihan Topik", desc: "Latihan fokus untuk topik yang ingin kamu tingkatkan.", href: "/app/learning" },
  { icon: Sparkles, color: "#6D49C9", bg: "#F2EBFF", title: "Smart Revision", desc: "Dapatkan rekomendasi latihan berdasarkan mastery dan kelemahanmu.", href: "/app/intelligence/smart-revision" },
];

function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("rounded-2xl border bg-white p-5", className)}>{children}</div>;
}
function Head({ title, action }: { title: string; action?: React.ReactNode }) {
  return (
    <div className="mb-3 flex items-center justify-between gap-2">
      <div className="flex items-center gap-1.5">
        <h2 className="text-h-sm text-ink">{title}</h2>
        <Info size={14} className="text-ink-muted" />
      </div>
      {action}
    </div>
  );
}

function level(v: number) {
  if (v >= 75) return { color: "#16B47A", bg: "#E9F9F1" };
  if (v >= 50) return { color: "#E8910B", bg: "#FFF1DC" };
  return { color: "#E5484D", bg: "#FDECEC" };
}

function MasteryBadge({ value }: { value: number }) {
  const l = level(value);
  return <span className="rounded-md px-2 py-0.5 text-[11px] font-bold" style={{ backgroundColor: l.bg, color: l.color }}>{value}%</span>;
}

function Sparkline({ values, color = "#16B47A" }: { values: number[]; color?: string }) {
  const w = 80, h = 28;
  const min = Math.min(...values), max = Math.max(...values);
  const xAt = (i: number) => (i / (values.length - 1)) * w;
  const yAt = (v: number) => h - 4 - ((v - min) / (max - min || 1)) * (h - 8);
  const points = values.map((v, i) => `${xAt(i)},${yAt(v)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-20">
      <polyline points={points} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={xAt(values.length - 1)} cy={yAt(values[values.length - 1])} r="2.5" fill={color} />
    </svg>
  );
}

export default async function Page() {
  const { profile } = await getPortalProfile();
  const nama = profile?.nama ?? "Farhan";

  const tw = 280, th = 110;
  const xAt = (i: number) => 16 + i * ((tw - 32) / (TREND.length - 1));
  const yAt = (v: number) => th - 22 - (v / 100) * (th - 40);

  // Penguasaan nyata per subtes (proxy topik).
  const intel = await getUserIntelligence();
  const subs = intel.subtes;
  const nTotal = subs.length || 1;
  const nMastered = subs.filter((s) => (s.akurasi ?? 0) >= 75).length;
  const nDeveloping = subs.filter((s) => (s.akurasi ?? 0) >= 50 && (s.akurasi ?? 0) < 75).length;
  const nAttention = subs.filter((s) => (s.akurasi ?? 0) < 50).length;
  const overall = subs.length ? Math.round(subs.reduce((a, s) => a + (s.akurasi ?? 0), 0) / subs.length) : 78;
  const pct = (n: number) => intel.hasData ? `${Math.round((n / nTotal) * 100)}% dari subtes` : "";

  return (
    <>
      <PortalTopbar
        eyebrow="Academic Intelligence  ›  Topic Mastery"
        title="Topic Mastery"
        subtitle="Pantau penguasaanmu pada setiap topik dan subtopik."
        nama={nama}
      />

      <div className="space-y-5 p-5 lg:p-7">
        {/* ROW 1 */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <Head title="Mastered Topics" />
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E9F9F1] text-[#16B47A]"><CheckCircle2 size={20} /></span>
            <div className="mt-2 text-[2rem] font-extrabold leading-none text-ink">{intel.hasData ? nMastered : 82}</div>
            <div className="text-caption text-ink-muted">Subtes dikuasai</div>
            <div className="mt-1 text-caption font-semibold text-[#16B47A]">{intel.hasData ? pct(nMastered) : "64% dari semua topik"}</div>
          </Card>
          <Card>
            <Head title="Developing Topics" />
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FFF1DC] text-[#E8910B]"><TrendingUp size={20} /></span>
            <div className="mt-2 text-[2rem] font-extrabold leading-none text-ink">{intel.hasData ? nDeveloping : 24}</div>
            <div className="text-caption text-ink-muted">Subtes berkembang</div>
            <div className="mt-1 text-caption font-semibold text-[#E8910B]">{intel.hasData ? pct(nDeveloping) : "19% dari semua topik"}</div>
          </Card>
          <Card>
            <Head title="Need Attention" />
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FDECEC] text-[#E5484D]"><AlertCircle size={20} /></span>
            <div className="mt-2 text-[2rem] font-extrabold leading-none text-ink">{intel.hasData ? nAttention : 11}</div>
            <div className="text-caption text-ink-muted">Perlu perhatian</div>
            <div className="mt-1 text-caption font-semibold text-[#E5484D]">{intel.hasData ? pct(nAttention) : "9% dari semua topik"}</div>
          </Card>
          <Card>
            <Head title="Overall Mastery" />
            <div className="flex items-center gap-4">
              <Ring value={overall} size={84} stroke={9} color="#2F5BFF">
                <span className="text-[1.4rem] font-extrabold leading-none text-ink">{overall}%</span>
              </Ring>
              <div>
                <div className="text-body-sm font-bold text-ink">Penguasaan Keseluruhan</div>
                <div className="mt-1 text-caption font-semibold text-[#16B47A]">+6% dari periode lalu</div>
              </div>
            </div>
          </Card>
        </div>

        {/* ROW 2 — Mastery Explorer + Topic Detail */}
        <div className="grid gap-5 lg:grid-cols-[1fr_1.4fr]">
          <Card>
            <div className="mb-3 flex items-center gap-2">
              <h2 className="text-h-sm text-ink">Mastery Explorer</h2>
              <div className="relative ml-auto flex-1">
                <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
                <input aria-label="Cari topik" className="h-9 w-full rounded-lg border bg-muted pl-8 pr-3 text-caption text-ink placeholder:text-ink-muted" placeholder="Cari topik..." />
              </div>
              <Dropdown size="sm" align="right" icon={SlidersHorizontal} options={["Semua Status", "Dikuasai (≥75%)", "Berkembang (50–74%)", "Perlu Perhatian (<50%)"]} />
            </div>

            <div className="space-y-1">
              {TOPICS.map((t) => (
                <div key={t.label}>
                  <div className="flex items-center gap-2 rounded-lg px-2 py-2">
                    {t.icon ? <t.icon size={15} className="text-ink-muted" /> : <span className="inline-block w-[15px]" />}
                    <span className="flex-1 text-body-sm font-bold text-ink">{t.label}</span>
                    <MasteryBadge value={t.value} />
                    {t.sub ? (t.expanded ? <ChevronUp size={15} className="text-ink-muted" /> : <ChevronDown size={15} className="text-ink-muted" />) : <ChevronDown size={15} className="text-ink-muted" />}
                  </div>
                  {t.sub?.map((s) => (
                    <div key={s.label} className="ml-5">
                      <div className="flex items-center gap-2 px-2 py-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-ink-muted" />
                        <span className="flex-1 text-caption font-semibold text-ink">{s.label}</span>
                        {s.value !== undefined ? <MasteryBadge value={s.value} /> : null}
                        {s.children ? (s.expanded ? <ChevronUp size={14} className="text-ink-muted" /> : <ChevronDown size={14} className="text-ink-muted" />) : null}
                      </div>
                      {s.children?.map((c) => (
                        <div key={c.label} className={cn("ml-5 flex items-center justify-between rounded-md px-2.5 py-1.5", c.active && "bg-brand-100")}>
                          <span className={cn("text-caption", c.active ? "font-bold text-brand" : "text-ink-body")}>{c.label}</span>
                          {c.active ? <span className="text-caption font-bold text-brand">{c.value}%</span> : (
                            <div className="flex items-center gap-2">
                              <div className="h-1.5 w-16 rounded-full bg-hair"><div className="h-full rounded-full" style={{ width: `${c.value}%`, backgroundColor: level(c.value).color }} /></div>
                              <span className="text-caption font-semibold" style={{ color: level(c.value).color }}>{c.value}%</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <Head title="Topic Detail" />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EAF0FF] text-brand"><BookOpen size={20} /></span>
                <div>
                  <div className="text-body-lg font-extrabold text-ink">Inferensi</div>
                  <div className="text-caption text-ink-muted">Penalaran Umum (TPS)</div>
                </div>
              </div>
              <span className="rounded-full bg-[#DCF5EA] px-3 py-1 text-[11px] font-bold text-[#16864F]">Mastered</span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="rounded-xl border p-3">
                <div className="text-caption text-ink-muted">Akurasi</div>
                <div className="text-h-sm font-extrabold text-ink">82%</div>
                <div className="text-[11px] font-semibold text-[#16B47A]">↑ 10% dari periode lalu</div>
              </div>
              <div className="rounded-xl border p-3">
                <div className="text-caption text-ink-muted">Percobaan Soal</div>
                <div className="text-h-sm font-extrabold text-ink">120 <span className="text-caption font-normal text-ink-muted">soal</span></div>
                <div className="text-[11px] text-ink-muted">Cukup banyak</div>
              </div>
              <div className="rounded-xl border p-3">
                <div className="text-caption text-ink-muted">Confidence Level</div>
                <div className="text-h-sm font-extrabold text-ink">High</div>
                <div className="text-[11px] text-ink-muted">Tinggi (Reliabel)</div>
              </div>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border p-4">
                <div className="text-caption font-semibold text-ink">Tren Penguasaan</div>
                <svg viewBox={`0 0 ${tw} ${th}`} className="mt-1 w-full">
                  {[0, 25, 50, 75, 100].map((g) => (
                    <line key={g} x1="16" x2={tw - 16} y1={yAt(g)} y2={yAt(g)} stroke="#E8EDF4" strokeWidth="1" />
                  ))}
                  <polyline points={TREND.map((t, i) => `${xAt(i)},${yAt(t.value)}`).join(" ")} fill="none" stroke="#2F5BFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  {TREND.map((t, i) => (
                    <g key={t.label}>
                      <circle cx={xAt(i)} cy={yAt(t.value)} r="3.5" fill="#2F5BFF" />
                      <text x={xAt(i)} y={yAt(t.value) - 8} textAnchor="middle" className="fill-ink text-[10px] font-semibold">{t.value}%</text>
                      <text x={xAt(i)} y={th - 6} textAnchor="middle" className="fill-current text-[9px] text-ink-muted">{t.label}</text>
                    </g>
                  ))}
                </svg>
                <p className="mt-1 text-caption text-ink-muted">Konsisten meningkat dalam 4 periode terakhir.</p>
              </div>

              <div className="rounded-xl border p-4">
                <div className="text-caption font-semibold text-ink">Distribusi Akurasi</div>
                <div className="mt-2 flex items-center gap-4">
                  <Donut segments={[{ value: 98, color: "#16B47A" }, { value: 16, color: "#E5484D" }, { value: 6, color: "#CBD5E1" }]} size={96} stroke={14}>
                    <span className="text-body-lg font-extrabold text-ink">120</span>
                    <span className="text-[10px] text-ink-muted">Soal</span>
                  </Donut>
                  <div className="space-y-1.5 text-caption">
                    <div className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-[3px] bg-[#16B47A]" /> Benar <b className="ml-auto text-ink">98 (82%)</b></div>
                    <div className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-[3px] bg-[#E5484D]" /> Salah <b className="text-ink">16 (13%)</b></div>
                    <div className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-[3px] bg-[#CBD5E1]" /> Tidak <span className="text-ink-muted">Dijawab</span> <b className="text-ink">6 (5%)</b></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 rounded-xl border p-4">
              <div className="text-caption font-semibold text-ink">Cakupan Subtopik</div>
              <div className="mt-2 space-y-2">
                {SUBTOPICS.map((s) => (
                  <div key={s.label} className="flex items-center gap-3">
                    <span className="w-32 shrink-0 text-caption text-ink-body">{s.label}</span>
                    <div className="h-2 flex-1 rounded-full bg-hair"><div className="h-full rounded-full bg-[#16B47A]" style={{ width: `${s.value}%` }} /></div>
                    <span className="w-10 text-right text-caption font-semibold text-ink">{s.value}%</span>
                  </div>
                ))}
              </div>
              <Link href="/app/intelligence/topic-mastery" className="mt-3 inline-flex items-center gap-1.5 text-caption font-semibold text-brand">
                Lihat semua subtopik <ArrowRight size={13} />
              </Link>
            </div>
          </Card>
        </div>

        {/* ROW 3 — Distribution / Journey / Recommended */}
        <div className="grid gap-5 lg:grid-cols-[0.9fr_1.4fr_1fr]">
          <Card>
            <Head title="Mastery Distribution" action={<span className="text-caption text-ink-muted">(Semua Topik)</span>} />
            <div className="flex flex-col items-center">
              <Donut segments={[{ value: 82, color: "#16B47A" }, { value: 24, color: "#E8910B" }, { value: 11, color: "#E5484D" }, { value: 0.001, color: "#CBD5E1" }]} size={150} stroke={20}>
                <span className="text-[1.75rem] font-extrabold leading-none text-ink">117</span>
                <span className="text-[10px] text-ink-muted">Total Topik</span>
              </Donut>
              <div className="mt-4 w-full space-y-1.5 text-caption">
                <div className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-[3px] bg-[#16B47A]" /> Mastered (≥ 75%) <b className="ml-auto text-ink">82 (64%)</b></div>
                <div className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-[3px] bg-[#E8910B]" /> Developing (50–74%) <b className="ml-auto text-ink">24 (19%)</b></div>
                <div className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-[3px] bg-[#E5484D]" /> Need Attention (&lt; 50%) <b className="ml-auto text-ink">11 (9%)</b></div>
                <div className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-[3px] bg-[#CBD5E1]" /> Belum Dicoba <b className="ml-auto text-ink">0 (0%)</b></div>
              </div>
            </div>
          </Card>

          <Card>
            <Head title="Mastery Journey" action={<span className="text-caption text-ink-muted">(Beberapa Topik Utama)</span>} />
            <div className="overflow-x-auto">
              <table className="w-full min-w-[420px] text-left">
                <thead>
                  <tr className="border-b">
                    <th className="py-2 pr-3 text-caption font-semibold text-ink-muted">Topik</th>
                    <th className="py-2 px-2 text-caption font-semibold text-ink-muted">Mar &apos;24</th>
                    <th className="py-2 px-2 text-caption font-semibold text-ink-muted">Apr &apos;24</th>
                    <th className="py-2 px-2 text-caption font-semibold text-ink-muted">Mei &apos;24 (1)</th>
                    <th className="py-2 px-2 text-caption font-semibold text-ink-muted">Mei &apos;24 (2)</th>
                    <th className="py-2 pl-2 text-caption font-semibold text-ink-muted">Tren</th>
                  </tr>
                </thead>
                <tbody>
                  {JOURNEY.map((j) => (
                    <tr key={j.topik} className="border-b last:border-0">
                      <td className="py-2.5 pr-3 text-body-sm font-semibold text-ink">{j.topik}</td>
                      {j.vals.map((v, i) => <td key={i} className="py-2.5 px-2 text-body-sm text-ink-body">{v}%</td>)}
                      <td className="py-2.5 pl-2"><Sparkline values={j.vals} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <Card>
            <Head title="Recommended Next Topics" action={<span className="text-caption text-ink-muted">(Beberapa Topik Utama)</span>} />
            <p className="-mt-2 mb-3 text-caption text-ink-muted">Berdasarkan penguasaanmu saat ini, topik berikut siap kamu naiki.</p>
            <div className="space-y-2.5">
              {RECOMMENDED.map((r) => {
                const Icon = r.icon;
                return (
                  <Link key={r.topik} href="/app/learning" className="flex items-center gap-3 rounded-lg border p-3 hover:bg-muted">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg" style={{ backgroundColor: r.bg, color: r.color }}><Icon size={17} /></span>
                    <div className="min-w-0 flex-1">
                      <div className="text-body-sm font-bold text-ink">{r.topik}</div>
                      <div className="flex items-center gap-1 text-caption text-ink-muted">{r.next} <ArrowUpRight size={12} /></div>
                    </div>
                    <ArrowRight size={15} className="shrink-0 text-ink-muted" />
                  </Link>
                );
              })}
            </div>
          </Card>
        </div>

        {/* ROW 4 — Aksi Selanjutnya */}
        <div>
          <h2 className="text-h-sm text-ink">Aksi Selanjutnya</h2>
          <p className="mt-1 text-body-sm text-ink-muted">Tingkatkan penguasaanmu dengan langkah berikut.</p>
          <div className="mt-3 grid gap-4 sm:grid-cols-3">
            {ACTIONS.map((a) => {
              const Icon = a.icon;
              return (
                <Link key={a.title} href={a.href} className="flex items-start gap-3 rounded-2xl border bg-white p-4 hover:bg-muted">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl" style={{ backgroundColor: a.bg, color: a.color }}><Icon size={18} /></span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 text-body-sm font-bold" style={{ color: a.color }}>{a.title} <ArrowRight size={13} /></div>
                    <p className="text-caption text-ink-muted">{a.desc}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
