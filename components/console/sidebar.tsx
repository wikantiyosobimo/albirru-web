"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight, X, PanelLeft, LogOut, ArrowLeft, type LucideIcon } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

export type ConsoleNavItem = { label: string; href: string; icon: LucideIcon; badge?: string };
export type ConsoleNavGroup = { title?: string; items: ConsoleNavItem[] };

function isActive(pathname: string, href: string, rootHref: string) {
  return href === rootHref ? pathname === rootHref : pathname.startsWith(href);
}

function NavItem({ item, active, collapsed, onClick }: { item: ConsoleNavItem; active: boolean; collapsed: boolean; onClick?: () => void }) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      onClick={onClick}
      title={collapsed ? item.label : undefined}
      className={cn(
        "flex items-center gap-3 rounded-lg py-2.5 text-body-sm font-medium transition-colors",
        collapsed ? "justify-center px-0" : "px-3",
        active ? "bg-brand text-white" : "text-white/70 hover:bg-white/5 hover:text-white",
      )}
    >
      <Icon size={18} className="shrink-0" />
      {!collapsed ? <span className="flex-1 truncate">{item.label}</span> : null}
      {!collapsed && item.badge ? <span className="rounded-full bg-[#E5484D] px-1.5 py-0.5 text-[10px] font-bold leading-none text-white">{item.badge}</span> : null}
    </Link>
  );
}

function Body({ pathname, collapsed, groups, brand, subtitle, rootHref, onNavigate, onToggleCollapse }: {
  pathname: string; collapsed: boolean; groups: ConsoleNavGroup[]; brand: string; subtitle: string; rootHref: string;
  onNavigate?: () => void; onToggleCollapse?: () => void;
}) {
  return (
    <div className="flex h-full flex-col">
      <div className={cn("flex items-center py-5", collapsed ? "justify-center px-2" : "gap-2.5 px-5")}>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-[18px] font-extrabold text-navy-900">A</div>
        {!collapsed ? (
          <div className="leading-tight">
            <div className="text-body-lg font-bold text-white">{brand}</div>
            <div className="text-[10px] text-white/60">{subtitle}</div>
          </div>
        ) : null}
        {onToggleCollapse && !collapsed ? (
          <button onClick={onToggleCollapse} title="Perkecil" className="ml-auto hidden h-7 w-7 items-center justify-center rounded-md text-white/60 hover:bg-white/10 hover:text-white lg:flex"><ChevronLeft size={16} /></button>
        ) : null}
      </div>

      {onToggleCollapse && collapsed ? (
        <button onClick={onToggleCollapse} title="Perbesar" className="mx-auto mb-2 hidden h-8 w-8 items-center justify-center rounded-md text-white/60 hover:bg-white/10 hover:text-white lg:flex"><PanelLeft size={16} /></button>
      ) : null}

      <nav className={cn("flex-1 overflow-y-auto pb-2", collapsed ? "px-2" : "px-3")}>
        {groups.map((g, i) => (
          <div key={g.title ?? i}>
            {i > 0 ? <div className="my-3 border-t border-white/10" /> : null}
            {g.title && !collapsed ? <div className="px-3 pb-1.5 pt-1 text-[10px] font-bold uppercase tracking-wider text-white/40">{g.title}</div> : null}
            <div className="flex flex-col gap-1">
              {g.items.map((item) => <NavItem key={item.href} item={item} active={isActive(pathname, item.href, rootHref)} collapsed={collapsed} onClick={onNavigate} />)}
            </div>
          </div>
        ))}
      </nav>

      <div className={cn("space-y-1 border-t border-white/10", collapsed ? "p-2" : "p-3")}>
        <Link href="/app" onClick={onNavigate} title={collapsed ? "Kembali ke portal siswa" : undefined} className={cn("flex items-center rounded-lg py-2 text-white/70 hover:bg-white/5 hover:text-white", collapsed ? "justify-center" : "gap-2.5 px-3")}>
          <ArrowLeft size={18} className="shrink-0" />
          {!collapsed ? <span className="flex-1 text-body-sm">Portal Siswa</span> : null}
        </Link>
        <LogoutLink collapsed={collapsed} />
      </div>
    </div>
  );
}

function LogoutLink({ collapsed }: { collapsed: boolean }) {
  const [busy, setBusy] = useState(false);
  async function onLogout() {
    setBusy(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/masuk";
  }
  return (
    <button onClick={onLogout} disabled={busy} title={collapsed ? "Keluar" : undefined} className={cn("flex w-full items-center rounded-lg py-2 text-white/70 hover:bg-white/5 hover:text-[#E5484D]", collapsed ? "justify-center" : "gap-2.5 px-3")}>
      <LogOut size={18} className="shrink-0" />
      {!collapsed ? <span className="flex-1 text-left text-body-sm">{busy ? "Keluar…" : "Keluar"}</span> : null}
    </button>
  );
}

export function ConsoleSidebar({ groups, brand, subtitle, rootHref }: {
  groups: ConsoleNavGroup[]; brand: string; subtitle: string; rootHref: string;
}) {
  const pathname = usePathname() || rootHref;
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    try { setCollapsed(localStorage.getItem("sb-collapsed") === "1"); } catch { /* abaikan */ }
  }, []);
  useEffect(() => {
    const handler = () => setMobileOpen((o) => !o);
    window.addEventListener("albirru:toggle-sidebar", handler);
    return () => window.removeEventListener("albirru:toggle-sidebar", handler);
  }, []);

  function toggleCollapse() {
    setCollapsed((c) => { const n = !c; try { localStorage.setItem("sb-collapsed", n ? "1" : "0"); } catch { /* abaikan */ } return n; });
  }

  return (
    <>
      <aside className={cn("sticky top-0 hidden h-screen shrink-0 flex-col bg-navy-900 transition-[width] duration-200 lg:flex", collapsed ? "w-[76px]" : "w-64")}>
        <Body pathname={pathname} collapsed={collapsed} groups={groups} brand={brand} subtitle={subtitle} rootHref={rootHref} onToggleCollapse={toggleCollapse} />
      </aside>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button type="button" aria-label="Tutup menu" className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-72 bg-navy-900 shadow-lg">
            <button onClick={() => setMobileOpen(false)} aria-label="Tutup menu" className="absolute right-3 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-md text-white/70 hover:bg-white/10"><X size={18} /></button>
            <Body pathname={pathname} collapsed={false} groups={groups} brand={brand} subtitle={subtitle} rootHref={rootHref} onNavigate={() => setMobileOpen(false)} />
          </aside>
        </div>
      ) : null}
    </>
  );
}
