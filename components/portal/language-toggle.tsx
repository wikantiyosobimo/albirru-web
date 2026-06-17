"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Languages } from "lucide-react";
import { cn } from "@/lib/utils";

// Toggle bahasa ID/EN — simpan ke cookie & muat ulang data server.
export function LanguageToggle() {
  const router = useRouter();
  const [locale, setLocale] = useState<"id" | "en">("id");

  useEffect(() => {
    const m = document.cookie.match(/(?:^|;\s*)locale=(en|id)/);
    if (m) setLocale(m[1] as "id" | "en");
  }, []);

  function set(next: "id" | "en") {
    if (next === locale) return;
    setLocale(next);
    document.cookie = `locale=${next}; path=/; max-age=31536000`;
    router.refresh();
  }

  return (
    <div className="hidden items-center rounded-lg border bg-white p-0.5 sm:flex" title="Bahasa / Language">
      <Languages size={15} className="mx-1.5 text-ink-muted" />
      {(["id", "en"] as const).map((l) => (
        <button key={l} onClick={() => set(l)}
          className={cn("rounded-md px-2 py-1 text-caption font-bold uppercase transition-colors", l === locale ? "bg-brand text-white" : "text-ink-muted hover:text-ink")}>
          {l}
        </button>
      ))}
    </div>
  );
}
