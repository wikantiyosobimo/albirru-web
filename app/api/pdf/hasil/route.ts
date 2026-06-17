import { createClient } from "@/lib/supabase/server";

// GET /api/pdf/hasil?attempt_id=...
// Mengembalikan dokumen HTML print-ready (auto-print → "Simpan sebagai PDF").
// Dependency-free; upgrade ke jsPDF/pdf-lib opsional di kemudian hari.
// Hanya attempt milik user (RPC get_attempt_review memvalidasi kepemilikan).

export async function GET(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new Response("Tidak terautentikasi.", { status: 401 });

  const url = new URL(req.url);
  const attemptId = url.searchParams.get("attempt_id") ?? url.searchParams.get("session_id");
  if (!attemptId) return new Response("attempt_id wajib.", { status: 400 });

  const [{ data: attempt }, { data: review }] = await Promise.all([
    supabase.from("tryout_attempts").select("tryout_id, skor, benar, salah, kosong, submitted_at").eq("id", attemptId).eq("user_id", user.id).single(),
    supabase.rpc("get_attempt_review", { p_attempt_id: attemptId }),
  ]);

  if (!attempt) return new Response("Hasil tidak ditemukan.", { status: 404 });

  const subtes = (review?.subtes ?? []) as { subtes: string; benar: number; salah: number; kosong: number; total: number; skor: number; persen: number }[];
  const tanggal = attempt.submitted_at ? new Date(attempt.submitted_at).toLocaleDateString("id-ID", { dateStyle: "long" }) : "—";

  const rows = subtes.map((s) => `
    <tr>
      <td>${escapeHtml(s.subtes)}</td>
      <td class="c">${s.benar}</td><td class="c">${s.salah}</td><td class="c">${s.kosong}</td>
      <td class="c">${s.persen}%</td><td class="c b">${s.skor}</td>
    </tr>`).join("");

  const html = `<!doctype html><html lang="id"><head><meta charset="utf-8">
<title>Hasil Try Out — Albirru</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:'Plus Jakarta Sans',Arial,sans-serif;color:#1a2233;padding:40px;max-width:760px;margin:auto}
  .head{display:flex;justify-content:space-between;align-items:flex-start;border-bottom:3px solid #2F5BFF;padding-bottom:16px;margin-bottom:24px}
  .logo{font-size:24px;font-weight:800;color:#2F5BFF}
  .sub{font-size:12px;color:#6b7280}
  h1{font-size:20px;margin:8px 0 2px}
  .meta{font-size:12px;color:#6b7280}
  .stats{display:flex;gap:12px;margin:24px 0}
  .stat{flex:1;border:1px solid #e5e7eb;border-radius:12px;padding:14px;text-align:center}
  .stat .v{font-size:26px;font-weight:800;color:#2F5BFF}
  .stat .l{font-size:11px;color:#6b7280;text-transform:uppercase;letter-spacing:.05em}
  table{width:100%;border-collapse:collapse;margin-top:8px;font-size:13px}
  th,td{padding:9px 10px;border-bottom:1px solid #eee;text-align:left}
  th{background:#f5f7fb;font-size:11px;text-transform:uppercase;letter-spacing:.04em;color:#6b7280}
  td.c{text-align:center}td.b{font-weight:700;color:#1a2233}
  .foot{margin-top:32px;font-size:11px;color:#9ca3af;text-align:center}
  @media print{body{padding:0}.noprint{display:none}}
  .btn{display:inline-block;margin-top:24px;background:#2F5BFF;color:#fff;padding:10px 18px;border-radius:8px;border:0;font-size:13px;cursor:pointer}
</style></head>
<body>
  <div class="head">
    <div><div class="logo">Albirru</div><div class="sub">Academic Intelligence</div></div>
    <div style="text-align:right"><h1>Laporan Hasil Try Out</h1><div class="meta">${escapeHtml(attempt.tryout_id)} · ${tanggal}</div></div>
  </div>
  <div class="stats">
    <div class="stat"><div class="v">${attempt.skor}</div><div class="l">Skor Total</div></div>
    <div class="stat"><div class="v">${attempt.benar}</div><div class="l">Benar</div></div>
    <div class="stat"><div class="v">${attempt.salah}</div><div class="l">Salah</div></div>
    <div class="stat"><div class="v">${attempt.kosong}</div><div class="l">Kosong</div></div>
  </div>
  <h2 style="font-size:15px;margin-bottom:6px">Rincian per Subtes</h2>
  <table>
    <thead><tr><th>Subtes</th><th class="c">Benar</th><th class="c">Salah</th><th class="c">Kosong</th><th class="c">Akurasi</th><th class="c">Skor</th></tr></thead>
    <tbody>${rows || '<tr><td colspan="6" class="c">Tidak ada data subtes.</td></tr>'}</tbody>
  </table>
  <button class="btn noprint" onclick="window.print()">🖨️ Simpan sebagai PDF</button>
  <div class="foot">Dokumen dihasilkan otomatis oleh Albirru Online · ${tanggal}</div>
  <script>window.addEventListener('load',function(){setTimeout(function(){try{window.print()}catch(e){}},400)})</script>
</body></html>`;

  return new Response(html, { headers: { "content-type": "text/html; charset=utf-8" } });
}

function escapeHtml(s: string): string {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
}
