import type { ReactNode } from "react";
import { Quote } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Monogram } from "@/components/common/monogram";
import { cn } from "@/lib/utils";
import type { Testimonial } from "@/lib/types";

export function TestimonialCard({
  testimonial,
  className,
  children,
}: {
  testimonial: Testimonial;
  className?: string;
  children?: ReactNode;
}) {
  const initial = testimonial.author.split(" ").slice(-1)[0]?.[0] ?? "A";
  return (
    <Card className={cn("flex h-full flex-col p-7 shadow-sm", className)}>
      <Quote className="text-brand-300" size={28} />
      <p className="mt-2 flex-1 text-body text-ink">{testimonial.quote}</p>
      <div className="mt-5 flex items-center gap-3">
        <Monogram label={initial} size={40} />
        <div>
          <div className="text-label text-ink">{testimonial.author}</div>
          <div className="text-caption text-ink-muted">{testimonial.program}</div>
        </div>
      </div>
      {children}
    </Card>
  );
}
