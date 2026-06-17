import type { LucideIcon } from "lucide-react";

export function IconTile({ icon: Icon, size = 52 }: { icon: LucideIcon; size?: number }) {
  return (
    <div
      className="flex items-center justify-center rounded-md bg-brand text-white"
      style={{ width: size, height: size }}
    >
      <Icon size={Math.round(size * 0.5)} strokeWidth={2} />
    </div>
  );
}
