import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function PricingCard({
  name,
  price,
  period,
  tagline,
  features,
  ctaLabel,
  ctaHref,
  featured,
}: {
  name: string;
  price: string;
  period?: string;
  tagline: string;
  features: string[];
  ctaLabel: string;
  ctaHref: string;
  featured?: boolean;
}) {
  return (
    <div className={cn("flex flex-col rounded-xl border p-7", featured ? "border-brand bg-white shadow-md" : "bg-white")}>
      <div className="text-eyebrow uppercase text-brand">{name}</div>
      <div className="mt-3 flex items-end gap-1">
        <span className="text-stat text-ink">{price}</span>
        {period ? <span className="mb-1.5 text-body-sm text-ink-muted">/{period}</span> : null}
      </div>
      <p className="mt-2 text-body-sm text-ink-body">{tagline}</p>
      <ul className="mt-5 flex flex-1 flex-col gap-2.5">
        {features.map((f, i) => (
          <li key={i} className="flex items-start gap-2 text-body-sm text-ink-body">
            <Check size={18} className="mt-0.5 shrink-0 text-brand" /> {f}
          </li>
        ))}
      </ul>
      <div className="mt-6">
        <Button href={ctaHref} variant={featured ? "primary" : "secondary"} fullWidth>
          {ctaLabel}
        </Button>
      </div>
    </div>
  );
}
