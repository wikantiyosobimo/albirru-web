"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle2 } from "lucide-react";
import { createMaterial } from "@/lib/actions/console";

export function MaterialForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true); setError(null);
    const res = await createMaterial(new FormData(e.currentTarget));
    setLoading(false);
    if (res.ok) { setDone(true); setTimeout(() => router.push("/staf/materi"), 900); }
    else setError(res.error ?? "Gagal menyimpan.");
  }

  if (done) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border bg-white px-6 py-14 text-center">
        <CheckCircle2 size={44} className="text-success" />
        <div className="text-body-lg font-bold text-ink">Materi tersimpan</div>
        <p className="text-body-sm text-ink-muted">Mengalihkan ke daftar materi…</p>
      </div>
    );
  }

  const inputCls = "h-11 w-full rounded-lg border bg-white px-3.5 text-body-sm text-ink placeholder:text-ink-muted focus:border-brand focus:outline-none";
  const labelCls = "mb-1.5 block text-body-sm font-semibold text-ink";

  return (
    <form onSubmit={onSubmit} className="max-w-2xl space-y-5 rounded-2xl border bg-white p-6">
      <div>
        <label className={labelCls} htmlFor="judul">Judul Materi</label>
        <input id="judul" name="judul" required className={inputCls} placeholder="mis. Teknik Cepat Penalaran Umum" />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={labelCls} htmlFor="tipe">Tipe</label>
          <select id="tipe" name="tipe" className={inputCls}>
            <option value="artikel">Artikel</option>
            <option value="video">Video</option>
            <option value="latihan">Latihan</option>
            <option value="live">Kelas Live</option>
            <option value="pdf">PDF</option>
          </select>
        </div>
        <div>
          <label className={labelCls} htmlFor="durasi">Durasi (menit)</label>
          <input id="durasi" name="durasi" type="number" min={0} className={inputCls} placeholder="15" />
        </div>
      </div>
      <div>
        <label className={labelCls} htmlFor="url">URL Konten (opsional)</label>
        <input id="url" name="url" className={inputCls} placeholder="https://… (video/PDF)" />
      </div>
      <label className="flex items-center gap-2.5 text-body-sm text-ink">
        <input type="checkbox" name="is_premium" className="h-4 w-4 rounded border-hair text-brand" /> Tandai sebagai materi Premium
      </label>

      {error ? <p className="rounded-lg bg-[#FDECEC] px-3.5 py-2.5 text-body-sm text-[#E5484D]">{error}</p> : null}

      <button disabled={loading} className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-brand px-6 text-body-sm font-semibold text-white hover:bg-brand-600 disabled:opacity-60">
        {loading ? <Loader2 size={16} className="animate-spin" /> : null} Simpan Materi
      </button>
    </form>
  );
}
