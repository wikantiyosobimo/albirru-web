import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// ⚠️ SERVER-ONLY. Client service-role mem-bypass RLS.
// HANYA boleh diimpor di Route Handler / Server Action backend (mis. webhook pembayaran),
// TIDAK PERNAH di Client Component. service_role key dibaca dari env server, tidak masuk bundle klien.
//
// Pemakaian sah: webhook Midtrans (tanpa sesi user) yang harus update subscriptions/payment_logs.

export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY / URL tidak tersedia di environment server.");
  }
  return createSupabaseClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
