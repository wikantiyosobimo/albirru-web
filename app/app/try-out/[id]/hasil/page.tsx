import {
  Calendar, FileText, ArrowRight, ClipboardCheck, RotateCcw, Target, CheckCircle2, XCircle, MinusCircle, Trophy,
} from "lucide-react";
import Link from "next/link";
import { getPortalProfile } from "@/lib/portal/session";
import { createClient } from "@/lib/supabase/server";
import { PortalTopbar } from "@/components/portal/topbar";
import { PrintButton } from "@/components/portal/print-button";
import { Ring } from "@/components/portal/ring";
import { getSegment } from "@/lib/data/targets";
import { peluangLolos, warnaPeluang, statusSubtes } from "@/lib/portal/peluang";
import { cn } from "@/lib/utils";

type QStatus = "benar" | "salah" | "kosong";
type ReviewQ = { nomor: number; subtes: string; status: QStatus };
type ReviewS = { subtes: string; total: number; benar: number; salah: number; kosong: number; skor: number; persen: number };

const TILE_BG: Record<QStatus, string> = { benar: "bg-[#16B47A] text-white", salah: "bg-[#E5484D] text-white", kosong: "bg-hair text-ink-muted" };

function AnswerTiles({ items, detail }: { items: ReviewQ[]; detail: string }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((it) => (
        <Link key={it.nomor} href={`${detail}?soal=${it.nomor}`} title={`Soal ${it.nomor} — ${it.status}`}
          className={cn("flex h-7 w-7 items-center justify-center rounded-[4px] text-[10px] font-bold transition-transform hover:scale-110 hover:ring-2 hover:ring-navy-900 hover:ring-offset-1", TILE_BG[it.status])}>{it.nomor}</Link>
      ))}
    </div>
  );
}

export default async function HasilPage({ params, searchParams }: { params: { id: string }; searchParams: { attempt?: string } }) {
  const { profile } = await getPortalProfile();
  const detail = `/app/try-out/${params.id}/hasil/detail`;
  const supabase = await createClient();

  const { data: tryout } = await supabase.from("tryouts").select("title").eq("id", params.id).maybeSingle();

  let attemptQ = supabase.from("tryout_attempts").select("id, skor, benar, salah, kosong, submitted_at")
    .eq("tryout_id", params.id).eq("status", "selesai").order("submitted_at", { ascending: false }).limit(1);
  if (searchParams?.attempt) attemptQ = attemptQ.eq("id", searchParams.attempt);
  const { data: attempt } = await attemptQ.maybeSingle();

  let reviewQ: ReviewQ[] | null = null;
  let reviewS: ReviewS[] | null = null;
  if (attempt?.id) {
    const { data: review } = await supabase.rpc("get_attempt_review", { p_attempt_id: attempt.id });
    if (review) { reviewQ = (review.questions ?? []) as ReviewQ[]; reviewS = (review.subtes ?? []) as ReviewS[]; }
  }

  const skor = attempt?.skor ?? 712;
  const benar = attempt?.benar ?? 142;
  const salah = attempt?.salah ?? 58;
  const kosong = attempt?.kosong ?? 40;
  const totalSoal = benar + salah + kosong;
  const akurasi = totalSoal ? Math.round((benar / totalSoal) * 100) : 0;
  const tanggal = attempt?.submitted_at
    ? new Date(attempt.submitted_at).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })
    : "25 Mei 2024";

  const seg = getSegment(profile?.segment);
  const targetSkor = profile?.target_skor ?? (seg.model === "akademik" ? 850 : 420);
  const peluang = peluangLolos(skor, 1000 * (targetSkor / seg.scoreMax)); // normalisasi ke skala skor /1000
  const peluangColor = warnaPeluang(peluang);

  const fokus = reviewS
    ? [...reviewS].sort((a, b) => a.persen - b.persen).filter((s) => s.persen < 70).slice(0, 2).map((s) => s.subtes)
    : [];

  const heatGroups = reviewQ
    ? Object.values(reviewQ.reduce<Record<string, { subtes: string; items: ReviewQ[] }>>((acc, q) => {
        (acc[q.subtes] ??= { subtes: q.subtes, items: [] }).items.push(q); return acc;
      }, {}))
    : null;

  const ACTIONS = [
    { icon: ClipboardCheck, t: "Lihat Pembahasan", href: detail, color: "#2F5BFF", bg: "#EAF0FF" },
    { icon: RotateCcw, t: "Review Soal Salah", href: `${detail}?soal=1`, color: "#E5484D", bg: "#FDECEC" },
    { icon: Trophy, t: "Lihat Peringkat", href: `/app/try-out/${params.id}/peringkat`, color: "#F5B301", bg: "#FFF7E6" },
    { icon: Target, t: "Smart Revision", href: "/app/intelligence/smart-revision", color: "#16B47A", bg: "#E9F9F1" },
  ];

  return (
    <>
      <PortalTopbar eyebrow="Try Out  ›  Hasil" title="Hasil Try Out" subtitle={tryout?.title ?? undefined} nama={profile?.nama ?? "Farhan"}
        right={attempt?.id
          ? <Link href={`/api/pdf/hasil?attempt_id=${attempt.id}`} target="_blank" rel="noopener noreferrer" className="inline-flex h-10 items-center gap-2 rounded-lg bg-brand px-4 text-body-sm font-semibold text-white transition-colors hover:bg-brand-600"><FileText size={15} /> Unduh PDF</Link>
          : <PrintButton label="Unduh Hasil (PDF)" />} />

      <div className="space-y-5 p-5 lg:p-7">
        {/* HERO RINGKAS */}
        <div className="grid items-center gap-6 rounded-2xl border bg-white p-6 md:grid-cols-[auto_1fr_auto]">
          {/* Skor */}
          <div className="flex items-center gap-5">
            <Ring value={akurasi} size={120} stroke={11} color={peluangColor}>
              <span className="text-[2rem] font-extrabold leading-none text-ink">{skor}</span>
              <span className="text-caption text-ink-muted">Skor</span>
            </Ring>
            <div>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-caption text-ink-muted">
                <span className="flex items-center gap-1"><Calendar size={13} /> {tanggal}</span>
                <span className="flex items-center gap-1"><FileText size={13} /> {totalSoal} Soal</span>
              </div>
              <div className="mt-1 text-h-md text-ink">Akurasi {akurasi}%</div>
              <div className="text-body-sm text-ink-muted">Skor {skor} dari 1000</div>
            </div>
          </div>

          {/* Benar/Salah/Kosong */}
          <div className="grid grid-cols-3 gap-3 md:border-x md:px-6">
            {[
              { icon: CheckCircle2, label: "Benar", val: benar, color: "#16B47A" },
              { icon: XCircle, label: "Salah", val: salah, color: "#E5484D" },
              { icon: MinusCircle, label: "Kosong", val: kosong, color: "#94A3B8" },
            ].map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="rounded-xl bg-muted p-3 text-center">
                  <Icon size={18} className="mx-auto" style={{ color: s.color }} />
                  <div className="mt-1 text-h-sm leading-none text-ink">{s.val}</div>
                  <div className="text-caption text-ink-muted">{s.label}</div>
                </div>
              );
            })}
          </div>

          {/* Peluang */}
          <div className="flex items-center gap-3">
            <Ring value={peluang} size={84} stroke={9} color={peluangColor}><span className="text-h-sm font-extrabold text-ink">{peluang}%</span></Ring>
            <div className="text-caption">
              <div className="text-ink-muted">Peluang {seg.peluangNoun}</div>
              <div className="text-body-sm font-bold text-ink">Target {targetSkor}</div>
              <Link href="/app/target" className="mt-1 inline-flex items-center gap-1 font-semibold text-brand hover:underline">Detail target <ArrowRight size={12} /></Link>
            </div>
          </div>
        </div>

        {/* PETA JAWABAN + SUBTES */}
        <div className="grid gap-5 lg:grid-cols-2">
          <div className="rounded-2xl border bg-white p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-h-sm text-ink">Peta Jawaban</h2>
              <div className="flex gap-3 text-caption text-ink-muted">
                <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-[3px] bg-[#16B47A]" /> Benar</span>
                <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-[3px] bg-[#E5484D]" /> Salah</span>
                <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-[3px] bg-hair" /> Kosong</span>
              </div>
            </div>
            <div className="mt-4 space-y-3">
              {heatGroups ? heatGroups.map((g) => (
                <div key={g.subtes}>
                  <div className="mb-1.5 text-caption font-semibold text-ink">{g.subtes} ({g.items.length})</div>
                  <AnswerTiles items={g.items} detail={detail} />
                </div>
              )) : <p className="rounded-lg bg-muted p-4 text-center text-body-sm text-ink-muted">Peta jawaban tersedia setelah kamu menyelesaikan try out ini.</p>}
            </div>
            <Link href={detail} className="mt-4 inline-flex items-center gap-1.5 text-body-sm font-semibold text-brand hover:underline">Klik nomor untuk pembahasan <ArrowRight size={14} /></Link>
          </div>

          <div className="rounded-2xl border bg-white p-5">
            <h2 className="text-h-sm text-ink">Performa Subtes</h2>
            <div className="mt-4 space-y-4">
              {reviewS && reviewS.length ? reviewS.map((s) => {
                const st = statusSubtes(s.persen);
                return (
                  <Link key={s.subtes} href={`${detail}?subtes=${encodeURIComponent(s.subtes)}`} className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-muted">
                    <div className="w-40 shrink-0 text-body-sm font-semibold text-ink">{s.subtes}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between text-caption"><span className="font-bold text-ink">{s.benar}/{s.total} benar</span><span className="text-ink-muted">{s.persen}%</span></div>
                      <div className="mt-1 h-2 rounded-full bg-hair"><div className="h-full rounded-full" style={{ width: `${s.persen}%`, backgroundColor: st.bar }} /></div>
                    </div>
                    <span className="shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold" style={{ backgroundColor: st.sb, color: st.sc }}>{st.label}</span>
                  </Link>
                );
              }) : <p className="rounded-lg bg-muted p-4 text-center text-body-sm text-ink-muted">Rincian subtes tersedia setelah kamu menyelesaikan try out ini.</p>}
            </div>
            {fokus.length ? <div className="mt-4 flex items-start gap-2 rounded-xl bg-muted p-3 text-body-sm text-ink-body"><Target size={15} className="mt-0.5 shrink-0 text-brand" /> <span>Fokus tingkatkan <b>{fokus.join(" & ")}</b> untuk hasil lebih optimal.</span></div> : null}
          </div>
        </div>

        {/* AKSI */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {ACTIONS.map((c) => {
            const Icon = c.icon;
            return (
              <Link key={c.t} href={c.href} className="flex items-center gap-3 rounded-2xl border p-4 transition-shadow hover:shadow-sm" style={{ backgroundColor: c.bg }}>
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white" style={{ color: c.color }}><Icon size={19} /></span>
                <span className="flex-1 text-body-sm font-bold" style={{ color: c.color }}>{c.t}</span>
                <ArrowRight size={16} style={{ color: c.color }} />
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
