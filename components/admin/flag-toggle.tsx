"use client";

import { useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
import { toggleFlag } from "@/lib/actions/console";

export function FlagToggle({ flagKey, enabled }: { flagKey: string; enabled: boolean }) {
  const [on, setOn] = useState(enabled);
  const [pending, startTransition] = useTransition();

  function toggle() {
    const next = !on;
    setOn(next);
    startTransition(async () => {
      const res = await toggleFlag(flagKey, next);
      if (!res.ok) setOn(!next); // rollback
    });
  }

  return (
    <button onClick={toggle} disabled={pending} role="switch" aria-checked={on}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${on ? "bg-brand" : "bg-hair"} disabled:opacity-60`}>
      <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${on ? "translate-x-5" : "translate-x-0.5"}`} />
      {pending ? <Loader2 size={12} className="absolute -right-5 animate-spin text-ink-muted" /> : null}
    </button>
  );
}
