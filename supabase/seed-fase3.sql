-- ============================================================
-- Albirru — Seed data master Fase 3 (topics + bank soal contoh)
-- Jalankan di Supabase SQL Editor (sekali). answer_key SERVER-ONLY.
-- ============================================================

-- ── TOPICS (taksonomi UTBK/SNBT: mapel level 1 → subtopik level 2) ──
insert into public.topics (slug, nama, mapel, level, urutan) values
  ('penalaran-umum',         'Penalaran Umum',                'Penalaran Umum', 1, 1),
  ('pengetahuan-kuantitatif','Pengetahuan Kuantitatif',       'Pengetahuan Kuantitatif', 1, 2),
  ('ppu',                    'Pengetahuan & Pemahaman Umum',  'PPU', 1, 3),
  ('pbm',                    'Pemahaman Bacaan & Menulis',    'PBM', 1, 4),
  ('literasi-indonesia',     'Literasi Bahasa Indonesia',     'Literasi Indonesia', 1, 5),
  ('literasi-inggris',       'Literasi Bahasa Inggris',       'Literasi Inggris', 1, 6),
  ('penalaran-matematika',   'Penalaran Matematika',          'Penalaran Matematika', 1, 7)
on conflict (slug) do nothing;

insert into public.topics (slug, nama, mapel, level, urutan, parent_id)
select v.slug, v.nama, v.mapel, 2, v.urutan, p.id
from (values
  ('pu-silogisme',  'Silogisme & Penarikan Kesimpulan', 'Penalaran Umum', 1, 'penalaran-umum'),
  ('pu-analitik',   'Penalaran Analitik',                'Penalaran Umum', 2, 'penalaran-umum'),
  ('pu-deret',      'Pola & Deret',                      'Penalaran Umum', 3, 'penalaran-umum'),
  ('pk-aritmetika', 'Aritmetika Sosial',                 'Pengetahuan Kuantitatif', 1, 'pengetahuan-kuantitatif'),
  ('pk-aljabar',    'Aljabar Dasar',                     'Pengetahuan Kuantitatif', 2, 'pengetahuan-kuantitatif'),
  ('pk-geometri',   'Geometri & Pengukuran',             'Pengetahuan Kuantitatif', 3, 'pengetahuan-kuantitatif'),
  ('pm-fungsi',     'Fungsi & Persamaan',                'Penalaran Matematika', 1, 'penalaran-matematika'),
  ('pm-statistika', 'Statistika & Peluang',              'Penalaran Matematika', 2, 'penalaran-matematika'),
  ('li-inferensi',  'Inferensi Teks',                    'Literasi Indonesia', 1, 'literasi-indonesia'),
  ('li-ide-pokok',  'Ide Pokok & Simpulan',              'Literasi Indonesia', 2, 'literasi-indonesia'),
  ('en-main-idea',  'Main Idea & Detail',                'Literasi Inggris', 1, 'literasi-inggris'),
  ('en-vocabulary', 'Vocabulary in Context',             'Literasi Inggris', 2, 'literasi-inggris')
) as v(slug, nama, mapel, urutan, parent_slug)
join public.topics p on p.slug = v.parent_slug
on conflict (slug) do nothing;

-- ── QUESTIONS (bank soal contoh; answer_key SERVER-ONLY) ──
insert into public.questions (kode, topic_id, mapel, level_kesulitan, tipe, cognitive_skill, sumber, tahun, estimasi_waktu_detik, konten, answer_key, pembahasan, aktif)
select v.kode, t.id, v.mapel, v.level, 'PG', v.skill, 'Bank Albirru', 2025, v.waktu,
       jsonb_build_object('soal', v.soal, 'opsi', v.opsi::jsonb), v.kunci, v.pembahasan, true
from (values
  ('PU-001','pu-silogisme','Penalaran Umum',2,'analisis',75,
    'Semua mahasiswa rajin belajar. Sebagian yang rajin belajar lulus cumlaude. Simpulan yang tepat adalah…',
    '["Semua mahasiswa lulus cumlaude","Sebagian mahasiswa mungkin lulus cumlaude","Tidak ada mahasiswa lulus cumlaude","Semua yang cumlaude rajin belajar","Mahasiswa tidak rajin belajar"]',
    'B','Dari premis, sebagian rajin belajar lulus cumlaude, dan semua mahasiswa rajin — maka sebagian mahasiswa mungkin cumlaude.'),
  ('PU-002','pu-deret','Penalaran Umum',2,'terapkan',60,
    'Deret: 2, 6, 12, 20, 30, … Bilangan berikutnya adalah…',
    '["40","42","44","48","50"]',
    'B','Selisih 4,6,8,10,12 → 30+12 = 42.'),
  ('PU-003','pu-analitik','Penalaran Umum',3,'analisis',90,
    'A lebih tinggi dari B, C lebih pendek dari B, D lebih tinggi dari A. Urutan tertinggi ke terendah?',
    '["D, A, B, C","A, D, B, C","D, B, A, C","A, B, C, D","B, A, D, C"]',
    'A','D>A>B>C.'),
  ('PK-001','pk-aritmetika','Pengetahuan Kuantitatif',2,'terapkan',80,
    'Harga barang Rp80.000 diskon 25%, lalu pajak 10%. Harga akhir?',
    '["Rp60.000","Rp66.000","Rp64.000","Rp72.000","Rp58.000"]',
    'B','80.000×0,75=60.000; +10% = 66.000.'),
  ('PK-002','pk-aljabar','Pengetahuan Kuantitatif',2,'terapkan',70,
    'Jika 3x + 5 = 20, maka nilai 2x + 1 adalah…',
    '["9","11","13","7","15"]',
    'B','x=5 → 2(5)+1=11.'),
  ('PK-003','pk-geometri','Pengetahuan Kuantitatif',3,'terapkan',95,
    'Persegi panjang panjang 12 cm lebar 5 cm. Panjang diagonalnya…',
    '["13 cm","17 cm","15 cm","11 cm","14 cm"]',
    'A','√(12²+5²)=√169=13.'),
  ('PM-001','pm-fungsi','Penalaran Matematika',3,'analisis',90,
    'Fungsi f(x)=2x−3. Jika f(a)=7, maka a=…',
    '["3","4","5","6","2"]',
    'C','2a−3=7 → a=5.'),
  ('PM-002','pm-statistika','Penalaran Matematika',2,'terapkan',80,
    'Rata-rata 5 bilangan adalah 14. Jika satu bilangan 10 dibuang, rata-rata sisanya…',
    '["15","16","14","13","17"]',
    'A','Jumlah=70; sisa=60/4=15.'),
  ('LI-001','li-ide-pokok','Literasi Indonesia',2,'paham',85,
    'Ide pokok paragraf yang membahas dampak perubahan iklim terhadap pertanian biasanya terletak pada…',
    '["Kalimat pertama atau terakhir","Hanya kalimat kedua","Seluruh kalimat","Catatan kaki","Judul saja"]',
    'A','Ide pokok umumnya di kalimat utama (awal/akhir paragraf).'),
  ('LI-002','li-inferensi','Literasi Indonesia',3,'analisis',95,
    'Penulis menyatakan ''meski hasil panen menurun, petani tetap optimistis''. Inferensi yang tepat…',
    '["Petani menyerah","Ada faktor lain yang menumbuhkan harapan","Panen selalu gagal","Optimisme tidak beralasan","Petani berhenti bertani"]',
    'B','Kata ''meski'' menyiratkan ada alasan lain yang membuat optimistis.'),
  ('EN-001','en-main-idea','Literasi Inggris',2,'paham',85,
    'A passage describing benefits of reading habits most likely has the main idea about…',
    '["The cost of books","Why reading is beneficial","How to print books","A bookstore location","Author biography"]',
    'B','Main idea aligns with the described benefits of reading.'),
  ('EN-002','en-vocabulary','Literasi Inggris',2,'paham',70,
    'The word ''crucial'' in context most nearly means…',
    '["Optional","Very important","Colorful","Temporary","Hidden"]',
    'B','''Crucial'' = sangat penting (very important).')
) as v(kode, topic_slug, mapel, level, skill, waktu, soal, opsi, kunci, pembahasan)
join public.topics t on t.slug = v.topic_slug
on conflict (kode) do nothing;

insert into public.question_topics (question_id, topic_id)
select q.id, q.topic_id from public.questions q where q.topic_id is not null
on conflict do nothing;
