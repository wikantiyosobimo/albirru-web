"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";

export function ExportButtons({ reportKey }: { reportKey: string }) {
  const [busy, setBusy] = useState(false);

  async function download() {
    setBusy(true);
    try {
      const res = await fetch(`/api/staf/export?report=${reportKey}`);
      if (!res.ok) throw new Error("Gagal mengunduh.");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `laporan-${reportKey}-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert("Gagal mengunduh laporan. Coba lagi.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <button onClick={download} disabled={busy}
      className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-body-sm font-semibold text-ink hover:bg-muted disabled:opacity-60">
      {busy ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />} CSV
    </button>
  );
}
