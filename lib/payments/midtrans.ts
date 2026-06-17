import crypto from "crypto";

// Integrasi Midtrans (Snap). Server-side only.
// Mode simulasi default; aktifkan production via feature flag `midtrans_live` + env keys.

const MIDTRANS_SNAP_URL_SANDBOX = "https://app.sandbox.midtrans.com/snap/v1/transactions";
const MIDTRANS_SNAP_URL_PROD = "https://app.midtrans.com/snap/v1/transactions";

export type MidtransStatus = "settlement" | "capture" | "pending" | "expire" | "cancel" | "deny" | "failure";

export interface MidtransNotification {
  order_id: string;
  status_code: string;
  gross_amount: string;
  signature_key: string;
  transaction_status: MidtransStatus;
  fraud_status?: string;
  payment_type?: string;
}

/**
 * Verifikasi signature webhook Midtrans:
 * sha512(order_id + status_code + gross_amount + ServerKey)
 */
export function verifySignature(n: MidtransNotification): boolean {
  const serverKey = process.env.MIDTRANS_SERVER_KEY;
  if (!serverKey) return false;
  const payload = `${n.order_id}${n.status_code}${n.gross_amount}${serverKey}`;
  const expected = crypto.createHash("sha512").update(payload).digest("hex");
  return expected === n.signature_key;
}

/**
 * Petakan status Midtrans → status internal subscriptions/payment_logs.
 */
export function mapStatus(s: MidtransStatus): "settlement" | "pending" | "failed" {
  if (s === "settlement" || s === "capture") return "settlement";
  if (s === "pending") return "pending";
  return "failed";
}

/**
 * Buat transaksi Snap (untuk upgrade Pro nyata). Mengembalikan token + redirect_url.
 * TODO: panggil dari Route Handler `/api/upgrade-pro` saat flag midtrans_live aktif.
 */
export async function createSnapTransaction(params: {
  orderId: string; amount: number; nama: string; email: string;
}): Promise<{ token: string; redirect_url: string }> {
  const serverKey = process.env.MIDTRANS_SERVER_KEY;
  if (!serverKey) throw new Error("MIDTRANS_SERVER_KEY tidak tersedia.");
  const isProd = process.env.MIDTRANS_ENV === "production";
  const url = isProd ? MIDTRANS_SNAP_URL_PROD : MIDTRANS_SNAP_URL_SANDBOX;
  const auth = Buffer.from(`${serverKey}:`).toString("base64");

  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json", authorization: `Basic ${auth}` },
    body: JSON.stringify({
      transaction_details: { order_id: params.orderId, gross_amount: params.amount },
      customer_details: { first_name: params.nama, email: params.email },
      credit_card: { secure: true },
    }),
  });
  if (!res.ok) throw new Error(`Midtrans error ${res.status}: ${await res.text().catch(() => "")}`);
  return (await res.json()) as { token: string; redirect_url: string };
}
