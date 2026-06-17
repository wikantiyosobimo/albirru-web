import { cn } from "@/lib/utils";

// albirru-design-system.md §12.3 (progress bar)
export function Progress({
  value,
  className,
  height = 6,
}: {
  value: number;
  className?: string;
  height?: number;
}) {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <div className={cn("w-full overflow-hidden rounded-full bg-hair", className)} style={{ height }}>
      <div className="h-full rounded-full bg-brand" style={{ width: `${clamped}%` }} />
    </div>
  );
}
