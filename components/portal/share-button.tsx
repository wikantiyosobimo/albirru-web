"use client";

import { useState } from "react";
import { Share2, Check } from "lucide-react";

// Bagikan via Web Share API; fallback salin tautan ke clipboard.
export function ShareButton({ title }: { title?: string }) {
  const [copied, setCopied] = useState(false);

  async function onShare() {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (navigator.share) {
      try { await navigator.share({ title: title ?? "Albirru Try Out", url }); return; } catch { /* dibatalkan */ }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* abaikan */ }
  }

  return (
    <button onClick={onShare} className="inline-flex h-10 items-center gap-2 rounded-lg border bg-white px-4 text-body-sm font-semibold text-ink transition-colors hover:bg-muted">
      {copied ? <><Check size={15} className="text-success" /> Tersalin</> : <><Share2 size={15} /> Bagikan</>}
    </button>
  );
}
