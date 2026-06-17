// TIER 3 — Claude AI. Server-side only.
import { callClaude, parseJsonResponse } from "./claude";
import type { GeneratedSoal, ValidationResult } from "../intelligence/types";

/**
 * Validasi soal menggunakan Claude sebelum dipublikasikan.
 * Cek: ambiguitas, kebenaran kunci, kualitas distraktor, kejelasan bahasa.
 *
 * TODO: simpan hasil validasi ke kolom validation_result (jsonb) di tabel questions.
 */
export async function validateSoal(soal: GeneratedSoal): Promise<ValidationResult> {
  const prompt = `Review soal berikut dan kembalikan JSON validasi:

Soal: ${soal.teks}
Pilihan: ${soal.pilihan.map((p) => `${p.k}. ${p.t}`).join(" | ")}
Kunci: ${soal.kunci}
Pembahasan: ${soal.pembahasan}

Kembalikan JSON:
{
  "valid": boolean,
  "kunci_sudah_tepat": boolean,
  "issues": string[],
  "saran": string
}

Bungkus dalam \`\`\`json ... \`\`\`.`;

  const res = await callClaude(
    [{ role: "user", content: prompt }],
    {
      model: "claude-haiku-4-5-20251001", // haiku cukup untuk validasi
      max_tokens: 512,
      system: "Kamu adalah validator soal UTBK/SNBT. Berikan penilaian kritis dan akurat.",
    },
  );

  return parseJsonResponse<ValidationResult>(res.content, {
    valid: false,
    kunci_sudah_tepat: false,
    issues: ["Gagal mem-parse respons validasi"],
    saran: "",
  });
}

/**
 * Batch validasi beberapa soal sekaligus.
 * Gunakan Promise.allSettled agar satu kegagalan tidak menghentikan batch.
 */
export async function validateSoalBatch(
  soal: GeneratedSoal[],
): Promise<{ soal: GeneratedSoal; validation: ValidationResult }[]> {
  const results = await Promise.allSettled(soal.map((s) => validateSoal(s)));
  return soal.map((s, i) => ({
    soal: s,
    validation:
      results[i].status === "fulfilled"
        ? results[i].value
        : { valid: false, kunci_sudah_tepat: false, issues: ["Error saat validasi"], saran: "" },
  }));
}
