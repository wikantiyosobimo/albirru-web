import {
  ArrowLeft, ArrowRight, Lightbulb, BarChart3, BookOpen, CheckCircle2, FileText,
} from "lucide-react";
import Link from "next/link";
import { getPortalProfile } from "@/lib/portal/session";
import { createClient } from "@/lib/supabase/server";
import { PortalTopbar } from "@/components/portal/topbar";
import { PrintButton } from "@/components/portal/print-button";
import { BookmarkToggle } from "@/components/portal/bookmark-toggle";
import { cn } from "@/lib/utils";

type QStatus = "benar" | "salah" | "kosong";
type Soal = {
  nomor: number; subtes: string; teks: string;
  pilihan: { k: string; t: string }[]; kunci: string; pembahasan: string | null;
  jawaban: string | null; status: QStatus;
};

const TILE: Record<QStatus, string> = { benar: "bg-[#16B47A] text-white", salah: "bg-[#E5484D] text-white", kosong: "bg-hair text-ink-muted" };

export default async function DetailJawabanPage({ params, searchParams }: { params: { id: string }; searchParams: { soal?: string; attempt?: string } }) {
  const { profile } = await getPortalProfile();
  const hasil = `/app/try-out/${params.id}/hasil`;
  const base = `/app/try-out/${params.id}/hasil/detail`;
  const supabase = await createClient();

  // Attempt milik user (dari ?attempt atau terbaru).
  let aQ = supabase.from("tryout_attempts").select("id, skor, benar, salah, kosong")
    .eq("tryout_id", params.id).eq("status", "selesai").order("submitted_at", { ascending: false }).limit(1);
  if (searchParams?.attempt) aQ = aQ.eq("id", searchParams.attempt);
  const { data: attempt } = await aQ.maybeSingle();

  let soal: Soal[] = [];
  if (attempt?.id) {
    const { data } = await supabase.rpc("get_attempt_detail", { p_attempt_id: attempt.id });
    if (Array.isArray(data)) soal = data as Soal[];
  }

  // Empty state.
  if (!attempt || soal.length === 0) {
    return (
      <>
        <PortalTopbar eyebrow="Try Out  ›  Hasil  ›  Detail Jawaban" title="Detail Jawaban" nama={profile?.nama ?? "Farhan"} />
        <div className="p-5 lg:p-7">
          <div className="mx-auto max-w-md rounded-2xl border bg-white p-10 text-center">
            <FileText className="mx-auto text-ink-muted" size={36} />
            <h2 className="mt-3 text-h-sm text-ink">Belum ada pembahasan</h2>
            <p className="mt-1 text-body-sm text-ink-body">Kerjakan try out ini dulu untuk melihat pembahasan jawabanmu.</p>
            <Link href={`/app/try-out/${params.id}/kerjakan`} className="mt-4 inline-flex rounded-lg bg-brand px-4 py-2 text-body-sm font-semibold text-white">Kerjakan Sekarang</Link>
          </div>
        </div>
      </>
    );
  }

  const total = soal.length;
  const idx = Math.min(total, Math.max(1, Number(searchParams?.soal) || 1));
  const cur = soal[idx - 1];
  const attemptQS = attempt.id ? `&attempt=${attempt.id}` : "";
  const link = (n: number) => `${base}?soal=${n}${attemptQS}`;

  const benar = attempt.benar ?? soal.filter((s) => s.status === "benar").length;
  const salah = attempt.salah ?? soal.filter((s) => s.status === "salah").length;
  const kosong = attempt.kosong ?? soal.filter((s) => s.status === "kosong").length;

  // Kelompokkan untuk peta soal.
  const groups = Object.values(soal.reduce<Record<string, { subtes: string; items: Soal[] }>>((acc, s) => {
    (acc[s.subtes] ??= { subtes: s.subtes, items: [] }).items.push(s); return acc;
  }, {}));

  const statusLabel = cur.status === "benar" ? "Benar" : cur.status === "salah" ? "Salah" : "Kosong";

  return (
    <>
      <PortalTopbar eyebrow="Try Out  ›  Hasil Try Out  ›  Detail Jawaban" title="Detail Jawaban" subtitle={`Soal ${idx} dari ${total}`} nama={profile?.nama ?? "Farhan"}
        right={<PrintButton label="Unduh Pembahasan (PDF)" />} />

      <div className="space-y-5 p-5 lg:p-7">
        {/* STAT STRIP */}
        <div className="grid grid-cols-2 gap-4 rounded-2xl border bg-white p-4 sm:grid-cols-4 sm:divide-x">
          {[["Skor Total", String(attempt.skor ?? 0), "/1000", "text-ink"], ["Benar", String(benar), "", "text-[#16B47A]"], ["Salah", String(salah), "", "text-[#E5484D]"], ["Kosong", String(kosong), "", "text-ink-muted"]].map((s, i) => (
            <div key={s[0]} className={cn(i > 0 && "sm:pl-4")}><div className="text-caption text-ink-muted">{s[0]}</div><div className={cn("text-h-md", s[3])}>{s[1]}<span className="text-caption font-normal text-ink-muted">{s[2]}</span></div></div>
          ))}
        </div>

        <div className="grid gap-5 xl:grid-cols-[230px_1fr_300px]">
          {/* LEFT — PETA SOAL */}
          <div className="rounded-2xl border bg-white p-4">
            <span className="text-body-sm font-bold text-ink">Peta Soal</span>
            <div className="mt-2 flex gap-2.5 text-[10px] text-ink-muted">
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-[2px] bg-[#16B47A]" /> Benar</span>
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-[2px] bg-[#E5484D]" /> Salah</span>
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-[2px] bg-hair" /> Kosong</span>
            </div>
            <div className="mt-3 space-y-3">
              {groups.map((g) => (
                <div key={g.subtes}>
                  <div className="mb-1.5 text-[11px] font-semibold text-ink">{g.subtes}</div>
                  <div className="flex flex-wrap gap-1.5">
                    {g.items.map((it) => (
                      <Link key={it.nomor} href={link(it.nomor)} className={cn("flex h-7 w-7 items-center justify-center rounded-[4px] text-[10px] font-bold transition-transform hover:scale-110", TILE[it.status], it.nomor === idx && "ring-2 ring-navy-900 ring-offset-1")}>{it.nomor}</Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 border-t pt-3 text-caption font-semibold text-ink">Total {total} Soal</div>
          </div>

          {/* MIDDLE — SOAL */}
          <div className="rounded-2xl border bg-white p-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-h-sm text-ink">Soal {cur.nomor}</span>
                <span className="rounded-md bg-brand-100 px-2 py-0.5 text-[11px] font-semibold text-brand">{cur.subtes}</span>
                <span className={cn("rounded-md px-2 py-0.5 text-[11px] font-semibold",
                  cur.status === "benar" ? "bg-[#DCF5EA] text-[#16864F]" : cur.status === "salah" ? "bg-[#FDECEC] text-[#C13030]" : "bg-muted text-ink-muted")}>{statusLabel}</span>
              </div>
              <BookmarkToggle id={`${params.id}-soal-${cur.nomor}`} />
            </div>

            <p className="mt-4 text-body leading-relaxed text-ink">{cur.teks}</p>

            <div className="mt-5 space-y-2.5">
              {cur.pilihan.map((o) => {
                const isKunci = o.k === cur.kunci;
                const isPilihanSalah = o.k === cur.jawaban && o.k !== cur.kunci;
                return (
                  <div key={o.k} className={cn("flex items-center gap-3 rounded-xl border p-3.5", isKunci && "border-[#16B47A] bg-[#E9F9F1]", isPilihanSalah && "border-[#E5484D] bg-[#FDECEC]")}>
                    <span className={cn("flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-body-sm font-bold", isKunci ? "bg-[#16B47A] text-white" : isPilihanSalah ? "bg-[#E5484D] text-white" : "border text-ink-body")}>{o.k}</span>
                    <span className={cn("text-body-sm", isKunci || isPilihanSalah ? "font-medium text-ink" : "text-ink-body")}>{o.t}</span>
                    {isKunci ? <CheckCircle2 size={16} className="ml-auto shrink-0 text-[#16B47A]" /> : null}
                  </div>
                );
              })}
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className={cn("rounded-xl border p-4", cur.status === "benar" ? "border-[#16B47A] bg-[#E9F9F1]" : cur.status === "salah" ? "border-[#E5484D] bg-[#FDECEC]" : "bg-muted")}>
                <div className={cn("text-caption font-semibold", cur.status === "benar" ? "text-[#16864F]" : cur.status === "salah" ? "text-[#B4282C]" : "text-ink-muted")}>Jawaban Kamu</div>
                <div className="mt-1 flex items-center gap-2">
                  {cur.jawaban ? <span className={cn("flex h-7 w-7 items-center justify-center rounded-full text-body-sm font-bold text-white", cur.status === "benar" ? "bg-[#16B47A]" : "bg-[#E5484D]")}>{cur.jawaban}</span> : <span className="flex h-7 w-7 items-center justify-center rounded-full bg-hair text-body-sm font-bold text-ink-muted">–</span>}
                  <span className="text-body-sm font-semibold text-ink">{statusLabel}</span>
                </div>
              </div>
              <div className="rounded-xl border border-[#16B47A] bg-[#E9F9F1] p-4">
                <div className="text-caption font-semibold text-[#16864F]">Jawaban Benar</div>
                <div className="mt-1 flex items-center gap-2"><span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#16B47A] text-body-sm font-bold text-white">{cur.kunci}</span><span className="text-body-sm font-semibold text-[#16864F]">Kunci</span></div>
              </div>
            </div>

            <div className="mt-5">
              <h3 className="text-body-lg font-bold text-ink">Pembahasan</h3>
              <p className="mt-2 text-body-sm leading-relaxed text-ink-body">{cur.pembahasan ?? "Pembahasan untuk soal ini belum tersedia."}</p>
            </div>

            <div className="mt-6 flex items-center justify-between border-t pt-4">
              <Link href={link(idx - 1)} aria-disabled={idx <= 1} className={cn("inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-body-sm font-semibold text-ink transition-colors hover:bg-muted", idx <= 1 && "pointer-events-none opacity-40")}><ArrowLeft size={15} /> Sebelumnya</Link>
              <span className="text-body-sm text-ink-muted"><b className="text-ink">{idx}</b> / {total}</span>
              <Link href={link(idx + 1)} aria-disabled={idx >= total} className={cn("inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-body-sm font-semibold text-ink transition-colors hover:bg-muted", idx >= total && "pointer-events-none opacity-40")}>Berikutnya <ArrowRight size={15} /></Link>
            </div>
          </div>

          {/* RIGHT — INSIGHTS */}
          <div className="space-y-4">
            {cur.status === "salah" ? (
              <div className="rounded-2xl border border-[#F3C9C9] bg-[#FDF3F3] p-5">
                <div className="flex items-center gap-2 text-[#B4282C]"><Lightbulb size={17} /><span className="text-body-sm font-bold">Mengapa Kamu Salah?</span></div>
                <p className="mt-2 text-body-sm text-ink-body">Kamu memilih <b>{cur.jawaban}</b>, sedangkan jawaban benar adalah <b>{cur.kunci}</b>. Pelajari pembahasan di samping untuk memahami konsepnya.</p>
              </div>
            ) : cur.status === "kosong" ? (
              <div className="rounded-2xl border border-[#FCE4C2] bg-[#FFF8EC] p-5">
                <div className="flex items-center gap-2 text-[#B7791F]"><Lightbulb size={17} /><span className="text-body-sm font-bold">Soal Terlewat</span></div>
                <p className="mt-2 text-body-sm text-ink-body">Kamu tidak menjawab soal ini. Jangan biarkan soal kosong — tebakan terbaik tetap berpeluang benar.</p>
              </div>
            ) : (
              <div className="rounded-2xl border border-[#C6EBD6] bg-[#EBF9F1] p-5">
                <div className="flex items-center gap-2 text-[#16864F]"><CheckCircle2 size={17} /><span className="text-body-sm font-bold">Tepat!</span></div>
                <p className="mt-2 text-body-sm text-ink-body">Jawabanmu benar. Pertahankan pemahaman pada materi {cur.subtes}.</p>
              </div>
            )}

            <div className="rounded-2xl border border-[#CFE0FF] bg-[#EFF4FF] p-5">
              <div className="flex items-center gap-2 text-brand"><BarChart3 size={17} /><span className="text-body-sm font-bold">Subtes</span></div>
              <p className="mt-2 text-body-sm text-ink-body">Soal ini menguji materi <b>{cur.subtes}</b>. Tinjau soal lain pada subtes yang sama lewat Peta Soal.</p>
            </div>

            <div className="rounded-2xl border border-[#C6EBD6] bg-[#EBF9F1] p-5">
              <div className="flex items-center gap-2 text-[#16864F]"><BookOpen size={17} /><span className="text-body-sm font-bold">Pelajari Lebih Lanjut</span></div>
              <Link href="/app/learning" className="mt-3 inline-flex h-9 items-center justify-center gap-2 rounded-lg px-4 text-body-sm font-semibold text-white" style={{ backgroundColor: "#16864F" }}>Mulai Latihan <ArrowRight size={14} /></Link>
            </div>
          </div>
        </div>

        <Link href={hasil} className="inline-flex items-center gap-1.5 text-body-sm font-semibold text-brand"><ArrowLeft size={15} /> Kembali ke Hasil Try Out</Link>
      </div>
    </>
  );
}
