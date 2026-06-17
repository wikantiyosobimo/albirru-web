import type { LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface CtaCardProps {
  variant: "navyPhoto" | "gradientIcon";
  title: string;
  body: string;
  ctaLabel: string;
  ctaHref: string;
  icon?: LucideIcon;
  className?: string;
}

// albirru-design-system.md §9 (inverse / gradient card variants)
export function CtaCard({ variant, title, body, ctaLabel, ctaHref, icon: Icon, className }: CtaCardProps) {
  const isNavy = variant === "navyPhoto";
  return (
    <div
      className={cn(
        "relative flex flex-col overflow-hidden rounded-xl p-7",
        isNavy ? "bg-navy-800" : "grad-card",
        className,
      )}
    >
      {isNavy ? (
        <div
          className="grad-photo pointer-events-none absolute -bottom-5 -right-5 hidden h-36 w-36 rounded-full opacity-70 sm:block lg:hidden xl:block"
          aria-hidden
        />
      ) : Icon ? (
        <div className="flex h-11 w-11 items-center justify-center rounded-md bg-white/15 text-white">
          <Icon size={22} />
        </div>
      ) : null}

      <div className="relative">
        <h3 className={cn("text-h-md text-white", !isNavy && "mt-4")}>{title}</h3>
        <p className="mt-2 max-w-[280px] text-body-sm text-white/72">{body}</p>
      </div>

      <div className="relative mt-auto pt-6">
        <Button href={ctaHref} variant="inverse" trailingIcon={ArrowRight}>
          {ctaLabel}
        </Button>
      </div>
    </div>
  );
}
