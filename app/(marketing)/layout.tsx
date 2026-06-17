import type { ReactNode } from "react";
import { Header } from "@/components/sections/header";
import { Footer } from "@/components/sections/footer";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
