import { NextResponse } from "next/server";
import { verifySignature, mapStatus, type MidtransNotification } from "@/lib/payments/midtrans";
import { createAdminClient } from "@/lib/supabase/admin";
import { rateLimit, clientKey, tooManyRequests } from "@/lib/rate-limit";

// POST /api/webhooks/midtrans — terima notifikasi pembayaran.
// Verifikasi signature → catat payment_logs → aktifkan subscription/Pro bila settlement.
// Memakai service-role (tanpa sesi user) karena dipanggil oleh server Midtrans.

export async function POST(req: Request) {
  // Lindungi dari flooding (verifikasi signature tetap lapis utama).
  const rl = rateLimit(clientKey(req, "midtrans"), 60, 60_000);
  if (!rl.ok) return tooManyRequests(rl.retryAfter);

  let body: MidtransNotification;
  try {
    body = (await req.json()) as MidtransNotification;
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  if (!verifySignature(body)) {
    return NextResponse.json({ error: "invalid signature" }, { status: 403 });
  }

  const status = mapStatus(body.transaction_status);
  const jumlah = Math.round(Number(body.gross_amount) || 0);

  try {
    const supabase = createAdminClient();

    // Catat / update log pembayaran (idempoten via order_id unik)
    await supabase.from("payment_logs").upsert({
      order_id: body.order_id,
      jumlah,
      status,
      midtrans_data: body as unknown as Record<string, unknown>,
      // user_id diisi dari konvensi order_id "pro-<userId>-<ts>" bila ada
      user_id: extractUserId(body.order_id),
    }, { onConflict: "order_id" });

    // Aktifkan Pro saat settlement
    if (status === "settlement") {
      const userId = extractUserId(body.order_id);
      if (userId) {
        await supabase.from("profiles").update({ plan: "pro" }).eq("id", userId);
        await supabase.from("subscriptions").insert({
          user_id: userId, paket: "pro", status: "aktif",
          mulai_at: new Date().toISOString(),
          berakhir_at: new Date(Date.now() + 30 * 864e5).toISOString(),
          midtrans_order_id: body.order_id, harga: jumlah,
        });
      }
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "server error" }, { status: 500 });
  }
}

// order_id berformat "pro-<uuid>-<timestamp>"
function extractUserId(orderId: string): string | null {
  const m = orderId.match(/^pro-([0-9a-f-]{36})-/i);
  return m ? m[1] : null;
}
