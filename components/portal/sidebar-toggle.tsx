"use client";

import { Menu } from "lucide-react";

// Hamburger (mobile) — memberi sinyal ke sidebar untuk membuka drawer.
export function SidebarToggle() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event("albirru:toggle-sidebar"))}
      aria-label="Buka menu"
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border text-ink-body hover:bg-muted lg:hidden"
    >
      <Menu size={18} />
    </button>
  );
}
