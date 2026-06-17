"use client";

import { useState } from "react";
import { Bookmark } from "lucide-react";
import { cn } from "@/lib/utils";

// Toggle bookmark visual (persist lokal sederhana).
export function BookmarkToggle({ id }: { id?: string }) {
  const [on, setOn] = useState(false);

  function toggle() {
    setOn((v) => {
      const next = !v;
      try {
        const key = "to-bookmark";
        const set = new Set<string>(JSON.parse(sessionStorage.getItem(key) ?? "[]"));
        const k = id ?? "soal";
        next ? set.add(k) : set.delete(k);
        sessionStorage.setItem(key, JSON.stringify([...set]));
      } catch {
        /* abaikan */
      }
      return next;
    });
  }

  return (
    <button
      onClick={toggle}
      className={cn("inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-body-sm transition-colors", on ? "font-semibold text-brand" : "text-ink-body hover:text-ink")}
    >
      <Bookmark size={15} className={on ? "fill-current" : ""} /> {on ? "Tersimpan" : "Bookmark"}
    </button>
  );
}
