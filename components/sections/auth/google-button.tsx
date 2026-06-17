"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.4 29.3 35 24 35c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 5.1 29.5 3 24 3 11.8 3 2 12.8 2 25s9.8 22 22 22 22-9.8 22-22c0-1.5-.2-2.9-.4-4.5z" />
      <path fill="#FF3D00" d="M5.3 13.7l6.6 4.8C13.6 14.6 18.4 11 24 11c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 5.1 29.5 3 24 3 16.3 3 9.7 7.3 5.3 13.7z" />
      <path fill="#4CAF50" d="M24 47c5.4 0 10.3-2.1 14-5.4l-6.5-5.5C29.6 37.6 26.9 38.6 24 38.6c-5.3 0-9.7-2.6-11.3-6.9l-6.6 5.1C9.6 42.6 16.2 47 24 47z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.2-4.2 5.6l6.5 5.5C41.9 36.6 46 31.4 46 25c0-1.5-.2-2.9-.4-4.5z" />
    </svg>
  );
}

export function GoogleButton({ label }: { label: string }) {
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const onClick = async () => {
    setErr(null);
    setBusy(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) {
      setBusy(false);
      setErr(
        /provider is not enabled/i.test(error.message)
          ? "Login Google belum diaktifkan di Supabase. Aktifkan provider Google dulu."
          : error.message,
      );
    }
    // jika sukses, browser akan diarahkan ke Google.
  };

  return (
    <div>
      <button
        type="button"
        onClick={onClick}
        disabled={busy}
        className="inline-flex h-12 w-full items-center justify-center gap-2.5 rounded-md border bg-white text-label text-ink transition hover:bg-muted disabled:opacity-60"
      >
        <GoogleIcon />
        <span>{busy ? "Menghubungkan…" : label}</span>
      </button>
      {err ? <p className="mt-2 text-center text-caption text-[#B4282C]">{err}</p> : null}
    </div>
  );
}
