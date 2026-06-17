// Bank soal try out (data klien).
// PENTING: sesuai arsitektur, TIDAK ADA kunci jawaban di sini. Klien hanya
// mengumpulkan pilihan; penilaian dilakukan di server (route handler/Edge
// Function) saat submit. Lihat catatan di komponen ExamEngine.

export type Pilihan = { k: string; t: string };
export type Soal = {
  subtes: string;
  teks: string;
  pilihan: Pilihan[];
};

export type TryOutMeta = {
  judul: string;
  jenis: string;
  durasiMenit: number;
  poinPerSoal: number;
};

export const META: TryOutMeta = {
  judul: "Simulasi SNBT Nasional 2024",
  jenis: "Simulasi SNBT",
  durasiMenit: 100,
  poinPerSoal: 4,
};

export const SOAL: Soal[] = [
  {
    subtes: "TPS - Penalaran Umum",
    teks: "Semua mahasiswa yang rajin belajar pasti berprestasi. Beberapa mahasiswa berprestasi. Kesimpulan yang paling tepat adalah …",
    pilihan: [
      { k: "A", t: "Semua mahasiswa yang berprestasi adalah rajin belajar." },
      { k: "B", t: "Beberapa mahasiswa rajin belajar." },
      { k: "C", t: "Semua mahasiswa berprestasi adalah rajin belajar." },
      { k: "D", t: "Beberapa mahasiswa yang rajin belajar berprestasi." },
      { k: "E", t: "Tidak dapat ditarik kesimpulan." },
    ],
  },
  {
    subtes: "TPS - Penalaran Umum",
    teks: "Jika hari hujan maka jalanan basah. Saat ini jalanan tidak basah. Maka …",
    pilihan: [
      { k: "A", t: "Hari ini hujan." },
      { k: "B", t: "Hari ini tidak hujan." },
      { k: "C", t: "Jalanan akan basah nanti." },
      { k: "D", t: "Tidak ada hubungan hujan dan jalanan." },
      { k: "E", t: "Hari ini mendung." },
    ],
  },
  {
    subtes: "TPS - Penalaran Umum",
    teks: "Perhatikan deret: 2, 6, 12, 20, 30, … Angka berikutnya adalah …",
    pilihan: [
      { k: "A", t: "40" },
      { k: "B", t: "42" },
      { k: "C", t: "44" },
      { k: "D", t: "46" },
      { k: "E", t: "48" },
    ],
  },
  {
    subtes: "TPS - Penalaran Umum",
    teks: "Manakah kata yang memiliki hubungan analogis dengan: DOKTER : RUMAH SAKIT?",
    pilihan: [
      { k: "A", t: "Guru : Murid" },
      { k: "B", t: "Petani : Sawah" },
      { k: "C", t: "Buku : Perpustakaan" },
      { k: "D", t: "Hakim : Hukum" },
      { k: "E", t: "Pilot : Pesawat" },
    ],
  },
  {
    subtes: "TPS - Pengetahuan & Pemahaman Umum",
    teks: "Sinonim yang paling tepat untuk kata 'KONVENSIONAL' adalah …",
    pilihan: [
      { k: "A", t: "Modern" },
      { k: "B", t: "Tradisional" },
      { k: "C", t: "Praktis" },
      { k: "D", t: "Efisien" },
      { k: "E", t: "Fleksibel" },
    ],
  },
  {
    subtes: "TPS - Pengetahuan & Pemahaman Umum",
    teks: "Antonim dari kata 'GANJIL' adalah …",
    pilihan: [
      { k: "A", t: "Aneh" },
      { k: "B", t: "Genap" },
      { k: "C", t: "Tunggal" },
      { k: "D", t: "Unik" },
      { k: "E", t: "Langka" },
    ],
  },
  {
    subtes: "Literasi Bahasa Indonesia",
    teks: "Kalimat berikut yang menggunakan ejaan baku secara tepat adalah …",
    pilihan: [
      { k: "A", t: "Dia pergi kerumah temannya kemarin." },
      { k: "B", t: "Saya membeli buku di toko itu." },
      { k: "C", t: "Mereka berangkat ke sekolah jam 7 pagi." },
      { k: "D", t: "Anak itu sangat pintar sekali." },
      { k: "E", t: "Kami akan datang besok lusa nanti." },
    ],
  },
  {
    subtes: "Literasi Bahasa Indonesia",
    teks: "Ide pokok sebuah paragraf umumnya ditemukan pada …",
    pilihan: [
      { k: "A", t: "Kalimat penjelas" },
      { k: "B", t: "Kalimat utama" },
      { k: "C", t: "Konjungsi antarkalimat" },
      { k: "D", t: "Kata kunci pertama" },
      { k: "E", t: "Tanda baca akhir" },
    ],
  },
  {
    subtes: "Penalaran Matematika",
    teks: "Jika 3x + 5 = 20, maka nilai x adalah …",
    pilihan: [
      { k: "A", t: "3" },
      { k: "B", t: "4" },
      { k: "C", t: "5" },
      { k: "D", t: "6" },
      { k: "E", t: "7" },
    ],
  },
  {
    subtes: "Penalaran Matematika",
    teks: "Sebuah segitiga memiliki alas 10 cm dan tinggi 6 cm. Luasnya adalah …",
    pilihan: [
      { k: "A", t: "16 cm²" },
      { k: "B", t: "30 cm²" },
      { k: "C", t: "60 cm²" },
      { k: "D", t: "26 cm²" },
      { k: "E", t: "36 cm²" },
    ],
  },
  {
    subtes: "Penalaran Matematika",
    teks: "Rata-rata dari 4, 8, 6, 10, dan 12 adalah …",
    pilihan: [
      { k: "A", t: "7" },
      { k: "B", t: "8" },
      { k: "C", t: "9" },
      { k: "D", t: "10" },
      { k: "E", t: "11" },
    ],
  },
  {
    subtes: "Penalaran Matematika",
    teks: "Jika sebuah barang seharga Rp80.000 mendapat diskon 25%, harga setelah diskon adalah …",
    pilihan: [
      { k: "A", t: "Rp55.000" },
      { k: "B", t: "Rp60.000" },
      { k: "C", t: "Rp65.000" },
      { k: "D", t: "Rp70.000" },
      { k: "E", t: "Rp75.000" },
    ],
  },
];
