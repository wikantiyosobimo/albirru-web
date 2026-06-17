import { Container } from "@/components/layout/container";
import { TrustItem } from "@/components/common/trust-item";
import { TRUST } from "@/lib/content";

export function TrustStrip() {
  return (
    <div className="border-t bg-white">
      <Container className="py-5">
        <div className="grid grid-cols-2 gap-4 md:flex md:justify-between">
          {TRUST.map((t) => (
            <TrustItem key={t.id} item={t} />
          ))}
        </div>
      </Container>
    </div>
  );
}
