-- Albirru — lead capture table (langkah 7a)
-- Jalankan di Supabase: SQL Editor → New query → Run.

create table if not exists public.leads (
  id           uuid primary key default gen_random_uuid(),
  nama         text not null,
  email        text not null,
  asal_sekolah text,
  source       text default 'landing',
  created_at   timestamptz not null default now()
);

alter table public.leads enable row level security;

-- Pengunjung anonim boleh MENGIRIM lead dari form, tapi tidak bisa membaca daftarnya.
drop policy if exists "anon can insert leads" on public.leads;
create policy "anon can insert leads"
  on public.leads for insert
  to anon
  with check (true);

-- (Opsional) akses baca untuk staf yang sudah login — sesuaikan dengan role kamu nanti.
-- create policy "authenticated can read leads"
--   on public.leads for select to authenticated using (true);

create index if not exists leads_email_idx on public.leads (email);
create index if not exists leads_created_at_idx on public.leads (created_at desc);

-- ============================================================
-- AUTH: profiles + auto-create on signup (langkah a)
-- ============================================================
create table if not exists public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  role       text not null default 'siswa' check (role in ('siswa','staf','admin')),
  nama       text,
  plan       text not null default 'free' check (plan in ('free','pro','siswa_albirru')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "own profile read" on public.profiles;
create policy "own profile read" on public.profiles
  for select to authenticated using (auth.uid() = id);

drop policy if exists "own profile update" on public.profiles;
create policy "own profile update" on public.profiles
  for update to authenticated using (auth.uid() = id);

-- Buat profile otomatis saat user baru daftar (membaca metadata nama & role).
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, role, nama)
  values (
    new.id,
    CASE
      WHEN new.raw_user_meta_data ->> 'role' IN ('siswa','staf','admin')
      THEN new.raw_user_meta_data ->> 'role'
      ELSE 'siswa'
    END,
    new.raw_user_meta_data ->> 'nama'
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- CONTACTS: form "Hubungi Kami" (halaman Kontak)
-- ============================================================
create table if not exists public.contacts (
  id         uuid primary key default gen_random_uuid(),
  nama       text not null,
  email      text not null,
  whatsapp   text,
  topik      text,
  pesan      text not null,
  created_at timestamptz not null default now()
);

alter table public.contacts enable row level security;

drop policy if exists "anon can insert contacts" on public.contacts;
create policy "anon can insert contacts"
  on public.contacts for insert to anon with check (true);

create index if not exists contacts_created_at_idx on public.contacts (created_at desc);

-- ============================================================
-- ONBOARDING: detail identitas & target (dipanggil pasca-daftar)
-- ============================================================
alter table public.profiles add column if not exists jenjang        text;
alter table public.profiles add column if not exists jurusan        text;
alter table public.profiles add column if not exists asal_sekolah   text;
alter table public.profiles add column if not exists segment        text default 'utbk';
alter table public.profiles add column if not exists target_kampus  text;
alter table public.profiles add column if not exists target_prodi   text;
-- Target khusus jalur aparatur (CPNS/PPPK). UTBK pakai target_kampus/target_prodi.
alter table public.profiles add column if not exists target_instansi text;
alter table public.profiles add column if not exists target_jabatan  text;
alter table public.profiles add column if not exists target_skor    int;
alter table public.profiles add column if not exists onboarding_done boolean not null default false;

-- ============================================================
-- TRY OUT ENGINE: katalog, soal (+kunci), attempts, jawaban, skoring
-- Kunci jawaban TIDAK pernah terekspos ke klien (RLS + column grants + view aman).
-- ============================================================
create table if not exists public.tryouts (
  id           text primary key,
  title        text not null,
  tipe         text not null default 'SNBT',
  durasi_menit int  not null default 100,
  poin_per_soal int not null default 4,
  status       text not null default 'tersedia' check (status in ('tersedia','berlangsung','selesai','arsip')),
  created_at   timestamptz not null default now()
);

create table if not exists public.tryout_questions (
  id         uuid primary key default gen_random_uuid(),
  tryout_id  text not null references public.tryouts(id) on delete cascade,
  nomor      int  not null,
  subtes     text not null,
  teks       text not null,
  pilihan    jsonb not null,
  kunci      text not null,            -- RAHASIA (server-side only)
  poin       int  not null default 4,
  pembahasan text,
  created_at timestamptz not null default now(),
  unique (tryout_id, nomor)
);

create table if not exists public.tryout_attempts (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  tryout_id    text not null references public.tryouts(id) on delete cascade,
  status       text not null default 'berlangsung' check (status in ('berlangsung','selesai')),
  skor int, benar int, salah int, kosong int,
  started_at   timestamptz not null default now(),
  submitted_at timestamptz
);
create index if not exists tryout_attempts_user_idx on public.tryout_attempts(user_id, tryout_id, submitted_at desc);

create table if not exists public.tryout_answers (
  id          uuid primary key default gen_random_uuid(),
  attempt_id  uuid not null references public.tryout_attempts(id) on delete cascade,
  question_id uuid not null references public.tryout_questions(id) on delete cascade,
  pilihan     text,
  unique (attempt_id, question_id)
);

alter table public.tryouts          enable row level security;
alter table public.tryout_questions enable row level security;
alter table public.tryout_attempts  enable row level security;
alter table public.tryout_answers   enable row level security;

drop policy if exists "tryouts readable" on public.tryouts;
create policy "tryouts readable" on public.tryouts for select to authenticated using (true);

-- Soal: baris boleh dibaca, TAPI kolom `kunci`/`pembahasan` tidak di-grant.
revoke all on public.tryout_questions from anon, authenticated;
drop policy if exists "questions readable" on public.tryout_questions;
create policy "questions readable" on public.tryout_questions for select to authenticated using (true);
grant select (id, tryout_id, nomor, subtes, teks, pilihan, poin) on public.tryout_questions to authenticated;

drop policy if exists "own attempts read"   on public.tryout_attempts;
drop policy if exists "own attempts insert" on public.tryout_attempts;
create policy "own attempts read"   on public.tryout_attempts for select to authenticated using (auth.uid() = user_id);
create policy "own attempts insert" on public.tryout_attempts for insert to authenticated with check (auth.uid() = user_id);

drop policy if exists "own answers read" on public.tryout_answers;
create policy "own answers read" on public.tryout_answers for select to authenticated
  using (exists (select 1 from public.tryout_attempts a where a.id = attempt_id and a.user_id = auth.uid()));

-- View aman (tanpa kunci), mengikuti hak pemanggil.
create or replace view public.tryout_questions_public
  with (security_invoker = on) as
  select id, tryout_id, nomor, subtes, teks, pilihan, poin from public.tryout_questions;
grant select on public.tryout_questions_public to authenticated;

-- Fungsi skoring server-side.
create or replace function public.submit_tryout(p_tryout_id text, p_answers jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_user uuid := auth.uid(); v_attempt uuid; v_total int; v_benar int; v_salah int; v_kosong int; v_skor int;
begin
  if v_user is null then raise exception 'not authenticated'; end if;
  insert into public.tryout_attempts (user_id, tryout_id, status, started_at, submitted_at)
  values (v_user, p_tryout_id, 'selesai', now(), now()) returning id into v_attempt;
  insert into public.tryout_answers (attempt_id, question_id, pilihan)
  select v_attempt, (a->>'q')::uuid, a->>'k'
  from jsonb_array_elements(coalesce(p_answers, '[]'::jsonb)) a
  where (a->>'q') is not null on conflict (attempt_id, question_id) do nothing;
  select count(*) into v_total from public.tryout_questions where tryout_id = p_tryout_id;
  select count(*) filter (where ans.pilihan is not null and ans.pilihan = q.kunci),
         count(*) filter (where ans.pilihan is not null and ans.pilihan <> q.kunci)
  into v_benar, v_salah
  from public.tryout_questions q
  left join public.tryout_answers ans on ans.question_id = q.id and ans.attempt_id = v_attempt
  where q.tryout_id = p_tryout_id;
  v_kosong := greatest(0, v_total - v_benar - v_salah);
  v_skor := case when v_total > 0 then round(v_benar::numeric / v_total * 1000) else 0 end;
  update public.tryout_attempts set benar=v_benar, salah=v_salah, kosong=v_kosong, skor=v_skor where id=v_attempt;
  return jsonb_build_object('attempt_id', v_attempt, 'skor', v_skor, 'benar', v_benar, 'salah', v_salah, 'kosong', v_kosong, 'total', v_total);
end; $$;
revoke all on function public.submit_tryout(text, jsonb) from public, anon;
grant execute on function public.submit_tryout(text, jsonb) to authenticated;

-- Review hasil attempt milik caller: status per soal + agregat per subtes (tanpa kunci mentah).
create or replace function public.get_attempt_review(p_attempt_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_user uuid := auth.uid(); v_tryout text; v_questions jsonb; v_subtes jsonb;
begin
  if v_user is null then raise exception 'not authenticated'; end if;
  select tryout_id into v_tryout from public.tryout_attempts where id = p_attempt_id and user_id = v_user;
  if v_tryout is null then raise exception 'attempt not found'; end if;
  with rows as (
    select q.nomor, q.subtes,
      case when ans.pilihan is null then 'kosong' when ans.pilihan = q.kunci then 'benar' else 'salah' end as status
    from public.tryout_questions q
    left join public.tryout_answers ans on ans.question_id = q.id and ans.attempt_id = p_attempt_id
    where q.tryout_id = v_tryout)
  select jsonb_agg(jsonb_build_object('nomor', nomor, 'subtes', subtes, 'status', status) order by nomor) into v_questions from rows;
  with rows as (
    select q.subtes,
      case when ans.pilihan is null then 'kosong' when ans.pilihan = q.kunci then 'benar' else 'salah' end as status
    from public.tryout_questions q
    left join public.tryout_answers ans on ans.question_id = q.id and ans.attempt_id = p_attempt_id
    where q.tryout_id = v_tryout),
  agg as (select subtes, count(*) total,
      count(*) filter (where status='benar') benar, count(*) filter (where status='salah') salah,
      count(*) filter (where status='kosong') kosong from rows group by subtes)
  select jsonb_agg(jsonb_build_object('subtes', subtes, 'total', total, 'benar', benar, 'salah', salah,
      'kosong', kosong, 'skor', round(benar::numeric/total*1000), 'persen', round(benar::numeric/total*100,1)) order by subtes)
  into v_subtes from agg;
  return jsonb_build_object('questions', coalesce(v_questions,'[]'::jsonb), 'subtes', coalesce(v_subtes,'[]'::jsonb));
end; $$;
revoke all on function public.get_attempt_review(uuid) from public, anon;
grant execute on function public.get_attempt_review(uuid) to authenticated;

-- ============================================================
-- PENDAFTARAN & PEMBAYARAN TRY OUT (aturan free/pro)
-- ============================================================
alter table public.tryouts add column if not exists harga    int not null default 0;
alter table public.tryouts add column if not exists mulai_at timestamptz;

create table if not exists public.tryout_registrations (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  tryout_id  text not null,
  status     text not null check (status in ('paid','registered')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, tryout_id)
);
alter table public.tryout_registrations enable row level security;
drop policy if exists "own registrations read" on public.tryout_registrations;
create policy "own registrations read" on public.tryout_registrations for select to authenticated using (auth.uid() = user_id);

-- Simulasi pembayaran QRIS berhasil → 'paid'.
create or replace function public.pay_tryout(p_tryout_id text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_user uuid := auth.uid(); v_status text;
begin
  if v_user is null then raise exception 'not authenticated'; end if;
  insert into public.tryout_registrations (user_id, tryout_id, status) values (v_user, p_tryout_id, 'paid')
  on conflict (user_id, tryout_id) do update
    set status = case when public.tryout_registrations.status = 'registered' then 'registered' else 'paid' end, updated_at = now()
  returning status into v_status;
  return jsonb_build_object('status', v_status);
end; $$;

-- Daftar; user free + try out berbayar wajib 'paid' dulu.
create or replace function public.register_tryout(p_tryout_id text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_user uuid := auth.uid(); v_plan text; v_harga int; v_paid boolean;
begin
  if v_user is null then raise exception 'not authenticated'; end if;
  select plan into v_plan from public.profiles where id = v_user;
  select harga into v_harga from public.tryouts where id = p_tryout_id;
  if coalesce(v_harga,0) > 0 and coalesce(v_plan,'free') = 'free' then
    select exists(select 1 from public.tryout_registrations where user_id=v_user and tryout_id=p_tryout_id and status in ('paid','registered')) into v_paid;
    if not v_paid then raise exception 'payment_required'; end if;
  end if;
  insert into public.tryout_registrations (user_id, tryout_id, status) values (v_user, p_tryout_id, 'registered')
  on conflict (user_id, tryout_id) do update set status = 'registered', updated_at = now();
  return jsonb_build_object('status', 'registered');
end; $$;

revoke all on function public.pay_tryout(text)      from public, anon;
revoke all on function public.register_tryout(text) from public, anon;
grant execute on function public.pay_tryout(text)      to authenticated;
grant execute on function public.register_tryout(text) to authenticated;

-- Detail pembahasan attempt milik caller (soal + kunci + pembahasan + jawaban user).
create or replace function public.get_attempt_detail(p_attempt_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_user uuid := auth.uid(); v_tryout text; v_out jsonb;
begin
  if v_user is null then raise exception 'not authenticated'; end if;
  select tryout_id into v_tryout from public.tryout_attempts where id = p_attempt_id and user_id = v_user;
  if v_tryout is null then raise exception 'attempt not found'; end if;
  select jsonb_agg(jsonb_build_object(
      'nomor', q.nomor, 'subtes', q.subtes, 'teks', q.teks, 'pilihan', q.pilihan,
      'kunci', q.kunci, 'pembahasan', q.pembahasan, 'jawaban', ans.pilihan,
      'status', case when ans.pilihan is null then 'kosong' when ans.pilihan = q.kunci then 'benar' else 'salah' end
    ) order by q.nomor)
  into v_out
  from public.tryout_questions q
  left join public.tryout_answers ans on ans.question_id = q.id and ans.attempt_id = p_attempt_id
  where q.tryout_id = v_tryout;
  return coalesce(v_out, '[]'::jsonb);
end; $$;
revoke all on function public.get_attempt_detail(uuid) from public, anon;
grant execute on function public.get_attempt_detail(uuid) to authenticated;

-- Upgrade ke Pro (simulasi pembayaran QRIS) → set plan = 'pro'.
create or replace function public.upgrade_pro()
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_user uuid := auth.uid();
begin
  if v_user is null then raise exception 'not authenticated'; end if;
  update public.profiles set plan = 'pro' where id = v_user;
  return jsonb_build_object('plan', 'pro');
end; $$;
revoke all on function public.upgrade_pro() from public, anon;
grant execute on function public.upgrade_pro() to authenticated;
