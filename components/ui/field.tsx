import type { InputHTMLAttributes, ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: LucideIcon;
  trailing?: ReactNode;
}

export function Field({ label, icon: Icon, trailing, name, className, ...rest }: FieldProps) {
  return (
    <div>
      {label ? (
        <label htmlFor={name} className="mb-1.5 block text-label text-ink">
          {label}
        </label>
      ) : null}
      <div className="relative">
        {Icon ? (
          <Icon size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted" />
        ) : null}
        <input
          id={name}
          name={name}
          className={cn(
            "h-12 w-full rounded-md border bg-white text-body text-ink placeholder:text-ink-muted transition-colors focus:border-brand",
            Icon ? "pl-11" : "pl-4",
            trailing ? "pr-11" : "pr-4",
            className,
          )}
          {...rest}
        />
        {trailing ? <div className="absolute right-3 top-1/2 -translate-y-1/2">{trailing}</div> : null}
      </div>
    </div>
  );
}
