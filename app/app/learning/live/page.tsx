import Link from "next/link";
import { ArrowLeft, Radio, Calendar, Clock, Users, Bell } from "lucide-react";
import { getPortalProfile } from "@/lib/portal/session";
import { PortalTopbar } from "@/components/portal/topbar";

export const metadata = { title: "Kelas Live — Albirru" };

const KELAS = [
  { t: "Bedah Soal HOTS Matematika", mentor: "Pak Budi", tanggal: "Hari ini", jam: "19.00 - 20.30", peserta: 248, status: "live" },
  { t: "Strategi Literasi Bahasa Indonesia", mentor: "Bu Sinta", tanggal: "Besok", jam: "16.00 - 17.30", peserta: 132, status: "akan" },
  { t: "Penalaran Umum Tingkat Lanjut", mentor: "Kak Rani", tanggal: "Sabtu", jam: "10.00 - 11.30", peserta: 96, status: "akan" },
  { t: "Review Try Out Nasional", mentor: "Tim Albirru", tanggal: "Minggu", jam: "13.00 - 14.30", peserta: 410, status: "akan" },
];

export default async function LivePage() {
  const { profile } = await getPortalProfile();

  return (
    <>
      <PortalTopbar eyebrow="Learning Center  ›  Kelas Live" title="Kelas Live" subtitle="Belajar langsung bersama mentor." nama={profile?.nama ?? "Farhan"}
        right={<Link href="/app/learning" className="inline-flex h-10 items-center gap-2 rounded-lg border bg-white px-4 text-body-sm font-semibold text-ink transition-colors hover:bg-muted"><ArrowLeft size={15} /> Kembali</Link>} />

      <div className="space-y-4 p-5 lg:p-7">
        {KELAS.map((k) => {
          const live = k.status === "live";
          return (
            <div key={k.t} className="flex flex-col gap-4 rounded-2xl border bg-white p-5 sm:flex-row sm:items-center">
              <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${live ? "bg-[#FDECEC] text-[#E5484D]" : "bg-brand-100 text-brand"}`}><Radio size={22} /></span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-body-lg font-bold text-ink">{k.t}</span>
                  {live ? <span className="flex items-center gap-1 rounded-md bg-[#FDECEC] px-2 py-0.5 text-[11px] font-bold text-[#E5484D]"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#E5484D]" /> LIVE</span> : null}
                </div>
                <div className="mt-1 text-caption text-ink-muted">Bersama {k.mentor}</div>
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-caption text-ink-muted">
                  <span className="flex items-center gap-1"><Calendar size={13} /> {k.tanggal}</span>
                  <span className="flex items-center gap-1"><Clock size={13} /> {k.jam}</span>
                  <span className="flex items-center gap-1"><Users size={13} /> {k.peserta} peserta</span>
                </div>
              </div>
              {live ? (
                <button className="inline-flex h-10 shrink-0 items-center justify-center gap-1.5 rounded-lg bg-[#E5484D] px-6 text-body-sm font-semibold text-white transition-opacity hover:opacity-90"><Radio size={15} /> Gabung</button>
              ) : (
                <button className="inline-flex h-10 shrink-0 items-center justify-center gap-1.5 rounded-lg border px-5 text-body-sm font-semibold text-ink transition-colors hover:bg-muted"><Bell size={15} /> Ingatkan</button>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
