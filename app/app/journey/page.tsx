import Link from "next/link";
import {
  Route, CheckCircle2, Clock, CalendarClock, Flag, BookOpen, Target, Trophy, ArrowRight,
} from "lucide-react";
import { getPortalProfile } from "@/lib/portal/session";
import { PortalTopbar } from "@/components/portal/topbar";

export const metadata = { title: "Academic Journey — Albirru" };

const TIMELINE = [
  { fase: "Fondasi", status: "selesai", periode: "Jan – Feb", desc: "Penguasaan konsep dasar semua subtes.", icon: BookOpen },
  { fase: "Penguatan", status: "selesai", periode: "Mar – Apr", desc: "Latihan intensif & try out rutin.", icon: Target },
  { fase: "Akselerasi", status: "aktif", periode: "Mei – Jun", desc: "Smart revision pada kelemahan & simulasi penuh.", icon: Route },
  { fase: "Finalisasi", status: "akan", periode: "Jul", desc: "Simulasi hari-H & pemantapan strategi.", icon: Flag },
  { fase: "Hari H", status: "akan", periode: "UTBK 2024", desc: "Eksekusi maksimal di ujian sesungguhnya.", icon: Trophy },
];

const JADWAL = [
  { t: "Mini Try Out TPS", when: "Hari ini · 16.00 - 17.30", badge: "Try Out", bb: "#EAF0FF", bc: "#2F5BFF", href: "/app/try-out" },
  { t: "Review Literasi - Bacaan", when: "Hari ini · 19.00 - 20.00", badge: "Belajar", bb: "#FFF1DC", bc: "#B7791F", href: "/app/learning" },
  { t: "Smart Revision Matematika", when: "Besok · 16.00 - 17.00", badge: "Revisi", bb: "#F3ECFF", bc: "#6D49C9", href: "/app/intelligence/smart-revision" },
  { t: "Simulasi SNBT Nasional", when: "25 Mei · 07.30 - 11.45", badge: "Try Out", bb: "#EAF0FF", bc: "#2F5BFF", href: "/app/try-out/snbt-06" },
];

const STATUS_DOT: Record<string, string> = { selesai: "bg-success text-white", aktif: "bg-brand text-white", akan: "bg-hair text-ink-muted" };

export default async function JourneyPage() {
  const { profile } = await getPortalProfile();

  return (
    <>
      <PortalTopbar title="Academic Journey" subtitle="Peta perjalanan belajarmu hingga hari H." nama={profile?.nama ?? "Farhan"} />

      <div className="grid gap-5 p-5 lg:grid-cols-[minmax(0,1fr)_320px] lg:p-7">
        {/* TIMELINE */}
        <div className="rounded-2xl border bg-white p-6">
          <h3 className="text-h-sm text-ink">Tahapan Persiapan</h3>
          <div className="mt-5">
            {TIMELINE.map((t, i) => {
              const Icon = t.icon;
              const last = i === TIMELINE.length - 1;
              return (
                <div key={t.fase} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <span className={`flex h-10 w-10 items-center justify-center rounded-full ${STATUS_DOT[t.status]}`}>{t.status === "selesai" ? <CheckCircle2 size={18} /> : <Icon size={18} />}</span>
                    {!last ? <span className={`my-1 w-0.5 flex-1 ${t.status === "selesai" ? "bg-success/40" : "bg-hair"}`} style={{ minHeight: 28 }} /> : null}
                  </div>
                  <div className={last ? "" : "pb-6"}>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-body-lg font-bold text-ink">{t.fase}</span>
                      <span className="text-caption text-ink-muted">· {t.periode}</span>
                      {t.status === "aktif" ? <span className="rounded-md bg-brand-100 px-2 py-0.5 text-[11px] font-semibold text-brand">Sedang Berjalan</span> : null}
                    </div>
                    <p className="mt-0.5 text-body-sm text-ink-body">{t.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* JADWAL TERDEKAT */}
        <div className="space-y-5">
          <div className="rounded-2xl border bg-white p-5">
            <h3 className="flex items-center gap-2 text-h-sm text-ink"><CalendarClock size={18} className="text-brand" /> Jadwal Terdekat</h3>
            <div className="mt-4 space-y-2.5">
              {JADWAL.map((j) => (
                <Link key={j.t} href={j.href} className="flex items-center gap-3 rounded-xl border p-2.5 transition-colors hover:border-brand/40 hover:bg-muted">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg" style={{ backgroundColor: j.bb, color: j.bc }}><Clock size={17} /></span>
                  <div className="min-w-0 flex-1"><div className="truncate text-body-sm font-semibold text-ink">{j.t}</div><div className="text-caption text-ink-muted">{j.when}</div></div>
                  <span className="shrink-0 rounded-md px-2 py-0.5 text-[10px] font-semibold" style={{ backgroundColor: j.bb, color: j.bc }}>{j.badge}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border bg-white p-5">
            <div className="text-body-sm font-bold text-ink">Jelajahi Journey</div>
            <div className="mt-3 space-y-2">
              {[
                { t: "Kalender Belajar", href: "/app/journey/calendar" },
                { t: "Misi Harian", href: "/app/journey/missions" },
                { t: "Milestone T-minus", href: "/app/journey/milestones" },
              ].map((a) => (
                <Link key={a.t} href={a.href} className="flex items-center justify-between rounded-lg border px-3 py-2.5 text-body-sm font-semibold text-ink transition-colors hover:bg-muted">{a.t} <ArrowRight size={14} className="text-brand" /></Link>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-brand/30 bg-brand-100 p-5">
            <div className="text-body-sm font-bold text-ink">Konsistensi adalah kunci 🔑</div>
            <p className="mt-1 text-caption text-ink-body">Kamu sudah konsisten 41 hari. Pertahankan ritme belajarmu menuju target.</p>
            <Link href="/app/navigator" className="mt-3 inline-flex items-center gap-1 text-body-sm font-semibold text-brand hover:underline">Lihat rencana mingguan <ArrowRight size={13} /></Link>
          </div>
        </div>
      </div>
    </>
  );
}
