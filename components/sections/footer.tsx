import { Container } from "@/components/layout/container";
import { Logo } from "@/components/common/logo";
import { TrustStrip } from "./trust-strip";

// Footer columns are intentionally minimal — the source screenshot ends at the
// trust strip (UI spec, Appendix B). Expand link columns / socials when designed.
export function Footer() {
  return (
    <footer>
      <TrustStrip />
      <div className="border-t bg-white">
        <Container className="flex flex-col items-center justify-between gap-4 py-8 sm:flex-row">
          <Logo />
          <p className="text-caption text-ink-muted">
            © {new Date().getFullYear()} Albirru. Personal Academic Intelligence System.
          </p>
        </Container>
      </div>
    </footer>
  );
}
