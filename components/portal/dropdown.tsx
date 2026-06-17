"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Check } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

// Dropdown selektor reusable: tombol membuka menu, pilih opsi memperbarui label.
export function Dropdown({
  options,
  value,
  icon: Icon,
  align = "left",
  size = "md",
  onChange,
}: {
  options: string[];
  value?: string;
  icon?: LucideIcon;
  align?: "left" | "right";
  size?: "sm" | "md";
  onChange?: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(value ?? options[0]);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  function choose(o: string) {
    setSelected(o);
    setOpen(false);
    onChange?.(o);
  }

  const h = size === "sm" ? "h-9 text-caption" : "h-10 text-body-sm";

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn("inline-flex items-center gap-2 rounded-lg border bg-white px-3 font-semibold text-ink transition-colors hover:bg-muted", h)}
      >
        {Icon ? <Icon size={size === "sm" ? 13 : 15} /> : null}
        {selected}
        <ChevronDown size={size === "sm" ? 13 : 14} className={cn("transition-transform", open && "rotate-180")} />
      </button>
      {open ? (
        <div className={cn("absolute z-30 mt-1.5 min-w-[180px] overflow-hidden rounded-xl border bg-white py-1 shadow-md", align === "right" ? "right-0" : "left-0")}>
          {options.map((o) => (
            <button
              key={o}
              type="button"
              onClick={() => choose(o)}
              className={cn("flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-body-sm transition-colors hover:bg-muted", o === selected ? "font-semibold text-brand" : "text-ink-body")}
            >
              {o}
              {o === selected ? <Check size={14} className="text-brand" /> : null}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
