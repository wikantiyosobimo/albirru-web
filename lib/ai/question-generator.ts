// TIER 3 — Claude AI. Server-side only. Hanya file lib/ai/* yang boleh memanggil Claude.
// kunci jawaban (GeneratedSoal.kunci) TIDAK PERNAH dikirim ke client.
import { callClaude, parseJsonResponse } from "./claude";
import type { GeneratedSoal, SubtesId, TopicId, Pilihan } from "../intelligence/types";

export interface GeneratorOptions {
  subtes: SubtesId;
  topicId: TopicId;
  level_kesulitan: 1 | 2 | 3 | 4 | 5; // 1=mudah, 5=sangat sulit
  jumlah?: number; // default 1
  konteks?: string; // teks/bacaan yang dijadikan dasar soal
}

/**
 * Generate soal baru menggunakan Claude.
 * Kembalikan GeneratedSoal[] lengkap dengan kunci jawaban (SERVER ONLY).
 * Route handler HARUS strip .kunci sebelum mengirim ke client.
 *
 * TODO: simpan soal hasil generasi ke tabel questions dengan status='draft' untuk
 *       review staf sebelum dipublikasikan (lihat lib/ai/question-validator.ts).
 */
export async function generateSoal(opts: GeneratorOptions): Promise<GeneratedSoal[]> {
  const { subtes, topicId, level_kesulitan, jumlah = 1, konteks } = opts;

  const prompt = buildPrompt({ subtes, topicId, level_kesulitan, jumlah, konteks });

  const res = await callClaude(
    [{ role: "user", content: prompt }],
    {
      model: "claude-sonnet-4-6", // gunakan sonnet untuk kualitas soal lebih baik
      max_tokens: 2048,
      system: SYSTEM_PROMPT,
    },
  );

  const parsed = parseJsonResponse<GeneratedSoal[]>(res.content, []);
  // Validasi minimal: pastikan setiap soal punya field kunci
  return parsed.filter(
    (s): s is GeneratedSoal =>
      typeof s.teks === "string" &&
      Array.isArray(s.pilihan) &&
      ["A", "B", "C", "D", "E"].includes(s.kunci as string),
  );
}

function buildPrompt(opts: GeneratorOptions): string {
  return `Buat ${opts.jumlah} soal ${opts.subtes} topik "${opts.topicId}" level kesulitan ${opts.level_kesulitan}/5.
${opts.konteks ? `\nKonteks/bacaan:\n${opts.konteks}\n` : ""}
Format respons: JSON array, setiap soal memiliki:
- teks: string (pertanyaan)
- pilihan: [{k: "A"|"B"|"C"|"D"|"E", t: string}] (5 pilihan)
- kunci: "A"|"B"|"C"|"D"|"E"
- pembahasan: string (penjelasan jawaban benar)
- subtes: "${opts.subtes}"
- topicId: "${opts.topicId}"
- level_kesulitan: ${opts.level_kesulitan}
- cognitive_skill: string (misal "analisis", "evaluasi", "penerapan")

Bungkus dalam \`\`\`json ... \`\`\`.`;
}

const SYSTEM_PROMPT = `Kamu adalah pembuat soal UTBK/SNBT/CPNS berpengalaman. Buat soal yang:
1. Sesuai kisi-kisi resmi SNBT/SKD CPNS terbaru.
2. Tidak ambigu — hanya satu jawaban yang benar.
3. Pilihan pengecoh (distraktor) masuk akal dan tidak trivial.
4. Pembahasan singkat, padat, dan mendidik.
5. Respons HANYA berupa JSON array yang valid.`;
