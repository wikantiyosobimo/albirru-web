import Link from "next/link";
import { ArrowLeft, PlayCircle, FileText, ClipboardList, Clock, CheckCircle2, ArrowRight } from "lucide-react";
import { getPortalProfile } from "@/lib/portal/session";
import { PortalTopbar } from "@/components/portal/topbar";

export const metadata = { title: "Topik — Albirru" };

const MATERI = [
  { tipe: "video", icon: PlayCircle, t: "Konsep Dasar & Strategi", durasi: "12 mnt", done: true, href: "/app/learning/video/1" },
  { tipe: "materi", icon: FileText, t: "Rangkuman Materi", durasi: "8 mnt baca", done: true, href: "/app/learning/video/2" },
  { tipe: "video", icon: PlayCircle, t: "Pembahasan Soal HOTS", durasi: "15 mnt", done: false, href: "/app/learning/video/3" },
  { tipe: "latihan", icon: ClipboardList, t: "Latihan Terbimbing (15 soal)", durasi: "20 mnt", done: false, href: "/app/learning/practice/1" },
];

function slugToTitle(slug: string) {
  return slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export default async function TopikPage({ params }: { params: { topik: string } }) {
  const { profile } = await getPortalProfile();
  const title = slugToTitle(decodeURIComponent(params.topik));
  const selesai = MATERI.filter((m) => m.done).length;
  const persen = Math.round((selesai / MATERI.length) * 100);

  return (
    <>
      <PortalTopbar eyebrow="Learning Center  ›  Topik" title={title} subtitle="Materi, video, dan latihan untuk topik ini." nama={profile?.nama ?? "Farhan"}
        right={<Link href="/app/learning" className="inline-flex h-10 items-center gap-2 rounded-lg border bg-white px-4 text-body-sm font-semibold text-ink transition-colors hover:bg-muted"><ArrowLeft size={15} /> Kembali</Link>} />

      <div className="space-y-5 p-5 lg:p-7">
        <div className="flex flex-col gap-4 rounded-2xl border grad-card p-6 text-white sm:flex-row sm:items-center">
          <div className="flex-1">
            <div className="text-caption text-white/80">Progres topik</div>
            <div className="text-h-md font-bold">{title}</div>
            <div className="mt-2 h-2 w-full max-w-sm rounded-full bg-white/25"><div className="h-full rounded-full bg-white" style={{ width: `${persen}%` }} /></div>
            <div className="mt-1 text-caption text-white/80">{selesai} dari {MATERI.length} materi selesai · {persen}%</div>
          </div>
          <Link href={MATERI.find((m) => !m.done)?.href ?? "/app/learning"} className="inline-flex h-11 items-center gap-2 rounded-lg bg-white px-5 text-body-sm font-semibold text-brand"><PlayCircle size={16} /> Lanjutkan</Link>
        </div>

        <div className="rounded-2xl border bg-white p-5">
          <h3 className="text-h-sm text-ink">Daftar Materi</h3>
          <div className="mt-4 divide-y">
            {MATERI.map((m) => {
              const Icon = m.icon;
              return (
                <Link key={m.t} href={m.href} className="flex items-center gap-3 py-3 transition-colors hover:bg-muted">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-100 text-brand"><Icon size={18} /></span>
                  <div className="min-w-0 flex-1"><div className="text-body-sm font-semibold text-ink">{m.t}</div><div className="flex items-center gap-1 text-caption text-ink-muted"><Clock size={12} /> {m.durasi}</div></div>
                  {m.done ? <CheckCircle2 size={18} className="shrink-0 text-success" /> : <ArrowRight size={16} className="shrink-0 text-ink-muted" />}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
