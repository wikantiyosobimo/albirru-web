import type { ReactNode } from "react";
import { Monogram } from "@/components/common/monogram";
import { SidebarToggle } from "@/components/portal/sidebar-toggle";

// Topbar generik untuk portal /staf & /admin (tanpa elemen spesifik siswa).
export function ConsoleTopbar({
  title, subtitle, eyebrow, nama = "Tim", roleLabel = "Staf", right,
}: {
  title: ReactNode;
  subtitle?: string;
  eyebrow?: string;
  nama?: string;
  roleLabel?: string;
  right?: ReactNode;
}) {
  return (
    <header className="sticky top-0 z-30 border-b bg-white/90 backdrop-blur">
      <div className="flex items-center justify-between gap-4 px-5 py-3.5 lg:px-7">
        <div className="flex min-w-0 items-center gap-3">
          <SidebarToggle />
          <div className="min-w-0">
            {eyebrow ? <div className="text-body-sm text-ink-body">{eyebrow}</div> : null}
            <h1 className="truncate text-h-md text-ink">{title}</h1>
            {subtitle ? <p className="truncate text-body-sm text-ink-muted">{subtitle}</p> : null}
          </div>
        </div>
        <div className="flex items-center gap-3 lg:gap-4">
          {right}
          <div className="flex items-center gap-2.5">
            <Monogram label={(nama[0] ?? "T").toUpperCase()} size={38} />
            <div className="hidden leading-tight sm:block">
              <div className="text-body-sm font-semibold text-ink">{nama}</div>
              <div className="text-caption text-ink-muted">{roleLabel}</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
