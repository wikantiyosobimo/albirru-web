"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Menu, X, ChevronDown } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Logo } from "@/components/common/logo";
import { Button } from "@/components/ui/button";
import { NAV } from "@/lib/content";
import { cn } from "@/lib/utils";
import type { NavItem } from "@/lib/types";

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}
function itemActive(pathname: string, item: NavItem) {
  return isActive(pathname, item.href) || !!item.children?.some((c) => isActive(pathname, c.href));
}

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname() || "/";

  return (
    <header className="sticky top-0 z-50 border-b bg-white">
      <Container className="flex items-center justify-between">
        <div className="flex items-center gap-10 py-4">
          <Logo />
          <nav className="hidden items-center gap-7 lg:flex">
            {NAV.map((item) => {
              const active = itemActive(pathname, item);
              if (item.children) {
                return (
                  <div key={item.label} className="group relative">
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-1 text-label transition-colors",
                        active ? "text-brand" : "text-ink-body hover:text-ink",
                      )}
                    >
                      {item.label}
                      <ChevronDown size={15} className="transition-transform group-hover:rotate-180" />
                    </Link>
                    <div className="invisible absolute left-1/2 top-full z-50 w-56 -translate-x-1/2 pt-3 opacity-0 transition-all duration-150 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                      <div className="overflow-hidden rounded-xl border bg-white p-1.5 shadow-md">
                        {item.children.map((c) => (
                          <Link
                            key={c.href}
                            href={c.href}
                            className={cn(
                              "block rounded-lg px-3 py-2 text-body-sm transition-colors",
                              isActive(pathname, c.href) ? "bg-brand-100 text-brand" : "text-ink-body hover:bg-muted hover:text-ink",
                            )}
                          >
                            {c.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              }
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn("text-label transition-colors", active ? "text-brand" : "text-ink-body hover:text-ink")}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <Button href="/masuk" variant="secondary">Masuk</Button>
          <Button href="/daftar" variant="navy">Daftar Gratis</Button>
        </div>

        <button
          type="button"
          className="p-2 text-ink lg:hidden"
          aria-label="Buka menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </Container>

      {open ? (
        <div className="border-t bg-white lg:hidden">
          <Container className="flex flex-col gap-1 py-4">
            {NAV.map((item) => (
              <div key={item.label}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn("block py-2 text-label", itemActive(pathname, item) ? "text-brand" : "text-ink-body")}
                >
                  {item.label}
                </Link>
                {item.children ? (
                  <div className="ml-2 flex flex-col border-l pl-3">
                    {item.children.map((c) => (
                      <Link
                        key={c.href}
                        href={c.href}
                        onClick={() => setOpen(false)}
                        className={cn("py-1.5 text-body-sm", isActive(pathname, c.href) ? "text-brand" : "text-ink-muted")}
                      >
                        {c.label}
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
            <div className="flex flex-col gap-2 pt-3">
              <Button href="/masuk" variant="secondary" fullWidth>Masuk</Button>
              <Button href="/daftar" variant="navy" fullWidth>Daftar Gratis</Button>
            </div>
          </Container>
        </div>
      ) : null}
    </header>
  );
}
