"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { ChevronDown, Check } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

// Dropdown yang benar-benar memfilter data: memetakan pilihan ke URL search param.
export function NavDropdown({
  paramKey, options, icon: Icon, align = "left", size = "md", defaultValue = "",
}: {
  paramKey: string;
  options: { label: string; value: string }[]; // value "" = default (hapus param)
  icon?: LucideIcon;
  align?: "left" | "right";
  size?: "sm" | "md";
  defaultValue?: string; // nilai terpilih saat param belum ada di URL
}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const current = params.get(paramKey) ?? defaultValue;
  const selected = options.find((o) => o.value === current) ?? options[0];

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  function choose(value: string) {
    setOpen(false);
    const next = new URLSearchParams(params.toString());
    if (value) next.set(paramKey, value); else next.delete(paramKey);
    const qs = next.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  }

  const h = size === "sm" ? "h-9 text-caption" : "h-10 text-body-sm";

  return (
    <div ref={ref} className="relative">
      <button type="button" onClick={() => setOpen((v) => !v)}
        className={cn("inline-flex items-center gap-2 rounded-lg border bg-white px-3 font-semibold text-ink transition-colors hover:bg-muted", h)}>
        {Icon ? <Icon size={size === "sm" ? 13 : 15} /> : null}
        {selected.label}
        <ChevronDown size={size === "sm" ? 13 : 14} className={cn("transition-transform", open && "rotate-180")} />
      </button>
      {open ? (
        <div className={cn("absolute z-30 mt-1.5 min-w-[200px] overflow-hidden rounded-xl border bg-white py-1 shadow-md", align === "right" ? "right-0" : "left-0")}>
          {options.map((o) => (
            <button key={o.value} type="button" onClick={() => choose(o.value)}
              className={cn("flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-body-sm transition-colors hover:bg-muted", o.value === current ? "font-semibold text-brand" : "text-ink-body")}>
              {o.label}
              {o.value === current ? <Check size={14} className="text-brand" /> : null}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
