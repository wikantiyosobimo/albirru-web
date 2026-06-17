"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Bell, Loader2, X, ShieldCheck, Clock, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export type RegStatus = "none" | "paid" | "registered";

type Props = {
  tryoutId: string;
  plan: string;          // 'free' | 'pro' | 'siswa_albirru'
  harga: number;         // 0 = gratis
  hargaLabel: string;    // "Rp 29.000" | "Gratis"
  started: boolean;
  selesai: boolean;
  initialStatus: RegStatus;
  variant?: "list" | "block";
};

const QR_N = 25;
function pseudoQR(seed: string): boolean[][] {
  let h = 2166136261;
  for (const c of seed) h = (Math.imul(h ^ c.charCodeAt(0), 16777619)) >>> 0;
  const grid: boolean[][] = [];
  for (let y = 0; y < QR_N; y++) {
    const row: boolean[] = [];
    for (let x = 0; x < QR_N; x++) {
      h = (Math.imul(h, 1103515245) + 12345 + x * 7 + y * 13) >>> 0;
      row.push(((h >>> 17) & 1) === 1);
    }
    grid.push(row);
  }
  // finder patterns di 3 sudut
  const stamp = (ox: number, oy: number) => {
    for (let y = 0; y < 7; y++) for (let x = 0; x < 7; x++) {
      const edge = x === 0 || x === 6 || y === 0 || y === 6;
      const core = x >= 2 && x <= 4 && y >= 2 && y <= 4;
      grid[oy + y][ox + x] = edge || core;
    }
  };
  stamp(0, 0); stamp(QR_N - 7, 0); stamp(0, QR_N - 7);
  return grid;
}

export function TryoutCta({ tryoutId, plan, harga, hargaLabel, started, selesai, initialStatus, variant = "list" }: Props) {
  const router = useRouter();
  const [status, setStatus] = useState<RegStatus>(initialStatus);
  const [showPay, setShowPay] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isPro = plan !== "free";
  const free = harga === 0;
  const block = variant === "block";
  const canStart = started && (free || status === "registered");
  const base = `/app/try-out/${tryoutId}`;
  const sz = block ? "h-11 w-full" : "h-10";

  async function call(path: "pay" | "register") {
    setBusy(true); setError(null);
    try {
      const res = await fetch(`/api/tryout/${tryoutId}/${path}`, { method: "POST" });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(j?.error || "Gagal memproses.");
      return j.status as RegStatus;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Terjadi kesalahan.");
      return null;
    } finally {
      setBusy(false);
    }
  }

  async function onPaid() {
    const s = await call("pay");
    if (s) { setStatus("paid"); setShowPay(false); router.refresh(); }
  }
  async function onRegister() {
    const s = await call("register");
    if (s) { setStatus("registered"); router.refresh(); }
  }

  // ---- pilih tombol sesuai state ----
  let btn: React.ReactNode;

  if (selesai) {
    btn = <Link href={`${base}/hasil`} className={cn("inline-flex items-center justify-center rounded-lg border bg-white px-5 text-body-sm font-semibold text-ink transition-colors hover:bg-muted", sz)}>Lihat Hasil</Link>;
  } else if (canStart) {
    btn = <Link href={`${base}/kerjakan`} className={cn("inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#16B47A] px-6 text-body-sm font-semibold text-white transition-colors hover:opacity-90", sz)}>{block ? "Mulai Kerjakan" : "Mulai"}</Link>;
  } else if (status === "registered") {
    btn = <button disabled className={cn("inline-flex items-center justify-center gap-1.5 rounded-lg bg-muted px-6 text-body-sm font-semibold text-ink-muted", sz)}><Clock size={14} /> {block ? "Menunggu Jadwal" : "Tunggu"}</button>;
  } else if (isPro || status === "paid" || free) {
    btn = <button onClick={onRegister} disabled={busy} className={cn("inline-flex items-center justify-center gap-1.5 rounded-lg bg-brand px-6 text-body-sm font-semibold text-white transition-colors hover:bg-brand-600 disabled:opacity-60", sz)}>{busy ? <Loader2 size={15} className="animate-spin" /> : null} {block ? "Daftar Sekarang" : "Daftar"}</button>;
  } else {
    btn = <button onClick={() => setShowPay(true)} className={cn("inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#E8910B] px-6 text-body-sm font-semibold text-white transition-colors hover:opacity-90", sz)}>{block ? "Bayar Sekarang" : "Bayar"}</button>;
  }

  const qr = showPay ? pseudoQR(tryoutId) : null;

  return (
    <>
      <div className={block ? "" : "inline-block"}>
        {btn}
        {error && !showPay ? <p className="mt-1 text-[11px] text-[#E5484D]">{error}</p> : null}
      </div>

      {/* MODAL QRIS */}
      {showPay ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button type="button" aria-label="Tutup pembayaran" className="absolute inset-0 bg-black/40" onClick={() => !busy && setShowPay(false)} disabled={busy} />
          <div role="dialog" aria-modal="true" className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-lg">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-h-sm text-ink">Pembayaran QRIS</div>
                <p className="text-caption text-ink-muted">Scan untuk menyelesaikan pendaftaran</p>
              </div>
              <button onClick={() => setShowPay(false)} disabled={busy} className="text-ink-muted hover:text-ink disabled:opacity-40"><X size={18} /></button>
            </div>

            <div className="mt-4 rounded-xl border p-4">
              <div className="flex items-center justify-between">
                <span className="text-body-sm font-bold tracking-tight text-[#E8910B]">QRIS</span>
                <span className="text-caption text-ink-muted">Albirru Online</span>
              </div>
              <div className="mx-auto mt-3 w-fit rounded-lg bg-white p-2 ring-1 ring-hair">
                <svg viewBox={`0 0 ${QR_N} ${QR_N}`} className="h-44 w-44" shapeRendering="crispEdges">
                  <rect width={QR_N} height={QR_N} fill="#ffffff" />
                  {qr!.map((row, y) => row.map((on, x) => on ? <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill="#0f172a" /> : null))}
                </svg>
              </div>
              <div className="mt-3 text-center">
                <div className="text-caption text-ink-muted">Total Pembayaran</div>
                <div className="text-h-md text-ink">{hargaLabel}</div>
              </div>
            </div>

            {error ? <p className="mt-3 text-center text-caption text-[#E5484D]">{error}</p> : null}
            <p className="mt-3 flex items-center justify-center gap-1.5 text-caption text-ink-muted"><ShieldCheck size={13} /> Pembayaran simulasi untuk demo</p>

            <button onClick={onPaid} disabled={busy} className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#16B47A] text-label text-white transition-colors hover:opacity-90 disabled:opacity-60">
              {busy ? <><Loader2 size={16} className="animate-spin" /> Memverifikasi…</> : <><Check size={16} /> Saya Sudah Membayar</>}
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}

// Banner ajakan upgrade untuk user free.
export function UpgradeBanner() {
  return (
    <Link href="/harga" className="flex items-center gap-3 rounded-2xl border border-brand/30 bg-brand-100 p-4 transition-colors hover:bg-brand-100/70">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand text-white">★</span>
      <div className="flex-1">
        <div className="text-body-sm font-bold text-ink">Upgrade ke Pro untuk akses tak terbatas ke semua try out & soal</div>
        <div className="text-caption text-ink-muted">Tanpa bayar per try out — kerjakan semuanya sepuasnya.</div>
      </div>
      <span className="hidden shrink-0 rounded-lg bg-brand px-4 py-2 text-body-sm font-semibold text-white sm:block">Upgrade</span>
    </Link>
  );
}
