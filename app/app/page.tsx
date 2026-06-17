import Link from "next/link";
import {
  Target, ArrowRight, TrendingUp, CheckCircle2, Circle, BookOpen, Brain,
  Sigma, Atom, AlarmClock, ClipboardList, RotateCcw, Trophy, CalendarClock,
  Video, Radio, Cpu, Heart,
} from "lucide-react";
import { getPortalProfile } from "@/lib/portal/session";
import { getSegment } from "@/lib/data/targets";
import { getUserIntelligence } from "@/lib/portal/intelligence";
import { statusSubtes } from "@/lib/portal/peluang";
import { getLocale, t } from "@/lib/i18n";
import { PortalTopbar } from "@/components/portal/topbar";
import { Ring } from "@/components/portal/ring";
import { cn } from "@/lib/utils";

export const metadata = { title: "Dashboard — Albirru" };

// Singkatan kampus: "Universitas Gadjah Mada" -> "UGM".
function abbrev(name: string) {
  const skip = new Set(["dan", "of", "the", "di"]);
  const words = name.replace(/\(.*?\)/g, "").trim().split(/\s+/).filter((w) => w.length > 2 && !skip.has(w.toLowerCase()));
  const code = words.map((w) => w[0]).join("").toUpperCase();
  return code.length >= 2 && code.length <= 5 ? code : name.slice(0, 4).toUpperCase();
}

const TREND = [520, 560, 603, 648, 703];
const TREND_LABELS = ["Jan", "Feb", "Mar", "Apr", "Mei"];

const MISI = [
  { t: "Review Literasi", d: "Selesaikan 15 menit review materi", done: true, badge: "Selesai", href: "/app/learning" },
  { t: "Mini Try Out TPS", d: "Kerjakan 20 soal", done: false, badge: "0/20", href: "/app/try-out" },
  { t: "Smart Revision Matematika", d: "Kerjakan 10 soal lemahmu", done: false, badge: "0/10", href: "/app/intelligence" },
];

const KELEMAHAN_MOCK = [
  { icon: BookOpen, label: "Literasi", val: 82, color: "#16B47A", sb: "#DCF5EA", sc: "#16864F", status: "Kuat" },
  { icon: Brain, label: "Penalaran", val: 64, color: "#E8910B", sb: "#FFF1DC", sc: "#B7791F", status: "Sedang" },
  { icon: Sigma, label: "Matematika", val: 51, color: "#E5484D", sb: "#FDECEC", sc: "#C13030", status: "Lemah" },
  { icon: Atom, label: "Fisika", val: 48, color: "#E5484D", sb: "#FDECEC", sc: "#C13030", status: "Lemah" },
];

function subtesIcon(name: string) {
  const n = name.toLowerCase();
  if (n.includes("matematika") || n.includes("kuantitatif") || n.includes("tiu")) return Sigma;
  if (n.includes("literasi") || n.includes("bacaan") || n.includes("twk")) return BookOpen;
  if (n.includes("penalaran") || n.includes("tkp")) return Brain;
  return Atom;
}
function shortLabel(name: string) {
  return name.split(" - ").pop()!.replace(/\s*\(.*\)/, "").slice(0, 18);
}

const REKOM = [
  { icon: ClipboardList, t: "Kerjakan 20 soal Penalaran (Level 2)", href: "/app/try-out" },
  { icon: Video, t: "Tonton Video: Strategi Bacaan Cepat", href: "/app/learning" },
  { icon: Radio, t: "Ikuti Kelas Live: Matematika - Turunan", href: "/app/learning" },
];

const NAVIGATOR = [
  { n: 1, icon: BookOpen, label: "Literasi", status: "Tinggi", poin: "+27", sb: "#DCF5EA", sc: "#16864F" },
  { n: 2, icon: Brain, label: "Penalaran", status: "Sedang", poin: "+19", sb: "#FFF1DC", sc: "#B7791F" },
  { n: 3, icon: Sigma, label: "Matematika", status: "Sedang", poin: "+16", sb: "#FFF1DC", sc: "#B7791F" },
];

const JADWAL = [
  { icon: AlarmClock, t: "Mini Try Out TPS (20 soal)", when: "Hari ini · 16.00 - 17.30", badge: "Try Out", bb: "#EAF0FF", bc: "#2F5BFF", href: "/app/try-out" },
  { icon: ClipboardList, t: "Review Literasi - Bacaan", when: "Hari ini · 19.00 - 20.00", badge: "Belajar", bb: "#FFF1DC", bc: "#B7791F", href: "/app/learning" },
  { icon: RotateCcw, t: "Smart Revision Matematika", when: "Besok · 16.00 - 17.00", badge: "Revisi", bb: "#F3ECFF", bc: "#6D49C9", href: "/app/intelligence" },
];

const NOTIF = [
  { icon: Trophy, color: "#E8910B", t: "Selamat! Skor NTK mu naik 41 poin 🎉", time: "2 jam yang lalu", unread: true },
  { icon: CalendarClock, color: "#2F5BFF", t: "Kelas Live dimulai 1 jam lagi - Matematika - Integral", time: "3 jam yang lalu", unread: false },
  { icon: Target, color: "#E5484D", t: "Target harianmu belum tercapai. Selesaikan misi untuk menjaga konsistensi!", time: "5 jam yang lalu", unread: false },
];

const VALUES = [
  { icon: Target, t: "Fokus Pada Tujuan", d: "Semua rekomendasi disesuaikan dengan target kampus impianmu." },
  { icon: Cpu, t: "AI-Powered Insight", d: "Analisis cerdas untuk memahami kekuatan, kelemahan, dan peluangmu." },
  { icon: TrendingUp, t: "Adaptif & Personal", d: "Rencana belajar adaptif yang berubah sesuai perkembanganmu." },
  { icon: Heart, t: "Human Centered", d: "Albirru mendampingimu di setiap langkah perjalanan akademikmu." },
];

function SectionHead({ title, sub, action, href }: { title: string; sub?: string; action?: string; href?: string }) {
  return (
    <div className="mb-4 flex items-start justify-between gap-3">
      <div>
        <h2 className="text-h-sm text-ink">{title}</h2>
        {sub ? <p className="mt-0.5 text-caption text-ink-muted">{sub}</p> : null}
      </div>
      {action && href ? (
        <Link href={href} className="inline-flex shrink-0 items-center gap-1 text-body-sm font-semibold text-brand hover:underline">{action} <ArrowRight size={13} /></Link>
      ) : null}
    </div>
  );
}

export default async function DashboardPage() {
  const { profile } = await getPortalProfile();
  const nama = profile?.nama ?? "Farhan";
  const locale = await getLocale();
  const seg = getSegment(profile?.segment);
  const isInstansi = seg.target === "instansi";
  const kampusFull = (isInstansi ? profile?.target_instansi : profile?.target_kampus) || (isInstansi ? "Kementerian Keuangan" : seg.value === "kedinasan" ? "PKN STAN" : "Universitas Gadjah Mada");
  const prodi = (isInstansi ? profile?.target_jabatan : profile?.target_prodi) || (isInstansi ? "Analis Keuangan" : seg.value === "kedinasan" ? "Akuntansi Sektor Publik" : "Teknik Informatika");
  const targetSkor = profile?.target_skor ?? (seg.model === "akademik" ? 850 : 420);
  const skorMax = seg.scoreMax;

  // Data nyata lintas try out (fallback ke contoh bila belum ada attempt).
  const intel = await getUserIntelligence();
  const skorTerbaru = intel.summary.skor_terbaru ?? (seg.model === "akademik" ? 703 : 385);
  const gap = Math.max(0, targetSkor - skorTerbaru);

  const kelemahan = intel.hasData
    ? intel.subtes.slice(0, 4).map((s) => {
        const akr = Math.round(s.akurasi ?? 0);
        const st = statusSubtes(akr);
        return { icon: subtesIcon(s.subtes), label: shortLabel(s.subtes), val: akr, color: st.bar, sb: st.sb, sc: st.sc, status: st.label };
      })
    : KELEMAHAN_MOCK;

  const trendScores = intel.hasData && intel.trend.length ? intel.trend.map((tr) => tr.skor) : TREND;
  const trendLabels = intel.hasData && intel.trend.length
    ? intel.trend.map((tr) => new Date(tr.tanggal).toLocaleDateString("id-ID", { day: "numeric", month: "short" }))
    : TREND_LABELS;

  // Titik grafik Perjalanan Skor (dinamis dari data nyata).
  const tMin = Math.min(...trendScores), tMax = Math.max(...trendScores);
  const tRange = tMax - tMin || 1;
  const trendPts = trendScores.map((s, i) => ({
    x: trendScores.length === 1 ? 160 : 30 + (i / (trendScores.length - 1)) * 260,
    y: 130 - ((s - tMin) / tRange) * 100,
    s, label: trendLabels[i] ?? "",
  }));
  const trendPoly = trendPts.map((p) => `${p.x.toFixed(0)},${p.y.toFixed(0)}`).join(" ");
  const trendNaik = trendScores.length > 1 ? trendScores[trendScores.length - 1] - trendScores[0] : 0;

  return (
    <>
      <PortalTopbar eyebrow={t(locale, "dash.welcome")} title={`${nama} 👋`} subtitle={t(locale, "dash.subtitle")} nama={nama} />

      <div className="space-y-5 p-5 lg:p-7">
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
          {/* ===== KOLOM KIRI ===== */}
          <div className="space-y-5">
            {/* HERO TARGET */}
            <div className="overflow-hidden rounded-2xl border">
              <div className="relative grad-photo p-6 text-white">
                <div className="blob pointer-events-none absolute -right-10 -top-10 h-64 w-64" />
                <div className="relative flex flex-wrap items-start justify-between gap-6">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 text-eyebrow text-white/80"><Target size={14} /> TARGET {seg.targetNoun.toUpperCase()} IMPIAN</div>
                    <div className="mt-3 text-[3rem] font-extrabold leading-none">{abbrev(kampusFull)}</div>
                    <div className="mt-2 text-body-lg font-semibold">{kampusFull}</div>
                    <div className="text-body-sm text-white/80">{prodi}</div>
                    <Link href="/app/target" className="mt-4 inline-flex h-10 items-center gap-2 rounded-lg bg-white/15 px-4 text-body-sm font-semibold text-white backdrop-blur transition-colors hover:bg-white/25">
                      Lihat Detail Target <ArrowRight size={15} />
                    </Link>
                  </div>
                  <div className="shrink-0 text-center">
                    <Ring value={62} size={132} stroke={11} color="#FFFFFF" track="rgba(255,255,255,0.25)">
                      <span className="text-eyebrow text-white/80">PELUANG LOLOS</span>
                      <span className="text-[1.75rem] font-extrabold leading-none">62%</span>
                      <span className="text-caption text-white/90">Cukup Tinggi</span>
                    </Ring>
                  </div>
                </div>
              </div>
              {/* STATS STRIP */}
              <div className="grid gap-4 bg-white p-5 sm:grid-cols-2 lg:grid-cols-4 lg:divide-x">
                <Link href="/app/intelligence" className="group">
                  <div className="text-caption text-ink-muted">Skor Terbaru</div>
                  <div className="text-stat leading-none text-ink transition-colors group-hover:text-brand">{skorTerbaru}<span className="text-body-sm font-normal text-ink-muted"> /{skorMax}</span></div>
                  <div className="text-caption text-ink-muted">Persentil 93.4</div>
                </Link>
                <Link href="/app/target" className="group lg:pl-4">
                  <div className="text-caption text-ink-muted">Gap ke Target</div>
                  <div className="text-stat leading-none text-ink transition-colors group-hover:text-brand">{gap}<span className="text-body-sm font-normal text-ink-muted"> poin</span></div>
                  <div className="text-caption text-ink-muted">dari target {targetSkor}</div>
                </Link>
                <Link href="/app/target" className="group lg:pl-4">
                  <div className="text-caption text-ink-muted">Target Skor</div>
                  <div className="text-stat leading-none text-ink transition-colors group-hover:text-brand">{targetSkor}<span className="text-body-sm font-normal text-ink-muted"> /{skorMax}</span></div>
                  <div className="text-caption text-ink-muted">Estimasi aman</div>
                </Link>
                <Link href="/app/intelligence" className="group lg:pl-4">
                  <div className="text-caption text-ink-muted">Trend Skor</div>
                  <svg viewBox="0 0 120 40" className="mt-1 h-9 w-full">
                    <polyline points="4,32 28,28 52,22 76,16 112,6" fill="none" stroke="#2F5BFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    {[[4,32],[28,28],[52,22],[76,16],[112,6]].map(([x,y]) => <circle key={x} cx={x} cy={y} r="2.5" fill="#2F5BFF" />)}
                  </svg>
                  <div className="flex items-center gap-1 text-caption font-semibold text-success-strong"><TrendingUp size={12} /> 41 poin <span className="font-normal text-ink-muted">vs 1 bulan lalu</span></div>
                </Link>
              </div>
            </div>

            {/* MISI + PERJALANAN */}
            <div className="grid gap-5 lg:grid-cols-2">
              <div className="rounded-2xl border bg-white p-5">
                <SectionHead title="Misi Hari Ini" sub="Selesaikan misi harian untuk menjaga momentum belajarmu." />
                <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
                  <div className="space-y-2.5">
                    {MISI.map((m) => (
                      <Link key={m.t} href={m.href} className="flex items-center gap-3 rounded-xl border p-3 transition-colors hover:border-brand/40 hover:bg-muted">
                        {m.done ? <CheckCircle2 size={20} className="shrink-0 text-success" /> : <Circle size={20} className="shrink-0 text-ink-muted" />}
                        <div className="min-w-0 flex-1"><div className="text-body-sm font-bold text-ink">{m.t}</div><div className="text-caption text-ink-muted">{m.d}</div></div>
                        <span className={cn("shrink-0 rounded-md px-2 py-0.5 text-[11px] font-semibold", m.done ? "bg-success-subtle text-success-strong" : "bg-muted text-ink-muted")}>{m.badge}</span>
                      </Link>
                    ))}
                  </div>
                  <div className="flex flex-col items-center justify-center gap-2 sm:w-40">
                    <div className="text-caption text-ink-muted">Progress Hari Ini</div>
                    <Ring value={67} size={104} stroke={9}><span className="text-h-md text-ink">67%</span></Ring>
                    <div className="text-caption font-medium text-success-strong">Konsisten bagus!</div>
                    <Link href="/app/learning" className="mt-1 w-full rounded-lg bg-brand py-2 text-center text-body-sm font-semibold text-white transition-colors hover:bg-brand-600">Lanjutkan Misi</Link>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border bg-white p-5">
                <SectionHead title="Perjalanan Skor" sub="Perkembangan skor dari waktu ke waktu." action="Lihat detail" href="/app/intelligence" />
                <svg viewBox="0 0 320 150" className="w-full">
                  {trendPts.length > 1 ? <polyline points={trendPoly} fill="none" stroke="#2F5BFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /> : null}
                  {trendPts.map((p, i) => {
                    const last = i === trendPts.length - 1;
                    return (
                      <g key={i}>
                        {last ? <rect x={p.x - 22} y={p.y - 23} width="44" height="22" rx="6" fill="#2F5BFF" /> : <circle cx={p.x} cy={p.y} r="4" fill="#2F5BFF" />}
                        <text x={p.x} y={last ? p.y - 8 : p.y - 10} textAnchor="middle" className={cn("text-[11px] font-bold", last ? "fill-white" : "fill-ink")}>{p.s}</text>
                        <text x={p.x} y="144" textAnchor="middle" className="fill-current text-[9px] text-ink-muted">{p.label}</text>
                      </g>
                    );
                  })}
                </svg>
                <div className="mt-2 rounded-lg px-3 py-2 text-center text-caption font-medium" style={{ backgroundColor: trendNaik >= 0 ? "var(--success-100)" : "#FDECEC", color: trendNaik >= 0 ? "var(--success-700)" : "#C13030" }}>
                  {trendNaik > 0 ? `+ Tren positif! Naik ${trendNaik} poin 🚀` : trendNaik < 0 ? `Skor turun ${Math.abs(trendNaik)} poin — ayo bangkit!` : "Mulai try out untuk melihat perkembangan skormu."}
                </div>
              </div>
            </div>

            {/* PETA KELEMAHAN + REKOMENDASI */}
            <div className="grid gap-5 lg:grid-cols-2">
              <div className="rounded-2xl border bg-white p-5">
                <SectionHead title="Peta Kelemahan" sub="Fokus pada topik lemah untuk peningkatan maksimal." action="Lihat semua topik" href="/app/intelligence" />
                <div className="grid grid-cols-2 gap-3">
                  {kelemahan.map((k) => {
                    const Icon = k.icon;
                    return (
                      <Link key={k.label} href="/app/intelligence" className="rounded-xl border p-3 transition-colors hover:border-brand/40 hover:bg-muted">
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ backgroundColor: k.sb, color: k.sc }}><Icon size={16} /></span>
                        <div className="mt-2 text-body-sm font-semibold text-ink">{k.label}</div>
                        <div className="text-stat leading-none text-ink">{k.val}<span className="text-body-sm font-normal text-ink-muted">%</span></div>
                        <div className="mt-2 h-1.5 rounded-full bg-hair"><div className="h-full rounded-full" style={{ width: `${k.val}%`, backgroundColor: k.color }} /></div>
                        <span className="mt-2 inline-flex rounded-md px-2 py-0.5 text-[11px] font-semibold" style={{ backgroundColor: k.sb, color: k.sc }}>{k.status}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-2xl border bg-white p-5">
                <SectionHead title="Rekomendasi Untukmu" sub="Berdasarkan performa dan targetmu saat ini." action="Lihat semua" href="/app/learning" />
                <div className="space-y-2.5">
                  {REKOM.map((r) => {
                    const Icon = r.icon;
                    return (
                      <div key={r.t} className="flex items-center gap-3 rounded-xl border p-3">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-100 text-brand"><Icon size={18} /></span>
                        <div className="min-w-0 flex-1 text-body-sm font-medium text-ink">{r.t}</div>
                        <Link href={r.href} className="shrink-0 rounded-lg border px-3.5 py-1.5 text-body-sm font-semibold text-brand transition-colors hover:bg-brand-100">Mulai</Link>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* ===== KOLOM KANAN ===== */}
          <div className="space-y-5">
            {/* ACADEMIC NAVIGATOR */}
            <div className="rounded-2xl border bg-white p-5">
              <SectionHead title="Academic Navigator" action="Lihat semua" href="/app/navigator" />
              <div className="text-label text-ink">Prioritas Minggu Ini</div>
              <p className="mt-0.5 text-caption text-ink-muted">Fokus pada area ini untuk dampak skor paling signifikan.</p>
              <div className="mt-3 space-y-2.5">
                {NAVIGATOR.map((p) => {
                  const Icon = p.icon;
                  return (
                    <Link key={p.n} href="/app/navigator" className="flex items-center gap-3 rounded-xl border p-2.5 transition-colors hover:border-brand/40 hover:bg-muted">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-caption font-bold text-ink-body">{p.n}</span>
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg" style={{ backgroundColor: p.sb, color: p.sc }}><Icon size={16} /></span>
                      <div className="min-w-0 flex-1"><div className="text-body-sm font-semibold text-ink">{p.label}</div><div className="mt-1 h-1.5 rounded-full bg-hair"><div className="h-full rounded-full" style={{ width: "70%", backgroundColor: p.sc }} /></div></div>
                      <div className="shrink-0 text-right"><span className="rounded-md px-1.5 py-0.5 text-[10px] font-semibold" style={{ backgroundColor: p.sb, color: p.sc }}>{p.status}</span><div className="text-caption font-bold text-success-strong">{p.poin} poin</div></div>
                    </Link>
                  );
                })}
              </div>
              <div className="mt-4 flex items-center justify-between border-t pt-3">
                <span className="text-body-sm font-medium text-ink-body">Estimasi Dampak Mingguan</span>
                <span className="flex items-center gap-1 text-body-sm font-bold text-success-strong"><TrendingUp size={14} /> +27 – 35 poin</span>
              </div>
            </div>

            {/* JADWAL TERDEKAT */}
            <div className="rounded-2xl border bg-white p-5">
              <SectionHead title="Jadwal Terdekat" action="Lihat kalender" href="/app/journey" />
              <div className="space-y-2.5">
                {JADWAL.map((j) => {
                  const Icon = j.icon;
                  return (
                    <Link key={j.t} href={j.href} className="flex items-center gap-3 rounded-xl border p-2.5 transition-colors hover:border-brand/40 hover:bg-muted">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg" style={{ backgroundColor: j.bb, color: j.bc }}><Icon size={17} /></span>
                      <div className="min-w-0 flex-1"><div className="truncate text-body-sm font-semibold text-ink">{j.t}</div><div className="text-caption text-ink-muted">{j.when}</div></div>
                      <span className="shrink-0 rounded-md px-2 py-0.5 text-[10px] font-semibold" style={{ backgroundColor: j.bb, color: j.bc }}>{j.badge}</span>
                    </Link>
                  );
                })}
              </div>
              <Link href="/app/journey" className="mt-3 flex items-center justify-center gap-1.5 rounded-lg bg-muted py-2 text-body-sm font-semibold text-ink transition-colors hover:bg-hair">Lihat semua jadwal <ArrowRight size={14} /></Link>
            </div>

            {/* NOTIFIKASI */}
            <div className="rounded-2xl border bg-white p-5">
              <SectionHead title="Notifikasi" action="Lihat semua" href="/app/notifikasi" />
              <div className="space-y-3">
                {NOTIF.map((n) => {
                  const Icon = n.icon;
                  return (
                    <Link key={n.t} href="/app/notifikasi" className="flex items-start gap-3 rounded-lg p-1 transition-colors hover:bg-muted">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full" style={{ backgroundColor: `${n.color}1A`, color: n.color }}><Icon size={16} /></span>
                      <div className="min-w-0 flex-1"><div className="text-body-sm font-medium leading-snug text-ink">{n.t}</div><div className="mt-0.5 text-caption text-ink-muted">{n.time}</div></div>
                      {n.unread ? <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-brand" /> : null}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* VALUE PROPS */}
        <div className="grid gap-px overflow-hidden rounded-2xl border bg-hair sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((v) => {
            const Icon = v.icon;
            return (
              <div key={v.t} className="flex items-start gap-3 bg-white p-5">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand"><Icon size={20} /></span>
                <div><div className="text-body-sm font-bold text-ink">{v.t}</div><p className="mt-0.5 text-caption text-ink-muted">{v.d}</p></div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
