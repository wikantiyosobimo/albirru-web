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
import { getClientLocale, tc } from "@/lib/i18n-client";
import type { DictKey } from "@/lib/i18n";

type Item = { labelKey: DictKey; href: string; icon: typeof Home; badge?: string };

const PRIMARY: Item[] = [
  { labelKey: "nav.dashboard", href: "/app", icon: Home },
  { labelKey: "nav.tryout", href: "/app/try-out", icon: ClipboardList },
  { labelKey: "nav.intelligence", href: "/app/intelligence", icon: BarChart3 },
  { labelKey: "nav.navigator", href: "/app/navigator", icon: Compass },
  { labelKey: "nav.target", href: "/app/target", icon: GraduationCap },
  { labelKey: "nav.journey", href: "/app/journey", icon: Route },
  { labelKey: "nav.learning", href: "/app/learning", icon: Library },
  { labelKey: "nav.achievement", href: "/app/achievement", icon: Trophy },
];
const SECONDARY: Item[] = [
  { labelKey: "nav.bookmark", href: "/app/bookmark", icon: Bookmark },
  { labelKey: "nav.notifikasi", href: "/app/notifikasi", icon: Bell, badge: "4" },
  { labelKey: "nav.profil", href: "/app/profil", icon: User },
];

function isActive(pathname: string, href: string) {
  return href === "/app" ? pathname === "/app" : pathname.startsWith(href);
}

function NavItem({ item, active, collapsed, onClick, locale }: { item: Item; active: boolean; collapsed: boolean; onClick?: () => void; locale: "id" | "en" }) {
  const Icon = item.icon;
  const label = tc(locale, item.labelKey);
  return (
    <Link
      href={item.href}
      onClick={onClick}
      title={collapsed ? label : undefined}
      className={cn(
        "flex items-center gap-3 rounded-lg py-2.5 text-body-sm font-medium transition-colors",
        collapsed ? "justify-center px-0" : "px-3",
        active ? "bg-brand text-white" : "text-white/70 hover:bg-white/5 hover:text-white",
      )}
    >
      <Icon size={18} className="shrink-0" />
      {!collapsed ? <span className="flex-1 truncate">{label}</span> : null}
      {!collapsed && item.badge ? <span className="rounded-full bg-[#E5484D] px-1.5 py-0.5 text-[10px] font-bold leading-none text-white">{item.badge}</span> : null}
    </Link>
  );
}

function SidebarBody({ pathname, collapsed, plan, onNavigate, onToggleCollapse, locale }: {
  pathname: string; collapsed: boolean; plan: string; onNavigate?: () => void; onToggleCollapse?: () => void; locale: "id" | "en";
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
          <button onClick={onToggleCollapse} title={tc(locale, "nav.collapse")} className="ml-auto hidden h-7 w-7 items-center justify-center rounded-md text-white/60 hover:bg-white/10 hover:text-white lg:flex"><ChevronLeft size={16} /></button>
        ) : null}
      </div>

      {onToggleCollapse && collapsed ? (
        <button onClick={onToggleCollapse} title={tc(locale, "nav.expand")} className="mx-auto mb-2 hidden h-8 w-8 items-center justify-center rounded-md text-white/60 hover:bg-white/10 hover:text-white lg:flex"><PanelLeft size={16} /></button>
      ) : null}

      <nav className={cn("flex-1 overflow-y-auto pb-2", collapsed ? "px-2" : "px-3")}>
        <div className="flex flex-col gap-1">
          {PRIMARY.map((item) => <NavItem key={item.href} item={item} active={isActive(pathname, item.href)} collapsed={collapsed} onClick={onNavigate} locale={locale} />)}
        </div>
        <div className="my-3 border-t border-white/10" />
        <div className="flex flex-col gap-1">
          {SECONDARY.map((item) => <NavItem key={item.href} item={item} active={isActive(pathname, item.href)} collapsed={collapsed} onClick={onNavigate} locale={locale} />)}
        </div>
      </nav>

      <div className={cn("space-y-3", collapsed ? "p-2" : "p-3")}>
        {!isPro && !collapsed ? (
          <div className="rounded-xl bg-brand p-4">
            <div className="flex items-center gap-2 text-white"><Gem size={18} /><span className="text-body-sm font-bold">{tc(locale, "nav.upgrade")}</span></div>
            <p className="mt-1.5 text-caption text-white/80">{tc(locale, "nav.upgrade.desc")}</p>
            <UpgradeProButton className="mt-3 flex h-9 w-full items-center justify-center gap-1.5 rounded-md bg-white text-body-sm font-semibold text-brand hover:bg-white/90">{tc(locale, "nav.upgrade.btn")} <ArrowRight size={15} /></UpgradeProButton>
          </div>
        ) : !isPro && collapsed ? (
          <UpgradeProButton className="flex h-10 w-full items-center justify-center rounded-lg bg-brand text-white hover:bg-brand-600"><Gem size={18} /></UpgradeProButton>
        ) : null}

        <Link href="/kontak" onClick={onNavigate} title={collapsed ? tc(locale, "nav.help") : undefined} className={cn("flex items-center rounded-lg py-2 text-white/70 hover:text-white", collapsed ? "justify-center" : "gap-2.5 px-3")}>
          <LifeBuoy size={18} className="shrink-0" />
          {!collapsed ? <span className="flex-1 text-caption leading-tight">{tc(locale, "nav.help")}<br /><span className="text-white/50">{tc(locale, "nav.help.sub")}</span></span> : null}
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
  const [locale, setLocale] = useState<"id" | "en">("id");

  useEffect(() => {
    try { setCollapsed(localStorage.getItem("sb-collapsed") === "1"); } catch { /* abaikan */ }
    setLocale(getClientLocale());
  }, []);

  useEffect(() => {
    const handler = () => setMobileOpen((o) => !o);
    window.addEventListener("albirru:toggle-sidebar", handler);
    return () => window.removeEventListener("albirru:toggle-sidebar", handler);
  }, []);

  useEffect(() => {
    const onCookie = () => setLocale(getClientLocale());
    window.addEventListener("albirru:locale-changed", onCookie);
    return () => window.removeEventListener("albirru:locale-changed", onCookie);
  }, []);

  function toggleCollapse() {
    setCollapsed((c) => { const n = !c; try { localStorage.setItem("sb-collapsed", n ? "1" : "0"); } catch { /* abaikan */ } return n; });
  }

  return (
    <>
      {/* DESKTOP */}
      <aside className={cn("sticky top-0 hidden h-screen shrink-0 flex-col bg-navy-900 transition-[width] duration-200 lg:flex", collapsed ? "w-[76px]" : "w-64")}>
        <SidebarBody pathname={pathname} collapsed={collapsed} plan={plan} onToggleCollapse={toggleCollapse} locale={locale} />
      </aside>

      {/* MOBILE DRAWER */}
      {mobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button type="button" aria-label="Tutup menu" className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-72 bg-navy-900 shadow-lg">
            <button onClick={() => setMobileOpen(false)} aria-label="Tutup menu" className="absolute right-3 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-md text-white/70 hover:bg-white/10"><X size={18} /></button>
            <SidebarBody pathname={pathname} collapsed={false} plan={plan} onNavigate={() => setMobileOpen(false)} locale={locale} />
          </aside>
        </div>
      ) : null}
    </>
  );
}
