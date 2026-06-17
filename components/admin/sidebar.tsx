"use client";

import {
  LayoutDashboard, Users, Database, FolderTree, LayoutTemplate, ClipboardList,
  School, CreditCard, TrendingUp, Languages, Settings, Activity,
} from "lucide-react";
import { ConsoleSidebar, type ConsoleNavGroup } from "@/components/console/sidebar";

const GROUPS: ConsoleNavGroup[] = [
  { items: [{ label: "Dashboard", href: "/admin", icon: LayoutDashboard }] },
  {
    title: "Konten",
    items: [
      { label: "Bank Soal", href: "/admin/bank-soal", icon: Database },
      { label: "Topik", href: "/admin/topik", icon: FolderTree },
      { label: "Blueprint", href: "/admin/blueprint", icon: LayoutTemplate },
      { label: "Try Out", href: "/admin/try-out", icon: ClipboardList },
    ],
  },
  {
    title: "Pengguna & Bisnis",
    items: [
      { label: "Pengguna", href: "/admin/pengguna", icon: Users },
      { label: "Sekolah", href: "/admin/sekolah", icon: School },
      { label: "Langganan", href: "/admin/langganan", icon: CreditCard },
      { label: "Analitik", href: "/admin/analitik", icon: TrendingUp },
    ],
  },
  {
    title: "Sistem",
    items: [
      { label: "i18n", href: "/admin/i18n", icon: Languages },
      { label: "Pengaturan", href: "/admin/pengaturan", icon: Settings },
      { label: "Monitoring", href: "/admin/monitoring", icon: Activity },
    ],
  },
];

export function AdminSidebar() {
  return <ConsoleSidebar groups={GROUPS} brand="Albirru" subtitle="Admin Panel" rootHref="/admin" />;
}
