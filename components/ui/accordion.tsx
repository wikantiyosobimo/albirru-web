"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function Accordion({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="flex flex-col gap-3">
      {items.map((it, i) => {
        const isOpen = open === i;
        return (
          <div key={i} className="rounded-lg border bg-white">
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-4 p-5 text-left"
            >
              <span className="text-label text-ink">{it.q}</span>
              <ChevronDown size={18} className={cn("shrink-0 text-ink-muted transition-transform", isOpen && "rotate-180")} />
            </button>
            {isOpen ? <div className="px-5 pb-5 text-body-sm text-ink-body">{it.a}</div> : null}
          </div>
        );
      })}
    </div>
  );
}
