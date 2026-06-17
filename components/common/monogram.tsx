import { cn } from "@/lib/utils";

// Placeholder avatar (swap for a real <Image> when brand photos are available).
export function Monogram({
  label,
  size = 40,
  ring,
}: {
  label: string;
  size?: number;
  ring?: boolean;
}) {
  return (
    <div
      className={cn(
        "grad-monogram inline-flex items-center justify-center rounded-full font-bold text-white",
        ring && "ring-2 ring-white",
      )}
      style={{ width: size, height: size, fontSize: Math.round(size * 0.34) }}
    >
      {label}
    </div>
  );
}
