import {
  Info, CalendarCheck, ClipboardList, Clock, ArrowRight, Play, BookOpen, Target, Brain,
  ListChecks, Map, BarChart3, Sparkles,
} from "lucide-react";
import Link from "next/link";
import { getPortalProfile } from "@/lib/portal/session";
import { PortalTopbar } from "@/components/portal/topbar";
import { Ring } from "@/components/portal/ring";
import { cn } from "@/lib/utils";

export const metadata = { title: "Smart Revision — Albirru" };

const PLAN = [
  { icon: BookOpen, color: "#E5484D", bg: "#FDECEC", title: "Inferensi", desc: "Fokus pada makna tersirat dan kesimpulan teks.", soal: 20, durasi: "35 menit", progress: 40 },
  { icon: Target, color: "#E8910B", bg: "#FFF1DC", title: "Ide Pokok", desc: "Latihan menentukan gagasan utama paragraf.", soal: 15, durasi: "25 menit", progress: 0 },
  { icon: Brain, color: "#6D49C9", bg: "#F2EBFF", title: "Aljabar", desc: "Perbaiki kesalahan tanda pada operasi aljabar.", soal: 18, durasi: "30 menit", progress: 70 },
  { icon: ListChecks, color: "#2F5BFF", bg: "#EAF0FF", title: "Bacaan Panjang", desc: "Latihan ketahanan membaca teks kompleks.", soal: 25, durasi: "40 menit", progress: 0 },
];

const SCHEDULE = [
  { day: "Sen", topik: "Inferensi", done: true },
  { day: "Sel", topik: "Ide Pokok", done: true },
  { day: "Rab", topik: "Aljabar", done: false, today: true },
  { day: "Kam", topik: "Bacaan Panjang", done: false },
  { day: "Jum", topik: "Logika", done: false },
  { day: "Sab", topik: "Review Mingguan", done: false },
  { day: "Min", topik: "Istirahat", done: false, rest: true },
];

const QUEUE = [
  { title: "Inferensi", reason: "Akurasi 48% — peluang peningkatan tercepat", soal: 20, durasi: "35 menit", color: "#E5484D" },
  { title: "Bacaan Panjang", reason: "Skor 580 — perlu ditingkatkan", soal: 25, durasi: "40 menit", color: "#E8910B" },
  { title: "Ide Pokok", reason: "Mendukung perbaikan Literasi Indonesia", soal: 15, durasi: "25 menit", color: "#2F5BFF" },
  { title: "Aljabar", reason: "Kesalahan konsep berulang ≥ 3x", soal: 18, durasi: "30 menit", color: "#6D49C9" },
];

const ACTIONS = [
  { icon: Map, color: "#2F5BFF", bg: "#EAF0FF", title: "Lihat Weakness Mapping", desc: "Lihat area yang mendasari rekomendasi revisi ini.", href: "/app/intelligence/weakness-mapping" },
  { icon: BarChart3, color: "#E8910B", bg: "#FFF1DC", title: "Mistake Analysis", desc: "Pahami akar kesalahan sebelum memulai revisi.", href: "/app/intelligence/mistake-analysis" },
  { icon: Sparkles, color: "#16B47A", bg: "#E9F9F1", title: "Topic Mastery", desc: "Pantau peningkatan penguasaan setelah revisi.", href: "/app/intelligence/topic-mastery" },
];

function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("rounded-2xl border bg-white p-5", className)}>{children}</div>;
}
function Head({ title }: { title: string }) {
  return (
    <div className="mb-3 flex items-center gap-1.5">
      <h2 className="text-h-sm text-ink">{title}</h2>
      <Info size={14} className="text-ink-muted" />
    </div>
  );
}

export default async function Page() {
  const { profile } = await getPortalProfile();
  const nama = profile?.nama ?? "Farhan";

  return (
    <>
      <PortalTopbar
        eyebrow="Academic Intelligence  ›  Smart Revision"
        title="Smart Revision"
        subtitle="Rencana revisi personal berdasarkan datamu."
        nama={nama}
      />

      <div className="space-y-5 p-5 lg:p-7">
        {/* ROW 1 */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <Head title="Revisi Terjadwal" />
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF0FF] text-brand"><CalendarCheck size={18} /></span>
            <div className="mt-2 text-[2rem] font-extrabold leading-none text-ink">5 <span className="text-body-sm font-normal text-ink-muted">sesi</span></div>
            <div className="mt-1 text-caption text-ink-muted">Minggu ini</div>
          </Card>
          <Card>
            <Head title="Soal Direkomendasikan" />
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E9F9F1] text-[#16B47A]"><ClipboardList size={18} /></span>
            <div className="mt-2 text-[2rem] font-extrabold leading-none text-ink">146 <span className="text-body-sm font-normal text-ink-muted">soal</span></div>
            <div className="mt-1 text-caption text-ink-muted">Disusun otomatis dari area lemahmu</div>
          </Card>
          <Card>
            <Head title="Estimasi Waktu" />
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF1DC] text-[#E8910B]"><Clock size={18} /></span>
            <div className="mt-2 text-[2rem] font-extrabold leading-none text-ink">4j 30m</div>
            <div className="mt-1 text-caption text-ink-muted">Total durasi revisi minggu ini</div>
          </Card>
          <Card>
            <Head title="Progres Revisi Minggu Ini" />
            <div className="flex items-center gap-4">
              <Ring value={65} size={84} stroke={9} color="#2F5BFF">
                <span className="text-[1.4rem] font-extrabold leading-none text-ink">65%</span>
              </Ring>
              <div>
                <div className="text-body-sm font-bold text-ink">2 dari 5 sesi selesai</div>
                <div className="mt-1 text-caption text-ink-muted">Lanjutkan untuk capai target mingguan</div>
              </div>
            </div>
          </Card>
        </div>

        {/* ROW 2 — Rencana Revisi + Jadwal */}
        <div className="grid gap-5 lg:grid-cols-[1.6fr_1fr]">
          <Card>
            <Head title="Rencana Revisi Hari Ini" />
            <div className="space-y-3">
              {PLAN.map((p) => {
                const Icon = p.icon;
                return (
                  <div key={p.title} className="flex items-center gap-3 rounded-xl border p-3">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl" style={{ backgroundColor: p.bg, color: p.color }}><Icon size={18} /></span>
                    <div className="min-w-0 flex-1">
                      <div className="text-body-sm font-bold text-ink">{p.title}</div>
                      <div className="text-caption text-ink-muted">{p.desc}</div>
                      <div className="mt-1.5 flex items-center gap-3 text-caption text-ink-muted">
                        <span>{p.soal} Soal</span><span>{p.durasi}</span>
                      </div>
                      {p.progress > 0 ? (
                        <div className="mt-1.5 h-1.5 rounded-full bg-hair"><div className="h-full rounded-full" style={{ width: `${p.progress}%`, backgroundColor: p.color }} /></div>
                      ) : null}
                    </div>
                    <Link href="/app/try-out" className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-lg bg-brand px-3 text-caption font-semibold text-white transition-colors hover:bg-brand-600">
                      <Play size={13} /> {p.progress > 0 ? "Lanjutkan" : "Mulai"}
                    </Link>
                  </div>
                );
              })}
            </div>
          </Card>

          <Card>
            <Head title="Jadwal Mingguan" />
            <div className="space-y-2">
              {SCHEDULE.map((s) => (
                <div key={s.day} className={cn("flex items-center gap-3 rounded-lg px-3 py-2.5", s.today ? "border border-brand bg-brand-100" : "bg-muted")}>
                  <span className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-caption font-bold", s.done ? "bg-[#16B47A] text-white" : s.today ? "bg-brand text-white" : "bg-white text-ink-muted")}>
                    {s.day}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className={cn("truncate text-body-sm font-semibold", s.rest ? "text-ink-muted" : "text-ink")}>{s.topik}</div>
                  </div>
                  {s.done ? <span className="text-caption font-semibold text-[#16B47A]">Selesai</span> : s.today ? <span className="text-caption font-semibold text-brand">Hari ini</span> : null}
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* ROW 3 — Adaptive Practice Queue */}
        <Card>
          <Head title="Adaptive Practice Queue" />
          <p className="-mt-2 mb-3 text-caption text-ink-muted">Urutan latihan disesuaikan otomatis berdasarkan dampaknya ke skor targetmu.</p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {QUEUE.map((q, i) => (
              <div key={q.title} className="rounded-xl border p-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-extrabold text-white" style={{ backgroundColor: q.color }}>{i + 1}</span>
                  <span className="text-body-sm font-bold text-ink">{q.title}</span>
                </div>
                <p className="mt-1.5 text-caption text-ink-muted">{q.reason}</p>
                <div className="mt-2 flex items-center gap-3 text-caption text-ink-muted">
                  <span>{q.soal} Soal</span><span>{q.durasi}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* ROW 4 — Actions */}
        <div>
          <h2 className="mb-3 text-h-sm text-ink">Lanjutkan dari Sini</h2>
          <div className="grid gap-4 sm:grid-cols-3">
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
