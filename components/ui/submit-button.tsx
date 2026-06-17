"use client";

import type { ReactNode } from "react";
import { useFormStatus } from "react-dom";
import type { LucideIcon } from "lucide-react";

export function SubmitButton({
  children,
  leadingIcon: Leading,
  trailingIcon: Trailing,
}: {
  children: ReactNode;
  leadingIcon?: LucideIcon;
  trailingIcon?: LucideIcon;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="group inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-brand text-label text-white transition hover:bg-brand-600 disabled:opacity-60"
    >
      {Leading ? <Leading size={18} /> : null}
      <span>{pending ? "Memproses…" : children}</span>
      {Trailing ? <Trailing size={18} className="transition-transform group-hover:translate-x-0.5" /> : null}
    </button>
  );
}
