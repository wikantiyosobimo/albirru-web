// TIER 3 — Claude AI. Server-side only.
import { callClaude, parseJsonResponse } from "./claude";
import type { AiInsight } from "../intelligence/types";

export interface QuestionInsightInput {
  teks_soal: string;   // teks pertanyaan (TANPA kunci)
  pilihan: string[];   // ["A. ...", "B. ...", ...]
  pembahasan: string;  // pembahasan resmi
  jawaban_siswa: string; // "A".."E" atau "kosong"
  kunci: string;       // SERVER ONLY — jangan kirim ke client setelah proses ini
}

/**
 * Generate insight singkat "mengapa kamu salah di soal ini" untuk pembahasan.
 * Dipanggil di halaman hasil try out (server component / route handler).
 * Kunci jawaban HANYA digunakan di server — tidak disertakan dalam respons UI.
 *
 * TODO: cache per (questionId, jawaban_siswa) di KV/Redis — insight sama jika
 *       jawaban sama, hemat token Claude.
 */
export async function generateQuestionInsight(
  input: QuestionInsightInput,
): Promise<AiInsight> {
  const { teks_soal, pilihan, pembahasan, jawaban_siswa, kunci } = input;
  const salahStr =
    jawaban_siswa === "kosong"
      ? "tidak menjawab"
      : `menjawab ${jawaban_siswa} (seharusnya ${kunci})`;

  const prompt = `Soal: ${teks_soal}
Pilihan: ${pilihan.join(" | ")}
Pembahasan resmi: ${pembahasan}
Siswa ${salahStr}.

Buat insight singkat (1-2 kalimat) yang membantu siswa memahami kenapa jawabannya salah
dan apa yang perlu diperhatikan. JSON:
{ "judul": "string", "isi": "string", "tipe": "root_cause" }

Bungkus dalam \`\`\`json ... \`\`\`.`;

  const res = await callClaude(
    [{ role: "user", content: prompt }],
    {
      model: "claude-haiku-4-5-20251001",
      max_tokens: 256,
      system: "Kamu tutor UTBK. Insight singkat, tidak menghakimi, fokus pada cara berpikir.",
    },
  );

  return parseJsonResponse<AiInsight>(res.content, {
    judul: "Catatan",
    isi: "Perhatikan kembali pembahasan di atas.",
    tipe: "root_cause",
  });
}
