import { cn } from "@/lib/utils";

export function StepIndicator({ current, total = 2 }: { current: number; total?: number }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <span className="rounded-full bg-muted px-3 py-1 text-caption font-semibold text-ink-body">
        Langkah {current} dari {total}
      </span>
      <div className="flex items-center gap-2">
        {Array.from({ length: total }).map((_, i) => {
          const n = i + 1;
          const active = n <= current;
          return (
            <div key={n} className="flex items-center gap-2">
              <span
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-full text-[12px] font-bold",
                  active ? "bg-brand text-white" : "bg-muted text-ink-muted",
                )}
              >
                {n}
              </span>
              {n < total ? <span className={cn("h-0.5 w-12", n < current ? "bg-brand" : "bg-hair")} /> : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
