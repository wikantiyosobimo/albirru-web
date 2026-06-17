"use client";

import {
  LayoutDashboard, Users, GraduationCap, BookOpen, ClipboardList,
  ClipboardCheck, Megaphone, BarChart3,
} from "lucide-react";
import { ConsoleSidebar, type ConsoleNavGroup } from "@/components/console/sidebar";

const GROUPS: ConsoleNavGroup[] = [
  { items: [{ label: "Dashboard", href: "/staf", icon: LayoutDashboard }] },
  {
    title: "Akademik",
    items: [
      { label: "Siswa", href: "/staf/siswa", icon: Users },
      { label: "Kelas", href: "/staf/kelas", icon: GraduationCap },
      { label: "Materi", href: "/staf/materi", icon: BookOpen },
      { label: "Try Out", href: "/staf/try-out", icon: ClipboardList },
    ],
  },
  {
    title: "Komunikasi",
    items: [
      { label: "Penugasan", href: "/staf/penugasan", icon: ClipboardCheck },
      { label: "Pengumuman", href: "/staf/pengumuman", icon: Megaphone },
      { label: "Laporan", href: "/staf/laporan", icon: BarChart3 },
    ],
  },
];

export function StafSidebar() {
  return <ConsoleSidebar groups={GROUPS} brand="Albirru" subtitle="Academic Team" rootHref="/staf" />;
}
