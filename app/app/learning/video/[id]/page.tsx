import Link from "next/link";
import { ArrowLeft, Play, FileText, ClipboardList, ArrowRight, Bookmark } from "lucide-react";
import { getPortalProfile } from "@/lib/portal/session";
import { PortalTopbar } from "@/components/portal/topbar";

export const metadata = { title: "Video — Albirru" };

const TERKAIT = [
  { t: "Pembahasan Soal HOTS", durasi: "15 mnt", href: "/app/learning/video/3" },
  { t: "Rangkuman Materi", durasi: "8 mnt baca", href: "/app/learning/video/2" },
  { t: "Latihan Terbimbing", durasi: "20 mnt", href: "/app/learning/practice/1" },
];

export default async function VideoPage({ params }: { params: { id: string } }) {
  const { profile } = await getPortalProfile();

  return (
    <>
      <PortalTopbar eyebrow="Learning Center  ›  Video" title="Konsep Dasar & Strategi" subtitle="Video pembelajaran" nama={profile?.nama ?? "Farhan"}
        right={<Link href="/app/learning" className="inline-flex h-10 items-center gap-2 rounded-lg border bg-white px-4 text-body-sm font-semibold text-ink transition-colors hover:bg-muted"><ArrowLeft size={15} /> Kembali</Link>} />

      <div className="grid gap-5 p-5 lg:grid-cols-[minmax(0,1fr)_320px] lg:p-7">
        <div className="space-y-5">
          {/* PLAYER PLACEHOLDER */}
          <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-2xl border grad-photo">
            <div className="blob pointer-events-none absolute -right-10 -top-10 h-56 w-56" />
            <button className="relative flex h-16 w-16 items-center justify-center rounded-full bg-white/90 text-brand shadow-lg transition-transform hover:scale-105"><Play size={28} className="ml-1 fill-current" /></button>
            <span className="absolute bottom-3 right-3 rounded bg-black/50 px-2 py-0.5 text-caption text-white">12:00</span>
          </div>

          <div className="rounded-2xl border bg-white p-5">
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-h-sm text-ink">Konsep Dasar & Strategi</h3>
              <button className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-body-sm text-ink-body hover:bg-muted"><Bookmark size={14} /> Simpan</button>
            </div>
            <p className="mt-2 text-body-sm leading-relaxed text-ink-body">Video ini membahas konsep inti dan strategi mengerjakan soal secara efisien. Tonton hingga tuntas, lalu lanjutkan ke latihan terbimbing untuk menguji pemahamanmu.</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link href="/app/learning/practice/1" className="inline-flex items-center gap-1.5 rounded-lg bg-brand px-4 py-2 text-body-sm font-semibold text-white hover:bg-brand-600"><ClipboardList size={15} /> Latihan Sekarang</Link>
              <button className="inline-flex items-center gap-1.5 rounded-lg border px-4 py-2 text-body-sm font-semibold text-ink hover:bg-muted"><FileText size={15} /> Unduh Materi</button>
            </div>
            <p className="mt-3 text-caption text-ink-muted">Catatan: pemutar video akan terhubung ke konten nyata saat Learning Center diisi.</p>
          </div>
        </div>

        <div className="rounded-2xl border bg-white p-5">
          <h3 className="text-body-lg font-bold text-ink">Materi Terkait</h3>
          <div className="mt-3 space-y-2.5">
            {TERKAIT.map((t) => (
              <Link key={t.t} href={t.href} className="flex items-center gap-3 rounded-xl border p-3 transition-colors hover:bg-muted">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-100 text-brand"><Play size={15} /></span>
                <div className="min-w-0 flex-1"><div className="truncate text-body-sm font-semibold text-ink">{t.t}</div><div className="text-caption text-ink-muted">{t.durasi}</div></div>
                <ArrowRight size={15} className="shrink-0 text-ink-muted" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
