import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

export function StatCard({ label, value, sub, icon: Icon, accent = "brand" }: {
  label: string; value: ReactNode; sub?: string; icon?: LucideIcon; accent?: "brand" | "success" | "warning" | "danger";
}) {
  const tones: Record<string, string> = {
    brand: "bg-brand-100 text-brand",
    success: "bg-success-subtle text-success-strong",
    warning: "bg-[#FEF3C7] text-[#92400E]",
    danger: "bg-[#FDECEC] text-[#E5484D]",
  };
  return (
    <div className="rounded-2xl border bg-white p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-caption text-ink-muted">{label}</div>
          <div className="mt-1 text-stat leading-none text-ink">{value}</div>
          {sub ? <div className="mt-1 text-caption text-ink-muted">{sub}</div> : null}
        </div>
        {Icon ? <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${tones[accent]}`}><Icon size={20} /></span> : null}
      </div>
    </div>
  );
}

export function ConsoleCard({ title, action, children, className = "" }: {
  title?: ReactNode; action?: ReactNode; children: ReactNode; className?: string;
}) {
  return (
    <div className={`rounded-2xl border bg-white p-5 ${className}`}>
      {(title || action) ? (
        <div className="mb-4 flex items-center justify-between gap-3">
          {title ? <h3 className="text-h-sm text-ink">{title}</h3> : <span />}
          {action}
        </div>
      ) : null}
      {children}
    </div>
  );
}

export function EmptyState({ icon: Icon, title, note }: { icon: LucideIcon; title: string; note?: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed bg-white px-6 py-14 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted text-ink-muted"><Icon size={24} /></span>
      <div className="mt-3 text-body-lg font-semibold text-ink">{title}</div>
      {note ? <p className="mt-1 max-w-sm text-body-sm text-ink-muted">{note}</p> : null}
    </div>
  );
}

export function Pill({ children, tone = "muted" }: { children: ReactNode; tone?: "muted" | "brand" | "success" | "warning" | "danger" }) {
  const tones: Record<string, string> = {
    muted: "bg-muted text-ink-body",
    brand: "bg-brand-100 text-brand",
    success: "bg-success-subtle text-success-strong",
    warning: "bg-[#FEF3C7] text-[#92400E]",
    danger: "bg-[#FDECEC] text-[#E5484D]",
  };
  return <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-semibold ${tones[tone]}`}>{children}</span>;
}
