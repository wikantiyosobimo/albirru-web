import type { ReactNode } from "react";
import { Container } from "@/components/layout/container";
import { Eyebrow } from "@/components/common/eyebrow";
import { cn } from "@/lib/utils";

export function PageHero({
  eyebrow,
  title,
  subtitle,
  tone = "light",
  children,
}: {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: string;
  tone?: "light" | "navy";
  children?: ReactNode;
}) {
  const navy = tone === "navy";
  return (
    <section className={cn(navy ? "bg-navy-900" : "bg-muted")}>
      <Container className="py-16 text-center md:py-20">
        {eyebrow ? (
          <div className="flex justify-center">
            <Eyebrow>{eyebrow}</Eyebrow>
          </div>
        ) : null}
        <h1 className={cn("mt-4 text-h-xl", navy ? "text-white" : "text-ink")}>{title}</h1>
        {subtitle ? (
          <p className={cn("mx-auto mt-4 max-w-2xl text-body", navy ? "text-white/72" : "text-ink-body")}>{subtitle}</p>
        ) : null}
        {children ? <div className="mt-6 flex justify-center gap-3">{children}</div> : null}
      </Container>
    </section>
  );
}
