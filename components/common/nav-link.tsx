import Link from "next/link";
import { cn } from "@/lib/utils";
import type { NavItem } from "@/lib/types";

export function NavLink({
  item,
  active,
  onClick,
}: {
  item: NavItem;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      href={item.href}
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={cn("text-label transition-colors", active ? "text-brand" : "text-ink-body hover:text-ink")}
    >
      <span className={cn(active && "border-b-2 border-brand pb-1")}>{item.label}</span>
    </Link>
  );
}
