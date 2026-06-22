import { cookies } from "next/headers";
export { DICT, type Locale, type DictKey } from "@/lib/i18n-dict";
import { DICT, type Locale, type DictKey } from "@/lib/i18n-dict";

export async function getLocale(): Promise<Locale> {
  const c = await cookies();
  return c.get("locale")?.value === "en" ? "en" : "id";
}

export function t(locale: Locale, key: DictKey): string {
  return DICT[locale][key] ?? DICT.id[key] ?? key;
}
