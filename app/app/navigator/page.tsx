import Link from "next/link";
import {
  Compass, TrendingUp, BookOpen, Brain, Sigma, ArrowRight, Target, Zap, Clock,
} from "lucide-react";
import { getPortalProfile } from "@/lib/portal/session";
import { PortalTopbar } from "@/components/portal/topbar";
import { AiRecommendationsButton } from "@/components/portal/ai-panel";

export const metadata = { title: "Academic Navigator — Albirru" };

const PRIORITAS = [
  { n: 1, icon: BookOpen, label: "Literasi Indonesia", status: "Prioritas Tinggi", poin: "+27", sb: "#FDECEC", sc: "#C13030", href: "/app/intelligence/weakness-mapping" },
  { n: 2, icon: Brain, label: "Penalaran Umum", status: "Sedang", poin: "+19", sb: "#FFF1DC", sc: "#B7791F", href: "/app/intelligence/topic-mastery" },
  { n: 3, icon: Sigma, label: "Penalaran Matematika", status: "Sedang", poin: "+16", sb: "#FFF1DC", sc: "#B7791F", href: "/app/intelligence/smart-revision" },
];

const RENCANA = [
  { hari: "Senin", fokus: "Literasi Indonesia — Ide Pokok", durasi: "45 mnt", icon: BookOpen },
  { hari: "Selasa", fokus: "Penalaran Umum — Silogisme", durasi: "40 mnt", icon: Brain },
  { hari: "Rabu", fokus: "Matematika — Aljabar Dasar", durasi: "50 mnt", icon: Sigma },
  { hari: "Kamis", fokus: "Mini Try Out TPS", durasi: "30 mnt", icon: Target },
  { hari: "Jumat", fokus: "Review soal salah", durasi: "35 mnt", icon: Zap },
];

export default async function NavigatorPage() {
  const { profile } = await getPortalProfile();

  return (
    <>
      <PortalTopbar title="Academic Navigator" subtitle="Panduan personal menuju target kampusmu." nama={profile?.nama ?? "Farhan"} />

      <div className="space-y-5 p-5 lg:p-7">
        {/* HERO */}
        <div className="flex flex-col items-start gap-4 rounded-2xl border bg-white p-6 sm:flex-row sm:items-center">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-brand-100 text-brand"><Compass size={26} /></span>
          <div className="flex-1">
            <h2 className="text-h-sm text-ink">Fokus Minggu Ini</h2>
            <p className="text-body-sm text-ink-body">Selesaikan 3 area prioritas untuk dampak skor paling signifikan.</p>
          </div>
          <div className="flex items-center gap-2 rounded-xl bg-success-subtle px-4 py-2 text-success-strong"><TrendingUp size={18} /><div><div className="text-caption">Estimasi Dampak</div><div className="text-body-lg font-extrabold">+27 – 35 poin</div></div></div>
        </div>

        {/* REKOMENDASI AI */}
        <div className="rounded-2xl border bg-white p-5">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-h-sm text-ink">Rekomendasi Cerdas</h3>
              <p className="text-body-sm text-ink-muted">Prioritas, rencana mingguan & misi dari data performamu — diperbarui sesuai try out terbaru.</p>
            </div>
          </div>
          <div className="mt-4"><AiRecommendationsButton /></div>
        </div>

        {/* SUB-NAV */}
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { t: "Rencana Fokus", d: "Langkah konkret per area lemah", href: "/app/navigator/focus-plan" },
            { t: "Analisis Kesenjangan", d: "Selisih menuju target per subtes", href: "/app/navigator/gap-analysis" },
          ].map((a) => (
            <Link key={a.t} href={a.href} className="flex items-center gap-3 rounded-2xl border bg-white p-4 transition-shadow hover:shadow-sm">
              <div className="min-w-0 flex-1"><div className="text-body-sm font-bold text-ink">{a.t}</div><div className="text-caption text-ink-muted">{a.d}</div></div>
              <ArrowRight size={16} className="shrink-0 text-brand" />
            </Link>
          ))}
        </div>

        {/* PRIORITAS */}
        <div className="rounded-2xl border bg-white p-5">
          <h3 className="text-h-sm text-ink">Prioritas Minggu Ini</h3>
          <div className="mt-4 space-y-3">
            {PRIORITAS.map((p) => {
              const Icon = p.icon;
              return (
                <Link key={p.n} href={p.href} className="flex items-center gap-3 rounded-xl border p-3 transition-colors hover:border-brand/40 hover:bg-muted">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-caption font-bold text-ink-body">{p.n}</span>
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg" style={{ backgroundColor: p.sb, color: p.sc }}><Icon size={18} /></span>
                  <div className="min-w-0 flex-1">
                    <div className="text-body-sm font-bold text-ink">{p.label}</div>
                    <span className="mt-1 inline-flex rounded-md px-2 py-0.5 text-[11px] font-semibold" style={{ backgroundColor: p.sb, color: p.sc }}>{p.status}</span>
                  </div>
                  <div className="shrink-0 text-right"><div className="text-body-sm font-bold text-success-strong">{p.poin} poin</div><ArrowRight size={15} className="ml-auto text-ink-muted" /></div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* RENCANA MINGGUAN */}
        <div className="rounded-2xl border bg-white p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-h-sm text-ink">Rencana Belajar Mingguan</h3>
            <Link href="/app/journey" className="inline-flex items-center gap-1 text-body-sm font-semibold text-brand hover:underline">Lihat kalender <ArrowRight size={13} /></Link>
          </div>
          <div className="mt-4 space-y-2.5">
            {RENCANA.map((r) => {
              const Icon = r.icon;
              return (
                <div key={r.hari} className="flex items-center gap-3 rounded-xl border p-3">
                  <span className="w-14 shrink-0 text-body-sm font-bold text-ink">{r.hari}</span>
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-100 text-brand"><Icon size={17} /></span>
                  <div className="min-w-0 flex-1 text-body-sm font-medium text-ink">{r.fokus}</div>
                  <span className="flex shrink-0 items-center gap-1 text-caption text-ink-muted"><Clock size={13} /> {r.durasi}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
