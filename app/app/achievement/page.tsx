import {
  Star, Trophy, Target, Flame, Zap, BookOpen, Calendar, Gem, Check, ArrowRight,
  Sparkles, Quote, CheckCircle2, ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { getPortalProfile } from "@/lib/portal/session";
import { PortalTopbar } from "@/components/portal/topbar";
import { cn } from "@/lib/utils";

const SUMMARY = [
  { icon: Trophy, color: "#E8910B", value: "28", label: "Achievement Diraih", delta: "↑ 5 dari minggu lalu" },
  { icon: Target, color: "#2F5BFF", value: "142", label: "Misi Selesai", delta: "↑ 18 dari minggu lalu" },
  { icon: Flame, color: "#16B47A", value: "41", label: "Streak Terbaik", delta: "41 hari" },
  { icon: Star, color: "#2F5BFF", value: "7.850", label: "Total XP", delta: "↑ 1.250 dari minggu lalu" },
];
const RECENT: { n?: string; icon?: typeof Star; color: string; title: string; desc: string; xp: string; time: string }[] = [
  { n: "50", color: "#6D49C9", title: "Problem Solver 50", desc: "Menyelesaikan 50 soal dengan akurasi minimal 70%", xp: "+150 XP", time: "2 jam lalu" },
  { icon: CheckCircle2, color: "#16B47A", title: "Misi Harian Konsisten", desc: "Menyelesaikan misi harian 7 hari berturut-turut", xp: "+100 XP", time: "5 jam lalu" },
  { icon: Calendar, color: "#2F5BFF", title: "Try Out Warrior", desc: "Mengikuti 5 try out dalam 1 minggu", xp: "+200 XP", time: "1 hari lalu" },
  { icon: BookOpen, color: "#E8910B", title: "Topik Master", desc: "Menguasai 10 topik dengan level Baik atau lebih tinggi", xp: "+250 XP", time: "2 hari lalu" },
  { icon: Zap, color: "#6D49C9", title: "Speed Learner", desc: "Menyelesaikan try out dengan waktu di bawah rata-rata", xp: "+150 XP", time: "3 hari lalu" },
];
const BADGES = [
  { icon: Star, grad: "from-[#6D49C9] to-[#3B1E78]", name: "Academic Achiever", sub: "Level 12" },
  { icon: Target, grad: "from-[#16B47A] to-[#0B7A4F]", name: "Consistent Learner", sub: "41 Hari" },
  { icon: Trophy, grad: "from-[#2F5BFF] to-[#1B3FB0]", name: "Try Out Master", sub: "25 Try Out" },
  { icon: BookOpen, grad: "from-[#E8910B] to-[#B96A00]", name: "Topic Explorer", sub: "120 Topik" },
  { icon: Gem, grad: "from-[#9B5DE5] to-[#6D49C9]", name: "Perfectionist", sub: "Akurasi 85%+" },
];
const TIPS = [
  ["Selesaikan misi harian", "+100 XP"], ["Ikuti lebih banyak try out", "+200 XP"],
  ["Tingkatkan akurasi jawaban", "+150 XP"], ["Kuasai lebih banyak topik", "+250 XP"],
];
const DAYS = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];

function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("rounded-2xl border bg-white p-5", className)}>{children}</div>;
}
function Head({ title, action }: { title: string; action?: string }) {
  return <div className="mb-4 flex items-center justify-between"><h2 className="text-h-sm text-ink">{title}</h2>{action ? <span className="inline-flex items-center gap-1 text-body-sm font-semibold text-brand">{action} <ArrowRight size={13} /></span> : null}</div>;
}

export default async function AchievementPage() {
  const { profile } = await getPortalProfile();
  const nama = profile?.nama ?? "Farhan";

  return (
    <>
      <PortalTopbar title="Achievement" subtitle="Perjalananmu, pencapaianmu, motivasimu." nama={nama} />

      <div className="space-y-5 p-5 lg:p-7">
        {/* ROW 1 */}
        <div className="grid gap-5 lg:grid-cols-2">
          <Card>
            <div className="flex items-center gap-5">
              <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2F5BFF] to-[#0B1A47] text-[#FFD54A] shadow-md"><Star size={44} className="fill-current" /></div>
              <div className="flex-1">
                <div className="text-caption text-ink-muted">Level Saat Ini</div>
                <div className="text-[2rem] font-extrabold leading-none text-ink">Level 12</div>
                <div className="text-body-sm font-semibold text-brand">Academic Achiever</div>
                <div className="mt-3 flex items-center gap-2">
                  <div className="h-2 flex-1 rounded-full bg-hair"><div className="h-full w-[82%] rounded-full bg-brand" /></div>
                  <span className="text-caption font-semibold text-ink-muted">2.460 / 3.000 XP</span>
                </div>
              </div>
            </div>
            <div className="mt-5 rounded-xl border p-4">
              <div className="text-body-sm font-semibold text-ink">Terus tingkatkan XP untuk naik ke Level berikutnya!</div>
              <div className="mt-3 flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand text-white"><Gem size={16} /></span>
                <span className="flex-1 text-body-sm font-medium text-ink">Level 13 (Expert Learner)</span>
                <span className="text-body-sm font-bold text-ink-muted">3.000 XP</span>
              </div>
            </div>
          </Card>

          <Card>
            <Head title="Ringkasan Pencapaian" action="Semua Waktu" />
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {SUMMARY.map((s) => {
                const Icon = s.icon;
                return (
                  <div key={s.label} className="text-center">
                    <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full" style={{ backgroundColor: `${s.color}1A`, color: s.color }}><Icon size={22} /></span>
                    <div className="mt-2 text-[1.5rem] font-extrabold leading-none text-ink">{s.value}</div>
                    <div className="text-[11px] leading-tight text-ink-muted">{s.label}</div>
                    <div className="mt-1 text-[10px] font-semibold text-[#16B47A]">{s.delta}</div>
                  </div>
                );
              })}
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-4 rounded-xl bg-muted p-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FFE3C2] text-[#E8910B]"><Flame size={20} className="fill-current" /></span>
              <div className="flex-1"><div className="text-body-sm font-bold text-ink">41 Streak Aktif</div><div className="text-caption text-ink-muted">Kamu konsisten belajar luar biasa!</div></div>
              <div className="flex gap-2">
                {DAYS.map((d, i) => (
                  <div key={d} className="text-center">
                    <div className="text-[10px] text-ink-muted">{d}</div>
                    <span className={cn("mt-1 flex h-7 w-7 items-center justify-center rounded-full", i < 6 ? "bg-[#E8910B] text-white" : "bg-hair text-ink-muted")}><Check size={14} /></span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* ROW 2 */}
        <div className="grid gap-5 lg:grid-cols-2">
          <Card>
            <Head title="Pencapaian Terbaru" action="Lihat Semua" />
            <div className="space-y-3">
              {RECENT.map((r) => {
                const Icon = r.icon;
                return (
                  <div key={r.title} className="flex items-center gap-3">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white" style={{ backgroundColor: r.color }}>{r.n ? <span className="text-body-sm font-extrabold">{r.n}</span> : Icon ? <Icon size={20} /> : null}</span>
                    <div className="min-w-0 flex-1"><div className="text-body-sm font-bold text-ink">{r.title}</div><div className="text-caption text-ink-muted">{r.desc}</div></div>
                    <div className="flex shrink-0 flex-col items-end gap-1"><span className="rounded-md bg-brand-100 px-2 py-0.5 text-[11px] font-bold text-brand">{r.xp}</span><span className="text-[10px] text-ink-muted">{r.time}</span></div>
                  </div>
                );
              })}
            </div>
            <Link href="/app/journey" className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-lg bg-muted py-2.5 text-body-sm font-semibold text-ink transition-colors hover:bg-hair">Lihat Semua Pencapaian <ArrowRight size={14} /></Link>
          </Card>

          <div className="flex flex-col gap-5">
            <Card>
              <Head title="Badge Collection" action="Lihat Semua" />
              <div className="grid grid-cols-3 gap-4 sm:grid-cols-5">
                {BADGES.map((b) => {
                  const Icon = b.icon;
                  return (
                    <div key={b.name} className="text-center">
                      <span className={cn("mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-sm", b.grad)}><Icon size={24} /></span>
                      <div className="mt-2 text-[11px] font-bold leading-tight text-ink">{b.name}</div>
                      <div className="text-[10px] text-ink-muted">{b.sub}</div>
                    </div>
                  );
                })}
              </div>
            </Card>

            <Card>
              <Head title="Progres Menuju Level Berikutnya" />
              <div className="flex items-center gap-4">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#6D49C9] to-[#3B1E78] text-body-lg font-extrabold text-white">13</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between"><span className="text-body-sm font-bold text-ink">Level 13 · Expert Learner</span><span className="text-caption font-semibold text-ink-muted">3.000 XP</span></div>
                  <div className="mt-2 h-2 rounded-full bg-hair"><div className="h-full w-[82%] rounded-full bg-gradient-to-r from-[#6D49C9] to-[#9B5DE5]" /></div>
                  <div className="mt-1 text-caption text-ink-muted">540 XP lagi untuk Level 13</div>
                </div>
              </div>
              <div className="mt-4 rounded-xl bg-muted p-4">
                <div className="text-caption font-semibold text-ink">Tips untuk naik level lebih cepat</div>
                <div className="mt-2 space-y-2">
                  {TIPS.map((t) => (
                    <div key={t[0]} className="flex items-center justify-between text-body-sm"><span className="flex items-center gap-2 text-ink-body"><Sparkles size={14} className="text-brand" /> {t[0]}</span><span className="font-semibold text-[#16B47A]">{t[1]}</span></div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* MOTIVATION */}
        <div className="grid items-center gap-5 rounded-2xl bg-brand-100 p-6 md:grid-cols-[1.4fr_1fr]">
          <div className="flex items-center gap-4">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white text-[#E8910B] shadow-sm"><Trophy size={28} /></span>
            <div>
              <div className="text-h-sm text-ink">Kamu Hebat! 🎉</div>
              <p className="mt-1 text-body-sm text-ink-body">Setiap langkah kecil membawamu lebih dekat ke tujuan besar. Pertahankan konsistensimu dan raih pencapaian luar biasa!</p>
            </div>
          </div>
          <div className="md:text-right">
            <Quote className="text-brand-300 md:ml-auto" size={26} />
            <p className="mt-2 text-body-lg font-semibold italic text-ink">Disiplin hari ini adalah pencapaian esok hari.</p>
            <p className="mt-1 text-caption text-ink-muted">— Albirru Team</p>
          </div>
        </div>
      </div>
    </>
  );
}
