"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home, ClipboardList, BarChart3, Compass, GraduationCap, Route, Library, Trophy,
  Bookmark, Bell, User, Gem, ArrowRight, LifeBuoy, ChevronRight, ChevronLeft, X, PanelLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { UpgradeProButton } from "@/components/portal/upgrade-pro-button";

type Item = { label: string; href: string; icon: typeof Home; badge?: string };

const PRIMARY: Item[] = [
  { label: "Dashboard", href: "/app", icon: Home },
  { label: "Try Out", href: "/app/try-out", icon: ClipboardList },
  { label: "Academic Intelligence", href: "/app/intelligence", icon: BarChart3 },
  { label: "Academic Navigator", href: "/app/navigator", icon: Compass },
  { label: "Target Kampus", href: "/app/target", icon: GraduationCap },
  { label: "Academic Journey", href: "/app/journey", icon: Route },
  { label: "Learning Center", href: "/app/learning", icon: Library },
  { label: "Achievement", href: "/app/achievement", icon: Trophy },
];
const SECONDARY: Item[] = [
  { label: "Bookmark", href: "/app/bookmark", icon: Bookmark },
  { label: "Notifikasi", href: "/app/notifikasi", icon: Bell, badge: "4" },
  { label: "Profil", href: "/app/profil", icon: User },
];

function isActive(pathname: string, href: string) {
  return href === "/app" ? pathname === "/app" : pathname.startsWith(href);
}

function NavItem({ item, active, collapsed, onClick }: { item: Item; active: boolean; collapsed: boolean; onClick?: () => void }) {
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

function SidebarBody({ pathname, collapsed, plan, onNavigate, onToggleCollapse }: {
  pathname: string; collapsed: boolean; plan: string; onNavigate?: () => void; onToggleCollapse?: () => void;
}) {
  const isPro = plan !== "free";
  return (
    <div className="flex h-full flex-col">
      <div className={cn("flex items-center py-5", collapsed ? "justify-center px-2" : "gap-2.5 px-5")}>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-[18px] font-extrabold text-navy-900">A</div>
        {!collapsed ? (
          <div className="leading-tight">
            <div className="text-body-lg font-bold text-white">Albirru</div>
            <div className="text-[10px] text-white/60">Academic Intelligence</div>
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
        <div className="flex flex-col gap-1">
          {PRIMARY.map((item) => <NavItem key={item.href} item={item} active={isActive(pathname, item.href)} collapsed={collapsed} onClick={onNavigate} />)}
        </div>
        <div className="my-3 border-t border-white/10" />
        <div className="flex flex-col gap-1">
          {SECONDARY.map((item) => <NavItem key={item.href} item={item} active={isActive(pathname, item.href)} collapsed={collapsed} onClick={onNavigate} />)}
        </div>
      </nav>

      <div className={cn("space-y-3", collapsed ? "p-2" : "p-3")}>
        {!isPro && !collapsed ? (
          <div className="rounded-xl bg-brand p-4">
            <div className="flex items-center gap-2 text-white"><Gem size={18} /><span className="text-body-sm font-bold">Tingkatkan ke Albirru Pro</span></div>
            <p className="mt-1.5 text-caption text-white/80">Akses semua fitur premium untuk persiapan maksimal.</p>
            <UpgradeProButton className="mt-3 flex h-9 w-full items-center justify-center gap-1.5 rounded-md bg-white text-body-sm font-semibold text-brand hover:bg-white/90">Upgrade Sekarang <ArrowRight size={15} /></UpgradeProButton>
          </div>
        ) : !isPro && collapsed ? (
          <UpgradeProButton className="flex h-10 w-full items-center justify-center rounded-lg bg-brand text-white hover:bg-brand-600"><Gem size={18} /></UpgradeProButton>
        ) : null}

        <Link href="/kontak" onClick={onNavigate} title={collapsed ? "Butuh bantuan?" : undefined} className={cn("flex items-center rounded-lg py-2 text-white/70 hover:text-white", collapsed ? "justify-center" : "gap-2.5 px-3")}>
          <LifeBuoy size={18} className="shrink-0" />
          {!collapsed ? <span className="flex-1 text-caption leading-tight">Butuh bantuan?<br /><span className="text-white/50">Hubungi kami</span></span> : null}
          {!collapsed ? <ChevronRight size={15} /> : null}
        </Link>
      </div>
    </div>
  );
}

export function PortalSidebar({ plan = "free" }: { plan?: string }) {
  const pathname = usePathname() || "/app";
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
      {/* DESKTOP */}
      <aside className={cn("sticky top-0 hidden h-screen shrink-0 flex-col bg-navy-900 transition-[width] duration-200 lg:flex", collapsed ? "w-[76px]" : "w-64")}>
        <SidebarBody pathname={pathname} collapsed={collapsed} plan={plan} onToggleCollapse={toggleCollapse} />
      </aside>

      {/* MOBILE DRAWER */}
      {mobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden" onClick={() => setMobileOpen(false)}>
          <div className="absolute inset-0 bg-black/40" />
          <aside className="absolute left-0 top-0 h-full w-72 bg-navy-900 shadow-lg" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setMobileOpen(false)} aria-label="Tutup menu" className="absolute right-3 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-md text-white/70 hover:bg-white/10"><X size={18} /></button>
            <SidebarBody pathname={pathname} collapsed={false} plan={plan} onNavigate={() => setMobileOpen(false)} />
          </aside>
        </div>
      ) : null}
    </>
  );
}
