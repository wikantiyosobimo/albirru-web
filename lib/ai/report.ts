// TIER 3 — Claude AI. Server-side only.
import { callClaude, parseJsonResponse } from "./claude";
import type { WeaknessScored, SkorRiwayat, PrediksiSkor } from "../intelligence/types";

export interface WeeklyReportInput {
  nama: string;
  skor_minggu_ini: number;
  skor_minggu_lalu: number;
  weakness_top3: WeaknessScored[];
  riwayat: SkorRiwayat[];
  prediksi: PrediksiSkor;
  hari_ke_ujian: number;
}

export interface WeeklyReport {
  judul: string;
  ringkasan: string;
  poin_kuat: string[];
  poin_lemah: string[];
  rekomendasi: string[];
  motivasi: string;
}

/**
 * Generate laporan mingguan personal menggunakan Claude.
 * Dipanggil oleh cron job mingguan (Edge Function) — bukan per request user.
 *
 * TODO: simpan ke tabel weekly_reports dan kirim via Resend email.
 * TODO: cache per user per minggu di Redis/KV untuk hindari regenerasi.
 */
export async function generateWeeklyReport(
  input: WeeklyReportInput,
): Promise<WeeklyReport> {
  const delta = input.skor_minggu_ini - input.skor_minggu_lalu;
  const deltaStr = delta >= 0 ? `+${delta}` : `${delta}`;
  const weakness = input.weakness_top3
    .map((w) => `${w.topicId} (weakness ${w.weakness_index}%)`)
    .join(", ");

  const prompt = `Buat laporan mingguan UTBK untuk siswa "${input.nama}":
- Skor minggu ini: ${input.skor_minggu_ini} (${deltaStr} dari minggu lalu)
- 3 kelemahan utama: ${weakness}
- Prediksi skor hari-H: ${input.prediksi.proyeksi} (${Math.round(input.prediksi.keyakinan * 100)}% yakin)
- Hari ke ujian: ${input.hari_ke_ujian}

JSON format:
{
  "judul": "string",
  "ringkasan": "string (2-3 kalimat)",
  "poin_kuat": ["string", ...],
  "poin_lemah": ["string", ...],
  "rekomendasi": ["string x3 (actionable)"],
  "motivasi": "string (1 kalimat, personal)"
}

Bungkus dalam \`\`\`json ... \`\`\`.`;

  const res = await callClaude(
    [{ role: "user", content: prompt }],
    {
      model: "claude-haiku-4-5-20251001",
      max_tokens: 800,
      system: "Kamu adalah coach UTBK yang empatik dan data-driven. Bahasa Indonesia yang ramah namun profesional.",
    },
  );

  return parseJsonResponse<WeeklyReport>(res.content, {
    judul: "Laporan Mingguan",
    ringkasan: "Terus semangat dalam persiapanmu!",
    poin_kuat: [],
    poin_lemah: [],
    rekomendasi: [],
    motivasi: "Kamu bisa!",
  });
}
