import type { StatItem as StatItemType } from "@/lib/types";

export function StatItem({ stat }: { stat: StatItemType }) {
  const Icon = stat.icon;
  return (
    <div>
      <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-md bg-white/10 text-white">
        <Icon size={22} />
      </div>
      <div className="text-stat text-white">{stat.value}</div>
      <div className="mt-1 text-caption text-white/72">{stat.label}</div>
    </div>
  );
}
