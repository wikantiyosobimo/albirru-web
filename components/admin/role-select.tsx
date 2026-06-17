"use client";

import { useState, useTransition } from "react";
import { Check, Loader2 } from "lucide-react";
import { setUserRole } from "@/lib/actions/console";

export function RoleSelect({ userId, current }: { userId: string; current: string }) {
  const [role, setRole] = useState(current);
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function onChange(next: string) {
    setRole(next); setError(null); setSaved(false);
    startTransition(async () => {
      const res = await setUserRole(userId, next);
      if (res.ok) { setSaved(true); setTimeout(() => setSaved(false), 2000); }
      else { setError(res.error ?? "Gagal"); setRole(current); }
    });
  }

  return (
    <div className="flex items-center gap-2">
      <select value={role} onChange={(e) => onChange(e.target.value)} disabled={pending}
        className="h-9 rounded-lg border bg-white px-3 text-body-sm font-semibold text-ink focus:border-brand focus:outline-none disabled:opacity-60">
        <option value="siswa">Siswa</option>
        <option value="staf">Staf</option>
        <option value="admin">Admin</option>
      </select>
      {pending ? <Loader2 size={16} className="animate-spin text-ink-muted" /> : saved ? <Check size={16} className="text-success" /> : null}
      {error ? <span className="text-caption text-[#E5484D]">{error}</span> : null}
    </div>
  );
}
