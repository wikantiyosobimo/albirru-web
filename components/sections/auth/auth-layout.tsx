import type { ReactNode } from "react";
import Link from "next/link";
import { Logo } from "@/components/common/logo";

export function AuthLayout({
  left,
  children,
  topRight,
}: {
  left: ReactNode;
  children: ReactNode;
  topRight?: { text: string; linkLabel: string; href: string };
}) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2" style={{ backgroundImage: "linear-gradient(160deg,#eef3ff,#ffffff 60%)" }}>
      {left}
      <div className="relative flex flex-col">
        {topRight ? (
          <div className="flex justify-end p-6 text-body-sm text-ink-body">
            <span>
              {topRight.text}{" "}
              <Link href={topRight.href} className="font-semibold text-brand hover:underline">
                {topRight.linkLabel}
              </Link>
            </span>
          </div>
        ) : (
          <div className="p-6" />
        )}
        <div className="px-6 lg:hidden">
          <Logo />
        </div>
        <div className="flex flex-1 items-center justify-center p-6">
          <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-md">{children}</div>
        </div>
      </div>
    </div>
  );
}
