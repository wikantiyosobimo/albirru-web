import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div className="flex h-10 w-10 items-center justify-center rounded-md bg-navy-900 text-[20px] font-extrabold text-white">
        A
      </div>
      <div className="leading-none">
        <div className="text-[9px] font-bold uppercase tracking-[0.08em] text-ink-muted">Rumah Belajar</div>
        <div className="text-h-sm text-ink">
          Albirru<span className="text-brand">.</span>
        </div>
      </div>
    </div>
  );
}
