// Rate limiter sederhana berbasis memori (per instance serverless).
// Cukup untuk meredam abuse dasar pada route sensitif. Untuk skala besar/multi-region,
// ganti ke Upstash Redis / Vercel KV (token bucket terdistribusi).

type Bucket = { count: number; reset: number };
const buckets = new Map<string, Bucket>();

export interface RateLimitResult {
  ok: boolean;
  remaining: number;
  retryAfter: number; // detik
}

/**
 * @param key      pengenal unik (mis. `ai:${userId}` atau `pay:${ip}`)
 * @param limit    jumlah maksimal request per window
 * @param windowMs durasi window dalam ms
 */
export function rateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  const b = buckets.get(key);

  if (!b || now > b.reset) {
    buckets.set(key, { count: 1, reset: now + windowMs });
    // Bersihkan entri kedaluwarsa sesekali agar map tak tumbuh tanpa batas.
    if (buckets.size > 5000) {
      for (const [k, v] of buckets) if (now > v.reset) buckets.delete(k);
    }
    return { ok: true, remaining: limit - 1, retryAfter: 0 };
  }

  if (b.count >= limit) {
    return { ok: false, remaining: 0, retryAfter: Math.ceil((b.reset - now) / 1000) };
  }

  b.count++;
  return { ok: true, remaining: limit - b.count, retryAfter: 0 };
}

/** Ambil pengenal klien dari header (IP) untuk endpoint tanpa sesi (mis. webhook publik). */
export function clientKey(req: Request, prefix: string): string {
  const fwd = req.headers.get("x-forwarded-for") ?? "";
  const ip = fwd.split(",")[0].trim() || req.headers.get("x-real-ip") || "unknown";
  return `${prefix}:${ip}`;
}

/** Helper Response 429 standar. */
export function tooManyRequests(retryAfter: number): Response {
  return new Response(JSON.stringify({ error: "Terlalu banyak permintaan. Coba lagi nanti." }), {
    status: 429,
    headers: { "content-type": "application/json", "retry-after": String(retryAfter) },
  });
}
