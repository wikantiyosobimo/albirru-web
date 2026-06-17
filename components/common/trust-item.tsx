import type { TrustItem as TrustItemType } from "@/lib/types";

export function TrustItem({ item }: { item: TrustItemType }) {
  const Icon = item.icon;
  return (
    <div className="flex items-center gap-2">
      <Icon size={18} className="text-ink-muted" />
      <span className="text-caption text-ink-body">{item.label}</span>
    </div>
  );
}
