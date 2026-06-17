// TIER 3 — Claude AI. Server-side only.
import { callClaude, parseJsonResponse } from "./claude";
import type { WeaknessScored, ThetaEstimate } from "../intelligence/types";

export interface CognitiveNarrativeInput {
  nama: string;
  theta: ThetaEstimate;          // estimasi kemampuan dari IRT
  weakness_top5: WeaknessScored[];
  dominant_skill?: string;       // mis. "penalaran deduktif"
  gaya_belajar?: string;         // mis. "visual" (dari onboarding)
}

export interface CognitiveNarrative {
  profil_singkat: string;        // 2-3 kalimat tentang profil kognitif
  kekuatan: string[];            // 2 poin
  area_pertumbuhan: string[];    // 2-3 poin
  strategi_belajar: string[];    // 3 rekomendasi spesifik
  afirmasi: string;              // kalimat motivasi personal
}

/**
 * Generate narasi profil kognitif personal berdasarkan data IRT + weakness.
 * Dipanggil saat siswa membuka halaman Academic Intelligence (lazy load).
 *
 * TODO: regenerasi maksimal 1x per minggu per user — simpan di tabel cognitive_profiles
 *       dengan kolom generated_at dan user_id.
 * TODO: tambahkan data gaya belajar (VAK) dari onboarding untuk personalisasi lebih dalam.
 */
export async function generateCognitiveNarrative(
  input: CognitiveNarrativeInput,
): Promise<CognitiveNarrative> {
  const { nama, theta, weakness_top5, dominant_skill, gaya_belajar } = input;
  const weaknessStr = weakness_top5
    .slice(0, 3)
    .map((w) => `${w.topicId} (${w.weakness_index}%)`)
    .join(", ");
  const thetaLabel = theta.theta > 1 ? "tinggi" : theta.theta > 0 ? "sedang" : "perlu dikembangkan";

  const prompt = `Buat profil kognitif personal untuk siswa UTBK bernama "${nama}":
- Kemampuan laten (IRT theta): ${theta.theta} (${thetaLabel}), SE: ${theta.se}
- Kelemahan utama: ${weaknessStr}
${dominant_skill ? `- Kekuatan dominan: ${dominant_skill}` : ""}
${gaya_belajar ? `- Gaya belajar: ${gaya_belajar}` : ""}

JSON:
{
  "profil_singkat": "string",
  "kekuatan": ["string", "string"],
  "area_pertumbuhan": ["string", "string", "string"],
  "strategi_belajar": ["string", "string", "string"],
  "afirmasi": "string"
}

Bungkus dalam \`\`\`json ... \`\`\`. Bahasa Indonesia yang hangat dan memotivasi.`;

  const res = await callClaude(
    [{ role: "user", content: prompt }],
    {
      model: "claude-haiku-4-5-20251001",
      max_tokens: 700,
      system:
        "Kamu psikolog pendidikan dan coach UTBK. Berikan narasi berbasis data, bukan generik. Hindari klise.",
    },
  );

  return parseJsonResponse<CognitiveNarrative>(res.content, {
    profil_singkat: `${nama} sedang dalam proses membangun kemampuan yang solid untuk UTBK.`,
    kekuatan: ["Ketekunan dalam berlatih", "Kemampuan analisis dasar"],
    area_pertumbuhan: ["Akurasi di soal penalaran", "Manajemen waktu"],
    strategi_belajar: [
      "Fokus review soal yang salah setelah setiap try out",
      "Latihan 20 soal per hari per topik lemah",
      "Gunakan teknik elaborasi saat membaca pembahasan",
    ],
    afirmasi: `${nama}, setiap langkah kecil membawa kamu lebih dekat ke tujuan!`,
  });
}
