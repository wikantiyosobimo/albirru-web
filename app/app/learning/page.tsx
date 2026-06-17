import Link from "next/link";
import {
  Library, PlayCircle, FileText, Radio, BookOpen, Brain, Sigma, Globe, Search, ArrowRight, Clock,
} from "lucide-react";
import { getPortalProfile } from "@/lib/portal/session";
import { PortalTopbar } from "@/components/portal/topbar";

export const metadata = { title: "Learning Center — Albirru" };

const KATEGORI = [
  { icon: BookOpen, label: "Literasi", n: 42, color: "#6D49C9" },
  { icon: Brain, label: "Penalaran", n: 38, color: "#2F5BFF" },
  { icon: Sigma, label: "Matematika", n: 51, color: "#16B47A" },
  { icon: Globe, label: "B. Inggris", n: 29, color: "#E8910B" },
];

const MATERI = [
  { tipe: "Video", icon: PlayCircle, t: "Strategi Membaca Cepat untuk Literasi", durasi: "12 mnt", tag: "Literasi", color: "#6D49C9" },
  { tipe: "Materi", icon: FileText, t: "Rangkuman Silogisme & Penalaran Logis", durasi: "8 mnt baca", tag: "Penalaran", color: "#2F5BFF" },
  { tipe: "Video", icon: PlayCircle, t: "Trik Cepat Aljabar & Persamaan Linear", durasi: "15 mnt", tag: "Matematika", color: "#16B47A" },
  { tipe: "Kelas Live", icon: Radio, t: "Bedah Soal HOTS Matematika", durasi: "Hari ini 19.00", tag: "Live", color: "#E5484D" },
  { tipe: "Materi", icon: FileText, t: "Tenses & Reading Comprehension", durasi: "10 mnt baca", tag: "B. Inggris", color: "#E8910B" },
  { tipe: "Video", icon: PlayCircle, t: "Menentukan Ide Pokok Paragraf", durasi: "9 mnt", tag: "Literasi", color: "#6D49C9" },
];

export default async function LearningPage() {
  const { profile } = await getPortalProfile();

  return (
    <>
      <PortalTopbar title="Learning Center" subtitle="Materi, video, dan kelas sesuai kebutuhanmu." nama={profile?.nama ?? "Farhan"} />

      <div className="space-y-5 p-5 lg:p-7">
        {/* SEARCH */}
        <div className="relative">
          <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted" />
          <input aria-label="Cari materi, video, atau topik" className="h-11 w-full rounded-xl border bg-white pl-10 pr-4 text-body-sm text-ink placeholder:text-ink-muted" placeholder="Cari materi, video, atau topik…" />
        </div>

        {/* KATEGORI */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {KATEGORI.map((k) => {
            const Icon = k.icon;
            return (
              <Link key={k.label} href={`/app/learning/${k.label.toLowerCase().replace(/[^a-z]+/g, "-")}`} className="flex items-center gap-3 rounded-2xl border bg-white p-4 transition-shadow hover:shadow-sm">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl" style={{ backgroundColor: `${k.color}1A`, color: k.color }}><Icon size={20} /></span>
                <div><div className="text-body-sm font-bold text-ink">{k.label}</div><div className="text-caption text-ink-muted">{k.n} materi</div></div>
              </Link>
            );
          })}
        </div>

        {/* CONTINUE */}
        <div className="flex flex-col items-start gap-4 rounded-2xl border grad-card p-6 text-white sm:flex-row sm:items-center">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/15"><Library size={24} /></span>
          <div className="flex-1">
            <div className="text-caption text-white/80">Lanjutkan Belajar</div>
            <div className="text-body-lg font-bold">Strategi Membaca Cepat untuk Literasi</div>
            <div className="mt-2 h-1.5 w-full max-w-xs rounded-full bg-white/25"><div className="h-full w-[60%] rounded-full bg-white" /></div>
          </div>
          <Link href="/app/learning/video/1" className="inline-flex h-10 items-center gap-2 rounded-lg bg-white px-4 text-body-sm font-semibold text-brand"><PlayCircle size={16} /> Lanjutkan</Link>
        </div>

        {/* KELAS LIVE BANNER */}
        <Link href="/app/learning/live" className="flex items-center gap-3 rounded-2xl border border-[#E5484D]/30 bg-[#FDF3F3] p-4 transition-colors hover:bg-[#FDECEC]">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#E5484D]"><Radio size={20} /></span>
          <div className="flex-1"><div className="text-body-sm font-bold text-ink">Kelas Live sedang berlangsung</div><div className="text-caption text-ink-muted">Bedah Soal HOTS Matematika · 248 peserta</div></div>
          <ArrowRight size={16} className="text-[#E5484D]" />
        </Link>

        {/* MATERI GRID */}
        <div>
          <h3 className="mb-3 text-h-sm text-ink">Rekomendasi Untukmu</h3>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {MATERI.map((m) => {
              const Icon = m.icon;
              const href = m.tipe === "Kelas Live" ? "/app/learning/live" : m.tipe === "Video" ? "/app/learning/video/1" : m.tipe === "Materi" ? "/app/learning/video/2" : "/app/learning/practice/1";
              return (
                <Link key={m.t} href={href} className="flex flex-col rounded-2xl border bg-white p-5 transition-shadow hover:shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl" style={{ backgroundColor: `${m.color}1A`, color: m.color }}><Icon size={20} /></span>
                    <span className="rounded-md px-2 py-0.5 text-[11px] font-semibold" style={{ backgroundColor: `${m.color}1A`, color: m.color }}>{m.tag}</span>
                  </div>
                  <div className="mt-3 flex-1 text-body-sm font-bold text-ink">{m.t}</div>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="flex items-center gap-1 text-caption text-ink-muted"><Clock size={13} /> {m.durasi}</span>
                    <span className="inline-flex items-center gap-1 text-body-sm font-semibold text-brand">Buka <ArrowRight size={13} /></span>
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
