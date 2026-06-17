import type { ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// albirru-design-system.md §11.1
const badgeVariants = cva("inline-flex items-center rounded-full font-semibold", {
  variants: {
    variant: {
      success: "bg-success-subtle text-success-strong",
      neutral: "bg-muted text-ink-body",
    },
    size: {
      sm: "px-2 py-0.5 text-[10px]",
      md: "px-2.5 py-1 text-caption",
    },
  },
  defaultVariants: { variant: "success", size: "md" },
});

export function Badge({
  variant,
  size,
  className,
  children,
}: VariantProps<typeof badgeVariants> & { className?: string; children: ReactNode }) {
  return <span className={cn(badgeVariants({ variant, size }), className)}>{children}</span>;
}
