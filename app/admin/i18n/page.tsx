import { Languages, Plus } from "lucide-react";
import { requireAdmin } from "@/lib/portal/roles";
import { createClient } from "@/lib/supabase/server";
import { ConsoleTopbar } from "@/components/console/topbar";
import { ConsoleCard, EmptyState, Pill } from "@/components/console/ui";

export const metadata = { title: "i18n — Admin Albirru" };

type Str = { key: string; locale: string; value: string };

export default async function AdminI18nPage() {
  const { profile } = await requireAdmin();
  let strings: Str[] = [];
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("i18n_strings").select("key, locale, value").order("key").limit(500);
    strings = (data as Str[]) ?? [];
  } catch { /* kosong */ }

  // Pivot per key
  const byKey = strings.reduce<Record<string, Record<string, string>>>((acc, s) => {
    (acc[s.key] ??= {})[s.locale] = s.value; return acc;
  }, {});
  const keys = Object.keys(byKey);
  const locales = Array.from(new Set(strings.map((s) => s.locale))).sort();

  return (
    <>
      <ConsoleTopbar eyebrow="Sistem" title="String Terjemahan" subtitle={`${keys.length} key · ${locales.join(", ").toUpperCase()}`} nama={profile?.nama ?? "Admin"} roleLabel="Admin"
        right={<button className="inline-flex h-10 items-center gap-2 rounded-lg bg-brand px-4 text-body-sm font-semibold text-white hover:bg-brand-600"><Plus size={15} /> Tambah Key</button>} />

      <div className="p-5 lg:p-7">
        {keys.length === 0 ? (
          <EmptyState icon={Languages} title="Belum ada string" note="String UI dieksternalisasi di sini agar mudah menambah bahasa (BAB 14)." />
        ) : (
          <ConsoleCard>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-body-sm">
                <thead className="border-b bg-muted/50 text-caption uppercase tracking-wide text-ink-muted">
                  <tr><th className="px-4 py-2.5 font-semibold">Key</th>{locales.map((l) => <th key={l} className="px-4 py-2.5 font-semibold">{l.toUpperCase()}</th>)}</tr>
                </thead>
                <tbody className="divide-y">
                  {keys.map((k) => (
                    <tr key={k} className="hover:bg-muted/40">
                      <td className="px-4 py-2.5"><code className="font-mono text-caption text-ink-body">{k}</code></td>
                      {locales.map((l) => <td key={l} className="px-4 py-2.5 text-ink">{byKey[k][l] ?? <Pill tone="danger">kosong</Pill>}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ConsoleCard>
        )}
      </div>
    </>
  );
}
