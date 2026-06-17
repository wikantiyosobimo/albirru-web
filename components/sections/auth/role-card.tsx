import type { ReactNode } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function RoleCard({
  href,
  title,
  desc,
  avatar,
  accent,
  emphasized,
}: {
  href: string;
  title: string;
  desc: string;
  avatar: ReactNode;
  accent: string;
  emphasized?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group flex items-center gap-4 rounded-xl border p-5 transition",
        emphasized ? "border-brand bg-brand-100" : "bg-white hover:border-brand hover:bg-muted",
      )}
    >
      <div className={cn("flex h-16 w-16 shrink-0 items-center justify-center rounded-full", accent)}>{avatar}</div>
      <div className="flex-1">
        <div className="text-h-sm text-ink">{title}</div>
        <div className="mt-1 text-body-sm text-ink-muted">{desc}</div>
      </div>
      <ChevronRight className="text-ink-muted transition group-hover:translate-x-0.5" />
    </Link>
  );
}
