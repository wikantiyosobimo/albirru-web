"use client";

import { DICT, type Locale, type DictKey } from "@/lib/i18n-dict";

export function getClientLocale(): Locale {
  if (typeof document === "undefined") return "id";
  const m = document.cookie.match(/(?:^|;\s*)locale=(en|id)/);
  return (m?.[1] as Locale) ?? "id";
}

export function tc(locale: Locale, key: DictKey): string {
  return DICT[locale][key] ?? DICT.id[key] ?? key;
}
