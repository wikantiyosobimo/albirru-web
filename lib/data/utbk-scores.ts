// ============================================================
// Data referensi UTBK-SNBT: universitas, prodi, estimasi skor.
// ------------------------------------------------------------
// PENTING: SNPMB TIDAK merilis passing grade resmi per prodi.
// Angka di sini adalah ESTIMASI terstruktur (skala 0–1000) yang
// dihimpun dari rentang yang umum beredar di publik, dimodelkan
// sebagai: skor dasar prodi (keketatan nasional) + bonus tier
// kampus. Tujuannya memberi gambaran target, bukan janji lolos.
// Model ini menjangkau SEMUA kombinasi kampus × prodi (termasuk
// yang tidak ada di list, lewat fallback), bukan tabel terbatas.
// ============================================================

export type Rumpun = "saintek" | "soshum" | "campuran";

// Skor dasar prodi = perkiraan nilai diterima di PTN tier menengah.
// Kampus tier atas menambah bonus (lihat KAMPUS_TIER).
const PRODI_BASE: { match: string[]; base: number; rumpun: Rumpun }[] = [
  // Saintek — kesehatan
  { match: ["kedokteran gigi"], base: 712, rumpun: "saintek" },
  { match: ["kedokteran", "pendidikan dokter"], base: 752, rumpun: "saintek" },
  { match: ["farmasi"], base: 680, rumpun: "saintek" },
  { match: ["keperawatan"], base: 640, rumpun: "saintek" },
  { match: ["kebidanan"], base: 626, rumpun: "saintek" },
  { match: ["gizi"], base: 648, rumpun: "saintek" },
  { match: ["kesehatan masyarakat"], base: 632, rumpun: "saintek" },
  // Saintek — komputer & teknik
  { match: ["teknik informatika", "informatika"], base: 702, rumpun: "saintek" },
  { match: ["ilmu komputer"], base: 700, rumpun: "saintek" },
  { match: ["sistem informasi"], base: 674, rumpun: "saintek" },
  { match: ["teknik elektro"], base: 668, rumpun: "saintek" },
  { match: ["teknik industri"], base: 670, rumpun: "saintek" },
  { match: ["teknik mesin"], base: 656, rumpun: "saintek" },
  { match: ["teknik sipil"], base: 650, rumpun: "saintek" },
  { match: ["teknik kimia"], base: 658, rumpun: "saintek" },
  { match: ["teknik perminyakan"], base: 690, rumpun: "saintek" },
  { match: ["teknik pertambangan", "pertambangan"], base: 686, rumpun: "saintek" },
  { match: ["arsitektur"], base: 662, rumpun: "saintek" },
  { match: ["teknik lingkungan"], base: 642, rumpun: "saintek" },
  { match: ["teknik geodesi", "teknik geomatika"], base: 640, rumpun: "saintek" },
  { match: ["teknik biomedis", "teknik biomedik"], base: 678, rumpun: "saintek" },
  // Saintek — MIPA
  { match: ["aktuaria"], base: 686, rumpun: "saintek" },
  { match: ["statistika"], base: 690, rumpun: "saintek" },
  { match: ["matematika"], base: 646, rumpun: "saintek" },
  { match: ["fisika"], base: 630, rumpun: "saintek" },
  { match: ["kimia"], base: 632, rumpun: "saintek" },
  { match: ["biologi"], base: 628, rumpun: "saintek" },
  { match: ["geografi"], base: 620, rumpun: "campuran" },
  { match: ["ilmu kelautan"], base: 612, rumpun: "saintek" },
  // Saintek — pertanian
  { match: ["agribisnis"], base: 616, rumpun: "saintek" },
  { match: ["agroteknologi", "agronomi"], base: 610, rumpun: "saintek" },
  { match: ["teknologi pangan", "teknologi hasil pertanian"], base: 646, rumpun: "saintek" },
  { match: ["peternakan"], base: 600, rumpun: "saintek" },
  { match: ["kehutanan"], base: 600, rumpun: "saintek" },
  // Soshum — favorit
  { match: ["hubungan internasional"], base: 718, rumpun: "soshum" },
  { match: ["psikologi"], base: 700, rumpun: "campuran" },
  { match: ["akuntansi"], base: 696, rumpun: "soshum" },
  { match: ["manajemen"], base: 690, rumpun: "soshum" },
  { match: ["bisnis digital"], base: 690, rumpun: "soshum" },
  { match: ["ilmu komunikasi", "komunikasi"], base: 688, rumpun: "soshum" },
  { match: ["hukum", "ilmu hukum"], base: 686, rumpun: "soshum" },
  { match: ["ilmu ekonomi", "ekonomi pembangunan", "ekonomi"], base: 678, rumpun: "soshum" },
  { match: ["kriminologi"], base: 672, rumpun: "soshum" },
  { match: ["administrasi bisnis", "administrasi niaga"], base: 666, rumpun: "soshum" },
  { match: ["administrasi negara", "administrasi publik"], base: 660, rumpun: "soshum" },
  { match: ["hubungan masyarakat"], base: 660, rumpun: "soshum" },
  { match: ["ilmu politik"], base: 650, rumpun: "soshum" },
  { match: ["sastra inggris", "bahasa inggris"], base: 650, rumpun: "soshum" },
  { match: ["sosiologi"], base: 640, rumpun: "soshum" },
  { match: ["pariwisata"], base: 632, rumpun: "soshum" },
  { match: ["antropologi"], base: 626, rumpun: "soshum" },
  { match: ["sastra", "ilmu sejarah", "sejarah"], base: 624, rumpun: "soshum" },
  { match: ["ilmu perpustakaan"], base: 612, rumpun: "soshum" },
];

// Bonus tier kampus (poin ditambahkan ke skor dasar prodi).
const KAMPUS_TIER: { bonus: number; match: string[] }[] = [
  {
    bonus: 62,
    match: ["universitas indonesia", "institut teknologi bandung", "gadjah mada"],
  },
  {
    bonus: 42,
    match: [
      "pertanian bogor", "ipb", "sepuluh nopember", "its", "airlangga",
      "padjadjaran", "diponegoro", "brawijaya",
    ],
  },
  {
    bonus: 27,
    match: [
      "sebelas maret", "hasanuddin", "sumatera utara", "negeri yogyakarta",
      "negeri jakarta", "pendidikan indonesia", "andalas", "negeri semarang",
      "negeri malang", "udayana", "syiah kuala",
    ],
  },
  {
    bonus: 12,
    match: [
      "sriwijaya", "lampung", "jenderal soedirman", "riau", "jember",
      "mulawarman", "tanjungpura", "sam ratulangi", "negeri surabaya",
      "negeri padang", "bengkulu", "mataram", "sultan ageng", "trunojoyo",
      "upn", "veteran", "singaperbangsa", "jambi",
    ],
  },
];
const KAMPUS_TIER_DEFAULT = 8;

// Daftar untuk autocomplete (datalist). Input tetap bebas diketik.
export const UNIVERSITIES = [
  "Universitas Indonesia",
  "Institut Teknologi Bandung",
  "Universitas Gadjah Mada",
  "Institut Pertanian Bogor (IPB University)",
  "Institut Teknologi Sepuluh Nopember",
  "Universitas Airlangga",
  "Universitas Padjadjaran",
  "Universitas Diponegoro",
  "Universitas Brawijaya",
  "Universitas Sebelas Maret",
  "Universitas Hasanuddin",
  "Universitas Sumatera Utara",
  "Universitas Andalas",
  "Universitas Negeri Yogyakarta",
  "Universitas Negeri Jakarta",
  "Universitas Pendidikan Indonesia",
  "Universitas Negeri Semarang",
  "Universitas Negeri Malang",
  "Universitas Syiah Kuala",
  "Universitas Udayana",
  "Universitas Sriwijaya",
  "Universitas Lampung",
  "Universitas Jenderal Soedirman",
  "Universitas Riau",
  "Universitas Jember",
  "Universitas Mulawarman",
  "Universitas Tanjungpura",
  "Universitas Sam Ratulangi",
  "Universitas Negeri Surabaya",
  "Universitas Negeri Padang",
  "UPN Veteran Jakarta",
  "UPN Veteran Yogyakarta",
  "UPN Veteran Jawa Timur",
  "Universitas Sultan Ageng Tirtayasa",
  "Universitas Jambi",
];

export const PRODI = [
  "Kedokteran",
  "Kedokteran Gigi",
  "Farmasi",
  "Keperawatan",
  "Kebidanan",
  "Ilmu Gizi",
  "Kesehatan Masyarakat",
  "Teknik Informatika",
  "Ilmu Komputer",
  "Sistem Informasi",
  "Teknik Elektro",
  "Teknik Industri",
  "Teknik Mesin",
  "Teknik Sipil",
  "Teknik Kimia",
  "Teknik Perminyakan",
  "Teknik Pertambangan",
  "Arsitektur",
  "Teknik Lingkungan",
  "Teknik Biomedis",
  "Aktuaria",
  "Statistika",
  "Matematika",
  "Fisika",
  "Kimia",
  "Biologi",
  "Geografi",
  "Agribisnis",
  "Teknologi Pangan",
  "Hubungan Internasional",
  "Psikologi",
  "Akuntansi",
  "Manajemen",
  "Bisnis Digital",
  "Ilmu Komunikasi",
  "Hukum",
  "Ilmu Ekonomi",
  "Kriminologi",
  "Administrasi Bisnis",
  "Ilmu Administrasi Negara",
  "Ilmu Politik",
  "Sastra Inggris",
  "Sosiologi",
  "Pariwisata",
];

function findBy<T extends { match: string[] }>(list: T[], q: string): T | undefined {
  const s = q.toLowerCase().trim();
  if (!s) return undefined;
  return list.find((it) => it.match.some((m) => s.includes(m)));
}

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

function keketatan(historis: number): string {
  if (historis >= 760) return "Sangat Ketat";
  if (historis >= 705) return "Ketat";
  if (historis >= 645) return "Kompetitif";
  return "Cukup Terjangkau";
}

export type UtbkEstimate = {
  historis: number; // perkiraan nilai diterima (rerata)
  targetAman: number; // disarankan agar peluang lebih aman
  keketatan: string;
  rumpun: Rumpun;
  exact: boolean; // true jika prodi & kampus dikenali model
};

export function getUtbkEstimate(kampus: string, prodi: string): UtbkEstimate | null {
  if (!kampus && !prodi) return null;
  const p = findBy(PRODI_BASE, prodi);
  const base = p?.base ?? 640;
  const tier = KAMPUS_TIER.find((t) => t.match.some((m) => kampus.toLowerCase().includes(m)));
  const bonus = tier?.bonus ?? KAMPUS_TIER_DEFAULT;

  const historis = clamp(base + bonus, 480, 835);
  const targetAman = clamp(historis + 25, 500, 855);
  return {
    historis,
    targetAman,
    keketatan: keketatan(historis),
    rumpun: p?.rumpun ?? "campuran",
    exact: Boolean(p),
  };
}
