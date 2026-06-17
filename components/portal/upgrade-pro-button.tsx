"use client";

import { useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Loader2, X, Check, ShieldCheck, Gem } from "lucide-react";

const QR_N = 25;
function pseudoQR(seed: string): boolean[][] {
  let h = 2166136261;
  for (const c of seed) h = (Math.imul(h ^ c.charCodeAt(0), 16777619)) >>> 0;
  const g: boolean[][] = [];
  for (let y = 0; y < QR_N; y++) {
    const row: boolean[] = [];
    for (let x = 0; x < QR_N; x++) { h = (Math.imul(h, 1103515245) + 12345 + x * 7 + y * 13) >>> 0; row.push(((h >>> 17) & 1) === 1); }
    g.push(row);
  }
  const stamp = (ox: number, oy: number) => { for (let y = 0; y < 7; y++) for (let x = 0; x < 7; x++) { const e = x === 0 || x === 6 || y === 0 || y === 6; const c = x >= 2 && x <= 4 && y >= 2 && y <= 4; g[oy + y][ox + x] = e || c; } };
  stamp(0, 0); stamp(QR_N - 7, 0); stamp(0, QR_N - 7);
  return g;
}

export function UpgradeProButton({ className, children }: { className?: string; children: ReactNode }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function pay() {
    setBusy(true); setError(null);
    try {
      const res = await fetch("/api/upgrade-pro", { method: "POST" });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(j?.error || "Gagal memproses.");
      setDone(true);
      setTimeout(() => { setOpen(false); setDone(false); router.refresh(); }, 1400);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Terjadi kesalahan.");
    } finally {
      setBusy(false);
    }
  }

  const qr = open ? pseudoQR("albirru-pro") : null;

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={className}>{children}</button>

      {open ? (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4" onClick={() => !busy && setOpen(false)}>
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-lg" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2 text-h-sm text-ink"><Gem size={18} className="text-brand" /> Albirru Pro</div>
              <button onClick={() => setOpen(false)} disabled={busy} className="text-ink-muted hover:text-ink disabled:opacity-40"><X size={18} /></button>
            </div>

            {done ? (
              <div className="py-8 text-center">
                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-success-subtle text-success"><Check size={28} /></span>
                <h3 className="mt-3 text-h-sm text-ink">Selamat, kamu Pro! 🎉</h3>
                <p className="mt-1 text-body-sm text-ink-body">Akses semua try out & soal kini terbuka.</p>
              </div>
            ) : (
              <>
                <p className="mt-1 text-body-sm text-ink-body">Akses tak terbatas ke semua try out, soal, dan analisis premium.</p>
                <div className="mt-4 rounded-xl border p-4">
                  <div className="flex items-center justify-between"><span className="text-body-sm font-bold tracking-tight text-[#E8910B]">QRIS</span><span className="text-caption text-ink-muted">Albirru Online</span></div>
                  <div className="mx-auto mt-3 w-fit rounded-lg bg-white p-2 ring-1 ring-hair">
                    <svg viewBox={`0 0 ${QR_N} ${QR_N}`} className="h-44 w-44" shapeRendering="crispEdges">
                      <rect width={QR_N} height={QR_N} fill="#ffffff" />
                      {qr!.map((row, y) => row.map((on, x) => on ? <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill="#0f172a" /> : null))}
                    </svg>
                  </div>
                  <div className="mt-3 text-center"><div className="text-caption text-ink-muted">Albirru Pro · 1 bulan</div><div className="text-h-md text-ink">Rp 49.000</div></div>
                </div>
                {error ? <p className="mt-3 text-center text-caption text-[#E5484D]">{error}</p> : null}
                <p className="mt-3 flex items-center justify-center gap-1.5 text-caption text-ink-muted"><ShieldCheck size={13} /> Pembayaran simulasi untuk demo</p>
                <button onClick={pay} disabled={busy} className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#16B47A] text-label text-white transition-colors hover:opacity-90 disabled:opacity-60">
                  {busy ? <><Loader2 size={16} className="animate-spin" /> Memverifikasi…</> : <><Check size={16} /> Saya Sudah Membayar</>}
                </button>
              </>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
}
