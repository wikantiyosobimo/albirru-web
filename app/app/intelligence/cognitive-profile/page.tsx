import {
  Info, Network, Shuffle, ListChecks, BarChart3, ArrowRight, CheckCircle2, AlertTriangle,
  Target, HelpCircle, RefreshCw, Brain, Puzzle, BookOpen, ShieldCheck, Clock, Gauge,
  Sparkles, RotateCcw, Lightbulb,
} from "lucide-react";
import Link from "next/link";
import { Dropdown } from "@/components/portal/dropdown";
import { getPortalProfile } from "@/lib/portal/session";
import { PortalTopbar } from "@/components/portal/topbar";
import { RadarChart } from "@/components/portal/intelligence/radar-chart";
import { MiniTrend } from "@/components/portal/intelligence/mini-trend";
import { cn } from "@/lib/utils";

export const metadata = { title: "Cognitive Profile — Albirru" };

const RADAR_AXES = [
  { label: "Analytical Thinking", value: 88 },
  { label: "Pattern Recognition", value: 75 },
  { label: "Reading Comprehension", value: 72 },
  { label: "Problem Solving", value: 82 },
  { label: "Decision Confidence", value: 68 },
  { label: "Time Management", value: 64 },
];
const RADAR_AVG = [70, 65, 68, 70, 60, 58];

const STYLES = [
  { key: "analytical", icon: Brain, color: "#2F5BFF", bg: "#EAF0FF", label: "Analytical Thinking", value: 88 },
  { key: "pattern", icon: Puzzle, color: "#16B47A", bg: "#E9F9F1", label: "Pattern Recognition", value: 75 },
  { key: "reading", icon: BookOpen, color: "#E8910B", bg: "#FFF1DC", label: "Reading Comprehension", value: 72 },
  { key: "problem", icon: Target, color: "#16B47A", bg: "#E9F9F1", label: "Problem Solving", value: 82 },
  { key: "decision", icon: ShieldCheck, color: "#E8910B", bg: "#FFF1DC", label: "Decision Confidence", value: 68 },
  { key: "time", icon: Clock, color: "#2F5BFF", bg: "#EAF0FF", label: "Time Management", value: 64 },
];

const DECISIONS = [
  { icon: Target, color: "#16B47A", bg: "#E9F9F1", title: "Saat Kamu Yakin", value: "86%", sub: "Akurasi Jawaban", freq: "Frekuensi", freqVal: "62% dari total soal" },
  { icon: HelpCircle, color: "#E8910B", bg: "#FFF1DC", title: "Saat Kamu Ragu", value: "42%", sub: "Akurasi Jawaban", freq: "Frekuensi", freqVal: "38% dari total soal" },
  { icon: RefreshCw, color: "#6D49C9", bg: "#F2EBFF", title: "Jawaban yang Diubah", value: "18%", sub: "Dari total jawaban", freq: "Benar setelah revisi", freqVal: "62%", freqGreen: true },
];

const CONTRIB = [
  { icon: Brain, color: "#6D49C9", bg: "#F2EBFF", label: "Analytical Thinking", value: "+32 poin" },
  { icon: Target, color: "#16B47A", bg: "#E9F9F1", label: "Problem Solving", value: "+28 poin" },
  { icon: Puzzle, color: "#16B47A", bg: "#E9F9F1", label: "Pattern Recognition", value: "+22 poin" },
  { icon: BookOpen, color: "#E8910B", bg: "#FFF1DC", label: "Reading Comprehension", value: "+18 poin" },
  { icon: ShieldCheck, color: "#E8910B", bg: "#FFF1DC", label: "Decision Confidence", value: "+12 poin" },
  { icon: Clock, color: "#2F5BFF", bg: "#EAF0FF", label: "Time Management", value: "+8 poin" },
];

const TIMELINE = [
  { title: "Analytical Thinking", color: "#2F5BFF", values: [72, 76, 81, 88], compare: [65, 66, 68, 70] },
  { title: "Pattern Recognition", color: "#16B47A", values: [62, 67, 71, 75], compare: [58, 60, 62, 64] },
  { title: "Reading Comprehension", color: "#E8910B", values: [58, 61, 67, 72], compare: [55, 57, 60, 62] },
  { title: "Problem Solving", color: "#16B47A", values: [65, 70, 76, 82], compare: [60, 63, 66, 69] },
  { title: "Decision Confidence", color: "#E8910B", values: [58, 61, 67, 68], compare: [55, 57, 60, 62] },
  { title: "Time Management", color: "#2F5BFF", values: [50, 54, 60, 64], compare: [48, 50, 53, 56] },
];

const RECOMMENDATIONS = [
  { icon: Gauge, text: "Tingkatkan kecepatan dalam pengambilan keputusan" },
  { icon: Clock, text: "Latih kemampuan mengerjakan soal di bawah tekanan waktu" },
  { icon: Brain, text: "Kurangi overthinking pada soal yang sudah kamu pahami" },
  { icon: ListChecks, text: "Gunakan teknik eliminasi untuk meningkatkan akurasi saat ragu" },
];

const ACTIONS = [
  { icon: BookOpen, color: "#E5484D", bg: "#FDECEC", title: "Lihat Weakness Mapping", desc: "Temukan area yang masih menghambat potensimu.", href: "/app/intelligence/weakness-mapping" },
  { icon: Target, color: "#16B47A", bg: "#E9F9F1", title: "Lihat Topic Mastery", desc: "Lihat topik yang sudah kamu kuasai dengan baik.", href: "/app/intelligence/topic-mastery" },
  { icon: Sparkles, color: "#6D49C9", bg: "#F2EBFF", title: "Adaptive Practice", desc: "Latihan yang menyesuaikan dengan pola berpikirmu.", href: "/app/intelligence/smart-revision" },
  { icon: RotateCcw, color: "#E8910B", bg: "#FFF1DC", title: "Smart Revision", desc: "Rekomendasi revisi berdasarkan cara kamu berpikir.", href: "/app/intelligence/smart-revision" },
  { icon: Lightbulb, color: "#2F5BFF", bg: "#EAF0FF", title: "Cognitive Tips", desc: "Tips untuk mengoptimalkan cara berpikirmu.", href: "/app/intelligence/cognitive-profile" },
];

function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("rounded-2xl border bg-white p-5", className)}>{children}</div>;
}

function Head({ title, info = true, action }: { title: string; info?: boolean; action?: React.ReactNode }) {
  return (
    <div className="mb-3 flex items-center justify-between gap-2">
      <div className="flex items-center gap-1.5">
        <h2 className="text-h-sm text-ink">{title}</h2>
        {info ? <Info size={14} className="text-ink-muted" /> : null}
      </div>
      {action}
    </div>
  );
}

function ArchetypeIllustration() {
  return (
    <svg viewBox="0 0 160 130" className="mx-auto h-28 w-32">
      <ellipse cx="80" cy="118" rx="55" ry="8" fill="#E7EEFF" />
      <line x1="80" y1="14" x2="80" y2="28" stroke="#6E9BF0" strokeWidth="3" strokeLinecap="round" />
      <circle cx="80" cy="10" r="5" fill="#6E9BF0" />
      <circle cx="80" cy="60" r="44" fill="url(#archGrad)" />
      <circle cx="64" cy="56" r="6" fill="#fff" />
      <circle cx="96" cy="56" r="6" fill="#fff" />
      <circle cx="64" cy="56" r="2.5" fill="#0B1A47" />
      <circle cx="96" cy="56" r="2.5" fill="#0B1A47" />
      <path d="M62 76 Q80 88 98 76" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" />
      <g stroke="#9B5DE5" strokeWidth="2" fill="none" opacity="0.7">
        <line x1="30" y1="40" x2="42" y2="48" />
        <line x1="130" y1="40" x2="118" y2="48" />
        <line x1="22" y1="80" x2="36" y2="78" />
        <line x1="138" y1="80" x2="124" y2="78" />
      </g>
      <defs>
        <linearGradient id="archGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#6E9BF0" />
          <stop offset="1" stopColor="#2F5BFF" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default async function Page() {
  const { profile } = await getPortalProfile();
  const nama = profile?.nama ?? "Farhan";

  return (
    <>
      <PortalTopbar
        eyebrow="Academic Intelligence  ›  Cognitive Profile"
        title="Cognitive Profile"
        subtitle="Pahami bagaimana pola berpikirmu saat belajar, menjawab soal, dan mengambil keputusan."
        nama={nama}
      />

      <div className="space-y-5 p-5 lg:p-7">
        {/* ROW 1 — Archetype / Radar / Thinking Style */}
        <div className="grid gap-5 lg:grid-cols-[1.1fr_1.1fr_1.5fr]">
          <Card>
            <Head title="Cognitive Archetype" />
            <ArchetypeIllustration />
            <div className="mt-2 text-center">
              <div className="text-h-md font-extrabold text-brand">Analytical Explorer</div>
              <p className="mt-1.5 text-body-sm text-ink-body">
                Kamu memiliki kemampuan analisis yang kuat dan rasa ingin tahu tinggi untuk memahami pola serta mencari hubungan antar informasi.
              </p>
            </div>
            <div className="mt-4 rounded-xl bg-muted p-4">
              <div className="text-caption font-semibold text-ink">Kamu cenderung unggul dalam:</div>
              <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                {[
                  { icon: Network, label: "Analisis logis dan sistematis" },
                  { icon: Shuffle, label: "Menghubungkan pola dan konsep" },
                  { icon: ListChecks, label: "Menyelesaikan soal bertahap" },
                ].map((it) => (
                  <div key={it.label}>
                    <span className="mx-auto flex h-9 w-9 items-center justify-center rounded-lg bg-white text-brand"><it.icon size={16} /></span>
                    <div className="mt-1.5 text-[11px] leading-tight text-ink-body">{it.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2 text-caption text-ink-muted">
              <BarChart3 size={14} /> Data berdasarkan 2.845 soal yang telah kamu kerjakan
            </div>
          </Card>

          <Card>
            <Head title="Cognitive Radar" />
            <RadarChart
              size={290}
              axes={RADAR_AXES}
              series={[
                { values: RADAR_AXES.map((a) => a.value), color: "#2F5BFF", fill: true },
                { values: RADAR_AVG, color: "#94A3B8", dashed: true },
              ]}
            />
            <div className="mt-2 flex justify-center gap-5 text-caption text-ink-muted">
              <span className="flex items-center gap-1.5"><span className="h-0.5 w-4 bg-brand" /> Skor Kamu</span>
              <span className="flex items-center gap-1.5"><span className="h-0.5 w-4 border-t-2 border-dashed border-ink-muted" /> Rata-rata Siswa</span>
            </div>
          </Card>

          <Card>
            <Head title="Thinking Style Explorer" />
            <div className="grid gap-3 sm:grid-cols-[1fr_1.3fr]">
              <div className="space-y-1.5">
                {STYLES.map((s) => {
                  const Icon = s.icon;
                  const active = s.key === "analytical";
                  return (
                    <div
                      key={s.key}
                      className={cn(
                        "flex items-center gap-2.5 rounded-lg px-3 py-2.5",
                        active ? "border border-brand bg-brand-100" : "hover:bg-muted",
                      )}
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white" style={{ color: s.color }}><Icon size={16} /></span>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-body-sm font-bold text-ink">{s.label}</div>
                        <div className="text-caption text-ink-muted">{s.value}%</div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="rounded-xl border p-4">
                <div className="flex items-center justify-between">
                  <div className="text-body-lg font-extrabold text-ink">Analytical Thinking</div>
                  <span className="rounded-full bg-[#DCF5EA] px-2.5 py-1 text-[11px] font-bold text-[#16864F]">Sangat Kuat</span>
                </div>
                <div className="mt-3 text-caption font-semibold text-ink">Kamu sangat kuat dalam:</div>
                <div className="mt-2 space-y-1.5">
                  {["Menganalisis informasi kompleks", "Mencari hubungan sebab-akibat", "Memahami logika dan struktur argumen"].map((t) => (
                    <div key={t} className="flex items-start gap-2 text-body-sm text-ink-body">
                      <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-[#16B47A]" /> {t}
                    </div>
                  ))}
                </div>
                <div className="mt-3 rounded-lg bg-[#FDECEC] p-3">
                  <div className="flex items-center gap-1.5 text-caption font-bold text-[#C0392B]"><AlertTriangle size={14} /> Potensi Risiko</div>
                  <p className="mt-1 text-caption text-ink-body">
                    Cenderung overthinking dan terlalu lama memvalidasi jawaban sebelum memutuskan.
                  </p>
                </div>
                <div className="mt-3 flex items-center justify-between rounded-lg bg-muted p-3">
                  <div>
                    <div className="text-caption font-bold text-ink">Dampak ke Hasil Akhir</div>
                    <div className="text-[11px] text-ink-muted">Memberikan kontribusi</div>
                  </div>
                  <div className="text-h-sm font-extrabold text-brand">+32 poin</div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* ROW 2 — Decision Behavior + Kontribusi */}
        <div className="grid gap-5 lg:grid-cols-[1fr_1.7fr]">
          <Card>
            <Head title="Decision Behavior" />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {DECISIONS.map((d) => {
                const Icon = d.icon;
                return (
                  <div key={d.title}>
                    <span className="flex h-10 w-10 items-center justify-center rounded-full" style={{ backgroundColor: d.bg, color: d.color }}><Icon size={18} /></span>
                    <div className="mt-2 text-body-sm font-bold text-ink">{d.title}</div>
                    <div className="text-[1.5rem] font-extrabold leading-none text-ink">{d.value}</div>
                    <div className="text-caption text-ink-muted">{d.sub}</div>
                    <div className="mt-2 text-[11px] text-ink-muted">{d.freq}</div>
                    <div className={cn("text-caption font-semibold", d.freqGreen ? "text-[#16B47A]" : "text-ink")}>{d.freqVal}</div>
                  </div>
                );
              })}
            </div>
          </Card>

          <Card>
            <Head title="Kontribusi Pola Pikir ke Hasil Try Out" />
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
              {CONTRIB.map((c) => {
                const Icon = c.icon;
                return (
                  <div key={c.label} className="text-center">
                    <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl" style={{ backgroundColor: c.bg, color: c.color }}><Icon size={20} /></span>
                    <div className="mt-2 text-[11px] leading-tight text-ink-body">{c.label}</div>
                    <div className="mt-1 text-body-sm font-extrabold text-ink">{c.value}</div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* ROW 3 — Cognitive Timeline + Recommendations */}
        <div className="grid gap-5 lg:grid-cols-[1.7fr_1fr]">
          <Card>
            <Head
              title="Cognitive Timeline"
              action={<Dropdown size="sm" align="right" options={["4 Bulan Terakhir", "3 Bulan Terakhir", "6 Bulan Terakhir", "1 Tahun Terakhir"]} />}
            />
            <div className="mb-3 flex gap-5 text-caption text-ink-muted">
              <span className="flex items-center gap-1.5"><span className="h-0.5 w-4 bg-brand" /> Skor Kamu</span>
              <span className="flex items-center gap-1.5"><span className="h-0.5 w-4 border-t-2 border-dashed border-ink-muted" /> Rata-rata Siswa</span>
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
              {TIMELINE.map((t) => <MiniTrend key={t.title} {...t} />)}
            </div>
          </Card>

          <Card className="flex flex-col">
            <Head title="Personalized Recommendations" />
            <div className="flex flex-1 flex-col items-center justify-center rounded-xl bg-muted p-6 text-center">
              <span className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#6E9BF0] to-[#2F5BFF] text-white shadow-md">
                <Target size={36} />
              </span>
              <p className="mt-4 text-body-sm font-bold text-ink">
                Kamu memiliki kemampuan analitis yang tinggi dan sangat potensial.
              </p>
            </div>
            <div className="mt-4 text-caption font-semibold text-ink">Fokus berikutnya untuk hasil yang lebih maksimal:</div>
            <div className="mt-2 space-y-2">
              {RECOMMENDATIONS.map((r) => {
                const Icon = r.icon;
                return (
                  <div key={r.text} className="flex items-center gap-2.5 rounded-lg bg-muted px-3 py-2.5">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-brand"><Icon size={15} /></span>
                    <span className="text-body-sm text-ink-body">{r.text}</span>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* ROW 4 — Cognitive Actions */}
        <div>
          <h2 className="mb-3 text-h-sm text-ink">Cognitive Actions</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {ACTIONS.map((a) => {
              const Icon = a.icon;
              return (
                <Link key={a.title} href={a.href} className="flex items-start gap-3 rounded-2xl border p-4" style={{ backgroundColor: a.bg }}>
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white" style={{ color: a.color }}><Icon size={18} /></span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 text-body-sm font-bold" style={{ color: a.color }}>{a.title} <ArrowRight size={13} /></div>
                    <div className="text-caption text-ink-muted">{a.desc}</div>
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
