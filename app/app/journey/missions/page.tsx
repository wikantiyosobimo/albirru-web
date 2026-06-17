import Link from "next/link";
import { ArrowLeft, CheckCircle2, Circle, Flame, Star, Zap } from "lucide-react";
import { getPortalProfile } from "@/lib/portal/session";
import { PortalTopbar } from "@/components/portal/topbar";
import { Ring } from "@/components/portal/ring";
import { AiMissionsButton } from "@/components/portal/ai-panel";
import { cn } from "@/lib/utils";

export const metadata = { title: "Misi Harian — Albirru" };

const MISI = [
  { t: "Review Literasi 15 menit", xp: 50, done: true },
  { t: "Kerjakan 20 soal Penalaran", xp: 80, done: false },
  { t: "Smart Revision Matematika (10 soal)", xp: 70, done: false },
];
const MINGGUAN = [
  { t: "Ikuti 3 try out minggu ini", progress: 1, total: 3 },
  { t: "Kuasai 2 subtes baru", progress: 0, total: 2 },
  { t: "Pertahankan streak 7 hari", progress: 4, total: 7 },
];

export default async function MissionsPage() {
  const { profile } = await getPortalProfile();
  const selesai = MISI.filter((m) => m.done).length;
  const persen = Math.round((selesai / MISI.length) * 100);

  return (
    <>
      <PortalTopbar eyebrow="Journey  ›  Misi" title="Misi Harian" subtitle="Selesaikan misi untuk menjaga momentum & raih XP." nama={profile?.nama ?? "Farhan"}
        right={<Link href="/app/journey" className="inline-flex h-10 items-center gap-2 rounded-lg border bg-white px-4 text-body-sm font-semibold text-ink transition-colors hover:bg-muted"><ArrowLeft size={15} /> Kembali</Link>} />

      <div className="grid gap-5 p-5 lg:grid-cols-[minmax(0,1fr)_300px] lg:p-7">
        <div className="space-y-5">
          <div className="rounded-2xl border bg-white p-5">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-h-sm text-ink">Misi Hari Ini</h3>
              <AiMissionsButton />
            </div>
            <div className="mt-4 space-y-2.5">
              {MISI.map((m) => (
                <div key={m.t} className={cn("flex items-center gap-3 rounded-xl border p-3", m.done && "bg-success-subtle/40")}>
                  {m.done ? <CheckCircle2 size={20} className="shrink-0 text-success" /> : <Circle size={20} className="shrink-0 text-ink-muted" />}
                  <span className={cn("flex-1 text-body-sm", m.done ? "font-medium text-ink line-through" : "text-ink-body")}>{m.t}</span>
                  <span className="shrink-0 rounded-md bg-brand-100 px-2 py-0.5 text-[11px] font-bold text-brand">+{m.xp} XP</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border bg-white p-5">
            <h3 className="text-h-sm text-ink">Misi Mingguan</h3>
            <div className="mt-4 space-y-4">
              {MINGGUAN.map((m) => (
                <div key={m.t}>
                  <div className="flex items-center justify-between text-body-sm"><span className="font-medium text-ink">{m.t}</span><span className="text-ink-muted">{m.progress}/{m.total}</span></div>
                  <div className="mt-1.5 h-2 rounded-full bg-hair"><div className="h-full rounded-full bg-brand" style={{ width: `${(m.progress / m.total) * 100}%` }} /></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-2xl border bg-white p-5 text-center">
            <div className="text-caption text-ink-muted">Progress Hari Ini</div>
            <Ring value={persen} size={120} stroke={11}><span className="text-h-md text-ink">{persen}%</span></Ring>
            <div className="mt-2 text-body-sm text-ink-body">{selesai} dari {MISI.length} misi selesai</div>
          </div>
          <div className="rounded-2xl border bg-white p-5">
            <div className="flex items-center gap-2"><Flame size={18} className="text-[#E8910B]" /><span className="text-body-sm font-bold text-ink">Streak 41 hari</span></div>
            <p className="mt-1 text-caption text-ink-muted">Selesaikan minimal 1 misi tiap hari untuk menjaga streak.</p>
            <div className="mt-3 flex items-center justify-around text-center">
              <div><Star size={18} className="mx-auto text-brand" /><div className="mt-1 text-body-sm font-bold text-ink">7.850</div><div className="text-[10px] text-ink-muted">Total XP</div></div>
              <div><Zap size={18} className="mx-auto text-[#6D49C9]" /><div className="mt-1 text-body-sm font-bold text-ink">Level 12</div><div className="text-[10px] text-ink-muted">Saat ini</div></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
