import { cache } from "react";
import { createClient } from "@/lib/supabase/server";

// Baca feature flags dari DB (Server Components). Di-cache per request.
export const getFeatureFlags = cache(async (): Promise<Record<string, boolean>> => {
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("feature_flags").select("key, enabled");
    const map: Record<string, boolean> = {};
    (data ?? []).forEach((f: { key: string; enabled: boolean }) => { map[f.key] = f.enabled; });
    return map;
  } catch {
    return {};
  }
});

export async function isFlagEnabled(key: string): Promise<boolean> {
  const flags = await getFeatureFlags();
  return flags[key] === true;
}
