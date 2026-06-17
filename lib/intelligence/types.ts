// ============================================================
// Tipe bersama untuk Intelligence Layer (Tier 1/2/3) — BAB 8 PRD.
// Server-side only. Tidak pernah mengirim answer_key ke client.
// Diimpor ulang oleh lib/intelligence/*, lib/ml/*, lib/ai/*.
// ============================================================

// ---------- Dasar ----------
export type SubtesId = string;   // mis. "TPS - Penalaran Umum"
export type TopicId = string;    // mis. "inferensi"
export type Pilihan = "A" | "B" | "C" | "D" | "E";

/** Jawaban siswa untuk satu soal. `null` = kosong/tidak dijawab. */
export interface AnswerInput {
  questionId: string;
  subtes: SubtesId;
  topicId?: TopicId;
  pilihan: Pilihan | null;
  waktuDetik?: number;
  isRagu?: boolean;
  poin?: number; // bobot soal (default 1)
}

/** Kunci jawaban — SERVER ONLY. Jangan pernah dikirim ke client. */
export interface AnswerKeyInput {
  questionId: string;
  subtes: SubtesId;
  topicId?: TopicId;
  kunci: Pilihan;
  poin?: number;
}

// ---------- Tier 1: Scoring ----------
export interface SubtesScore {
  subtes: SubtesId;
  benar: number;
  salah: number;
  kosong: number;
  total: number;
  skor: number;       // 0..1000 (ternormalisasi)
  akurasi: number;    // 0..100 (%)
}

export interface ScoreResult {
  benar: number;
  salah: number;
  kosong: number;
  total: number;
  skor_total: number;             // 0..1000
  skor_per_subtes: SubtesScore[];
}

// ---------- Tier 1: Ranking ----------
export interface RankResult {
  peringkat: number;     // 1 = teratas
  total_peserta: number;
  persentil: number;     // 0..100
}

// ---------- Tier 1: Weakness ----------
export interface WeaknessRecordInput {
  topicId: TopicId;
  subtes?: SubtesId;
  akurasi: number;  // 0..1
  total_soal: number;
  bobot_mapel?: number; // default 1
}

export interface WeaknessScored extends WeaknessRecordInput {
  weakness_index: number; // (1 - akurasi) * 100
  prioritas_skor: number; // weakness_index * bobot_mapel
}

export interface PrioritasTopik {
  topicId: TopicId;
  weakness_index: number;
  prioritas_skor: number;
  rank: number;
}

// ---------- Tier 1: Missions ----------
export type MissionTipe = "review" | "latihan" | "tryout" | "revisi" | "video";
export interface Mission {
  kode: string;
  tipe: MissionTipe;
  judul: string;
  deskripsi: string;
  target: number;     // mis. 20 (soal)
  xp: number;
  topicId?: TopicId;
}

// ---------- Tier 1: Study Plan ----------
export type HariMinggu = "sen" | "sel" | "rab" | "kam" | "jum" | "sab" | "min";
export interface StudyBlock {
  hari: HariMinggu;
  topicId: TopicId;
  judul: string;
  durasi_menit: number;
}
export interface StudyPlan {
  minggu_mulai: string; // ISO date
  blok: StudyBlock[];
  total_menit: number;
}

// ---------- Tier 1: Peluang ----------
export interface PeluangResult {
  peluang: number;   // 0..1
  persen: number;    // 0..100
  gap: number;       // pgAman - skor (>=0)
}

// ---------- Tier 1: Milestone & Gamification ----------
export interface Milestone {
  kode: string;       // "T-90" .. "T-0"
  hari_ke_ujian: number;
  judul: string;
  target: string;
  status: "selesai" | "aktif" | "akan";
}
export interface LevelInfo {
  level: number;
  xp_total: number;
  xp_level: number;   // xp pada level saat ini
  xp_target: number;  // xp untuk naik level
  progress: number;   // 0..100
}

// ---------- Tier 2: IRT ----------
export interface ItemParams {
  questionId: string;
  a: number; // diskriminasi (2PL/3PL)
  b: number; // kesulitan
  c: number; // tebakan (3PL)
}
export interface ItemResponse {
  questionId: string;
  benar: boolean;
}
export interface ThetaEstimate {
  theta: number;  // kemampuan laten
  se: number;     // standard error
}

// ---------- Tier 2: Score Predictor ----------
export interface SkorRiwayat {
  tanggal: string; // ISO
  skor: number;
}
export interface PrediksiSkor {
  proyeksi: number;       // skor hari-H
  bawah: number;          // batas bawah interval
  atas: number;           // batas atas interval
  keyakinan: number;      // 0..1
}

// ---------- Tier 2: Spaced Repetition (SM-2) ----------
export interface SrsItem {
  topicId: TopicId;
  ease: number;        // easiness factor (default 2.5)
  interval_hari: number;
  repetisi: number;
  jatuh_tempo: string; // ISO date review berikutnya
}
export interface AnswerHistory {
  topicId: TopicId;
  kualitas: number; // 0..5 (SM-2 grade)
  tanggal: string;
}

// ---------- Tier 3: AI ----------
export interface GeneratedSoal {
  teks: string;
  pilihan: { k: Pilihan; t: string }[];
  kunci: Pilihan;        // SERVER ONLY
  pembahasan: string;
  subtes: SubtesId;
  topicId?: TopicId;
  level_kesulitan: number; // 1..5
  cognitive_skill?: string; // Bloom
}
export interface ValidationResult {
  valid: boolean;
  kunci_sudah_tepat: boolean;
  issues: string[];
  saran: string;
}
export interface AiInsight {
  judul: string;
  isi: string;
  tipe: "root_cause" | "tips" | "materi";
}
