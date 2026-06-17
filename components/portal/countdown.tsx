"use client";

import { useEffect, useState } from "react";

// Hitung mundur ke target (ISO string). Menampilkan Hari/Jam/Menit/Detik.
export function Countdown({ target, variant = "light" }: { target: string; variant?: "light" | "dark" }) {
  const [now, setNow] = useState<number>(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const diff = Math.max(0, new Date(target).getTime() - now);
  const hari = Math.floor(diff / 86400000);
  const jam = Math.floor((diff % 86400000) / 3600000);
  const menit = Math.floor((diff % 3600000) / 60000);
  const detik = Math.floor((diff % 60000) / 1000);
  const pad = (n: number) => String(n).padStart(2, "0");

  const cells: [string, number][] = [["Hari", hari], ["Jam", jam], ["Menit", menit], ["Detik", detik]];
  const box = variant === "dark"
    ? "bg-white/10 text-white"
    : "bg-muted text-ink";
  const sub = variant === "dark" ? "text-white/60" : "text-ink-muted";

  return (
    <div className="grid grid-cols-4 gap-2">
      {cells.map(([label, val]) => (
        <div key={label} className={`rounded-lg px-1 py-2 text-center ${box}`}>
          <div className="text-h-sm font-extrabold tabular-nums leading-none">{pad(val)}</div>
          <div className={`mt-1 text-[10px] ${sub}`}>{label}</div>
        </div>
      ))}
    </div>
  );
}
