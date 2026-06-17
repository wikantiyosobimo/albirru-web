import { cookies } from "next/headers";

export type Locale = "id" | "en";

// Kamus terpusat. Tambahkan key per halaman secara bertahap.
export const DICT = {
  id: {
    "topbar.search": "Cari materi, try out, atau topik…",
    "topbar.role": "Siswa",
    "common.student": "Siswa",
    "dash.welcome": "Selamat datang kembali,",
    "dash.subtitle": "Terus konsisten, setiap langkah kecil membawamu lebih dekat ke impian.",
    "lang.label": "Bahasa",
    "lang.id": "Indonesia",
    "lang.en": "English",
  },
  en: {
    "topbar.search": "Search materials, try outs, or topics…",
    "topbar.role": "Student",
    "common.student": "Student",
    "dash.welcome": "Welcome back,",
    "dash.subtitle": "Stay consistent — every small step brings you closer to your goal.",
    "lang.label": "Language",
    "lang.id": "Indonesia",
    "lang.en": "English",
  },
} as const;

export type DictKey = keyof (typeof DICT)["id"];

export async function getLocale(): Promise<Locale> {
  const c = await cookies();
  return c.get("locale")?.value === "en" ? "en" : "id";
}

export function t(locale: Locale, key: DictKey): string {
  return DICT[locale][key] ?? DICT.id[key] ?? key;
}
