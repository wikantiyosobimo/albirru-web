import { Card } from "@/components/ui/card";
import type { UniversityItem } from "@/lib/types";

// Logo slot uses a monogram placeholder — replace with the official SVG crest.
export function UniversityCard({ university }: { university: UniversityItem }) {
  return (
    <Card className="flex flex-col items-center p-5 text-center shadow-sm transition-transform duration-200 hover:-translate-y-0.5">
      <div className="grad-monogram flex h-14 w-14 items-center justify-center rounded-full text-[15px] font-extrabold text-white">
        {university.abbr}
      </div>
      <div className="mt-3 text-label text-ink">{university.abbr}</div>
      <div className="mt-1 text-caption text-ink-muted">{university.name}</div>
    </Card>
  );
}
