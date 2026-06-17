// Integrasi email transaksional via Resend. Server-side only.
// Aktif bila RESEND_API_KEY tersedia; jika tidak, no-op (dev) agar tidak menghambat.

const RESEND_URL = "https://api.resend.com/emails";
const FROM_DEFAULT = "Albirru <noreply@albirru.id>";

export interface SendEmailParams {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
  replyTo?: string;
}

export async function sendEmail(params: SendEmailParams): Promise<{ ok: boolean; id?: string; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    // Dev / belum dikonfigurasi: jangan gagal keras.
    console.warn("[resend] RESEND_API_KEY tidak ada — email dilewati:", params.subject);
    return { ok: false, error: "RESEND_API_KEY tidak tersedia" };
  }
  try {
    const res = await fetch(RESEND_URL, {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        from: params.from ?? FROM_DEFAULT,
        to: params.to,
        subject: params.subject,
        html: params.html,
        reply_to: params.replyTo,
      }),
    });
    if (!res.ok) return { ok: false, error: `Resend ${res.status}: ${await res.text().catch(() => "")}` };
    const data = (await res.json()) as { id: string };
    return { ok: true, id: data.id };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "send failed" };
  }
}

// ── Template ringkas ──────────────────────────────────────

export function welcomeEmail(nama: string): { subject: string; html: string } {
  return {
    subject: "Selamat datang di Albirru Online 🎓",
    html: `<div style="font-family:sans-serif;max-width:480px;margin:auto">
      <h2 style="color:#2F5BFF">Halo, ${escapeHtml(nama)}!</h2>
      <p>Akunmu siap. Mulai try out pertamamu dan biarkan Academic Intelligence memetakan kekuatanmu.</p>
      <a href="https://albirru.id/app" style="display:inline-block;background:#2F5BFF;color:#fff;padding:10px 20px;border-radius:8px;text-decoration:none">Masuk ke Dashboard</a>
    </div>`,
  };
}

export function weeklyReportEmail(nama: string, ringkasan: string): { subject: string; html: string } {
  return {
    subject: "Laporan Mingguan Albirru-mu 📈",
    html: `<div style="font-family:sans-serif;max-width:480px;margin:auto">
      <h2 style="color:#2F5BFF">Progres ${escapeHtml(nama)} pekan ini</h2>
      <p>${escapeHtml(ringkasan)}</p>
      <a href="https://albirru.id/app/intelligence" style="color:#2F5BFF">Lihat detail →</a>
    </div>`,
  };
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
}
