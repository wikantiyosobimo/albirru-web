// TIER 3 — Claude AI. Server-side only.
import { callClaude, parseJsonResponse } from "./claude";
import type { AiInsight, WeaknessScored } from "../intelligence/types";

export interface RootCauseInput {
  subtes: string;
  topicId: string;
  weakness_index: number;
  contoh_soal_salah: string[]; // teks soal yang salah (TANPA kunci)
  pola_kesalahan?: string;     // mis. "sering salah di soal inferensi negatif"
}

/**
 * Analisis root cause dari kesalahan siswa pada topik tertentu.
 * Hasilkan insight yang actionable (bukan sekedar "perlu belajar lebih").
 *
 * TODO: cache per (userId, topicId, tanggal) — root cause tidak berubah harian.
 * TODO: gunakan histori 3 try out terakhir, bukan hanya 1.
 */
export async function analisisRootCause(
  input: RootCauseInput,
): Promise<AiInsight[]> {
  const soalStr = input.contoh_soal_salah
    .slice(0, 3) // batasi konteks
    .map((s, i) => `${i + 1}. ${s}`)
    .join("\n");

  const prompt = `Analisis kesalahan siswa di ${input.subtes} — topik "${input.topicId}" (weakness index ${input.weakness_index}%).
${input.pola_kesalahan ? `Pola: ${input.pola_kesalahan}` : ""}
Contoh soal yang salah:
${soalStr}

Kembalikan JSON array 2-3 insights:
[{
  "judul": "string (singkat)",
  "isi": "string (1-2 kalimat, actionable)",
  "tipe": "root_cause"|"tips"|"materi"
}]

Bungkus dalam \`\`\`json ... \`\`\`.`;

  const res = await callClaude(
    [{ role: "user", content: prompt }],
    {
      model: "claude-haiku-4-5-20251001",
      max_tokens: 512,
      system: "Kamu adalah tutor UTBK ahli. Identifikasi root cause kognitif, bukan permukaan.",
    },
  );

  const insights = parseJsonResponse<AiInsight[]>(res.content, []);
  return insights.filter(
    (i): i is AiInsight =>
      typeof i.judul === "string" &&
      typeof i.isi === "string" &&
      ["root_cause", "tips", "materi"].includes(i.tipe),
  );
}

/**
 * Batch root cause untuk top-N weakness sekaligus.
 * Gunakan Promise.allSettled agar satu kegagalan tidak menghentikan batch.
 */
export async function batchRootCause(
  weaknesses: (WeaknessScored & { contoh_soal_salah?: string[] })[],
): Promise<Map<string, AiInsight[]>> {
  const results = await Promise.allSettled(
    weaknesses.map((w) =>
      analisisRootCause({
        subtes: w.subtes ?? "",
        topicId: w.topicId,
        weakness_index: w.weakness_index,
        contoh_soal_salah: w.contoh_soal_salah ?? [],
      }),
    ),
  );
  const map = new Map<string, AiInsight[]>();
  weaknesses.forEach((w, i) => {
    map.set(w.topicId, results[i].status === "fulfilled" ? results[i].value : []);
  });
  return map;
}
