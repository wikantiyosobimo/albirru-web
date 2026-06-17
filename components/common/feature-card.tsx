import { Card } from "@/components/ui/card";
import { IconTile } from "@/components/common/icon-tile";
import type { FeatureItem } from "@/lib/types";

export function FeatureCard({ feature }: { feature: FeatureItem }) {
  return (
    <Card className="p-6 shadow-xs transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-sm">
      <IconTile icon={feature.icon} />
      <h3 className="mt-4 text-h-sm text-ink">{feature.title}</h3>
      <p className="mt-2 text-body-sm text-ink-muted">{feature.description}</p>
    </Card>
  );
}
