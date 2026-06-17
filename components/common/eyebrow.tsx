import type { ReactNode } from "react";

// albirru-design-system.md §11.2
export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="inline-block rounded-full bg-brand-100 px-3 py-1.5 text-eyebrow uppercase text-brand">
      {children}
    </span>
  );
}
