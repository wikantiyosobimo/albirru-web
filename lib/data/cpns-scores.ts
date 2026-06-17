// ============================================================
// Data referensi seleksi ASN: SKD (TWK/TIU/TKP) & SKB.
// ------------------------------------------------------------
// Berbeda dengan UTBK, ambang batas (passing grade) SKD CPNS
// bersifat RESMI (diatur PermenPANRB tiap tahun). Nilai di bawah
// mengacu pada ketentuan CPNS 2024 (PermenPANRB No. 321/2024).
// SKB & komposisi nilai akhir juga mengikuti aturan resmi.
// "Nilai aman" per instansi = ESTIMASI keketatan, bukan ambang resmi.
// ============================================================

// Struktur & nilai maksimum SKD (110 soal, skala poin).
export const SKD = {
  twk: { soal: 30, max: 150, ambang: 65, label: "TWK", nama: "Tes Wawasan Kebangsaan" },
  tiu: { soal: 35, max: 175, ambang: 80, label: "TIU", nama: "Tes Intelegensi Umum" },
  tkp: { soal: 45, max: 225, ambang: 166, label: "TKP", nama: "Tes Karakteristik Pribadi" },
  total: { soal: 110, max: 550 },
};

// Varian ambang batas khusus (CPNS).
export const SKD_VARIAN = {
  umum: { tiu: 80, totalNote: "Lulus jika ketiga komponen ≥ ambang." },
  cumlaude: { tiu: 85, totalNote: "Lulusan cumlaude: TIU ≥ 85." },
  diaspora: { tiu: 85, totalNote: "Diaspora: TIU ≥ 85." },
  disabilitas: { tiu: 60, totalNote: "Disabilitas: TIU ≥ 60." },
  papua: { tiu: 60, totalNote: "Putra/Putri Papua: TIU ≥ 60." },
};

// Komposisi nilai akhir.
export const KOMPOSISI = {
  cpns: "Nilai akhir CPNS = 40% SKD + 60% SKB.",
  pppk:
    "PPPK: Seleksi Kompetensi (Teknis, Manajerial, Sosiokultural) + Wawancara. " +
    "Ambang batas kompetensi teknis ditentukan per jabatan oleh instansi.",
};

// Instansi kompetitif → estimasi total SKD yang "aman" (di atas ambang).
const INSTANSI_TOP = [
  "keuangan", "pajak", "bea dan cukai", "kejaksaan", "mahkamah agung",
  "luar negeri", "intelijen", "bin", "pemeriksa keuangan", "bpk",
  "sekretariat negara", "setneg",
];
const INSTANSI_MID = [
  "kementerian", "direktorat", "kepolisian", "statistik", "bps",
  "kepegawaian", "bkn", "pusat",
];

export const INSTANSI = [
  "Kementerian Keuangan",
  "Direktorat Jenderal Pajak",
  "Direktorat Jenderal Bea dan Cukai",
  "Kejaksaan Agung",
  "Mahkamah Agung",
  "Kementerian Luar Negeri",
  "Badan Intelijen Negara (BIN)",
  "Badan Pemeriksa Keuangan (BPK)",
  "Kementerian Sekretariat Negara",
  "Kementerian Hukum dan HAM",
  "Kementerian Dalam Negeri",
  "Kementerian Kesehatan",
  "Kementerian Pendidikan",
  "Kementerian Agama",
  "Kementerian PUPR",
  "Kepolisian Republik Indonesia",
  "Badan Pusat Statistik (BPS)",
  "Badan Kepegawaian Negara (BKN)",
  "Pemerintah Provinsi DKI Jakarta",
  "Pemerintah Daerah (Kabupaten/Kota)",
];

export const JABATAN = [
  "Analis Kebijakan",
  "Analis Keuangan",
  "Auditor",
  "Pemeriksa Pajak",
  "Pemeriksa Bea dan Cukai",
  "Pranata Komputer",
  "Analis Data",
  "Statistisi",
  "Jaksa",
  "Analis Hukum",
  "Diplomat (PDLN)",
  "Perencana",
  "Arsiparis",
  "Pranata Humas",
  "Analis SDM Aparatur",
  "Pengelola Pengadaan Barang/Jasa",
  "Penyuluh",
  "Guru (PPPK)",
  "Tenaga Kesehatan (PPPK)",
  "Penyuluh Pertanian (PPPK)",
];

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

// Sekolah kedinasan paling ketat (SKD + pemeringkatan).
const KEDINASAN_TOP = ["stan", "stis", "stin", "ipdn", "ssn", "akmil", "akpol"];

export type SkdJenis = "cpns" | "pppk" | "kedinasan";
export type CpnsEstimate = {
  jenis: SkdJenis;
  twk: number;
  tiu: number;
  tkp: number;
  ambangTotal: number; // jumlah ambang per komponen (acuan)
  totalAman: number; // estimasi total agar bersaing
  totalMax: number;
  keketatan: string;
  skbNote: string;
};

export function getCpnsEstimate(
  segment: SkdJenis,
  instansi: string,
  _jabatan: string,
): CpnsEstimate | null {
  if (!instansi && !_jabatan) return null;
  const s = instansi.toLowerCase();
  const isTop = INSTANSI_TOP.some((m) => s.includes(m)) || KEDINASAN_TOP.some((m) => s.includes(m));
  const isMid = INSTANSI_MID.some((m) => s.includes(m));

  let totalAman = isTop ? 420 : isMid ? 385 : 360;
  let keketatan = isTop ? "Sangat Ketat" : isMid ? "Ketat" : "Kompetitif";
  if (segment === "pppk") {
    totalAman = clamp(totalAman - 35, 300, 480); // skema nilai PPPK berbeda
    keketatan = isTop ? "Ketat" : "Kompetitif";
  }
  if (segment === "kedinasan") {
    totalAman = clamp(totalAman + 20, 350, 500); // kedinasan berbasis ranking, lebih tinggi
    keketatan = isTop ? "Sangat Ketat" : "Ketat";
  }

  const skbNote = segment === "pppk" ? KOMPOSISI.pppk
    : segment === "kedinasan" ? "Sekolah kedinasan: lulus SKD lalu tes lanjutan (kesehatan, kebugaran, wawancara) sesuai sekolah."
    : KOMPOSISI.cpns;

  return {
    jenis: segment,
    twk: SKD.twk.ambang,
    tiu: SKD.tiu.ambang,
    tkp: SKD.tkp.ambang,
    ambangTotal: SKD.twk.ambang + SKD.tiu.ambang + SKD.tkp.ambang, // 311
    totalAman: clamp(totalAman, 311, 500),
    totalMax: SKD.total.max,
    keketatan,
    skbNote,
  };
}
