import {
  Calendar, Star, Info, TrendingUp, CheckCircle2, AlertTriangle,
  Zap, Target, ArrowRight, Map, BarChart3, BookOpen, Crosshair, Clock,
} from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { getPortalProfile } from "@/lib/portal/session";
import { Dropdown } from "@/components/portal/dropdown";
import { PortalTopbar } from "@/components/portal/topbar";
import { Ring } from "@/components/portal/ring";
import { RadarChart } from "@/components/portal/intelligence/radar-chart";
import { AiReportButton } from "@/components/portal/ai-panel";
import { getLocale, t } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export const metadata = { title: "Academic Intelligence — Albirru" };

const DNA_AXES = [
  { label: "Penalaran", value: 86 },
  { label: "Analitis", value: 80 },
  { label: "Kecepatan", value: 72 },
  { label: "Literasi", value: 60 },
  { label: "Ketelitian", value: 78 },
];

const STRENGTHS = [
  { title: "Penalaran Matematika", desc: "Skor 780 (Sangat Kuat)" },
  { title: "Logika Formal", desc: "Skor 720 (Kuat)" },
  { title: "Problem Solving", desc: "Skor 715 (Kuat)" },
];

const IMPROVEMENTS = [
  { title: "Literasi Indonesia", desc: "Skor 640 (Perlu Ditingkatkan)" },
  { title: "Inferensi", desc: "Skor 600 (Perlu Ditingkatkan)" },
  { title: "Bacaan Panjang", desc: "Skor 580 (Perlu Ditingkatkan)" },
];

const MONTHS = ["Jan '24", "Feb '24", "Mar '24", "Apr '24", "Mei '24"];
const PROGRESS_SERIES = [
  { label: "Penalaran Matematika", color: "#2F5BFF", values: [650, 680, 700, 740, 780] },
  { label: "Literasi Indonesia", color: "#16B47A", values: [500, 540, 580, 610, 640] },
  { label: "Literasi Inggris", color: "#6D49C9", values: [470, 510, 550, 590, 620] },
];
const KENAIKAN = [
  { label: "Penalaran Matematika", color: "#2F5BFF", from: 650, to: 780, delta: "+130 poin" },
  { label: "Literasi Indonesia", color: "#16B47A", from: 580, to: 640, delta: "+60 poin" },
  { label: "Literasi Inggris", color: "#6D49C9", from: 560, to: 620, delta: "+60 poin" },
];

const INSIGHTS = [
  { icon: Crosshair, color: "#E5484D", bg: "#FDECEC", title: "Kesalahan Paling Sering", value: "Inferensi", sub: "26% dari total kesalahanmu" },
  { icon: TrendingUp, color: "#16B47A", bg: "#E9F9F1", title: "Kenaikan Terbesar", value: "Penalaran Matematika", sub: "+130 poin dalam 90 hari terakhir" },
  { icon: Target, color: "#2F5BFF", bg: "#EAF0FF", title: "Potensi Peningkatan", value: "+48 poin", sub: "Jika fokus pada 3 area perbaikan utama" },
  { icon: Clock, color: "#6D49C9", bg: "#F2EBFF", title: "Waktu Belajar Optimal", value: "19.00 - 21.00", sub: "Performa terbaikmu di jam ini" },
];

const ACTIONS = [
  { icon: Map, title: "Weakness Mapping", desc: "Lihat peta kelemahan berdasarkan topik dan subtopik secara detail.", color: "#2F5BFF", href: "/app/intelligence/weakness-mapping" },
  { icon: Target, title: "Topic Mastery", desc: "Pantau penguasaanmu di setiap topik yang diujikan.", color: "#16B47A", href: "/app/intelligence/topic-mastery" },
  { icon: BarChart3, title: "Mistake Analysis", desc: "Analisis kesalahan untuk mengetahui pola dan akar masalahnya.", color: "#E8910B", href: "/app/intelligence/mistake-analysis" },
  { icon: BookOpen, title: "Smart Revision", desc: "Dapatkan rekomendasi belajar berbasis datamu.", color: "#6D49C9", href: "/app/intelligence/smart-revision" },
];

function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("rounded-2xl border bg-white p-5", className)}>{children}</div>;
}

function Head({ title, info = true }: { title: string; info?: boolean }) {
  return (
    <div className="mb-3 flex items-center gap-1.5">
      <h2 className="text-h-sm text-ink">{title}</h2>
      {info ? <Info size={14} className="text-ink-muted" /> : null}
    </div>
  );
}

function GrowthSparkline() {
  return (
    <svg viewBox="0 0 220 70" className="mt-2 w-full" preserveAspectRatio="none">
      <path d="M2,58 L36,46 L70,50 L104,34 L138,28 L172,16 L218,8 L218,70 L2,70 Z" fill="#16B47A" opacity="0.12" />
      <path d="M2,58 L36,46 L70,50 L104,34 L138,28 L172,16 L218,8" fill="none" stroke="#16B47A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {[[2, 58], [36, 46], [70, 50], [104, 34], [138, 28], [172, 16], [218, 8]].map((p, i) => (
        <circle key={i} cx={p[0]} cy={p[1]} r="2.5" fill="#16B47A" />
      ))}
    </svg>
  );
}

function ConsistencyBars() {
  const heights = [18, 24, 20, 28, 22, 30, 26, 32, 24, 30, 28, 34, 14, 12];
  return (
    <div className="mt-3 flex h-9 items-end gap-1.5">
      {heights.map((h, i) => (
        <span
          key={i}
          className={cn("flex-1 rounded-sm", i >= heights.length - 2 ? "bg-brand-100" : "bg-brand")}
          style={{ height: `${h}px` }}
        />
      ))}
    </div>
  );
}

export default async function Page() {
  const { profile } = await getPortalProfile();
  const locale = await getLocale();
  const nama = profile?.nama ?? "Farhan";

  const xAt = (i: number) => 40 + i * 125;
  const yAt = (v: number) => 190 - ((v - 300) / 600) * 160;

  return (
    <>
      <PortalTopbar
        title={t(locale, "intel.title")}
        subtitle={t(locale, "intel.subtitle")}
        nama={nama}
        right={<Suspense><Dropdown icon={Calendar} align="right" options={["20 Apr – 20 Mei 2024", "Maret 2024", "April 2024", "Mei 2024", "90 hari terakhir"]} /></Suspense>}
      />

      <div className="space-y-5 p-5 lg:p-7">
        {/* LAPORAN MINGGUAN AI */}
        <div className="rounded-2xl border bg-white p-5">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-h-sm text-ink">{t(locale, "intel.weekly")}</h3>
              <p className="text-body-sm text-ink-muted">{t(locale, "intel.weekly.desc")}</p>
            </div>
          </div>
          <div className="mt-4"><Suspense><AiReportButton /></Suspense></div>
        </div>

        {/* ROW 1 — top metrics */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <Head title={t(locale, "intel.health")} />
            <div className="flex items-center gap-4">
              <Ring value={82} size={96} stroke={10} color="#2F5BFF">
                <span className="text-[1.65rem] font-extrabold leading-none text-ink">82</span>
                <span className="text-[10px] text-ink-muted">/ 100</span>
              </Ring>
              <div>
                <div className="flex items-center gap-1.5 text-body-sm font-bold text-ink">
                  Advanced Learner <Star size={14} className="fill-current text-[#E8910B]" />
                </div>
                <p className="mt-1 text-caption text-ink-muted">Kamu termasuk dalam 20% siswa teratas</p>
              </div>
            </div>
          </Card>

          <Card>
            <Head title={t(locale, "intel.growth")} />
            <div className="text-[2rem] font-extrabold leading-none text-[#16B47A]">+14%</div>
            <div className="mt-1 text-caption text-ink-muted">30 hari terakhir</div>
            <GrowthSparkline />
          </Card>

          <Card>
            <Head title={t(locale, "intel.consistency")} />
            <div className="text-[2rem] font-extrabold leading-none text-brand">87%</div>
            <div className="mt-1 text-caption text-ink-muted">Sangat Konsisten</div>
            <ConsistencyBars />
            <div className="mt-2 text-caption text-ink-muted">Konsistensimu di atas 80% siswa</div>
          </Card>

          <Card>
            <Head title={t(locale, "intel.readiness")} />
            <div className="text-caption text-ink-muted">
              Target: <span className="font-semibold text-ink">UGM - Teknik Informatika</span>
            </div>
            <div className="mt-3 flex items-center gap-3">
              <Ring value={84} size={84} stroke={9} color="#16B47A">
                <span className="text-[1.4rem] font-extrabold leading-none text-ink">84%</span>
              </Ring>
              <div className="text-body-sm font-bold leading-tight text-[#16B47A]">Siap Menuju Target</div>
            </div>
            <div className="mt-3 rounded-md bg-muted px-2 py-1.5 text-[11px] text-ink-muted">
              Tinggal 138 poin menuju target aman
            </div>
          </Card>
        </div>

        {/* ROW 2 — Academic DNA + Kekuatan/Area */}
        <div className="grid gap-5 lg:grid-cols-[1.3fr_1fr_1fr]">
          <Card>
            <Head title={t(locale, "intel.dna")} />
            <div className="flex flex-col items-center gap-4 sm:flex-row">
              <div className="w-full max-w-[260px] shrink-0">
                <RadarChart axes={DNA_AXES} series={[{ values: DNA_AXES.map((a) => a.value), color: "#2F5BFF", fill: true }]} size={260} />
              </div>
              <div>
                <div className="text-caption text-ink-muted">Tipe Belajar Dominan</div>
                <div className="text-h-sm font-extrabold text-brand">Analytical Problem Solver</div>
                <p className="mt-2 text-body-sm text-ink-body">
                  Kamu unggul dalam menganalisis masalah kompleks, menghubungkan konsep, dan menemukan pola logis.
                </p>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 border-t pt-3 text-caption text-ink-muted">
              <BarChart3 size={14} /> Diperbarui berdasarkan 12 Try Out terakhir
            </div>
          </Card>

          <Card>
            <div className="mb-3 flex items-center gap-2.5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#E9F9F1] text-[#16B47A]"><Zap size={18} /></span>
              <h2 className="text-h-sm text-ink">{t(locale, "intel.strengths")}</h2>
            </div>
            <div className="space-y-3.5">
              {STRENGTHS.map((s) => (
                <div key={s.title} className="flex items-start gap-2.5">
                  <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-[#16B47A]" />
                  <div>
                    <div className="text-body-sm font-bold text-ink">{s.title}</div>
                    <div className="text-caption text-ink-muted">{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <Link href="/app/intelligence/topic-mastery" className="mt-4 inline-flex items-center gap-1.5 text-body-sm font-semibold text-brand">
              Lihat detail kekuatan <ArrowRight size={14} />
            </Link>
          </Card>

          <Card>
            <div className="mb-3 flex items-center gap-2.5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#FFF1DC] text-[#E8910B]"><Target size={18} /></span>
              <h2 className="text-h-sm text-ink">{t(locale, "intel.improvements")}</h2>
            </div>
            <div className="space-y-3.5">
              {IMPROVEMENTS.map((s) => (
                <div key={s.title} className="flex items-start gap-2.5">
                  <AlertTriangle size={18} className="mt-0.5 shrink-0 text-[#E8910B]" />
                  <div>
                    <div className="text-body-sm font-bold text-ink">{s.title}</div>
                    <div className="text-caption text-ink-muted">{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <Link href="/app/intelligence/weakness-mapping" className="mt-4 inline-flex items-center gap-1.5 text-body-sm font-semibold text-brand">
              Lihat detail area perbaikan <ArrowRight size={14} />
            </Link>
          </Card>
        </div>

        {/* ROW 3 — Progress Intelligence + insights */}
        <div className="grid gap-5 lg:grid-cols-[1.6fr_1fr]">
          <Card>
            <Head title={t(locale, "intel.progress")} />
            <div className="flex flex-col gap-5 lg:flex-row">
              <div className="flex-1">
                <div className="mb-2 flex flex-wrap gap-4 text-caption text-ink-muted">
                  {PROGRESS_SERIES.map((s) => (
                    <span key={s.label} className="flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: s.color }} /> {s.label}
                    </span>
                  ))}
                </div>
                <svg viewBox="0 0 580 220" className="w-full">
                  {PROGRESS_SERIES.map((s) => (
                    <g key={s.label}>
                      <polyline
                        points={s.values.map((v, i) => `${xAt(i)},${yAt(v)}`).join(" ")}
                        fill="none" stroke={s.color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                      />
                      {s.values.map((v, i) => (
                        <g key={i}>
                          <circle cx={xAt(i)} cy={yAt(v)} r="3.5" fill={s.color} />
                          <text x={xAt(i)} y={yAt(v) - 9} textAnchor="middle" className="fill-ink text-[10px] font-semibold">{v}</text>
                        </g>
                      ))}
                    </g>
                  ))}
                  {MONTHS.map((m, i) => (
                    <text key={m} x={xAt(i)} y="210" textAnchor="middle" className="fill-current text-[10px] text-ink-muted">{m}</text>
                  ))}
                </svg>
              </div>

              <div className="w-full shrink-0 rounded-xl border p-4 lg:w-60">
                <div className="text-body-sm font-bold text-ink">Kenaikan Total</div>
                <div className="text-caption text-ink-muted">(vs 90 hari lalu)</div>
                <div className="mt-3 space-y-3">
                  {KENAIKAN.map((k) => (
                    <div key={k.label}>
                      <div className="flex items-center gap-1.5 text-caption font-semibold text-ink">
                        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: k.color }} /> {k.label}
                      </div>
                      <div className="mt-0.5 flex items-center justify-between">
                        <span className="text-body-sm text-ink-body">{k.from} → {k.to}</span>
                        <span className="text-caption font-bold text-[#16B47A]">{k.delta}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <Link href="/app/intelligence/topic-mastery" className="mt-4 inline-flex items-center gap-1.5 text-caption font-semibold text-brand">
                  Lihat progress lengkap <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {INSIGHTS.map((c) => {
              const Icon = c.icon;
              return (
                <div key={c.title} className="rounded-2xl border p-4" style={{ backgroundColor: c.bg }}>
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white" style={{ color: c.color }}><Icon size={18} /></span>
                  <div className="mt-2.5 text-caption text-ink-muted">{c.title}</div>
                  <div className="mt-0.5 text-body-sm font-extrabold leading-tight text-ink">{c.value}</div>
                  <div className="mt-1 text-[11px] leading-snug text-ink-muted">{c.sub}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ROW 4 — Intelligence Actions */}
        <div>
          <h2 className="text-h-sm text-ink">{t(locale, "intel.actions")}</h2>
          <p className="mt-1 text-body-sm text-ink-muted">{t(locale, "intel.actions.desc")}</p>
          <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {ACTIONS.map((a) => {
              const Icon = a.icon;
              return (
                <Link key={a.title} href={a.href} className="flex flex-col rounded-2xl border bg-white p-4 transition-colors hover:bg-muted">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ backgroundColor: `${a.color}1A`, color: a.color }}><Icon size={20} /></span>
                  <div className="mt-3 flex items-center gap-1.5 text-body-sm font-bold" style={{ color: a.color }}>
                    {a.title} <ArrowRight size={14} />
                  </div>
                  <p className="mt-1 text-caption text-ink-muted">{a.desc}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
