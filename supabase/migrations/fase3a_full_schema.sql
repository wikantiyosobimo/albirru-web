-- ============================================================
-- FASE 3A — Albirru Online: Tabel lengkap PRD v3
-- Jalankan di Supabase SQL Editor (Project: lhygzydpmjamrzdtewxa)
-- Catatan: tabel yang sudah ada (leads, profiles, contacts, tryouts,
-- tryout_questions, tryout_attempts, tryout_answers, tryout_registrations)
-- TIDAK diulang di sini.
-- ============================================================

-- ────────────────────────────────────────────────────────────
-- 1. TAKSONOMI & BANK SOAL
-- ────────────────────────────────────────────────────────────

create table if not exists public.topics (
  id         uuid primary key default gen_random_uuid(),
  slug       text unique not null,
  nama       text not null,
  parent_id  uuid references public.topics(id) on delete set null,
  mapel      text not null,
  level      int not null default 1,  -- 1=mapel, 2=bab, 3=subtopik
  urutan     int not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists topics_parent_idx  on public.topics(parent_id);
create index if not exists topics_mapel_idx   on public.topics(mapel);

alter table public.topics enable row level security;
drop policy if exists "topics readable" on public.topics;
create policy "topics readable" on public.topics for select to authenticated using (true);


-- Bank soal utama (kunci jawaban server-only via column grant)
create table if not exists public.questions (
  id                    uuid primary key default gen_random_uuid(),
  kode                  text unique,
  topic_id              uuid references public.topics(id) on delete set null,
  mapel                 text not null,
  level_kesulitan       int not null default 2 check (level_kesulitan between 1 and 5),
  tipe                  text not null default 'PG' check (tipe in ('PG','benar_salah','menjodohkan','isian')),
  cognitive_skill       text,  -- ingat|paham|terapkan|analisis|evaluasi|cipta
  sumber                text,
  tahun                 int,
  estimasi_waktu_detik  int,
  konten                jsonb not null,  -- { soal, opsi:[A..E], media? }
  answer_key            text not null,  -- SERVER ONLY (column grant dikurangi)
  pembahasan            text,
  kesalahan_umum        text,
  irt_a                 float not null default 1.0,
  irt_b                 float not null default 0.0,
  irt_c                 float not null default 0.2,
  aktif                 boolean not null default true,
  created_by            uuid references auth.users(id) on delete set null,
  created_at            timestamptz not null default now()
);
create index if not exists questions_topic_idx  on public.questions(topic_id);
create index if not exists questions_mapel_idx  on public.questions(mapel, level_kesulitan);

alter table public.questions enable row level security;
-- Cabut semua grant default lalu berikan hanya kolom aman ke authenticated
revoke all on public.questions from anon, authenticated;
drop policy if exists "questions readable" on public.questions;
create policy "questions readable" on public.questions for select to authenticated using (aktif = true);
grant select (id, kode, topic_id, mapel, level_kesulitan, tipe, cognitive_skill,
              sumber, tahun, estimasi_waktu_detik, konten, pembahasan,
              kesalahan_umum, irt_a, irt_b, irt_c, aktif, created_at)
  on public.questions to authenticated;
-- answer_key tidak di-grant ke authenticated → client tidak bisa baca


create table if not exists public.question_topics (
  question_id uuid not null references public.questions(id) on delete cascade,
  topic_id    uuid not null references public.topics(id)    on delete cascade,
  primary key (question_id, topic_id)
);
alter table public.question_topics enable row level security;
drop policy if exists "question_topics readable" on public.question_topics;
create policy "question_topics readable" on public.question_topics for select to authenticated using (true);


-- ────────────────────────────────────────────────────────────
-- 2. TEST BLUEPRINT (admin auto-generate paket)
-- ────────────────────────────────────────────────────────────

create table if not exists public.test_blueprints (
  id          uuid primary key default gen_random_uuid(),
  nama        text not null,
  tipe        text,  -- SNBT|SKD|mandiri
  durasi_menit int,
  -- [{mapel, jumlah, distribusi_kesulitan:{1:x,2:y,3:z}}]
  komposisi   jsonb not null default '[]'::jsonb,
  created_by  uuid references auth.users(id) on delete set null,
  created_at  timestamptz not null default now()
);
alter table public.test_blueprints enable row level security;
drop policy if exists "blueprints admin only" on public.test_blueprints;
create policy "blueprints admin only" on public.test_blueprints for select to authenticated
  using (exists (select 1 from public.profiles where id = auth.uid() and role in ('staf','admin')));


-- ────────────────────────────────────────────────────────────
-- 3. ACADEMIC INTELLIGENCE
-- ────────────────────────────────────────────────────────────

create table if not exists public.weakness_records (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references auth.users(id) on delete cascade,
  topic_id       uuid not null references public.topics(id) on delete cascade,
  akurasi        float not null check (akurasi between 0 and 1),
  total_soal     int not null default 0,
  benar          int not null default 0,
  weakness_index float,   -- (1-akurasi)*100
  prioritas      int,
  periode        date not null,
  updated_at     timestamptz not null default now(),
  unique (user_id, topic_id, periode)
);
create index if not exists weakness_records_user_idx on public.weakness_records(user_id, periode desc);

alter table public.weakness_records enable row level security;
drop policy if exists "own weakness read"   on public.weakness_records;
drop policy if exists "own weakness upsert" on public.weakness_records;
create policy "own weakness read"   on public.weakness_records for select    to authenticated using (auth.uid() = user_id);
create policy "own weakness upsert" on public.weakness_records for insert    to authenticated with check (auth.uid() = user_id);
create policy "own weakness update" on public.weakness_records for update    to authenticated using (auth.uid() = user_id);


create table if not exists public.mastery_records (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  topic_id   uuid not null references public.topics(id) on delete cascade,
  -- mastered|developing|need_attention|belum_dicoba
  level      text not null check (level in ('mastered','developing','need_attention','belum_dicoba')),
  akurasi    float,
  total_soal int not null default 0,
  confidence text,
  periode    date not null,
  updated_at timestamptz not null default now(),
  unique (user_id, topic_id, periode)
);
create index if not exists mastery_records_user_idx on public.mastery_records(user_id, periode desc);

alter table public.mastery_records enable row level security;
drop policy if exists "own mastery read"   on public.mastery_records;
drop policy if exists "own mastery upsert" on public.mastery_records;
create policy "own mastery read"   on public.mastery_records for select to authenticated using (auth.uid() = user_id);
create policy "own mastery upsert" on public.mastery_records for insert to authenticated with check (auth.uid() = user_id);
create policy "own mastery update" on public.mastery_records for update to authenticated using (auth.uid() = user_id);


create table if not exists public.cognitive_profiles (
  id                      uuid primary key default gen_random_uuid(),
  user_id                 uuid unique not null references auth.users(id) on delete cascade,
  archetype               text,
  analytical_thinking     int,
  pattern_recognition     int,
  reading_comprehension   int,
  problem_solving         int,
  decision_confidence     int,
  time_management         int,
  akurasi_saat_yakin      float,
  akurasi_saat_ragu       float,
  frekuensi_ubah_jawaban  float,
  akurasi_setelah_ubah    float,
  jam_produktif_mulai     time,
  jam_produktif_selesai   time,
  learning_style          text,
  ai_narrative            text,
  generated_at            timestamptz,
  updated_at              timestamptz not null default now()
);

alter table public.cognitive_profiles enable row level security;
drop policy if exists "own cognitive read"   on public.cognitive_profiles;
drop policy if exists "own cognitive upsert" on public.cognitive_profiles;
create policy "own cognitive read"   on public.cognitive_profiles for select to authenticated using (auth.uid() = user_id);
create policy "own cognitive upsert" on public.cognitive_profiles for insert to authenticated with check (auth.uid() = user_id);
create policy "own cognitive update" on public.cognitive_profiles for update to authenticated using (auth.uid() = user_id);


create table if not exists public.intelligence_snapshots (
  id                    uuid primary key default gen_random_uuid(),
  user_id               uuid not null references auth.users(id) on delete cascade,
  periode               date not null,
  academic_health_score int,
  growth_trend          float,
  learning_consistency  float,
  target_readiness      float,
  kekuatan_utama        jsonb,
  area_perbaikan        jsonb,
  ai_narrative          text,
  created_at            timestamptz not null default now(),
  unique (user_id, periode)
);
create index if not exists intelligence_snapshots_user_idx on public.intelligence_snapshots(user_id, periode desc);

alter table public.intelligence_snapshots enable row level security;
drop policy if exists "own snapshots read" on public.intelligence_snapshots;
create policy "own snapshots read" on public.intelligence_snapshots for select to authenticated using (auth.uid() = user_id);


-- ────────────────────────────────────────────────────────────
-- 4. NAVIGATOR & PLANNING
-- ────────────────────────────────────────────────────────────

create table if not exists public.study_plans (
  id                    uuid primary key default gen_random_uuid(),
  user_id               uuid not null references auth.users(id) on delete cascade,
  minggu_mulai          date not null,
  prioritas             jsonb not null default '[]'::jsonb,  -- PrioritasTopik[]
  jadwal_harian         jsonb,                                -- StudyBlock[]
  target_skor_minggu_ini int,
  ai_generated          boolean not null default true,
  created_at            timestamptz not null default now(),
  unique (user_id, minggu_mulai)
);
create index if not exists study_plans_user_idx on public.study_plans(user_id, minggu_mulai desc);

alter table public.study_plans enable row level security;
drop policy if exists "own study_plans read"   on public.study_plans;
drop policy if exists "own study_plans upsert" on public.study_plans;
create policy "own study_plans read"   on public.study_plans for select to authenticated using (auth.uid() = user_id);
create policy "own study_plans upsert" on public.study_plans for insert to authenticated with check (auth.uid() = user_id);
create policy "own study_plans update" on public.study_plans for update to authenticated using (auth.uid() = user_id);


create table if not exists public.daily_missions (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  tanggal      date not null,
  missions     jsonb not null default '[]'::jsonb,  -- Mission[]
  selesai      int not null default 0,
  total        int not null default 3,
  ai_generated boolean not null default true,
  created_at   timestamptz not null default now(),
  unique (user_id, tanggal)
);
create index if not exists daily_missions_user_idx on public.daily_missions(user_id, tanggal desc);

alter table public.daily_missions enable row level security;
drop policy if exists "own daily_missions read"   on public.daily_missions;
drop policy if exists "own daily_missions upsert" on public.daily_missions;
create policy "own daily_missions read"   on public.daily_missions for select to authenticated using (auth.uid() = user_id);
create policy "own daily_missions upsert" on public.daily_missions for insert to authenticated with check (auth.uid() = user_id);
create policy "own daily_missions update" on public.daily_missions for update to authenticated using (auth.uid() = user_id);


create table if not exists public.study_schedules (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  judul       text not null,
  deskripsi   text,
  mulai_at    timestamptz not null,
  selesai_at  timestamptz not null,
  tipe        text not null default 'belajar' check (tipe in ('belajar','review','tryout','live','lainnya')),
  topic_id    uuid references public.topics(id) on delete set null,
  selesai     boolean not null default false,
  created_at  timestamptz not null default now()
);
create index if not exists study_schedules_user_idx on public.study_schedules(user_id, mulai_at);

alter table public.study_schedules enable row level security;
drop policy if exists "own schedules read"   on public.study_schedules;
drop policy if exists "own schedules insert" on public.study_schedules;
drop policy if exists "own schedules update" on public.study_schedules;
drop policy if exists "own schedules delete" on public.study_schedules;
create policy "own schedules read"   on public.study_schedules for select to authenticated using (auth.uid() = user_id);
create policy "own schedules insert" on public.study_schedules for insert to authenticated with check (auth.uid() = user_id);
create policy "own schedules update" on public.study_schedules for update to authenticated using (auth.uid() = user_id);
create policy "own schedules delete" on public.study_schedules for delete to authenticated using (auth.uid() = user_id);


-- ────────────────────────────────────────────────────────────
-- 5. GAMIFICATION
-- ────────────────────────────────────────────────────────────

create table if not exists public.streaks (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid unique not null references auth.users(id) on delete cascade,
  streak_aktif      int not null default 0,
  streak_terpanjang int not null default 0,
  terakhir_aktif    date,
  freeze_tersisa    int not null default 0,
  updated_at        timestamptz not null default now()
);

alter table public.streaks enable row level security;
drop policy if exists "own streaks read" on public.streaks;
create policy "own streaks read" on public.streaks for select to authenticated using (auth.uid() = user_id);


create table if not exists public.xp_transactions (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  jumlah     int not null,
  sumber     text not null,  -- tryout|latihan|review|streak_7|perfect_score|achievement
  keterangan text,
  created_at timestamptz not null default now()
);
create index if not exists xp_transactions_user_idx on public.xp_transactions(user_id, created_at desc);

alter table public.xp_transactions enable row level security;
drop policy if exists "own xp read" on public.xp_transactions;
create policy "own xp read" on public.xp_transactions for select to authenticated using (auth.uid() = user_id);


create table if not exists public.user_levels (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid unique not null references auth.users(id) on delete cascade,
  level      int not null default 1,
  xp_total   int not null default 0,
  xp_level   int not null default 0,
  xp_target  int not null default 500,
  updated_at timestamptz not null default now()
);

alter table public.user_levels enable row level security;
drop policy if exists "own levels read" on public.user_levels;
create policy "own levels read" on public.user_levels for select to authenticated using (auth.uid() = user_id);


create table if not exists public.achievements (
  id          uuid primary key default gen_random_uuid(),
  kode        text unique not null,
  nama        text not null,
  deskripsi   text,
  icon        text,
  color       text,
  xp_reward   int not null default 100,
  kondisi     jsonb,  -- {tipe:"streak_7"|"perfect_score"|..., nilai:n}
  created_at  timestamptz not null default now()
);

alter table public.achievements enable row level security;
drop policy if exists "achievements readable" on public.achievements;
create policy "achievements readable" on public.achievements for select to authenticated using (true);

-- Seed achievement dasar
insert into public.achievements (kode, nama, deskripsi, icon, color, xp_reward, kondisi) values
  ('streak-3',     'Konsisten 3 Hari',   'Belajar 3 hari berturut-turut',    '🔥', '#f59e0b', 50,  '{"tipe":"streak_aktif","nilai":3}'),
  ('streak-7',     'Api Semangat',        'Belajar 7 hari berturut-turut',    '🔥', '#ef4444', 100, '{"tipe":"streak_aktif","nilai":7}'),
  ('streak-30',    'Juara Konsistensi',   'Belajar 30 hari berturut-turut',   '🏆', '#f59e0b', 500, '{"tipe":"streak_aktif","nilai":30}'),
  ('first-tryout', 'Try Out Pertama',     'Menyelesaikan try out perdana',    '📝', '#3b82f6', 80,  '{"tipe":"tryout_selesai","nilai":1}'),
  ('score-600',    'Skor 600+',           'Meraih skor ≥ 600 dalam try out', '⭐', '#6366f1', 150, '{"tipe":"skor_minimal","nilai":600}'),
  ('score-800',    'Skor 800+',           'Meraih skor ≥ 800 dalam try out', '💎', '#8b5cf6', 300, '{"tipe":"skor_minimal","nilai":800}'),
  ('perfect',      'Sempurna!',           '100% benar dalam satu try out',   '🎯', '#22c55e', 500, '{"tipe":"akurasi_minimal","nilai":100}')
on conflict (kode) do nothing;


create table if not exists public.user_achievements (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references auth.users(id) on delete cascade,
  achievement_id uuid not null references public.achievements(id) on delete cascade,
  diraih_at      timestamptz not null default now(),
  unique (user_id, achievement_id)
);
create index if not exists user_achievements_user_idx on public.user_achievements(user_id, diraih_at desc);

alter table public.user_achievements enable row level security;
drop policy if exists "own user_achievements read" on public.user_achievements;
create policy "own user_achievements read" on public.user_achievements for select to authenticated using (auth.uid() = user_id);


-- ────────────────────────────────────────────────────────────
-- 6. LEARNING CENTER
-- ────────────────────────────────────────────────────────────

create table if not exists public.learning_materials (
  id            uuid primary key default gen_random_uuid(),
  judul         text not null,
  slug          text unique not null,
  topic_id      uuid references public.topics(id) on delete set null,
  tipe          text not null check (tipe in ('video','artikel','latihan','live','pdf')),
  konten        jsonb,   -- {url?, teks?, soal_ids?}
  durasi_menit  int,
  thumbnail_url text,
  is_premium    boolean not null default false,
  urutan        int not null default 0,
  aktif         boolean not null default true,
  created_at    timestamptz not null default now()
);
create index if not exists learning_materials_topic_idx on public.learning_materials(topic_id, urutan);

alter table public.learning_materials enable row level security;
drop policy if exists "materials readable" on public.learning_materials;
create policy "materials readable" on public.learning_materials for select to authenticated using (aktif = true);


create table if not exists public.learning_progress (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references auth.users(id) on delete cascade,
  material_id    uuid not null references public.learning_materials(id) on delete cascade,
  progress_persen int not null default 0 check (progress_persen between 0 and 100),
  selesai        boolean not null default false,
  selesai_at     timestamptz,
  created_at     timestamptz not null default now(),
  unique (user_id, material_id)
);
create index if not exists learning_progress_user_idx on public.learning_progress(user_id, material_id);

alter table public.learning_progress enable row level security;
drop policy if exists "own progress read"   on public.learning_progress;
drop policy if exists "own progress upsert" on public.learning_progress;
create policy "own progress read"   on public.learning_progress for select to authenticated using (auth.uid() = user_id);
create policy "own progress upsert" on public.learning_progress for insert to authenticated with check (auth.uid() = user_id);
create policy "own progress update" on public.learning_progress for update to authenticated using (auth.uid() = user_id);


create table if not exists public.bookmarks (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  tipe       text not null check (tipe in ('soal','materi','tryout')),
  ref_id     uuid not null,
  catatan    text,
  created_at timestamptz not null default now(),
  unique (user_id, tipe, ref_id)
);
create index if not exists bookmarks_user_idx on public.bookmarks(user_id, tipe, created_at desc);

alter table public.bookmarks enable row level security;
drop policy if exists "own bookmarks read"   on public.bookmarks;
drop policy if exists "own bookmarks insert" on public.bookmarks;
drop policy if exists "own bookmarks delete" on public.bookmarks;
create policy "own bookmarks read"   on public.bookmarks for select to authenticated using (auth.uid() = user_id);
create policy "own bookmarks insert" on public.bookmarks for insert to authenticated with check (auth.uid() = user_id);
create policy "own bookmarks delete" on public.bookmarks for delete to authenticated using (auth.uid() = user_id);


-- ────────────────────────────────────────────────────────────
-- 7. SUBSCRIPTION & PAYMENT
-- ────────────────────────────────────────────────────────────

create table if not exists public.subscriptions (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid not null references auth.users(id) on delete cascade,
  paket               text not null check (paket in ('free','pro','siswa_albirru')),
  status              text not null default 'aktif' check (status in ('aktif','expired','cancelled','pending')),
  mulai_at            timestamptz,
  berakhir_at         timestamptz,
  midtrans_order_id   text,
  harga               int,
  created_at          timestamptz not null default now()
);
create index if not exists subscriptions_user_idx on public.subscriptions(user_id, created_at desc);

alter table public.subscriptions enable row level security;
drop policy if exists "own subscriptions read" on public.subscriptions;
create policy "own subscriptions read" on public.subscriptions for select to authenticated using (auth.uid() = user_id);


create table if not exists public.payment_logs (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references auth.users(id) on delete cascade,
  order_id       text unique not null,
  jumlah         int not null,
  status         text,   -- pending|settlement|expire|cancel|failure
  midtrans_data  jsonb,
  created_at     timestamptz not null default now()
);
create index if not exists payment_logs_user_idx on public.payment_logs(user_id, created_at desc);

alter table public.payment_logs enable row level security;
drop policy if exists "own payment_logs read" on public.payment_logs;
create policy "own payment_logs read" on public.payment_logs for select to authenticated using (auth.uid() = user_id);


-- ────────────────────────────────────────────────────────────
-- 8. B2B SEKOLAH
-- ────────────────────────────────────────────────────────────

create table if not exists public.schools (
  id         uuid primary key default gen_random_uuid(),
  nama       text not null,
  kode       text unique,
  kota       text,
  provinsi   text,
  plan       text default 'free',
  admin_id   uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

alter table public.schools enable row level security;
drop policy if exists "schools member read" on public.schools;
create policy "schools member read" on public.schools for select to authenticated
  using (exists (
    select 1 from public.school_members sm
    where sm.school_id = id and sm.user_id = auth.uid()
  ) or exists (
    select 1 from public.profiles p where p.id = auth.uid() and p.role in ('staf','admin')
  ));


create table if not exists public.school_members (
  id         uuid primary key default gen_random_uuid(),
  school_id  uuid not null references public.schools(id) on delete cascade,
  user_id    uuid not null references auth.users(id) on delete cascade,
  role       text not null default 'siswa' check (role in ('siswa','guru','koordinator')),
  kelas      text,
  joined_at  timestamptz not null default now(),
  unique (school_id, user_id)
);
create index if not exists school_members_user_idx on public.school_members(user_id);

alter table public.school_members enable row level security;
drop policy if exists "own school_members read" on public.school_members;
create policy "own school_members read" on public.school_members for select to authenticated
  using (user_id = auth.uid() or exists (
    select 1 from public.profiles p where p.id = auth.uid() and p.role in ('staf','admin')
  ));


create table if not exists public.assignments (
  id           uuid primary key default gen_random_uuid(),
  school_id    uuid references public.schools(id) on delete cascade,
  dibuat_oleh  uuid not null references auth.users(id) on delete cascade,
  judul        text not null,
  ref_tipe     text,   -- tryout|materi|latihan
  ref_id       uuid,
  target_kelas text,
  due_at       timestamptz,
  created_at   timestamptz not null default now()
);
create index if not exists assignments_school_idx on public.assignments(school_id, created_at desc);

alter table public.assignments enable row level security;
drop policy if exists "assignments member read" on public.assignments;
create policy "assignments member read" on public.assignments for select to authenticated
  using (exists (
    select 1 from public.school_members sm
    where sm.school_id = assignments.school_id and sm.user_id = auth.uid()
  ) or dibuat_oleh = auth.uid());


create table if not exists public.announcements (
  id          uuid primary key default gen_random_uuid(),
  school_id   uuid references public.schools(id) on delete cascade,
  dibuat_oleh uuid not null references auth.users(id) on delete cascade,
  judul       text not null,
  isi         text not null,
  created_at  timestamptz not null default now()
);
create index if not exists announcements_school_idx on public.announcements(school_id, created_at desc);

alter table public.announcements enable row level security;
drop policy if exists "announcements member read" on public.announcements;
create policy "announcements member read" on public.announcements for select to authenticated
  using (school_id is null or exists (
    select 1 from public.school_members sm
    where sm.school_id = announcements.school_id and sm.user_id = auth.uid()
  ) or exists (
    select 1 from public.profiles p where p.id = auth.uid() and p.role in ('staf','admin')
  ));


-- ────────────────────────────────────────────────────────────
-- 9. TATA KELOLA
-- ────────────────────────────────────────────────────────────

create table if not exists public.audit_logs (
  id          uuid primary key default gen_random_uuid(),
  actor_id    uuid references auth.users(id) on delete set null,
  aksi        text not null,
  entitas     text,
  entitas_id  text,
  metadata    jsonb,
  ip          text,
  created_at  timestamptz not null default now()
);
create index if not exists audit_logs_actor_idx  on public.audit_logs(actor_id, created_at desc);
create index if not exists audit_logs_created_idx on public.audit_logs(created_at desc);

alter table public.audit_logs enable row level security;
-- audit_logs hanya bisa dibaca admin (insert via service_role di server)
drop policy if exists "audit_logs admin read" on public.audit_logs;
create policy "audit_logs admin read" on public.audit_logs for select to authenticated
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));


create table if not exists public.i18n_strings (
  id     uuid primary key default gen_random_uuid(),
  key    text not null,
  locale text not null,
  value  text not null,
  unique (key, locale)
);
create index if not exists i18n_strings_locale_idx on public.i18n_strings(locale, key);

alter table public.i18n_strings enable row level security;
drop policy if exists "i18n readable" on public.i18n_strings;
create policy "i18n readable" on public.i18n_strings for select to authenticated using (true);
-- anon juga perlu baca (halaman marketing i18n)
drop policy if exists "i18n anon readable" on public.i18n_strings;
create policy "i18n anon readable" on public.i18n_strings for select to anon using (true);

-- Seed string dasar ID/EN
insert into public.i18n_strings (key, locale, value) values
  ('nav.dashboard',   'id', 'Dashboard'),
  ('nav.dashboard',   'en', 'Dashboard'),
  ('nav.tryout',      'id', 'Try Out'),
  ('nav.tryout',      'en', 'Practice Test'),
  ('nav.intelligence','id', 'Academic Intelligence'),
  ('nav.intelligence','en', 'Academic Intelligence'),
  ('nav.navigator',   'id', 'Academic Navigator'),
  ('nav.navigator',   'en', 'Academic Navigator'),
  ('nav.journey',     'id', 'Academic Journey'),
  ('nav.journey',     'en', 'Academic Journey'),
  ('nav.learning',    'id', 'Learning Center'),
  ('nav.learning',    'en', 'Learning Center'),
  ('nav.target',      'id', 'Target Kampus'),
  ('nav.target',      'en', 'Target Campus'),
  ('nav.achievement', 'id', 'Achievement'),
  ('nav.achievement', 'en', 'Achievement'),
  ('nav.bookmark',    'id', 'Bookmark'),
  ('nav.bookmark',    'en', 'Bookmark'),
  ('nav.profil',      'id', 'Profil'),
  ('nav.profil',      'en', 'Profile')
on conflict (key, locale) do nothing;


create table if not exists public.feature_flags (
  key         text primary key,
  enabled     boolean not null default false,
  deskripsi   text,
  updated_at  timestamptz not null default now()
);

alter table public.feature_flags enable row level security;
drop policy if exists "feature_flags readable" on public.feature_flags;
create policy "feature_flags readable" on public.feature_flags for select to authenticated using (true);

-- Seed feature flags
insert into public.feature_flags (key, enabled, deskripsi) values
  ('ai_insights',        false, 'Aktifkan insight AI (Claude) di halaman hasil try out'),
  ('ai_cognitive',       false, 'Aktifkan narasi kognitif AI di Academic Intelligence'),
  ('ai_weekly_report',   false, 'Aktifkan laporan mingguan AI via email'),
  ('ai_question_gen',    false, 'Aktifkan AI question generator (staf/admin)'),
  ('midtrans_live',      false, 'Gunakan Midtrans production (false = simulasi)'),
  ('realtime_ranking',   false, 'Aktifkan ranking realtime via Supabase Realtime'),
  ('pdf_export',         false, 'Aktifkan ekspor PDF hasil try out'),
  ('b2b_schools',        false, 'Aktifkan fitur B2B sekolah'),
  ('streak_freeze',      true,  'Izinkan siswa pakai streak freeze'),
  ('beta_irt',           false, 'Gunakan IRT theta di halaman hasil (beta)')
on conflict (key) do nothing;


-- ────────────────────────────────────────────────────────────
-- 10. RPC: get_user_intelligence
--     Dipanggil oleh lib/portal/intelligence.ts
--     Mengagregasi data dari tryout_attempts (skema existing)
-- ────────────────────────────────────────────────────────────

create or replace function public.get_user_intelligence()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user     uuid := auth.uid();
  v_summary  jsonb;
  v_subtes   jsonb;
  v_trend    jsonb;
begin
  if v_user is null then raise exception 'not authenticated'; end if;

  -- Ringkasan: skor terbaru, rata-rata, total try out selesai
  select jsonb_build_object(
    'skor_terbaru',   max(a.skor) filter (where a.submitted_at = (
                        select max(a2.submitted_at) from public.tryout_attempts a2
                        where a2.user_id = v_user and a2.status = 'selesai')),
    'rata_rata',      round(avg(a.skor)::numeric, 0),
    'total_tryout',   count(*),
    'total_benar',    sum(a.benar),
    'total_soal',     sum(a.benar + a.salah + a.kosong)
  )
  into v_summary
  from public.tryout_attempts a
  where a.user_id = v_user and a.status = 'selesai';

  -- Performa per subtes (agregat dari tryout_answers + tryout_questions)
  select jsonb_agg(
    jsonb_build_object(
      'subtes',         q.subtes,
      'total_soal',     count(*),
      'benar',          count(*) filter (where ans.pilihan = q.kunci),
      'akurasi',        round(
                          (count(*) filter (where ans.pilihan = q.kunci))::numeric
                          / nullif(count(*), 0) * 100, 1),
      'weakness_index', round(
                          (1 - (count(*) filter (where ans.pilihan = q.kunci))::float
                          / nullif(count(*), 0)) * 100, 1)
    ) order by q.subtes
  )
  into v_subtes
  from public.tryout_attempts a
  join public.tryout_answers ans   on ans.attempt_id   = a.id
  join public.tryout_questions q   on q.id             = ans.question_id
  where a.user_id = v_user and a.status = 'selesai'
  group by q.subtes;

  -- Tren skor: 8 try out terakhir
  select jsonb_agg(
    jsonb_build_object(
      'tanggal', to_char(a.submitted_at, 'YYYY-MM-DD'),
      'skor',    a.skor
    ) order by a.submitted_at
  )
  into v_trend
  from (
    select submitted_at, skor
    from public.tryout_attempts
    where user_id = v_user and status = 'selesai'
    order by submitted_at desc
    limit 8
  ) a;

  return jsonb_build_object(
    'summary', coalesce(v_summary, '{}'::jsonb),
    'subtes',  coalesce(v_subtes,  '[]'::jsonb),
    'trend',   coalesce(v_trend,   '[]'::jsonb),
    'hasData', (v_summary ->> 'total_tryout')::int > 0
  );
end;
$$;

revoke all on function public.get_user_intelligence() from public, anon;
grant execute on function public.get_user_intelligence() to authenticated;


-- ────────────────────────────────────────────────────────────
-- 11. RPC: upsert_gamification
--     Dipanggil server-side setelah submit try out.
--     Tambah XP, update streak & level, cek achievement.
-- ────────────────────────────────────────────────────────────

create or replace function public.upsert_gamification(
  p_sumber  text,
  p_xp      int,
  p_skor    int default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user     uuid := auth.uid();
  v_xp_total int;
  v_level    int;
  v_streak   int;
  v_today    date := current_date;
  v_prev_date date;
begin
  if v_user is null then raise exception 'not authenticated'; end if;

  -- Catat XP
  insert into public.xp_transactions (user_id, jumlah, sumber) values (v_user, p_xp, p_sumber);

  -- Update user_levels (upsert)
  insert into public.user_levels (user_id, xp_total, xp_level, xp_target)
  values (v_user, p_xp, p_xp, 500)
  on conflict (user_id) do update
    set xp_total  = public.user_levels.xp_total + p_xp,
        xp_level  = (public.user_levels.xp_total + p_xp) % 500,
        level     = ((public.user_levels.xp_total + p_xp) / 500) + 1,
        updated_at = now()
  returning xp_total, level into v_xp_total, v_level;

  -- Update streaks
  select terakhir_aktif into v_prev_date
  from public.streaks where user_id = v_user;

  if v_prev_date is null then
    insert into public.streaks (user_id, streak_aktif, streak_terpanjang, terakhir_aktif)
    values (v_user, 1, 1, v_today)
    on conflict (user_id) do nothing;
    v_streak := 1;
  elsif v_prev_date = v_today then
    select streak_aktif into v_streak from public.streaks where user_id = v_user;
  elsif v_prev_date = v_today - 1 then
    update public.streaks
    set streak_aktif = streak_aktif + 1,
        streak_terpanjang = greatest(streak_terpanjang, streak_aktif + 1),
        terakhir_aktif = v_today,
        updated_at = now()
    where user_id = v_user
    returning streak_aktif into v_streak;
  else
    -- Streak putus
    update public.streaks
    set streak_aktif = 1, terakhir_aktif = v_today, updated_at = now()
    where user_id = v_user
    returning streak_aktif into v_streak;
  end if;

  -- Cek & berikan achievement streak
  if v_streak in (3, 7, 30) then
    insert into public.user_achievements (user_id, achievement_id)
    select v_user, a.id from public.achievements a
    where a.kondisi->>'tipe' = 'streak_aktif' and (a.kondisi->>'nilai')::int = v_streak
    on conflict (user_id, achievement_id) do nothing;
  end if;

  -- Cek achievement skor
  if p_skor is not null then
    insert into public.user_achievements (user_id, achievement_id)
    select v_user, a.id from public.achievements a
    where a.kondisi->>'tipe' = 'skor_minimal'
      and (a.kondisi->>'nilai')::int <= p_skor
    on conflict (user_id, achievement_id) do nothing;
  end if;

  return jsonb_build_object(
    'xp_total', v_xp_total,
    'level',    v_level,
    'streak',   v_streak
  );
end;
$$;

revoke all on function public.upsert_gamification(text, int, int) from public, anon;
grant execute on function public.upsert_gamification(text, int, int) to authenticated;


-- ────────────────────────────────────────────────────────────
-- 12. Helper: tambah kolom tanggal_ujian ke profiles (untuk milestone T-90)
-- ────────────────────────────────────────────────────────────

alter table public.profiles add column if not exists tanggal_ujian date;
alter table public.profiles add column if not exists gaya_belajar  text;  -- visual|auditori|kinestetik
