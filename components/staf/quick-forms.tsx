"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle2 } from "lucide-react";
import { createAnnouncement, createAssignment } from "@/lib/actions/console";

const inputCls = "h-11 w-full rounded-lg border bg-white px-3.5 text-body-sm text-ink placeholder:text-ink-muted focus:border-brand focus:outline-none";
const labelCls = "mb-1.5 block text-body-sm font-semibold text-ink";

function useFormSubmit(action: (fd: FormData) => Promise<{ ok: boolean; error?: string }>, redirectTo: string) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true); setError(null);
    const res = await action(new FormData(e.currentTarget));
    setLoading(false);
    if (res.ok) { setDone(true); setTimeout(() => router.refresh(), 700); }
    else setError(res.error ?? "Gagal menyimpan.");
  }
  return { loading, error, done, onSubmit, redirectTo };
}

function Submitted({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 rounded-lg bg-success-subtle px-4 py-3 text-body-sm font-semibold text-success-strong">
      <CheckCircle2 size={18} /> {label}
    </div>
  );
}

export function AnnouncementForm() {
  const { loading, error, done, onSubmit } = useFormSubmit(createAnnouncement, "/staf/pengumuman");
  if (done) return <Submitted label="Pengumuman terkirim." />;
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div><label className={labelCls}>Judul</label><input name="judul" required className={inputCls} placeholder="mis. Jadwal Try Out Akbar" /></div>
      <div><label className={labelCls}>Isi</label><textarea name="isi" required rows={4} className="w-full rounded-lg border bg-white px-3.5 py-2.5 text-body-sm text-ink placeholder:text-ink-muted focus:border-brand focus:outline-none" placeholder="Tulis pengumuman…" /></div>
      {error ? <p className="rounded-lg bg-[#FDECEC] px-3.5 py-2.5 text-body-sm text-[#E5484D]">{error}</p> : null}
      <button disabled={loading} className="inline-flex h-11 items-center gap-2 rounded-lg bg-brand px-6 text-body-sm font-semibold text-white hover:bg-brand-600 disabled:opacity-60">{loading ? <Loader2 size={16} className="animate-spin" /> : null} Kirim Pengumuman</button>
    </form>
  );
}

export function AssignmentForm() {
  const { loading, error, done, onSubmit } = useFormSubmit(createAssignment, "/staf/penugasan");
  if (done) return <Submitted label="Penugasan dibuat." />;
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div><label className={labelCls}>Judul Tugas</label><input name="judul" required className={inputCls} placeholder="mis. Latihan Penalaran Umum Bab 3" /></div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div><label className={labelCls}>Tipe</label><select name="ref_tipe" className={inputCls}><option value="tryout">Try Out</option><option value="materi">Materi</option><option value="latihan">Latihan</option></select></div>
        <div><label className={labelCls}>Target Kelas</label><input name="target_kelas" className={inputCls} placeholder="XII IPA 1" /></div>
      </div>
      <div><label className={labelCls}>Batas Waktu</label><input name="due_at" type="date" className={inputCls} /></div>
      {error ? <p className="rounded-lg bg-[#FDECEC] px-3.5 py-2.5 text-body-sm text-[#E5484D]">{error}</p> : null}
      <button disabled={loading} className="inline-flex h-11 items-center gap-2 rounded-lg bg-brand px-6 text-body-sm font-semibold text-white hover:bg-brand-600 disabled:opacity-60">{loading ? <Loader2 size={16} className="animate-spin" /> : null} Buat Penugasan</button>
    </form>
  );
}
