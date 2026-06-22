-- ═══════════════════════════════════════════════════════════
-- ALBIRRU ADMIN COMPLETE SETUP
-- Jalankan SELURUH isi file ini di Supabase SQL Editor → Run
-- ═══════════════════════════════════════════════════════════

-- ═══════════════════════════════════════════════════════════
-- 1. FIX CHECK CONSTRAINT: izinkan 'admin'
-- ═══════════════════════════════════════════════════════════
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check CHECK (role IN ('siswa', 'staf', 'admin'));

-- ═══════════════════════════════════════════════════════════
-- 2. SET AKUN ADMIN
-- ═══════════════════════════════════════════════════════════
UPDATE public.profiles p
SET role = 'admin'
FROM auth.users u
WHERE p.id = u.id
  AND u.email = 'wikantiyosobimo@gmail.com';

-- ═══════════════════════════════════════════════════════════
-- 3. UPDATE TRIGGER — handle 'admin' role dari metadata
-- ═══════════════════════════════════════════════════════════
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, role, nama)
  VALUES (
    new.id,
    CASE
      WHEN new.raw_user_meta_data ->> 'role' IN ('siswa','staf','admin')
      THEN new.raw_user_meta_data ->> 'role'
      ELSE 'siswa'
    END,
    COALESCE(new.raw_user_meta_data ->> 'nama', new.raw_user_meta_data ->> 'full_name', '')
  );
  RETURN new;
END;
$$;

-- ═══════════════════════════════════════════════════════════
-- 4. TABEL TAMBAHAN YANG DIBUTUHKAN ADMIN
-- ═══════════════════════════════════════════════════════════

-- Kolom tambahan tryouts
ALTER TABLE public.tryouts ADD COLUMN IF NOT EXISTS slug text;
ALTER TABLE public.tryouts ADD COLUMN IF NOT EXISTS jumlah_soal int DEFAULT 20;
ALTER TABLE public.tryouts ADD COLUMN IF NOT EXISTS dibuat_oleh uuid REFERENCES auth.users(id);

-- Bank Soal (questions)
CREATE TABLE IF NOT EXISTS public.questions (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kode             text,
  mapel            text NOT NULL DEFAULT 'Penalaran Umum',
  topic_slug       text,
  level_kesulitan  int NOT NULL DEFAULT 1,
  tipe             text NOT NULL DEFAULT 'pilihan_ganda',
  cognitive_skill  text,
  soal             text NOT NULL DEFAULT '',
  opsi_a           text, opsi_b text, opsi_c text, opsi_d text, opsi_e text,
  answer_key       text NOT NULL DEFAULT '',
  pembahasan       text,
  aktif            boolean NOT NULL DEFAULT false,
  created_at       timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "admin read questions" ON public.questions;
CREATE POLICY "admin read questions" ON public.questions FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "admin insert questions" ON public.questions;
CREATE POLICY "admin insert questions" ON public.questions FOR INSERT TO authenticated WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin','staf'))
);
DROP POLICY IF EXISTS "admin update questions" ON public.questions;
CREATE POLICY "admin update questions" ON public.questions FOR UPDATE TO authenticated USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin','staf'))
);

-- Topik / Taksonomi
CREATE TABLE IF NOT EXISTS public.topics (
  id        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug      text NOT NULL,
  nama      text NOT NULL,
  mapel     text NOT NULL,
  level     int NOT NULL DEFAULT 1,
  urutan    int NOT NULL DEFAULT 0,
  parent_id uuid REFERENCES public.topics(id),
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.topics ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "topics readable" ON public.topics;
CREATE POLICY "topics readable" ON public.topics FOR SELECT TO authenticated USING (true);

-- Test Blueprints
CREATE TABLE IF NOT EXISTS public.test_blueprints (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nama        text NOT NULL,
  tipe        text,
  durasi_menit int,
  komposisi   jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at  timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.test_blueprints ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "blueprints readable" ON public.test_blueprints;
CREATE POLICY "blueprints readable" ON public.test_blueprints FOR SELECT TO authenticated USING (true);

-- Sekolah Mitra
CREATE TABLE IF NOT EXISTS public.schools (
  id        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nama      text NOT NULL,
  kode      text UNIQUE,
  kota      text,
  provinsi  text,
  plan      text DEFAULT 'free',
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "schools readable" ON public.schools;
CREATE POLICY "schools readable" ON public.schools FOR SELECT TO authenticated USING (true);

-- Payment Logs
CREATE TABLE IF NOT EXISTS public.payment_logs (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid REFERENCES auth.users(id),
  order_id   text NOT NULL,
  jumlah     int NOT NULL DEFAULT 0,
  status     text,
  metode     text,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.payment_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "payment_logs admin read" ON public.payment_logs;
CREATE POLICY "payment_logs admin read" ON public.payment_logs FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- i18n Strings
CREATE TABLE IF NOT EXISTS public.i18n_strings (
  key    text NOT NULL,
  locale text NOT NULL DEFAULT 'id',
  value  text NOT NULL DEFAULT '',
  PRIMARY KEY (key, locale)
);
ALTER TABLE public.i18n_strings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "i18n readable" ON public.i18n_strings;
CREATE POLICY "i18n readable" ON public.i18n_strings FOR SELECT TO authenticated USING (true);

-- Feature Flags
CREATE TABLE IF NOT EXISTS public.feature_flags (
  key       text PRIMARY KEY,
  enabled   boolean NOT NULL DEFAULT false,
  deskripsi text,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.feature_flags ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "flags readable" ON public.feature_flags;
CREATE POLICY "flags readable" ON public.feature_flags FOR SELECT TO authenticated USING (true);

-- Seed feature flags
INSERT INTO public.feature_flags (key, enabled, deskripsi) VALUES
  ('ai_intelligence', false, 'Aktifkan Academic Intelligence (AI report per siswa)'),
  ('ai_navigator', false, 'Aktifkan Academic Navigator (rekomendasi kampus AI)'),
  ('b2b_schools', false, 'Aktifkan fitur sekolah mitra (B2B)'),
  ('payment_midtrans', false, 'Aktifkan pembayaran via Midtrans'),
  ('cpns_module', false, 'Aktifkan modul persiapan CPNS/PPPK'),
  ('learning_center', false, 'Aktifkan Learning Center'),
  ('email_notifications', false, 'Kirim notifikasi via email (Resend)')
ON CONFLICT (key) DO NOTHING;

-- Audit Logs
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid REFERENCES auth.users(id),
  aksi       text NOT NULL,
  entitas    text,
  entitas_id text,
  detail     jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "audit admin read" ON public.audit_logs;
CREATE POLICY "audit admin read" ON public.audit_logs FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
DROP POLICY IF EXISTS "audit admin insert" ON public.audit_logs;
CREATE POLICY "audit admin insert" ON public.audit_logs FOR INSERT TO authenticated WITH CHECK (true);

-- Learning Materials
CREATE TABLE IF NOT EXISTS public.learning_materials (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  judul       text NOT NULL,
  slug        text NOT NULL,
  tipe        text NOT NULL DEFAULT 'artikel',
  durasi_menit int,
  konten      jsonb DEFAULT '{}'::jsonb,
  is_premium  boolean NOT NULL DEFAULT false,
  aktif       boolean NOT NULL DEFAULT true,
  created_at  timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.learning_materials ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "materials readable" ON public.learning_materials;
CREATE POLICY "materials readable" ON public.learning_materials FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "materials writable" ON public.learning_materials;
CREATE POLICY "materials writable" ON public.learning_materials FOR INSERT TO authenticated WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin','staf'))
);

-- Announcements
CREATE TABLE IF NOT EXISTS public.announcements (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  judul      text NOT NULL,
  isi        text NOT NULL,
  dibuat_oleh uuid REFERENCES auth.users(id),
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "announcements readable" ON public.announcements;
CREATE POLICY "announcements readable" ON public.announcements FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "announcements writable" ON public.announcements;
CREATE POLICY "announcements writable" ON public.announcements FOR INSERT TO authenticated WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin','staf'))
);

-- Assignments
CREATE TABLE IF NOT EXISTS public.assignments (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  judul        text NOT NULL,
  ref_tipe     text DEFAULT 'tryout',
  ref_id       uuid,
  target_kelas text,
  due_at       timestamptz,
  dibuat_oleh  uuid REFERENCES auth.users(id),
  created_at   timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "assignments readable" ON public.assignments;
CREATE POLICY "assignments readable" ON public.assignments FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "assignments writable" ON public.assignments;
CREATE POLICY "assignments writable" ON public.assignments FOR INSERT TO authenticated WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin','staf'))
);

-- ═══════════════════════════════════════════════════════════
-- 5. RPC FUNCTIONS — STAF
-- ═══════════════════════════════════════════════════════════

-- staf_overview: dashboard staf
DROP FUNCTION IF EXISTS public.staf_overview();
CREATE FUNCTION public.staf_overview()
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_caller text; v_out jsonb;
BEGIN
  SELECT role INTO v_caller FROM public.profiles WHERE id = auth.uid();
  IF v_caller NOT IN ('staf','admin') THEN RAISE EXCEPTION 'forbidden'; END IF;
  SELECT jsonb_build_object(
    'total_siswa',   (SELECT count(*) FROM public.profiles WHERE role = 'siswa'),
    'total_attempt', (SELECT count(*) FROM public.tryout_attempts WHERE status = 'selesai'),
    'rata_skor',     (SELECT round(avg(skor)) FROM public.tryout_attempts WHERE status = 'selesai'),
    'total_materi',  (SELECT count(*) FROM public.learning_materials WHERE aktif = true),
    'total_tryout',  (SELECT count(*) FROM public.tryouts)
  ) INTO v_out;
  RETURN v_out;
END;
$$;

-- staf_list_students: daftar siswa
DROP FUNCTION IF EXISTS public.staf_list_students(text);
CREATE FUNCTION public.staf_list_students(p_search text DEFAULT NULL)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_caller text; v_out jsonb;
BEGIN
  SELECT role INTO v_caller FROM public.profiles WHERE id = auth.uid();
  IF v_caller NOT IN ('staf','admin') THEN RAISE EXCEPTION 'forbidden'; END IF;
  SELECT coalesce(jsonb_agg(row_to_json(t)::jsonb ORDER BY t.nama), '[]'::jsonb) INTO v_out
  FROM (
    SELECT p.id, p.nama, p.asal_sekolah, p.segment, p.plan, p.target_kampus,
      (SELECT skor FROM public.tryout_attempts WHERE user_id = p.id AND status = 'selesai' ORDER BY submitted_at DESC LIMIT 1) AS skor_terakhir,
      (SELECT count(*) FROM public.tryout_attempts WHERE user_id = p.id AND status = 'selesai') AS jumlah_tryout
    FROM public.profiles p
    WHERE p.role = 'siswa'
      AND (p_search IS NULL OR p.nama ILIKE '%' || p_search || '%')
    LIMIT 200
  ) t;
  RETURN v_out;
END;
$$;

-- ═══════════════════════════════════════════════════════════
-- 6. RPC FUNCTIONS — ADMIN
-- ═══════════════════════════════════════════════════════════

-- admin_overview: dashboard admin
DROP FUNCTION IF EXISTS public.admin_overview();
CREATE FUNCTION public.admin_overview()
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_caller text; v_out jsonb;
BEGIN
  SELECT role INTO v_caller FROM public.profiles WHERE id = auth.uid();
  IF v_caller <> 'admin' THEN RAISE EXCEPTION 'forbidden'; END IF;
  SELECT jsonb_build_object(
    'total_user',    (SELECT count(*) FROM public.profiles),
    'total_siswa',   (SELECT count(*) FROM public.profiles WHERE role = 'siswa'),
    'total_staf',    (SELECT count(*) FROM public.profiles WHERE role = 'staf'),
    'total_pro',     (SELECT count(*) FROM public.profiles WHERE plan = 'pro'),
    'total_soal',    (SELECT count(*) FROM public.questions),
    'total_tryout',  (SELECT count(*) FROM public.tryouts),
    'total_attempt', (SELECT count(*) FROM public.tryout_attempts WHERE status = 'selesai'),
    'pendapatan',    COALESCE((SELECT sum(jumlah) FROM public.payment_logs WHERE status = 'settlement'), 0),
    'signup_7hari',  (SELECT count(*) FROM public.profiles WHERE created_at >= now() - interval '7 days')
  ) INTO v_out;
  RETURN v_out;
END;
$$;

-- admin_list_users: daftar pengguna
DROP FUNCTION IF EXISTS public.admin_list_users(text, text);
CREATE FUNCTION public.admin_list_users(p_search text DEFAULT NULL, p_role text DEFAULT NULL)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_caller text; v_out jsonb;
BEGIN
  SELECT role INTO v_caller FROM public.profiles WHERE id = auth.uid();
  IF v_caller <> 'admin' THEN RAISE EXCEPTION 'forbidden'; END IF;
  SELECT coalesce(jsonb_agg(row_to_json(t)::jsonb ORDER BY t.created_at DESC), '[]'::jsonb) INTO v_out
  FROM (
    SELECT p.id, p.nama, p.role, p.plan, p.segment, p.asal_sekolah, p.onboarding_done, p.created_at::text
    FROM public.profiles p
    WHERE (p_search IS NULL OR p.nama ILIKE '%' || p_search || '%')
      AND (p_role IS NULL OR p.role = p_role)
    ORDER BY p.created_at DESC
    LIMIT 200
  ) t;
  RETURN v_out;
END;
$$;

-- admin_user_detail: profil + riwayat tryout user
DROP FUNCTION IF EXISTS public.admin_user_detail(uuid);
CREATE FUNCTION public.admin_user_detail(p_id uuid)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_caller text; v_profile jsonb; v_tryout jsonb; v_xp int; v_level int;
BEGIN
  SELECT role INTO v_caller FROM public.profiles WHERE id = auth.uid();
  IF v_caller <> 'admin' THEN RAISE EXCEPTION 'forbidden'; END IF;

  SELECT row_to_json(p)::jsonb INTO v_profile
  FROM public.profiles p WHERE p.id = p_id;

  SELECT coalesce(jsonb_agg(jsonb_build_object(
    'tryout_id', a.tryout_id, 'skor', a.skor, 'benar', a.benar,
    'salah', a.salah, 'kosong', a.kosong, 'submitted_at', a.submitted_at
  ) ORDER BY a.submitted_at DESC), '[]'::jsonb) INTO v_tryout
  FROM public.tryout_attempts a
  WHERE a.user_id = p_id AND a.status = 'selesai';

  v_xp := COALESCE((SELECT sum(COALESCE(skor, 0)) FROM public.tryout_attempts WHERE user_id = p_id AND status = 'selesai'), 0);
  v_level := GREATEST(1, (v_xp / 500) + 1);

  RETURN jsonb_build_object('profile', v_profile, 'tryout', v_tryout, 'xp', v_xp, 'level', v_level);
END;
$$;

-- admin_analytics: tren signup, plan, segment
DROP FUNCTION IF EXISTS public.admin_analytics();
CREATE FUNCTION public.admin_analytics()
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_caller text; v_signup jsonb; v_plan jsonb; v_segment jsonb;
BEGIN
  SELECT role INTO v_caller FROM public.profiles WHERE id = auth.uid();
  IF v_caller <> 'admin' THEN RAISE EXCEPTION 'forbidden'; END IF;

  SELECT coalesce(jsonb_agg(jsonb_build_object('hari', d::text, 'jml', COALESCE(c.jml, 0)) ORDER BY d), '[]'::jsonb)
  INTO v_signup
  FROM generate_series(current_date - 29, current_date, '1 day') d
  LEFT JOIN (SELECT created_at::date AS hari, count(*) AS jml FROM public.profiles WHERE created_at >= current_date - 29 GROUP BY 1) c ON c.hari = d;

  SELECT coalesce(jsonb_agg(jsonb_build_object('plan', plan, 'jml', jml) ORDER BY jml DESC), '[]'::jsonb)
  INTO v_plan
  FROM (SELECT COALESCE(plan, 'free') AS plan, count(*) AS jml FROM public.profiles GROUP BY 1) t;

  SELECT coalesce(jsonb_agg(jsonb_build_object('segment', segment, 'jml', jml) ORDER BY jml DESC), '[]'::jsonb)
  INTO v_segment
  FROM (SELECT COALESCE(segment, 'utbk') AS segment, count(*) AS jml FROM public.profiles GROUP BY 1) t;

  RETURN jsonb_build_object('signup', v_signup, 'plan', v_plan, 'segment', v_segment);
END;
$$;

-- admin_set_role: ubah role user (audit-logged)
DROP FUNCTION IF EXISTS public.admin_set_role(uuid, text);
CREATE FUNCTION public.admin_set_role(p_id uuid, p_role text)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_caller text;
BEGIN
  SELECT role INTO v_caller FROM public.profiles WHERE id = auth.uid();
  IF v_caller IS DISTINCT FROM 'admin' THEN RAISE EXCEPTION 'forbidden'; END IF;
  IF p_role NOT IN ('siswa','staf','admin') THEN RAISE EXCEPTION 'invalid role'; END IF;
  UPDATE public.profiles SET role = p_role WHERE id = p_id;
  INSERT INTO public.audit_logs (user_id, aksi, entitas, entitas_id, detail)
  VALUES (auth.uid(), 'set_role', 'profiles', p_id::text, jsonb_build_object('target', p_id, 'role', p_role));
END;
$$;

-- admin_toggle_flag: toggle feature flag (audit-logged)
DROP FUNCTION IF EXISTS public.admin_toggle_flag(text, boolean);
CREATE FUNCTION public.admin_toggle_flag(p_key text, p_enabled boolean)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_caller text;
BEGIN
  SELECT role INTO v_caller FROM public.profiles WHERE id = auth.uid();
  IF v_caller IS DISTINCT FROM 'admin' THEN RAISE EXCEPTION 'forbidden'; END IF;
  UPDATE public.feature_flags SET enabled = p_enabled WHERE key = p_key;
  INSERT INTO public.audit_logs (user_id, aksi, entitas, entitas_id, detail)
  VALUES (auth.uid(), 'toggle_flag', 'feature_flags', p_key, jsonb_build_object('key', p_key, 'enabled', p_enabled));
END;
$$;

-- ═══════════════════════════════════════════════════════════
-- 7. GRANT EXECUTE — semua RPC bisa dipanggil authenticated
-- ═══════════════════════════════════════════════════════════
GRANT EXECUTE ON FUNCTION public.staf_overview() TO authenticated;
GRANT EXECUTE ON FUNCTION public.staf_list_students(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_overview() TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_list_users(text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_user_detail(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_analytics() TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_set_role(uuid, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_toggle_flag(text, boolean) TO authenticated;

-- ═══════════════════════════════════════════════════════════
-- 8. RLS — admin bisa baca semua profiles (untuk list pengguna)
-- ═══════════════════════════════════════════════════════════
DROP POLICY IF EXISTS "admin read all profiles" ON public.profiles;
CREATE POLICY "admin read all profiles" ON public.profiles FOR SELECT TO authenticated
  USING (auth.uid() = id OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin','staf')));

-- Admin bisa update semua profiles (role change)
DROP POLICY IF EXISTS "admin update profiles" ON public.profiles;
CREATE POLICY "admin update profiles" ON public.profiles FOR UPDATE TO authenticated
  USING (auth.uid() = id OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Admin insert tryouts
DROP POLICY IF EXISTS "staff insert tryouts" ON public.tryouts;
CREATE POLICY "staff insert tryouts" ON public.tryouts FOR INSERT TO authenticated WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin','staf'))
);

-- ═══════════════════════════════════════════════════════════
-- 9. VERIFIKASI
-- ═══════════════════════════════════════════════════════════
SELECT p.nama, p.role, p.plan, p.created_at
FROM public.profiles p
ORDER BY p.role, p.nama;
