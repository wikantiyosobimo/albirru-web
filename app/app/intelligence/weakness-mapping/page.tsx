import {
  Info, BookOpen, TrendingUp, ClipboardList, ArrowRight, ChevronRight, Target,
} from "lucide-react";
import Link from "next/link";
import { getPortalProfile } from "@/lib/portal/session";
import { getUserIntelligence } from "@/lib/portal/intelligence";
import { statusSubtes } from "@/lib/portal/peluang";
import { PortalTopbar } from "@/components/portal/topbar";
import { Ring } from "@/components/portal/ring";
import { cn } from "@/lib/utils";

export const metadata = { title: "Weakness Mapping — Albirru" };

const COLUMNS = ["Literasi Indonesia", "Literasi Inggris", "Penalaran Matematika", "TPS"];
const HEATMAP: { topik: string; vals: (number | null)[] }[] = [
  { topik: "Inferensi", vals: [48, 64, 72, 60] },
  { topik: "Ide Pokok", vals: [55, 68, 75, 70] },
  { topik: "Analogi", vals: [72, 80, 78, 65] },
  { topik: "Logika", vals: [60, 70, 82, 75] },
  { topik: "Peluang", vals: [65, 72, 70, 60] },
  { topik: "Aritmetika", vals: [80, null, 85, null] },
  { topik: "Aljabar", vals: [78, null, 80, null] },
  { topik: "Geometri", vals: [75, null, 76, null] },
  { topik: "Integral", vals: [45, null, 50, null] },
];

const TREE = {
  root: { label: "Literasi Indonesia", sub: "Akurasi 55%", left: 35, top: 6.67, width: 30, height: 16.67, weak: true },
  row2: [
    { label: "Inferensi", sub: "Akurasi 48%", left: 11.67, top: 43.33, width: 26.67, height: 16.67, weak: true },
    { label: "Ide Pokok", sub: "Akurasi 55%", left: 61.67, top: 43.33, width: 26.67, height: 16.67, weak: false },
  ],
  row3: [
    { label: "Bacaan Panjang", sub: "Akurasi 45%", left: 1.67, top: 76.67, width: 21.67, height: 16.67, weak: true },
    { label: "Kesimpulan", sub: "Akurasi 50%", left: 26.67, top: 76.67, width: 21.67, height: 16.67, weak: false },
    { label: "Menentukan Ide Pokok", sub: "Akurasi 55%", left: 51.67, top: 76.67, width: 21.67, height: 16.67, weak: false },
    { label: "Detail Pendukung", sub: "Akurasi 60%", left: 76.67, top: 76.67, width: 21.67, height: 16.67, weak: false },
  ],
};

const TOP5 = [
  { rank: 1, icon: BookOpen, title: "Inferensi", value: "48%", color: "#E5484D", bg: "#FDECEC" },
  { rank: 2, icon: ClipboardList, title: "Bacaan Panjang", value: "52%", color: "#E8910B", bg: "#FFF1DC" },
  { rank: 3, icon: Target, title: "Ide Pokok", value: "55%", color: "#E8910B", bg: "#FFF1DC" },
  { rank: 4, icon: BookOpen, title: "Kesimpulan", value: "58%", color: "#94A3B8", bg: "#F5F8FC" },
  { rank: 5, icon: TrendingUp, title: "Detail Pendukung", value: "60%", color: "#94A3B8", bg: "#F5F8FC" },
];

const IMPACT = [
  { icon: TrendingUp, color: "#E5484D", bg: "#FDECEC", title: "Jika Inferensi naik", from: "50%", to: "75%", delta: "+24 poin" },
  { icon: TrendingUp, color: "#16B47A", bg: "#E9F9F1", title: "Jika Literasi Inggris naik", from: "60%", to: "80%", delta: "+18 poin" },
];

const PLAN = [
  { icon: BookOpen, color: "#E5484D", bg: "#FDECEC", title: "Inferensi", desc: "Memperbaiki kemampuan menarik kesimpulan dan memahami makna tersirat dalam teks.", soal: "20 Soal", waktu: "3 Hari" },
  { icon: Target, color: "#E8910B", bg: "#FFF1DC", title: "Ide Pokok", desc: "Melatih kemampuan menemukan gagasan utama dan ide pendukung.", soal: "15 Soal", waktu: "2 Hari" },
  { icon: ClipboardList, color: "#2F5BFF", bg: "#EAF0FF", title: "Bacaan Panjang", desc: "Meningkatkan ketahanan dan pemahaman pada teks panjang dan kompleks.", soal: "25 Soal", waktu: "4 Hari" },
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
  if (v >= 55) return { color: "#E8910B", bg: "#FFF1DC" };
  return { color: "#E5484D", bg: "#FDECEC" };
}

function Cell({ v }: { v: number | null }) {
  if (v === null) return <span className="text-caption text-ink-muted">–</span>;
  const l = level(v);
  return (
    <div className="flex items-center gap-2">
      <div className="h-2 w-16 rounded-full bg-hair"><div className="h-full rounded-full" style={{ width: `${v}%`, backgroundColor: l.color }} /></div>
      <span className="text-caption font-semibold" style={{ color: l.color }}>{v}%</span>
    </div>
  );
}

function TreeNode({ n }: { n: { label: string; sub: string; left: number; top: number; width: number; height: number; weak: boolean } }) {
  const c = n.weak ? { color: "#C0392B", bg: "#FDECEC" } : { color: "#B7791F", bg: "#FFF1DC" };
  return (
    <div
      className="absolute flex flex-col items-center justify-center rounded-xl text-center"
      style={{ left: `${n.left}%`, top: `${n.top}%`, width: `${n.width}%`, height: `${n.height}%`, backgroundColor: c.bg, color: c.color }}
    >
      <div className="text-caption font-bold leading-tight">{n.label}</div>
      <div className="text-[11px] leading-tight">{n.sub}</div>
    </div>
  );
}

export default async function Page() {
  const { profile } = await getPortalProfile();
  const nama = profile?.nama ?? "Farhan";

  // Data nyata: subtes diurutkan dari terlemah.
  const intel = await getUserIntelligence();
  const weakest = intel.subtes[0];
  const overallAkurasi = intel.subtes.length
    ? Math.round(intel.subtes.reduce((a, s) => a + (s.akurasi ?? 0), 0) / intel.subtes.length)
    : 0;
  const weaknessIndex = intel.hasData ? Math.max(0, Math.min(100, 100 - overallAkurasi)) : 68;
  const riskLabel = weaknessIndex >= 60 ? "High Risk" : weaknessIndex >= 40 ? "Moderate Risk" : "Low Risk";
  const riskColor = weaknessIndex >= 60 ? "#E5484D" : weaknessIndex >= 40 ? "#E8910B" : "#16B47A";

  const RANK_TONE = [
    { color: "#E5484D", bg: "#FDECEC" }, { color: "#E8910B", bg: "#FFF1DC" },
    { color: "#E8910B", bg: "#FFF1DC" }, { color: "#94A3B8", bg: "#F5F8FC" }, { color: "#94A3B8", bg: "#F5F8FC" },
  ];
  const top5 = intel.hasData
    ? intel.subtes.slice(0, 5).map((s, i) => ({ rank: i + 1, icon: BookOpen, title: s.subtes, value: `${Math.round(s.akurasi ?? 0)}%`, color: RANK_TONE[i].color, bg: RANK_TONE[i].bg }))
    : TOP5;

  return (
    <>
      <PortalTopbar
        eyebrow="Academic Intelligence  ›  Weakness Mapping"
        title="Weakness Mapping"
        subtitle="Identifikasi area yang paling menghambat pencapaian targetmu."
        nama={nama}
      />

      <div className="space-y-5 p-5 lg:p-7">
        {/* ROW 1 */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <Head title="Weakness Index" />
            <div className="flex items-center gap-4">
              <Ring value={weaknessIndex} size={88} stroke={9} color={riskColor}>
                <span className="text-[1.5rem] font-extrabold leading-none text-ink">{weaknessIndex}</span>
                <span className="text-[10px] text-ink-muted">/ 100</span>
              </Ring>
              <div>
                <div className="text-body-sm font-bold text-ink">{riskLabel}</div>
                <p className="mt-1 text-caption text-ink-muted">{intel.hasData ? "Berdasarkan akurasimu lintas try out." : "Masih banyak area yang perlu diperbaiki."}</p>
              </div>
            </div>
          </Card>

          <Card>
            <Head title="Biggest Bottleneck" />
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FDECEC] text-[#E5484D]"><BookOpen size={18} /></span>
            <div className="mt-2 text-body-lg font-extrabold text-ink">{weakest ? weakest.subtes : "Literasi Indonesia"}</div>
            <p className="text-caption text-ink-muted">Akurasi terendah saat ini</p>
            <div className="text-h-sm font-extrabold text-[#E5484D]">{weakest ? `${Math.round(weakest.akurasi ?? 0)}%` : "−32 poin"}</div>
          </Card>

          <Card>
            <Head title="Fastest Improvement Opportunity" />
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E9F9F1] text-[#16B47A]"><TrendingUp size={18} /></span>
            <div className="mt-2 text-body-lg font-extrabold text-ink">Inferensi</div>
            <p className="text-caption text-ink-muted">Peluang peningkatan tercepat</p>
            <div className="text-h-sm font-extrabold text-[#16B47A]">+24 poin</div>
          </Card>

          <Card>
            <Head title="Remediation Priority" />
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F2EBFF] text-[#6D49C9]"><ClipboardList size={18} /></span>
            <div className="mt-2 text-body-lg font-extrabold text-ink">3 Topik Prioritas</div>
            <p className="mt-1 text-caption text-ink-muted">Fokus pada area yang memberi dampak terbesar</p>
          </Card>
        </div>

        {/* ROW 2 — Heatmap + Hierarki */}
        <div className="grid gap-5 lg:grid-cols-[1.6fr_1fr]">
          <Card>
            <Head
              title="Weakness Heatmap (Berdasarkan Akurasi)"
              action={
                <div className="flex gap-3 text-caption text-ink-muted">
                  <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-[3px] bg-[#E5484D]" /> Lemah</span>
                  <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-[3px] bg-[#E8910B]" /> Sedang</span>
                  <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-[3px] bg-[#16B47A]" /> Kuat</span>
                </div>
              }
            />
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-left">
                <thead>
                  <tr className="border-b">
                    <th className="py-2 pr-3 text-caption font-semibold text-ink-muted">Topik</th>
                    {COLUMNS.map((c) => (
                      <th key={c} className="py-2 px-3 text-caption font-semibold text-ink-muted">{c}</th>
                    ))}
                    <th className="py-2 px-3 text-caption font-semibold text-ink-muted">Rata-rata</th>
                  </tr>
                </thead>
                <tbody>
                  {HEATMAP.map((row) => {
                    const valid = row.vals.filter((v): v is number => v !== null);
                    const avg = Math.round(valid.reduce((a, b) => a + b, 0) / valid.length);
                    const l = level(avg);
                    return (
                      <tr key={row.topik} className="border-b last:border-0">
                        <td className="py-2.5 pr-3 text-body-sm font-semibold text-ink">{row.topik}</td>
                        {row.vals.map((v, i) => (
                          <td key={i} className="py-2.5 px-3"><Cell v={v} /></td>
                        ))}
                        <td className="py-2.5 px-3 text-body-sm font-bold" style={{ color: l.color }}>{avg}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>

          <Card>
            <Head title="Hierarki Kelemahan" />
            <div className="relative aspect-[6/5] w-full">
              <TreeNode n={TREE.root} />
              {TREE.row2.map((n) => <TreeNode key={n.label} n={n} />)}
              {TREE.row3.map((n) => <TreeNode key={n.label} n={n} />)}
              <svg viewBox="0 0 600 300" className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
                <g stroke="#CBD5E1" strokeWidth="1.5" fill="none">
                  <path d="M300,70 V100" />
                  <path d="M150,100 H450" />
                  <path d="M150,100 V130" />
                  <path d="M450,100 V130" />
                  <path d="M150,180 V205" />
                  <path d="M75,205 H225" />
                  <path d="M75,205 V230" />
                  <path d="M225,205 V230" />
                  <path d="M450,180 V205" />
                  <path d="M375,205 H525" />
                  <path d="M375,205 V230" />
                  <path d="M525,205 V230" />
                </g>
              </svg>
            </div>
          </Card>
        </div>

        {/* ROW 3 — Top 5 */}
        <div>
          <h2 className="mb-3 text-h-sm text-ink">Top 5 Area Paling Menghambat</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {top5.map((t) => {
              const Icon = t.icon;
              return (
                <Card key={t.rank}>
                  <span className="flex h-7 w-7 items-center justify-center rounded-full text-[12px] font-extrabold text-white" style={{ backgroundColor: t.color }}>{t.rank}</span>
                  <span className="mt-3 flex h-11 w-11 items-center justify-center rounded-xl" style={{ backgroundColor: t.bg, color: t.color }}><Icon size={20} /></span>
                  <div className="mt-2 text-body-sm font-bold text-ink">{t.title}</div>
                  <div className="text-caption text-ink-muted">Akurasi</div>
                  <div className="text-h-sm font-extrabold text-ink">{t.value}</div>
                  <span className="mt-2 inline-block rounded-md px-2 py-0.5 text-[11px] font-semibold" style={{ backgroundColor: t.bg, color: t.color }}>Prioritas {t.rank}</span>
                </Card>
              );
            })}
          </div>
        </div>

        {/* ROW 4 — Dampak ke Target */}
        <div>
          <h2 className="mb-3 text-h-sm text-ink">Dampak ke Target <span className="text-body-sm font-normal text-ink-muted">(Simulasi Peningkatan)</span></h2>
          <div className="grid gap-5 sm:grid-cols-2">
            {IMPACT.map((d) => {
              const Icon = d.icon;
              return (
                <Card key={d.title}>
                  <div className="flex items-start gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl" style={{ backgroundColor: d.bg, color: d.color }}><Icon size={18} /></span>
                    <div className="flex-1">
                      <div className="text-body-sm font-bold text-ink">{d.title}</div>
                      <div className="text-h-sm font-extrabold text-ink">{d.from} → {d.to}</div>
                      <div className="text-caption text-ink-muted">Potensi peningkatan skor</div>
                      <div className="text-h-sm font-extrabold" style={{ color: d.color }}>{d.delta}</div>
                    </div>
                  </div>
                  <Link href="/app/intelligence/smart-revision" className="mt-3 inline-flex h-9 items-center gap-1.5 rounded-lg border px-3 text-body-sm font-semibold text-ink transition-colors hover:bg-muted">
                    Lihat Detail <ArrowRight size={14} />
                  </Link>
                </Card>
              );
            })}
          </div>
        </div>

        {/* ROW 5 — Remediation Plan */}
        <div>
          <h2 className="text-h-sm text-ink">Remediation Plan <span className="text-body-sm font-normal text-ink-muted">(Rencana Perbaikan Otomatis)</span></h2>
          <p className="mt-1 text-body-sm text-ink-muted">Fokus pada topik prioritas untuk hasil yang maksimal.</p>
          <div className="mt-3 grid gap-4 sm:grid-cols-3">
            {PLAN.map((p) => {
              const Icon = p.icon;
              return (
                <Link key={p.title} href="/app/intelligence/smart-revision" className="flex items-start gap-3 rounded-2xl border bg-white p-4 hover:bg-muted">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl" style={{ backgroundColor: p.bg, color: p.color }}><Icon size={18} /></span>
                  <div className="min-w-0 flex-1">
                    <div className="text-body-sm font-bold text-ink">{p.title}</div>
                    <p className="mt-0.5 text-caption text-ink-muted">{p.desc}</p>
                    <div className="mt-2 flex gap-3 text-caption text-ink-muted">
                      <span className="flex items-center gap-1"><ClipboardList size={13} /> {p.soal}</span>
                      <span className="flex items-center gap-1">⏱ {p.waktu}</span>
                    </div>
                  </div>
                  <ChevronRight size={16} className="mt-1 shrink-0 text-ink-muted" />
                </Link>
              );
            })}
          </div>
        </div>

        {/* FOOTER CTA */}
        <div className="flex flex-col items-center justify-between gap-3 rounded-2xl border bg-white p-5 sm:flex-row">
          <div className="text-body-lg font-bold text-ink">Siap memperbaiki kelemahanmu?</div>
          <div className="flex flex-wrap gap-3">
            <Link href="/app/intelligence/smart-revision" className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-brand px-4 text-body-sm font-semibold text-white">
              Mulai Smart Revision <ArrowRight size={14} />
            </Link>
            <Link href="/app/learning" className="inline-flex h-10 items-center gap-1.5 rounded-lg border px-4 text-body-sm font-semibold text-ink">
              Latihan Area Lemah <ArrowRight size={14} />
            </Link>
            <Link href="/app/intelligence/topic-mastery" className="inline-flex h-10 items-center gap-1.5 rounded-lg border px-4 text-body-sm font-semibold text-ink">
              Lihat Topic Mastery <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
