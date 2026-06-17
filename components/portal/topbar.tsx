import type { ReactNode } from "react";
import Link from "next/link";
import { Search, Bell } from "lucide-react";
import { Monogram } from "@/components/common/monogram";
import { SidebarToggle } from "@/components/portal/sidebar-toggle";
import { LanguageToggle } from "@/components/portal/language-toggle";

export function PortalTopbar({
  title, subtitle, eyebrow, nama = "Siswa", right,
}: {
  title: ReactNode;
  subtitle?: string;
  eyebrow?: string;
  nama?: string;
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
          <LanguageToggle />
          {right ?? (
            <div className="relative hidden md:block">
              <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted" />
              <input aria-label="Cari materi, try out, atau topik" className="h-10 w-64 rounded-lg border bg-muted pl-10 pr-4 text-body-sm text-ink placeholder:text-ink-muted xl:w-80" placeholder="Cari materi, try out, atau topik…" />
            </div>
          )}
          <Link href="/app/notifikasi" className="relative flex h-10 w-10 items-center justify-center rounded-lg border text-ink-body hover:bg-muted">
            <Bell size={18} />
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#E5484D] px-1 text-[10px] font-bold text-white">4</span>
          </Link>
          <div className="flex items-center gap-2.5">
            <Monogram label={(nama[0] ?? "S").toUpperCase()} size={38} />
            <div className="hidden leading-tight sm:block">
              <div className="text-body-sm font-semibold text-ink">{nama}</div>
              <div className="text-caption text-ink-muted">Siswa</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
