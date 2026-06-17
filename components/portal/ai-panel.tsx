"use client";

import { useState } from "react";
import { Sparkles, Loader2, TrendingUp, Calendar, Target, RefreshCw, FileText, ChevronRight } from "lucide-react";

async function postJson(url: string) {
  const res = await fetch(url, { method: "POST" });
  if (!res.ok) throw new Error((await res.json().catch(() => ({})))?.error ?? `Error ${res.status}`);
  return res.json();
}

// ── Tipe respons ──
type Prioritas = { topicId: string; weakness_index: number; prioritas_skor: number; rank: number };
type Blok = { hari: string; topicId: string; judul: string; durasi_menit: number };
type Misi = { kode: string; tipe: string; judul: string; deskripsi: string; target: number; xp: number };
type RecResp = { hasData: boolean; prioritas: Prioritas[]; rencana_mingguan: { blok: Blok[]; total_menit: number }; misi: Misi[]; estimasi_dampak_poin: number; catatan: string | null };
type ReportResp = { source: string; report: { judul: string; ringkasan: string; poin_kuat: string[]; poin_lemah: string[]; rekomendasi: string[]; motivasi: string }; prediksi: { proyeksi: number; bawah: number; atas: number; keyakinan: number } };

const HARI_LABEL: Record<string, string> = { sen: "Sen", sel: "Sel", rab: "Rab", kam: "Kam", jum: "Jum", sab: "Sab", min: "Min" };

// ═══════════ Rekomendasi (Navigator) ═══════════
export function AiRecommendationsButton() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<RecResp | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function run() {
    setLoading(true); setError(null);
    try { setData(await postJson("/api/ai/recommendations")); }
    catch (e) { setError(e instanceof Error ? e.message : "Gagal"); }
    finally { setLoading(false); }
  }

  return (
    <div>
      <button onClick={run} disabled={loading} className="inline-flex h-10 items-center gap-2 rounded-lg bg-brand px-4 text-body-sm font-semibold text-white transition-colors hover:bg-brand-600 disabled:opacity-60">
        {loading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />} {data ? "Perbarui Rekomendasi" : "Buat Rekomendasi AI"}
      </button>
      {error ? <p className="mt-3 rounded-lg bg-[#FDECEC] px-3.5 py-2.5 text-body-sm text-[#E5484D]">{error}</p> : null}

      {data ? (
        <div className="mt-4 space-y-4">
          {data.catatan ? <p className="rounded-lg bg-[#FEF3C7] px-3.5 py-2 text-caption text-[#92400E]">{data.catatan}</p> : null}
          <div className="flex items-center gap-2 rounded-xl bg-success-subtle px-4 py-3 text-body-sm font-semibold text-success-strong">
            <TrendingUp size={18} /> Estimasi dampak: +{data.estimasi_dampak_poin} poin bila prioritas ditutup.
          </div>

          <div className="rounded-2xl border bg-white p-5">
            <h3 className="flex items-center gap-2 text-h-sm text-ink"><Target size={17} className="text-brand" /> Prioritas Fokus</h3>
            <div className="mt-3 space-y-2">
              {data.prioritas.map((p) => (
                <div key={p.topicId} className="flex items-center gap-3 rounded-lg bg-muted/50 px-3 py-2.5">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand text-caption font-bold text-white">{p.rank}</span>
                  <span className="flex-1 text-body-sm font-semibold capitalize text-ink">{p.topicId.replace(/-/g, " ")}</span>
                  <span className="rounded-md bg-[#FDECEC] px-2 py-0.5 text-[11px] font-bold text-[#E5484D]">weakness {p.weakness_index}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border bg-white p-5">
            <h3 className="flex items-center gap-2 text-h-sm text-ink"><Calendar size={17} className="text-brand" /> Rencana Mingguan <span className="text-caption font-normal text-ink-muted">({data.rencana_mingguan.total_menit} menit)</span></h3>
            <div className="mt-3 space-y-1.5">
              {data.rencana_mingguan.blok.slice(0, 7).map((b, i) => (
                <div key={i} className="flex items-center gap-3 text-body-sm">
                  <span className="w-9 shrink-0 rounded-md bg-brand-100 py-1 text-center text-[11px] font-bold text-brand">{HARI_LABEL[b.hari] ?? b.hari}</span>
                  <span className="flex-1 capitalize text-ink-body">{b.judul}</span>
                  <span className="text-caption text-ink-muted">{b.durasi_menit}m</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

// ═══════════ Misi Harian (Journey) ═══════════
export function AiMissionsButton() {
  const [loading, setLoading] = useState(false);
  const [misi, setMisi] = useState<Misi[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function run() {
    setLoading(true); setError(null);
    try { const d = await postJson("/api/ai/missions"); setMisi(d.misi ?? []); }
    catch (e) { setError(e instanceof Error ? e.message : "Gagal"); }
    finally { setLoading(false); }
  }

  return (
    <div>
      <button onClick={run} disabled={loading} className="inline-flex h-10 items-center gap-2 rounded-lg border bg-white px-4 text-body-sm font-semibold text-ink transition-colors hover:bg-muted disabled:opacity-60">
        {loading ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={15} />} Generate Misi AI
      </button>
      {error ? <p className="mt-3 rounded-lg bg-[#FDECEC] px-3.5 py-2.5 text-body-sm text-[#E5484D]">{error}</p> : null}
      {misi ? (
        <div className="mt-4 space-y-2">
          {misi.map((m) => (
            <div key={m.kode} className="flex items-center gap-3 rounded-xl border bg-white p-3.5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-100 text-brand"><Sparkles size={16} /></span>
              <div className="min-w-0 flex-1"><div className="truncate text-body-sm font-semibold capitalize text-ink">{m.judul}</div><div className="truncate text-caption text-ink-muted">{m.deskripsi}</div></div>
              <span className="shrink-0 rounded-md bg-[#FFF1DC] px-2 py-0.5 text-[11px] font-bold text-[#B7791F]">+{m.xp} XP</span>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

// ═══════════ Laporan Mingguan (Intelligence) ═══════════
export function AiReportButton() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ReportResp | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function run() {
    setLoading(true); setError(null);
    try { setData(await postJson("/api/ai/report")); }
    catch (e) { setError(e instanceof Error ? e.message : "Gagal"); }
    finally { setLoading(false); }
  }

  return (
    <div>
      <button onClick={run} disabled={loading} className="inline-flex h-10 items-center gap-2 rounded-lg bg-brand px-4 text-body-sm font-semibold text-white transition-colors hover:bg-brand-600 disabled:opacity-60">
        {loading ? <Loader2 size={16} className="animate-spin" /> : <FileText size={16} />} {data ? "Perbarui Laporan" : "Generate Laporan Mingguan"}
      </button>
      {error ? <p className="mt-3 rounded-lg bg-[#FDECEC] px-3.5 py-2.5 text-body-sm text-[#E5484D]">{error}</p> : null}
      {data ? (
        <div className="mt-4 rounded-2xl border bg-white p-5">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-h-sm text-ink">{data.report.judul}</h3>
            <span className="rounded-md bg-muted px-2 py-0.5 text-[11px] font-semibold text-ink-muted">{data.source === "claude" ? "AI" : "Otomatis"}</span>
          </div>
          <p className="mt-2 text-body-sm text-ink-body">{data.report.ringkasan}</p>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {data.report.poin_kuat.length ? (
              <div><div className="text-caption font-bold uppercase tracking-wide text-success-strong">Kekuatan</div><ul className="mt-1.5 space-y-1">{data.report.poin_kuat.map((p) => <li key={p} className="flex gap-2 text-body-sm text-ink-body"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-success" />{p}</li>)}</ul></div>
            ) : null}
            {data.report.poin_lemah.length ? (
              <div><div className="text-caption font-bold uppercase tracking-wide text-[#C13030]">Area Perbaikan</div><ul className="mt-1.5 space-y-1">{data.report.poin_lemah.map((p) => <li key={p} className="flex gap-2 text-body-sm text-ink-body"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#E5484D]" /><span className="capitalize">{p}</span></li>)}</ul></div>
            ) : null}
          </div>

          {data.report.rekomendasi.length ? (
            <div className="mt-4">
              <div className="text-caption font-bold uppercase tracking-wide text-brand">Rekomendasi</div>
              <ul className="mt-1.5 space-y-1.5">{data.report.rekomendasi.map((r) => <li key={r} className="flex items-start gap-2 text-body-sm text-ink-body"><ChevronRight size={15} className="mt-0.5 shrink-0 text-brand" /><span className="capitalize">{r}</span></li>)}</ul>
            </div>
          ) : null}

          <div className="mt-4 rounded-xl bg-brand-100/50 p-3.5">
            <div className="text-caption text-ink-muted">Proyeksi skor hari-H</div>
            <div className="text-h-md text-ink">{data.prediksi.proyeksi} <span className="text-body-sm font-normal text-ink-muted">({data.prediksi.bawah}–{data.prediksi.atas}, yakin {Math.round(data.prediksi.keyakinan * 100)}%)</span></div>
          </div>
          <p className="mt-3 text-body-sm font-medium italic text-ink">{data.report.motivasi}</p>
        </div>
      ) : null}
    </div>
  );
}
