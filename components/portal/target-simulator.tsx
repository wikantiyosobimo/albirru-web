"use client";

import { useState } from "react";
import { Ring } from "@/components/portal/ring";
import { peluangLolos, warnaPeluang } from "@/lib/portal/peluang";

export function TargetSimulator({ skorAwal, targetSkor, scoreMax, peluangNoun }: {
  skorAwal: number; targetSkor: number; scoreMax: number; peluangNoun: string;
}) {
  const [skor, setSkor] = useState(skorAwal);
  const peluang = peluangLolos(skor, targetSkor);
  const color = warnaPeluang(peluang);
  const gap = Math.max(0, targetSkor - skor);

  return (
    <div className="rounded-2xl border bg-white p-6">
      <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center">
        <Ring value={peluang} size={150} stroke={13} color={color}>
          <span className="text-[2rem] font-extrabold leading-none text-ink">{peluang}%</span>
          <span className="text-caption text-ink-muted">Peluang Lolos</span>
        </Ring>
        <div className="flex-1">
          <label htmlFor="sim" className="text-body-sm font-semibold text-ink">Geser skor simulasimu</label>
          <input
            id="sim" type="range" min={Math.round(scoreMax * 0.3)} max={scoreMax} value={skor}
            onChange={(e) => setSkor(Number(e.target.value))}
            className="mt-3 w-full accent-[var(--blue-500)]"
            aria-valuetext={`Skor ${skor}, peluang ${peluang} persen`}
          />
          <div className="mt-2 flex items-center justify-between text-caption text-ink-muted">
            <span>{Math.round(scoreMax * 0.3)}</span>
            <span className="text-h-sm font-extrabold text-ink">{skor}</span>
            <span>{scoreMax}</span>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-3 text-center">
            <div className="rounded-xl bg-muted p-3"><div className="text-caption text-ink-muted">Skor</div><div className="text-h-sm text-ink">{skor}</div></div>
            <div className="rounded-xl bg-muted p-3"><div className="text-caption text-ink-muted">Target</div><div className="text-h-sm text-ink">{targetSkor}</div></div>
            <div className="rounded-xl bg-muted p-3"><div className="text-caption text-ink-muted">Gap</div><div className="text-h-sm" style={{ color }}>{gap}</div></div>
          </div>
          <p className="mt-3 text-caption text-ink-muted">
            Jika skormu <b className="text-ink">{skor}</b>, peluang lolos ke {peluangNoun} targetmu sekitar <b style={{ color }}>{peluang}%</b>.
            {gap > 0 ? <> Tingkatkan <b className="text-ink">{gap} poin</b> lagi untuk mencapai target aman.</> : <> Kamu sudah di atas target aman! 🎉</>}
          </p>
        </div>
      </div>
    </div>
  );
}
