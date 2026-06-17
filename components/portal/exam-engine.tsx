"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Pause, Play, Calendar, Clock, FileText, ArrowRight, ArrowLeft, Bookmark,
  Flag, AlertTriangle, CheckCircle2, XCircle, ChevronDown, ChevronUp, Send, X, Loader2,
} from "lucide-react";
import { PortalTopbar } from "@/components/portal/topbar";
import { cn } from "@/lib/utils";

export type EngineSoal = {
  id: string;
  subtes: string;
  teks: string;
  pilihan: { k: string; t: string }[];
};

function fmt(total: number) {
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

export function ExamEngine({
  nama, tryoutId, hasilHref, soal, judul, tipe, durasiMenit, poinPerSoal,
}: {
  nama: string;
  tryoutId: string;
  hasilHref: string;
  soal: EngineSoal[];
  judul: string;
  tipe: string;
  durasiMenit: number;
  poinPerSoal: number;
}) {
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [ragu, setRagu] = useState<Set<number>>(new Set());
  const [marked, setMarked] = useState<Set<number>>(new Set());
  const [secondsLeft, setSecondsLeft] = useState(durasiMenit * 60);
  const [running, setRunning] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const submittedRef = useRef(false);

  const total = soal.length;
  const answeredCount = Object.keys(answers).length;
  const raguCount = ragu.size;
  const kosongCount = total - answeredCount;
  const progress = total ? Math.round((answeredCount / total) * 100) : 0;

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setSecondsLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, [running]);

  async function submit() {
    if (submittedRef.current) return;
    submittedRef.current = true;
    setSubmitting(true);
    setError(null);
    // Penilaian dilakukan server-side; kunci jawaban tidak ada di klien.
    const payload = Object.entries(answers).map(([i, k]) => ({ q: soal[Number(i)].id, k }));
    try {
      const res = await fetch(`/api/tryout/${tryoutId}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: payload }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j?.error || "Gagal mengirim jawaban.");
      }
      const data = await res.json();
      router.push(`${hasilHref}?attempt=${data.attempt_id ?? ""}`);
    } catch (e) {
      submittedRef.current = false;
      setSubmitting(false);
      setError(e instanceof Error ? e.message : "Terjadi kesalahan.");
    }
  }

  useEffect(() => {
    if (secondsLeft === 0 && total > 0) submit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsLeft]);

  const groups = useMemo(() => {
    const g: { subtes: string; idx: number[] }[] = [];
    soal.forEach((s, i) => {
      const last = g[g.length - 1];
      if (last && last.subtes === s.subtes) last.idx.push(i);
      else g.push({ subtes: s.subtes, idx: [i] });
    });
    return g;
  }, [soal]);

  // Empty state: try out belum punya soal.
  if (total === 0) {
    return (
      <>
        <PortalTopbar eyebrow="Try Out  ›  Pengerjaan" title={judul} nama={nama} />
        <div className="p-5 lg:p-7">
          <div className="mx-auto max-w-md rounded-2xl border bg-white p-10 text-center">
            <FileText className="mx-auto text-ink-muted" size={36} />
            <h2 className="mt-3 text-h-sm text-ink">Soal belum tersedia</h2>
            <p className="mt-1 text-body-sm text-ink-body">Try out ini belum memiliki soal. Silakan pilih try out lain.</p>
            <button onClick={() => router.push("/app/try-out")} className="mt-4 rounded-lg bg-brand px-4 py-2 text-body-sm font-semibold text-white">Kembali ke Daftar Try Out</button>
          </div>
        </div>
      </>
    );
  }

  const q = soal[current];

  const pick = (k: string) => setAnswers((a) => ({ ...a, [current]: k }));
  function toggleRagu() {
    setRagu((prev) => { const n = new Set(prev); n.has(current) ? n.delete(current) : n.add(current); return n; });
  }
  function toggleMark() {
    setMarked((prev) => { const n = new Set(prev); n.has(current) ? n.delete(current) : n.add(current); return n; });
  }
  const go = (i: number) => setCurrent(Math.min(total - 1, Math.max(0, i)));

  function numClass(i: number) {
    if (i === current) return "border-2 border-brand bg-white text-brand";
    if (ragu.has(i)) return "bg-[#E8910B] text-white";
    if (answers[i]) return "bg-[#16B47A] text-white";
    return "border bg-white text-ink-body hover:border-brand/50";
  }

  return (
    <>
      <PortalTopbar
        eyebrow="Try Out  ›  Pengerjaan Try Out"
        title={judul}
        nama={nama}
        right={
          <div className="flex items-center gap-2 rounded-xl border bg-white px-4 py-2">
            <div className="text-right">
              <div className="text-[10px] text-ink-muted">Sisa Waktu</div>
              <div className={cn("text-h-sm tabular-nums", secondsLeft < 300 ? "text-[#E5484D]" : "text-ink")}>{fmt(secondsLeft)}</div>
            </div>
            <button onClick={() => setRunning((r) => !r)} title={running ? "Jeda" : "Lanjutkan"} className="flex h-8 w-8 items-center justify-center rounded-md bg-muted text-ink-body hover:bg-hair">
              {running ? <Pause size={15} /> : <Play size={15} />}
            </button>
          </div>
        }
      />

      <div className="space-y-5 p-5 lg:p-7">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-caption text-ink-muted">
          <span className="flex items-center gap-1"><Calendar size={13} /> {new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</span>
          <span className="flex items-center gap-1"><FileText size={13} /> {total} Soal</span>
          <span className="rounded-md bg-brand-100 px-2 py-0.5 font-semibold text-brand">{tipe}</span>
        </div>

        {!running ? (
          <div className="flex items-center gap-3 rounded-xl border border-[#E8910B]/40 bg-[#FFF8EC] px-4 py-3 text-body-sm text-[#B7791F]">
            <Pause size={16} /> Ujian dijeda. Klik tombol play di kanan atas untuk melanjutkan.
          </div>
        ) : null}
        {error ? (
          <div className="flex items-center gap-3 rounded-xl border border-[#E5484D]/40 bg-[#FDECEC] px-4 py-3 text-body-sm text-[#B4282C]">
            <AlertTriangle size={16} /> {error}
          </div>
        ) : null}

        <div className="grid gap-5 lg:grid-cols-[1fr_340px]">
          {/* LEFT */}
          <div className="space-y-5">
            <div className="rounded-2xl border bg-white p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div><div className="text-caption text-ink-muted">Progress Pengerjaan</div><div className="text-h-md text-ink">{answeredCount} <span className="text-body-sm font-normal text-ink-muted">dari {total} soal ({progress}%)</span></div></div>
                <div className="flex gap-5">
                  <span className="flex items-center gap-1.5 text-body-sm"><CheckCircle2 size={16} className="text-[#16B47A]" /> <b>{answeredCount}</b> <span className="text-ink-muted">Dijawab</span></span>
                  <span className="flex items-center gap-1.5 text-body-sm"><AlertTriangle size={16} className="text-[#E8910B]" /> <b>{raguCount}</b> <span className="text-ink-muted">Ragu-ragu</span></span>
                  <span className="flex items-center gap-1.5 text-body-sm"><XCircle size={16} className="text-[#E5484D]" /> <b>{kosongCount}</b> <span className="text-ink-muted">Kosong</span></span>
                </div>
              </div>
              <div className="mt-3 h-2 rounded-full bg-hair"><div className="h-full rounded-full bg-[#16B47A] transition-all" style={{ width: `${progress}%` }} /></div>
            </div>

            <div className="rounded-2xl border bg-white p-6">
              <div className="flex items-center justify-between">
                <span className="rounded-md bg-brand-100 px-2.5 py-1 text-caption font-semibold text-brand">{q.subtes}</span>
                <button onClick={toggleMark} className={cn("inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-body-sm transition-colors", marked.has(current) ? "border-brand bg-brand-100 text-brand" : "text-ink-body hover:bg-muted")}>
                  <Bookmark size={14} className={marked.has(current) ? "fill-current" : ""} /> {marked.has(current) ? "Ditandai" : "Tandai"}
                </button>
              </div>
              <div className="mt-4 text-caption text-ink-muted">Soal {current + 1} dari {total}</div>
              <p className="mt-2 text-body-lg leading-relaxed text-ink">{q.teks}</p>
              <div className="mt-5 space-y-3">
                {q.pilihan.map((o) => {
                  const sel = answers[current] === o.k;
                  return (
                    <button key={o.k} onClick={() => pick(o.k)} className={cn("flex w-full cursor-pointer items-center gap-3 rounded-xl border p-4 text-left transition-colors", sel ? "border-brand bg-brand-100" : "hover:bg-muted")}>
                      <span className={cn("flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-body-sm font-bold", sel ? "bg-brand text-white" : "border text-ink-body")}>{o.k}</span>
                      <span className={cn("text-body-sm", sel ? "font-medium text-ink" : "text-ink-body")}>{o.t}</span>
                    </button>
                  );
                })}
              </div>
              <div className="mt-4 flex items-center justify-between">
                <button className="inline-flex items-center gap-1.5 text-body-sm text-ink-muted hover:text-ink-body"><Flag size={14} /> Laporkan Soal</button>
                {answers[current] ? <button onClick={() => setAnswers((a) => { const n = { ...a }; delete n[current]; return n; })} className="text-body-sm text-ink-muted hover:text-[#E5484D]">Hapus jawaban</button> : null}
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button onClick={() => go(current - 1)} disabled={current === 0} className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border bg-white px-5 text-label text-ink transition-colors hover:bg-muted disabled:opacity-40"><ArrowLeft size={16} /> Sebelumnya</button>
              <button onClick={toggleRagu} className={cn("inline-flex h-11 items-center justify-center gap-2 rounded-lg border px-5 text-label transition-colors", ragu.has(current) ? "border-[#E8910B] bg-[#FFF1DC] text-[#B7791F]" : "border-[#E8910B] bg-white text-[#B7791F] hover:bg-[#FFF8EC]")}><AlertTriangle size={16} /> {ragu.has(current) ? "Batal Ragu" : "Ragu-ragu"}</button>
              {current === total - 1 ? (
                <button onClick={() => setConfirm(true)} className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#16B47A] px-6 text-label text-white transition-colors hover:opacity-90"><Send size={16} /> Selesai</button>
              ) : (
                <button onClick={() => go(current + 1)} className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-brand px-6 text-label text-white transition-colors hover:bg-brand-600">Selanjutnya <ArrowRight size={16} /></button>
              )}
            </div>
          </div>

          {/* RIGHT */}
          <div className="space-y-5">
            <div className="rounded-2xl border bg-white p-5">
              <div className="text-body-sm font-semibold text-ink">Nomor Soal</div>
              <div className="mt-3 flex flex-wrap gap-3 text-caption text-ink-muted">
                <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-[#16B47A]" /> Dijawab</span>
                <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-[#E8910B]" /> Ragu-ragu</span>
                <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full border bg-white" /> Kosong</span>
              </div>
              <div className={cn("mt-4 space-y-4", !showAll && "max-h-72 overflow-hidden")}>
                {groups.map((g) => (
                  <div key={g.subtes}>
                    <div className="mb-2 text-caption font-semibold text-ink">{g.subtes}</div>
                    <div className="grid grid-cols-5 gap-2">
                      {g.idx.map((i) => (
                        <button key={i} onClick={() => go(i)} className={cn("relative flex h-9 items-center justify-center rounded-md text-body-sm font-semibold transition-colors", numClass(i))}>
                          {i + 1}
                          {marked.has(i) ? <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-brand ring-2 ring-white" /> : null}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={() => setShowAll((v) => !v)} className="mt-4 inline-flex w-full items-center justify-center gap-1 text-body-sm font-semibold text-brand">
                {showAll ? <>Tampilkan Lebih Sedikit <ChevronUp size={14} /></> : <>Lihat Semua Nomor <ChevronDown size={14} /></>}
              </button>
              <button onClick={() => setConfirm(true)} className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-[#16B47A] py-2.5 text-body-sm font-semibold text-white transition-colors hover:opacity-90"><Send size={15} /> Selesaikan Ujian</button>
            </div>

            <div className="rounded-2xl border bg-white p-5">
              <h2 className="text-body-lg font-bold text-ink">Informasi Try Out</h2>
              <div className="mt-3 divide-y text-body-sm">
                {[["Jenis", tipe], ["Total Soal", String(total)], ["Nilai Tiap Soal", `${poinPerSoal} Poin`], ["Skor Maksimal", String(total * poinPerSoal)]].map((r) => (
                  <div key={r[0]} className="flex items-center justify-between py-2.5"><span className="text-ink-muted">{r[0]}</span><span className="font-semibold text-ink">{r[1]}</span></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL KONFIRMASI */}
      {confirm ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button type="button" aria-label="Tutup konfirmasi" className="absolute inset-0 bg-black/40" onClick={() => !submitting && setConfirm(false)} disabled={submitting} />
          <div role="dialog" aria-modal="true" className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-lg">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2 text-h-sm text-ink"><Send size={18} className="text-[#16B47A]" /> Selesaikan Ujian?</div>
              <button onClick={() => setConfirm(false)} disabled={submitting} className="text-ink-muted hover:text-ink disabled:opacity-40"><X size={18} /></button>
            </div>
            <p className="mt-2 text-body-sm text-ink-body">Pastikan kamu sudah memeriksa semua jawaban. Setelah dikirim, jawaban tidak dapat diubah.</p>
            <div className="mt-4 grid grid-cols-3 gap-3 rounded-xl bg-muted p-4 text-center">
              <div><div className="text-h-sm text-[#16B47A]">{answeredCount}</div><div className="text-caption text-ink-muted">Dijawab</div></div>
              <div><div className="text-h-sm text-[#E8910B]">{raguCount}</div><div className="text-caption text-ink-muted">Ragu-ragu</div></div>
              <div><div className="text-h-sm text-[#E5484D]">{kosongCount}</div><div className="text-caption text-ink-muted">Kosong</div></div>
            </div>
            {kosongCount > 0 ? <p className="mt-3 flex items-center gap-1.5 text-caption text-[#B7791F]"><AlertTriangle size={13} /> Masih ada {kosongCount} soal yang belum dijawab.</p> : null}
            {error ? <p className="mt-3 text-caption text-[#B4282C]">{error}</p> : null}
            <div className="mt-5 flex gap-3">
              <button onClick={() => setConfirm(false)} disabled={submitting} className="flex-1 rounded-lg border py-2.5 text-body-sm font-semibold text-ink transition-colors hover:bg-muted disabled:opacity-40">Periksa Lagi</button>
              <button onClick={submit} disabled={submitting} className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#16B47A] py-2.5 text-body-sm font-semibold text-white transition-colors hover:opacity-90 disabled:opacity-60">
                {submitting ? <><Loader2 size={15} className="animate-spin" /> Menilai…</> : "Kirim Jawaban"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
