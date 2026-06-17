import type { SelectHTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export function SelectField({ label, name, options, placeholder, className, ...rest }: SelectFieldProps) {
  return (
    <div>
      {label ? (
        <label htmlFor={name} className="mb-1.5 block text-label text-ink">
          {label}
        </label>
      ) : null}
      <div className="relative">
        <select
          id={name}
          name={name}
          className={cn(
            "h-12 w-full appearance-none rounded-md border bg-white px-4 pr-10 text-body text-ink transition-colors focus:border-brand",
            className,
          )}
          {...rest}
        >
          {placeholder ? <option value="">{placeholder}</option> : null}
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown size={18} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted" />
      </div>
    </div>
  );
}
