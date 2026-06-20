"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle2 } from "lucide-react";
import { createTryOut } from "@/lib/actions/console";

const inputCls = "h-11 w-full rounded-lg border bg-white px-3.5 text-body-sm text-ink placeholder:text-ink-muted focus:border-brand focus:outline-none";
const labelCls = "mb-1.5 block text-body-sm font-semibold text-ink";

export function TryOutForm({ totalSoal }: { totalSoal: number }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    const res = await createTryOut(fd);
    setLoading(false);
    if (!res.ok) { setError(res.error ?? "Gagal menyimpan."); return; }
    setDone(true);
    setTimeout(() => router.push("/staf/try-out"), 1200);
  }

  if (done) {
    return (
      <div className="py-10 text-center">
        <CheckCircle2 size={40} className="mx-auto text-[#16B47A]" />
        <p className="mt-3 text-body-sm font-semibold text-ink">Try Out berhasil dibuat!</p>
        <p className="mt-1 text-caption text-ink-muted">Mengalihkan ke daftar try out…</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {error ? <p className="rounded-lg bg-[#FDECEC] px-3.5 py-2.5 text-body-sm text-[#E5484D]">{error}</p> : null}
      <div><label className={labelCls} htmlFor="tryout-title">Judul Try Out</label><input id="tryout-title" name="judul" required className={inputCls} placeholder="mis. Try Out Nasional #5" /></div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div><label className={labelCls} htmlFor="tryout-type">Tipe</label><select id="tryout-type" name="tipe" className={inputCls}><option>SNBT</option><option>SKD CPNS</option><option>Mandiri</option></select></div>
        <div><label className={labelCls} htmlFor="tryout-duration">Durasi (menit)</label><input id="tryout-duration" name="durasi" type="number" className={inputCls} defaultValue={100} /></div>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div><label className={labelCls} htmlFor="tryout-question-count">Jumlah Soal</label><input id="tryout-question-count" name="jumlah_soal" type="number" className={inputCls} defaultValue={20} /></div>
        <div><label className={labelCls} htmlFor="tryout-price">Harga (Rp)</label><input id="tryout-price" name="harga" type="number" className={inputCls} defaultValue={0} /></div>
      </div>
      <div>
        <div className={labelCls}>Pemilihan Soal</div>
        <div className="rounded-lg border border-dashed bg-muted/40 p-4 text-body-sm text-ink-muted">
          Soal akan diambil secara acak dari bank ({totalSoal} tersedia) sesuai jumlah yang ditentukan.
          {totalSoal === 0 ? <span className="mt-1 block text-[#E5484D]">Bank soal kosong — tambahkan soal di Admin → Bank Soal terlebih dahulu.</span> : null}
        </div>
      </div>
      <button type="submit" disabled={loading} className="inline-flex h-11 items-center gap-2 rounded-lg bg-brand px-6 text-body-sm font-semibold text-white hover:bg-brand-600 disabled:opacity-60">
        {loading ? <><Loader2 size={16} className="animate-spin" /> Menyimpan…</> : "Simpan Paket"}
      </button>
    </form>
  );
}
