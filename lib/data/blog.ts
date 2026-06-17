// Konten blog (sumber sederhana berbasis file). Bisa dipindah ke tabel CMS nanti.

export type BlogBlock =
  | { tipe: "p"; teks: string }
  | { tipe: "h2"; teks: string }
  | { tipe: "list"; item: string[] }
  | { tipe: "quote"; teks: string };

export interface BlogPost {
  slug: string;
  judul: string;
  kategori: string;
  penulis: string;
  tanggal: string;   // ISO
  baca_menit: number;
  ringkasan: string;
  isi: BlogBlock[];
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "panduan-lengkap-utbk-snbt-2025",
    judul: "Panduan Lengkap UTBK-SNBT 2025",
    kategori: "UTBK-SNBT",
    penulis: "Tim Albirru",
    tanggal: "2025-05-20",
    baca_menit: 8,
    ringkasan: "Semua yang perlu kamu tahu untuk meraih skor terbaik di UTBK-SNBT 2025: struktur tes, strategi, dan timeline persiapan.",
    isi: [
      { tipe: "p", teks: "UTBK-SNBT adalah gerbang utama menuju PTN impian. Memahami strukturnya sejak awal membuat persiapanmu jauh lebih terarah." },
      { tipe: "h2", teks: "Struktur Tes" },
      { tipe: "p", teks: "SNBT terdiri dari Tes Potensi Skolastik (TPS) dan Tes Literasi. TPS mengukur kemampuan kognitif, sementara literasi menilai pemahaman bacaan dan penalaran." },
      { tipe: "list", item: ["Penalaran Umum", "Pengetahuan & Pemahaman Umum", "Pemahaman Bacaan & Menulis", "Pengetahuan Kuantitatif", "Literasi Bahasa Indonesia & Inggris", "Penalaran Matematika"] },
      { tipe: "h2", teks: "Strategi Persiapan" },
      { tipe: "p", teks: "Kunci sukses bukan belajar paling lama, tapi belajar paling tepat sasaran. Mulai dari diagnostik untuk memetakan kelemahan, lalu fokus menutup gap terbesar." },
      { tipe: "quote", teks: "Belajar terarah mengalahkan belajar keras tanpa arah." },
      { tipe: "p", teks: "Gunakan Academic Intelligence Albirru untuk melihat peta kelemahanmu dan rencana mingguan otomatis." },
    ],
  },
  {
    slug: "cara-meningkatkan-skor-penalaran-umum",
    judul: "Cara Meningkatkan Skor Penalaran Umum",
    kategori: "Strategi Belajar",
    penulis: "Tim Albirru",
    tanggal: "2025-05-10",
    baca_menit: 6,
    ringkasan: "Penalaran Umum sering jadi penentu. Pelajari pola soal dan teknik cepat untuk menaikkan akurasimu.",
    isi: [
      { tipe: "p", teks: "Penalaran Umum menguji logika, bukan hafalan. Karena itu, latihan pola adalah cara tercepat untuk meningkat." },
      { tipe: "h2", teks: "Kenali Tiga Pola Utama" },
      { tipe: "list", item: ["Silogisme & penarikan kesimpulan", "Penalaran analitik (urutan, posisi)", "Pola & deret angka/gambar"] },
      { tipe: "h2", teks: "Teknik Cepat" },
      { tipe: "p", teks: "Untuk deret, cari selisih antar-suku terlebih dahulu. Untuk silogisme, ubah premis menjadi diagram. Untuk analitik, buat tabel posisi." },
      { tipe: "quote", teks: "Akurasi naik ketika kamu mengenali jenis soal dalam 5 detik pertama." },
    ],
  },
  {
    slug: "menyusun-academic-journey",
    judul: "Menyusun Academic Journey: Dari Sekarang Hingga Lolos PTN",
    kategori: "Perencanaan Akademik",
    penulis: "Tim Albirru",
    tanggal: "2025-05-14",
    baca_menit: 7,
    ringkasan: "Perjalanan menuju PTN butuh peta. Begini cara menyusun milestone realistis dari H-90 hingga hari ujian.",
    isi: [
      { tipe: "p", teks: "Tanpa milestone, persiapan terasa kabur. Academic Journey memecah target besar menjadi checkpoint yang bisa dirayakan." },
      { tipe: "h2", teks: "Milestone T-90 hingga T-0" },
      { tipe: "list", item: ["T-90: diagnostik & pemetaan target", "T-60: kuatkan fondasi subtes terlemah", "T-30: akselerasi & simulasi penuh", "T-7: review menyeluruh", "T-0: tampil terbaik"] },
      { tipe: "p", teks: "Setiap milestone punya indikator keberhasilan terukur, bukan sekadar 'rajin belajar'." },
      { tipe: "quote", teks: "Target tanpa tenggat hanyalah harapan." },
    ],
  },
  {
    slug: "mengelola-stres-belajar",
    judul: "Mengelola Stres Belajar Agar Tetap Sehat dan Produktif",
    kategori: "Psikologi & Remaja",
    penulis: "Tim Albirru",
    tanggal: "2025-05-13",
    baca_menit: 6,
    ringkasan: "Persiapan UTBK menuntut mental yang kuat. Pelajari cara menjaga keseimbangan tanpa burnout.",
    isi: [
      { tipe: "p", teks: "Stres ringan menajamkan fokus, tapi stres berlebih menggerus performa. Kuncinya adalah ritme, bukan kecepatan." },
      { tipe: "h2", teks: "Tiga Kebiasaan Sehat" },
      { tipe: "list", item: ["Tidur cukup 7-8 jam — memori dikonsolidasikan saat tidur", "Belajar dengan teknik Pomodoro (25 menit fokus + istirahat)", "Olahraga ringan 3x seminggu untuk menjaga mood"] },
      { tipe: "p", teks: "Ingat, konsistensi kecil setiap hari mengalahkan maraton belajar semalam." },
      { tipe: "quote", teks: "Jaga tubuhmu — ia kendaraan menuju impianmu." },
    ],
  },
];

export function getPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

export function getRelated(slug: string, limit = 3): BlogPost[] {
  return BLOG_POSTS.filter((p) => p.slug !== slug).slice(0, limit);
}
