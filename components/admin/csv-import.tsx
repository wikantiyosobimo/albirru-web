"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, FileText, Loader2, CheckCircle2, AlertTriangle, X } from "lucide-react";

type Result = { inserted: number; ditolak: number; errors: { baris: number; alasan: string }[] };

const TEMPLATE = `kode,mapel,topic_slug,level_kesulitan,tipe,cognitive_skill,soal,opsi_a,opsi_b,opsi_c,opsi_d,opsi_e,answer_key,pembahasan
PU-001,Penalaran Umum,,3,pilihan_ganda,analisis,"Jika semua A adalah B, dan semua B adalah C, maka...",Semua A adalah C,Sebagian A adalah C,Tidak ada A yang C,Semua C adalah A,Tidak dapat disimpulkan,A,"Silogisme transitif: A⊂B⊂C maka A⊂C."`;

export function CsvImport() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);

  function downloadTemplate() {
    const blob = new Blob([TEMPLATE], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "template-soal-albirru.csv"; a.click();
    URL.revokeObjectURL(url);
  }

  async function process() {
    if (!file) return;
    setBusy(true); setError(null); setResult(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/questions/import", { method: "POST", body: fd });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) { setError(j?.error ?? "Gagal memproses file."); return; }
      setResult(j as Result);
      router.refresh();
    } catch {
      setError("Terjadi kesalahan jaringan.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      {!file ? (
        <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed bg-muted/40 px-6 py-14 text-center transition-colors hover:border-brand hover:bg-brand-100/30">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-100 text-brand"><Upload size={26} /></span>
          <span className="mt-3 text-body-lg font-semibold text-ink">Pilih file CSV</span>
          <span className="mt-1 text-body-sm text-ink-muted">atau seret ke sini · maks 5MB</span>
          <input ref={inputRef} type="file" accept=".csv,text/csv" className="hidden"
            onChange={(e) => { setFile(e.target.files?.[0] ?? null); setResult(null); setError(null); }} />
        </label>
      ) : (
        <div className="flex items-center gap-3 rounded-2xl border bg-white px-4 py-3.5">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-100 text-brand"><FileText size={18} /></span>
          <div className="min-w-0 flex-1">
            <div className="truncate text-body-sm font-semibold text-ink">{file.name}</div>
            <div className="text-caption text-ink-muted">{(file.size / 1024).toFixed(1)} KB</div>
          </div>
          <button onClick={() => { setFile(null); setResult(null); if (inputRef.current) inputRef.current.value = ""; }} disabled={busy} aria-label="Hapus file" className="text-ink-muted hover:text-ink disabled:opacity-40"><X size={18} /></button>
        </div>
      )}

      {error ? <p className="mt-3 rounded-lg bg-[#FDECEC] px-3.5 py-2.5 text-body-sm text-[#E5484D]">{error}</p> : null}

      {result ? (
        <div className="mt-4 space-y-3">
          <div className="flex items-center gap-2 rounded-lg bg-success-subtle px-3.5 py-3 text-body-sm text-success-strong">
            <CheckCircle2 size={18} className="shrink-0" />
            <span><b>{result.inserted}</b> soal berhasil diimport{result.ditolak > 0 ? <>, <b>{result.ditolak}</b> ditolak.</> : "."}</span>
          </div>
          {result.errors.length > 0 ? (
            <div className="rounded-lg border border-[#FCD34D] bg-[#FEF3C7] p-3.5">
              <div className="flex items-center gap-1.5 text-body-sm font-semibold text-[#92400E]"><AlertTriangle size={15} /> Baris ditolak</div>
              <ul className="mt-2 space-y-1 text-caption text-[#92400E]">
                {result.errors.map((er, i) => <li key={i}>Baris {er.baris}: {er.alasan}</li>)}
              </ul>
            </div>
          ) : null}
        </div>
      ) : null}

      <div className="mt-4 flex items-center justify-between">
        <button onClick={downloadTemplate} className="inline-flex items-center gap-1.5 text-body-sm font-semibold text-brand hover:underline"><FileText size={15} /> Unduh template CSV</button>
        <button onClick={process} disabled={!file || busy}
          className="inline-flex h-10 items-center gap-2 rounded-lg bg-brand px-5 text-body-sm font-semibold text-white hover:bg-brand-600 disabled:opacity-50">
          {busy ? <><Loader2 size={15} className="animate-spin" /> Memproses…</> : <><Upload size={15} /> Proses Import</>}
        </button>
      </div>
    </div>
  );
}
