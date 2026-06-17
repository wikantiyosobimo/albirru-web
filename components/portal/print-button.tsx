"use client";

import { Download } from "lucide-react";

// Memicu dialog cetak browser (pengguna bisa "Save as PDF").
// Implementasi ringan tanpa dependensi; cukup untuk MVP.
export function PrintButton({ label = "Unduh (PDF)" }: { label?: string }) {
  return (
    <button
      onClick={() => window.print()}
      className="inline-flex h-10 items-center gap-2 rounded-lg border bg-white px-4 text-body-sm font-semibold text-ink transition-colors hover:bg-muted"
    >
      <Download size={15} /> {label}
    </button>
  );
}
