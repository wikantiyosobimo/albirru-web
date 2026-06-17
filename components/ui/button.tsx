import Link from "next/link";
import type { ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

// Brand variants (albirru-design-system.md §8). shadcn-compatible:
// swap with `npx shadcn add button` and these variant names map across.
export const buttonVariants = cva(
  "group inline-flex items-center justify-center gap-2 rounded-md text-label transition-[transform,box-shadow,background-color,border-color,color] duration-200 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-brand text-white shadow-sm hover:bg-brand-600 hover:-translate-y-0.5",
        navy: "bg-navy-900 text-white hover:bg-navy-800",
        inverse: "bg-white text-ink hover:bg-muted",
        secondary: "border border-hair bg-transparent text-ink hover:bg-muted",
        ghostInverse: "border border-white/30 bg-transparent text-white hover:bg-white/10",
        link: "text-brand hover:underline",
      },
      size: {
        sm: "h-9 px-4",
        md: "h-11 px-6",
        lg: "h-[3.25rem] px-7",
        link: "h-auto p-0",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export interface ButtonProps extends VariantProps<typeof buttonVariants> {
  href?: string;
  leadingIcon?: LucideIcon;
  trailingIcon?: LucideIcon;
  fullWidth?: boolean;
  className?: string;
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  "aria-label"?: string;
}

function Inner({
  leadingIcon: Leading,
  trailingIcon: Trailing,
  children,
}: Pick<ButtonProps, "leadingIcon" | "trailingIcon" | "children">) {
  return (
    <>
      {Leading ? <Leading size={18} strokeWidth={2} /> : null}
      <span>{children}</span>
      {Trailing ? (
        <Trailing size={18} strokeWidth={2} className="transition-transform group-hover:translate-x-0.5" />
      ) : null}
    </>
  );
}

export function Button({
  href,
  variant,
  size,
  leadingIcon,
  trailingIcon,
  fullWidth,
  className,
  children,
  onClick,
  type = "button",
  disabled,
  ...aria
}: ButtonProps) {
  const classes = cn(
    buttonVariants({ variant, size: variant === "link" ? "link" : size }),
    fullWidth && "w-full",
    className,
  );
  const inner = (
    <Inner leadingIcon={leadingIcon} trailingIcon={trailingIcon}>
      {children}
    </Inner>
  );

  if (href) {
    return (
      <Link href={href} className={classes} {...aria}>
        {inner}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={classes} {...aria}>
      {inner}
    </button>
  );
}
